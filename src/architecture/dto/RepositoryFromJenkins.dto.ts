import { IsNotEmpty } from 'class-validator';

export class RepositoryFromJenkinsDTO {
  @IsNotEmpty()
  observableId: string;
  @IsNotEmpty()
  nameRepo: string;
  @IsNotEmpty()
  urlRepo: string;
  message: string;
}
