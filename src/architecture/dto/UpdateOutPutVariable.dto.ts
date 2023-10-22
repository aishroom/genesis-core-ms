import { IsNotEmpty } from 'class-validator';

export class UpdateOutPutVariableDTO {
  @IsNotEmpty()
  observableId: string;
  @IsNotEmpty()
  event: string;
  @IsNotEmpty()
  linkId: number;
  @IsNotEmpty()
  nameVariable: string;
  @IsNotEmpty()
  valueVariable: any;
  message: string;
}
