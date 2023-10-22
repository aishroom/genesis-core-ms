import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArchitectureController } from './architecture.controller';
import { ArchitectureMockService } from './architecture.mock.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchitectureRef } from 'src/database/models/architectureRef.entity';
import { ArchitectureGateway } from './architecture.gateway';
import { ObserverArchitectureService } from './observer-architecture.service';
import { LinkModule } from 'src/link/link.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ProductModule } from 'src/product/product.module';
import { RepositoryModule } from 'src/repository/repository.module';
import { HclModule } from 'src/share/hcl/hcl.module';

@Module({
  imports: [
    HttpModule,
    LinkModule,
    WorkspaceModule,
    ProductModule,
    RepositoryModule,
    HclModule,
    TypeOrmModule.forFeature([ArchitectureRef]),
  ],
  providers: [
    ArchitectureMockService,
    ArchitectureGateway,
    ObserverArchitectureService,
    ConfigModule,
  ],
  controllers: [ArchitectureController],
})
export class ArchitectureModule {}
