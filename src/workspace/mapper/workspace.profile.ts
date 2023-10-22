import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { Workspace } from '../../database/models/workspace.entity';
import { WorkspaceDto } from '../dto/workspace.dto';

@Injectable()
export class WorkspaceProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Workspace, WorkspaceDto);
      createMap(mapper, WorkspaceDto, Workspace);
    };
  }
}
