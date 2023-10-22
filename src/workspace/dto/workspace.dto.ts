import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { ProductWorkspace } from 'src/database/models/productWorkspace.entity';

export class WorkspaceDto {
  @IsNotEmpty()
  @AutoMap()
  id: number;

  @IsNotEmpty()
  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap()
  owner: string;

  @IsNotEmpty()
  @AutoMap()
  createdAt: Date;

  @IsNotEmpty()
  @AutoMap()
  isEcosystem: boolean;
  productWorkspaces: ProductWorkspace[];
}
