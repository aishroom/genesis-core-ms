import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Controller('workspace')
export class WorkspaceController {
  constructor(
    private workspaceService: WorkspaceService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  @Get('')
  async findAllBasicInfo() {
    return this.workspaceService.findAllBasicInfo();
  }

  @Get('/ecosystem')
  async findAllEcosystemBasicInfo() {
    return this.workspaceService.findAllEcosystemBasicInfo();
  }
}
