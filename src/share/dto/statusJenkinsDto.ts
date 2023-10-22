import { IsNotEmpty } from 'class-validator';

export class StatusJenkinsDto {
  @IsNotEmpty()
  clientsId: string[];
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
