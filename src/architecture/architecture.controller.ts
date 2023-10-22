import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArchitectureDto } from './dto/ArchitectureDto';
import { UpdateJenkinsDTO } from 'src/share/dto/UpdateJenkins.dto';
import { validate } from 'class-validator';
import { ObserverArchitectureService } from './observer-architecture.service';
import { ArchitectureMockService } from './architecture.mock.service';
import { UpdateOutPutVariableDTO } from './dto/UpdateOutPutVariable.dto';
import { RepositoryFromJenkinsDTO } from './dto/RepositoryFromJenkins.dto';
import { AccountFromJenkinsDTO } from './dto/AccountFromJenkins.dto';

@Controller('architecture')
export class ArchitectureController {
  constructor(
    private readonly architecturService: ArchitectureMockService,
    private readonly observerArchitectureService: ObserverArchitectureService,
  ) {}

  @Get('/')
  //@UseGuards(AuthGuard('jwt'))
  findAllArch(): ArchitectureDto[] {
    return this.architecturService.findAll();
  }

  @Get('/:id')
  findOneArch(@Param('id') id: number) {
    return this.architecturService.findById(id);
  }

  @Get('/observer/:id')
  findObserverById(@Param('id') id: string) {
    const { observers, ...observable } =
      this.observerArchitectureService.getObservable(id);
    return observable;
  }

  @Post('update-process')
  async updateProcessCreateArchitecture(
    @Body() updateJenkinsDTO: UpdateJenkinsDTO,
  ) {
    const errorsInRequest = await validate(updateJenkinsDTO);
    if (errorsInRequest.length > 0) {
      throw new BadRequestException(errorsInRequest);
    }
    const { objectId, event, ...data } = updateJenkinsDTO;
    this.observerArchitectureService.updateProcess(objectId, data);
  }

  @Post('update-job')
  async updateJobCreateArchitecture(
    @Body() updateJenkinsDTO: UpdateJenkinsDTO,
  ) {
    const errorsInRequest = await validate(updateJenkinsDTO);
    if (errorsInRequest.length > 0) {
      throw new BadRequestException(errorsInRequest);
    }
    const { objectId, event, ...data } = updateJenkinsDTO;
    this.observerArchitectureService.updateJob(objectId, data);
  }

  @Post('update-output-variable')
  async updateOutPutVariableCreateArchitecture(
    @Body() updateOutPutVariableDTO: UpdateOutPutVariableDTO,
  ) {
    const errorsInRequest = await validate(updateOutPutVariableDTO);
    if (errorsInRequest.length > 0) {
      throw new BadRequestException(errorsInRequest);
    }

    this.observerArchitectureService.updateOutPutVariable(
      updateOutPutVariableDTO,
    );
  }

  @Post('next-link')
  async nextLinkCreateArchitecture(@Body() updateJenkinsDTO: UpdateJenkinsDTO) {
    const errorsInRequest = await validate(updateJenkinsDTO);
    if (errorsInRequest.length > 0) {
      throw new BadRequestException(errorsInRequest);
    }
    this.observerArchitectureService.nextLink(updateJenkinsDTO.objectId);
  }

  @Post('create-repo')
  async saveCreatedRepositoryFromJenkins(
    @Body() repositoryFromJenkinsDTO: RepositoryFromJenkinsDTO,
  ) {
    const errorsInRequest = await validate(repositoryFromJenkinsDTO);
    if (errorsInRequest.length > 0) {
      throw new BadRequestException(errorsInRequest);
    }
    this.observerArchitectureService.saveCreatedRepositoryFromJenkins(
      repositoryFromJenkinsDTO,
    );
  }

  @Get('/observer/parameters/:idObservable')
  findParametersByObservableId(@Param('idObservable') idObservable: string) {
    return this.observerArchitectureService.getParametersByObservableId(
      idObservable,
    );
  }
}
