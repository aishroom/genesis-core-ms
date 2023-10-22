import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { Workspace } from '../database/models/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceProfile } from './mapper/workspace.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, WorkspaceProfile],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
