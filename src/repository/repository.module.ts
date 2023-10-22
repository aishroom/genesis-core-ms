import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Repository } from 'src/database/models/repository.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { ProductWorkspace } from 'src/database/models/productWorkspace.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Repository]),
    ProductModule,
    WorkspaceModule,
  ],
  providers: [ConfigModule, RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
