import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectType } from '../database/models/projectType.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectTypeService {
  constructor(
    @InjectRepository(ProjectType)
    private readonly projectTypeRepository: Repository<ProjectType>,
  ) {}

  async findAllActive(): Promise<ProjectType[]> {
    return this.projectTypeRepository.find({
      where: {
        active: true,
      },
    });
  }
}
