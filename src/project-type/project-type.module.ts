import { Module } from '@nestjs/common';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeService } from './project-type.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectType } from '../database/models/projectType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectType])],
  controllers: [ProjectTypeController],
  providers: [ProjectTypeService],
})
export class ProjectTypeModule {}
