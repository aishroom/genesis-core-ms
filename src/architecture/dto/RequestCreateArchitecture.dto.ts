import { IsNotEmpty } from 'class-validator';
import { VarFile } from 'src/database/models/varFile.entity';

export class RequestCreateArchitecture {
  @IsNotEmpty()
  name: string;

  description: string | null = null;

  @IsNotEmpty()
  teamSlug: string;

  @IsNotEmpty()
  idArchitectureRef: number;

  @IsNotEmpty()
  owner: string;

  inputVarFiles: VarFile[];
}
