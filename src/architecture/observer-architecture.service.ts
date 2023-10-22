import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Link } from 'src/database/models/link.entity';
import { ArchitectureMockService } from './architecture.mock.service';
import { Workspace } from 'src/database/models/workspace.entity';
import { Product } from 'src/database/models/product.entity';
import { VarFile } from 'src/database/models/varFile.entity';
import { Repository } from 'src/database/models/repository.entity';
import { ArchitectureRef } from 'src/database/models/architectureRef.entity';
import { RepositoryService } from 'src/repository/repository.service';
import { Variable } from 'src/database/models/variable.entity';
import { UpdateOutPutVariableDTO } from './dto/UpdateOutPutVariable.dto';
import { RepositoryFromJenkinsDTO } from './dto/RepositoryFromJenkins.dto';
import { HclService } from 'src/share/hcl/hcl.service';
import { ConfigType } from '@nestjs/config';
import config from '../share/config/config';

@Injectable()
export class ObserverArchitectureService {
  private observables: Map<
    string,
    {
      linkChain: Link;
      currentLink: Link;
      job: any;
      process: any;
      observers: Socket[];
      workspace: Workspace;
      product: Product;
      inputVarFiles: VarFile[];
      architectureRef: ArchitectureRef;
      inceptions: [];
      parametersCurrentLink: any;
      notify(event: string, message: string): void;
    }
  > = new Map();

