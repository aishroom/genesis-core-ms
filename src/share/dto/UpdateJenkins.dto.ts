import { IsNotEmpty } from 'class-validator';

export class UpdateJenkinsDTO {
  @IsNotEmpty()
  objectId: string;
  @IsNotEmpty()
  event: string;
  message: string;
  @IsNotEmpty()
  stage: string;
  @IsNotEmpty()
  status: string;
  @IsNotEmpty()
  jobId: string;
}
