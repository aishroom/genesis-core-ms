import { IsIn, IsNotEmpty } from 'class-validator';
import { validTypeRepositories } from '../../database/models/validTypeRepositories';
import { VarFile } from 'src/database/models/varFile.entity';

export class LinkRequestDTO {
  @IsNotEmpty()
  observableId: string;
  @IsNotEmpty()
  linkId: number;
  job: string;
  @IsIn(validTypeRepositories)
  proyectType: string;
  @IsNotEmpty()
  inputVarFiles: VarFile[];
  description: string | null;
}