  constructor(
    private readonly architectureService: ArchitectureMockService,
    private readonly repositoryService: RepositoryService,
    private readonly hclService: HclService,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  attachObservable(
    idObservable: string,
    linkChain: Link,
    job: string,
    process: string,
    workspace: Workspace,
    product: Product,
    inputVarFiles: VarFile[],
    architectureRef: ArchitectureRef,
    parametersCurrentLink: any,
    observers: Socket[],
  ): void {
    try {
      const notify = function (event: string, message: string) {
        observers.forEach((observer: Socket) => {
          observer.emit(event, message);
        });
      };
      const urlGenesisVariable: Variable = {
        id: 0,
        name: 'URL_GENESIS',
        value: this.configService.URL_GENESIS,
        varFile: inputVarFiles[0],
        isMultiVariable: false,
        varTemplate: null,
        isMultiJobData: false,
      };

      inputVarFiles[0].variables.push(urlGenesisVariable);
      this.importOutPutVarFilesToNextInputVarFilesRecursive(
        inputVarFiles,
        linkChain,
      );
      const currentLink = linkChain;
      this.observables.set(idObservable, {
        linkChain,
        currentLink,
        job,
        process,
        workspace,
        product,
        observers,
        inputVarFiles,
        architectureRef,
        inceptions: [],
        parametersCurrentLink,
        notify,
      });
      const observable = this.getObservable(idObservable);
      this.emitChain(idObservable);
      observable.notify('job', job);
      observable.notify('process', process);
      const { nextLink, ...currentLinkEmit } = currentLink;
      observable.notify('link', JSON.stringify(currentLinkEmit));
      observable.notify('link-status', JSON.stringify(currentLinkEmit.name));
    } catch (error) {
      console.log(error);
    }
  }

  detachObservable(idObservable: string): void {
    try {
      const deleted = this.observables.delete(idObservable);
      if (!deleted) {
        throw new Error('Invalid id Observable  for detach');
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateProcess(idObservable: string, dataUpdateJenkinsDTO: any): void {
    try {
      const observable = this.getObservable(idObservable);
      observable.process = dataUpdateJenkinsDTO.status;
      observable.notify('process', JSON.stringify(dataUpdateJenkinsDTO));
    } catch (error) {
      console.log(error);
    }
  }

  async updateJob(
    idObservable: string,
    dataUpdateJenkinsDTO: any,
  ): Promise<void> {
    try {
      const observable = this.getObservable(idObservable);
      observable.job = dataUpdateJenkinsDTO.status;
      observable.notify('job', JSON.stringify(dataUpdateJenkinsDTO));
      if (dataUpdateJenkinsDTO.status == 'finished') {
        if (!observable.currentLink.hasInceptions) {
          this.nextLink(idObservable);
          return;
        }
        const inception: any = observable.inceptions.find(
          (inception: any) => inception.name === dataUpdateJenkinsDTO.message,
        );
        if (inception) {
          inception.value = true;
        }

        const completedInceptions = observable.inceptions.every(
          (inception: any) => inception.value === true,
        );

        if (completedInceptions) {
          this.nextLink(idObservable);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  nextLink(idObservable: string): void {
    try {
      const observable = this.getObservable(idObservable);
      const outPutVarFiles: VarFile[] = observable.currentLink.varFiles.filter(
        (VarFile) => !VarFile.isInput,
      );
      observable.currentLink = observable.currentLink.nextLink;
      this.importOutPutVarFilesToNextInputVarFilesRecursive(
        outPutVarFiles,
        observable.currentLink,
      );

      if (
        !observable.currentLink ||
        JSON.stringify(observable.currentLink) === '{}'
      ) {
        observable.notify('link', 'finished');
        observable.notify('status', 'finished');
        observable.notify('chain', 'finished');
        observable.notify('link-status', JSON.stringify('finished'));
        return;
      }

      const { nextLink, ...currentLinkEmit } = observable.currentLink;
      observable.notify('link', JSON.stringify(currentLinkEmit));
      observable.notify('link-status', JSON.stringify(currentLinkEmit.name));
      this.executeCurrentLink(idObservable);
    } catch (error) {
      console.log(error);
    }
  }

  emitChain(idObservable: string): void {
    try {
      const observable = this.getObservable(idObservable);
      observable.notify('chain', JSON.stringify(observable.linkChain));
    } catch (error) {
      console.log(error);
    }
  }

  updateOutPutVariable(updateOutPutVariableDTO: UpdateOutPutVariableDTO) {
    try {
      const observable = this.getObservable(
        updateOutPutVariableDTO.observableId,
      );
      const currentLink = observable.currentLink;
      if (updateOutPutVariableDTO.linkId != observable.currentLink.id) {
        throw new HttpException(
          `The id link ${updateOutPutVariableDTO.linkId} was not found in Observable ${updateOutPutVariableDTO.observableId}`,
          HttpStatus.CONFLICT,
        );
      }

      currentLink.varFiles
        .filter((VarFile) => !VarFile.isInput)
        .forEach((varFile) => {
          varFile.variables.forEach((variable) => {
            if (variable.name === updateOutPutVariableDTO.nameVariable) {
              variable.value = updateOutPutVariableDTO.valueVariable;
            }
          });
        });
    } catch (error) {
      console.log(error);
    }
  }

  getObservable(idObservable: string) {
    const observable = this.observables.get(idObservable);
    if (!observable) {
      throw new HttpException(
        `The id Observable ${idObservable} was not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return observable;
  }

  getParametersByObservableId(idObservable: string) {
    try {
      const observable = this.observables.get(idObservable);
      return observable.parametersCurrentLink;
    } catch (error) {
      console.log('Error get Parameters By obaservable id:', idObservable);
    }
  }

  updateInputVarFilesCurrentLink(idObservable: string) {
    try {
      const observable = this.observables.get(idObservable);
      let currentLink = observable.currentLink;
      do {
        replaceVarFilesById(currentLink.varFiles, observable.inputVarFiles);
        currentLink = currentLink.nextLink;
      } while (currentLink);
      this.emitChain(idObservable);
    } catch (error) {
      console.log(error);
    }
  }

  saveCreatedRepositoryFromJenkins(
    repositoryFromJenkins: RepositoryFromJenkinsDTO,
  ) {
    try {
      const observable = this.observables.get(
        repositoryFromJenkins.observableId,
      );
      const newRepository: Repository = {
        id: undefined,
        url: repositoryFromJenkins.urlRepo,
        name: repositoryFromJenkins.nameRepo,
        description: observable.product.description,
        creator: observable.product.creator,
        type: observable.currentLink.linkProjectTypes[0].projectType.name,
        architectureRef: observable.architectureRef,
        product: observable.product,
      };
      const savedRepository =
        this.repositoryService.createRepository(newRepository);
      return savedRepository;
    } catch (error) {
      console.log(error);
    }
  }

  executeCurrentLink(idObservable: string) {
    try {
      const observable = this.observables.get(idObservable);
      if (observable.currentLink.hasInceptions) {
        observable.inceptions = getInceptions(observable.currentLink);
      }
      const { nextLink, ...parameters } = observable.currentLink;
      observable.parametersCurrentLink = parameters;

      const isMandatoryLink = observable.currentLink.varFiles
        .find((varFile) => varFile.file === 'pipeline')
        .variables.find((variable) =>
          variable.name.includes('IS_MANDATORY'),
        ).value;

      if (isMandatoryLink === 'false') {
        const data = {
          status: `link ${observable.currentLink.id} will not be executed because is not a mandatory link`,
        };
        this.updateProcess(idObservable, data);
        this.nextLink(idObservable);
        return;
      }

      this.architectureService.executeLink(
        idObservable,
        observable.currentLink,
      );

      const data = {
        status: `link ${observable.currentLink.id} will be executed in ${observable.currentLink.job}`,
      };

      this.updateProcess(idObservable, data);
    } catch (error) {
      const data = {
        status: 'error',
        messsage: error,
      };
      this.updateProcess(idObservable, data);
    }
  }

  importOutPutVarFilesToNextInputVarFilesRecursive(
    outPutVarFiles: VarFile[],
    link: Link,
  ) {
    try {
      if (!link || !outPutVarFiles) {
        return;
      }
      if (!link.varFiles || !link.varFiles == undefined) {
        return;
      }
      link.varFiles.forEach((varFile) => {
        if (varFile.isInput) {
          varFile.variables.forEach((variable) => {
            const variableByNameInVarFiles = findVariableByNameInVarFiles(
              outPutVarFiles,
              variable.name,
            );
            if (variableByNameInVarFiles) {
              variable.value = variableByNameInVarFiles.value;
              if (variable.isMultiVariable && variable.varTemplate != null) {
                const templateJson = JSON.parse(
                  this.hclService.hclToJSon(variable.varTemplate),
                );
                const keyVar = Object.keys(templateJson)[0];
                const mergedArray = JSON.parse(
                  JSON.stringify(variable.value),
                ).map((item) => ({
                  ...templateJson[keyVar][0],
                  ...item,
                }));
                const itemsHcl = mergedArray
                  .reduce((items, item) => {
                    items += `{${this.hclService.jsonToHcl(item)}}, `;
                    return items;
                  }, '')
                  .slice(0, -2);
                variable.value = `[${itemsHcl}]`;
              }
            }
          });
        }
      });
      this.importOutPutVarFilesToNextInputVarFilesRecursive(
        outPutVarFiles,
        link.nextLink,
      );
    } catch (error) {
      console.log(error);
    }
  }
}

function replaceVarFilesById(
  currentVarFiles: VarFile[],
  inputVarFiles: VarFile[],
): void {
  try {
    if (!currentVarFiles || !inputVarFiles) {
      return;
    }
    currentVarFiles.forEach((currentVarFile, index) => {
      const matchinginputVarFile = inputVarFiles.find(
        (inputVarFile) => currentVarFile.id === inputVarFile.id,
      );
      if (matchinginputVarFile) {
        currentVarFiles[index] = matchinginputVarFile;
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function findVariableByNameInVarFiles(
  varFiles: VarFile[],
  variableName: string,
): Variable | undefined {
  try {
    if (!varFiles) {
      return undefined;
    }
    let res = undefined;
    for (const varFile of varFiles) {
      const variable = varFile.variables.find(
        (variable) => variable.name === variableName,
      );
      if (variable) {
        res = variable;
        break;
      }
    }
    return res;
  } catch (error) {
    console.log(error);
  }
}
function getInceptions(currentLink: Link): any {
  const inceptions = [];

  const variableConfigs = [
    { variableName: 'CREDENTIAL_DEV', inceptionName: 'develop' },
    { variableName: 'CREDENTIAL_PRE', inceptionName: 'pre' },
    { variableName: 'CREDENTIAL_STG', inceptionName: 'stage' },
    { variableName: 'CREDENTIAL_PROD', inceptionName: 'master' },
  ];

  for (const config of variableConfigs) {
    const variable = findVariableByNameInVarFiles(
      currentLink.varFiles,
      config.variableName,
    );

    if (variable) {
      if (variable.value != null && variable.value !== '') {
        const newInception = { name: config.inceptionName, value: false };
        inceptions.push(newInception);
      }
    }
  }
  const defaultInception = { name: 'DEFAULT', value: false };
  inceptions.push(defaultInception);

  return inceptions;
}
