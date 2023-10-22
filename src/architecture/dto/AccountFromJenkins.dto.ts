import { IsNotEmpty } from 'class-validator';

export class AccountFromJenkinsDTO {
  @IsNotEmpty()
  observableId: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  idCredentialJenkins: string;
  @IsNotEmpty()
  nameAccount: string;
  @IsNotEmpty()
  keyCredential: string;
}
