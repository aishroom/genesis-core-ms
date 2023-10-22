import { Controller, Get } from '@nestjs/common';
import { ProjectTypeService } from './project-type.service';

@Controller('project-type')
export class ProjectTypeController {
  constructor(private projectTypeService: ProjectTypeService) {}

  @Get('')
  async findAllActive() {
    return this.projectTypeService.findAllActive();
  }
}
