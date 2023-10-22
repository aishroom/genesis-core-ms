import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ArchitectureMockService } from './architecture.mock.service';
import { Server, Socket } from 'socket.io';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { RequestCreateArchitecture } from './dto/RequestCreateArchitecture.dto';
import { validate } from 'class-validator';
import { ArchitectureRef } from '../database/models/architectureRef.entity';
import { ObserverArchitectureService } from './observer-architecture.service';
import { LinkService } from '../link/link.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { Workspace } from '../database/models/workspace.entity';
import { Product } from 'src/database/models/product.entity';
import { ProductService } from 'src/product/product.service';
import { ProductWorkspace } from 'src/database/models/productWorkspace.entity';
@WebSocketGateway({
  namespace: '/architecture',
  cors: {
    allowedHeaders: '*',
    origin: ['*'],
    methods: ['*'],
    credentials: true,
  },
})
export class ArchitectureGateway {
  constructor(
    private readonly architectureService: ArchitectureMockService,
    private readonly observerArchitectureService: ObserverArchitectureService,
    private readonly linkService: LinkService,
    private readonly workspaceService: WorkspaceService,
    private readonly productService: ProductService,
  ) {}

  afterInit(server: Server) {
    console.log('Initialized genesis link websocket...');
  }

  handleDisconnect(client: Socket) {
    this.observerArchitectureService.detachObservable(client.id);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const executionContextHost = new ExecutionContextHost([client, ...args]);
    try {
      console.log('client.id', client.id);
      client.emit('process', 'client conected...');
    } catch (error) {
      if (typeof client.disconnect === 'function') {
        client.disconnect(true);
      }
    }
  }

  @SubscribeMessage('create')
  async createArchitecture(client: Socket, jsonString: string) {
    try {
      const jsonObject = JSON.parse(jsonString);
      const architectureRequest = new RequestCreateArchitecture();
      Object.assign(architectureRequest, jsonObject);

      const errorsInRequest = await validate(architectureRequest);
      if (errorsInRequest.length > 0) {
        client.emit('process', `Invalid Request ${errorsInRequest}`);
        return 'fail';
      }

      const architectureRef: ArchitectureRef =
        await this.architectureService.findById(
          architectureRequest.idArchitectureRef,
        );

      if (!architectureRef.avaliable) {
        client.emit(
          'process',
          `Error: Architecture Ref by id ${architectureRef.id} is not avaliable`,
        );
      }
      const linkChain = await this.linkService.getLinkChainbyId(
        architectureRef.firstLink.id,
      );
      const dateNow: Date = new Date();
      dateNow.setHours(0, 0, 0, 0);

      // verificación para saltar creación de cuentas
      let createdWorkspace: Workspace | null = null;

      const newWorkspace: Workspace = {
        id: null,
        name: architectureRequest.name,
        description: architectureRequest.description,
        owner: architectureRequest.owner,
        createdAt: dateNow,
        isEcosystem: true,
        productWorkspaces: null,
      };

      createdWorkspace = await this.workspaceService.save(newWorkspace);

      const newProduct: Product = {
        id: null,
        name: architectureRequest.name,
        description: architectureRequest.description,
        teamSlug: architectureRequest.teamSlug,
        createdAt: dateNow,
        creator: architectureRequest.owner,
        repositories: null,
        productWorkspaces: null,
      };

      const createdProduct = await this.productService.createProduct(
        newProduct,
      );

      const productWorkspace: ProductWorkspace = {
        product: createdProduct,
        workspace: createdWorkspace,
        productId: createdProduct.id,
        workspaceId: createdWorkspace.id,
      };

      const newProductWorkspace =
        await this.productService.createProductWorkspace(productWorkspace);
      this.observerArchitectureService.attachObservable(
        client.id,
        linkChain,
        undefined,
        undefined,
        createdWorkspace,
        createdProduct,
        architectureRequest.inputVarFiles,
        architectureRef,
        null,
        [client],
      );
      this.observerArchitectureService.executeCurrentLink(client.id);
    } catch (error) {
      client.emit('process', `Error: ${error}`);
      console.log(client.id, error);
      return 'fail';
    }
    return 'create';
  }
}
