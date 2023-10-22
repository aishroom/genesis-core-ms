import {
  Controller,
  Param,
  Res,
  Delete,
  Headers,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidateEmail } from '../share/resources/ValidateEmail';
import { JenkinsService } from './jenkins.service';

@Controller('jenkins')
export class JenkinsController {
  constructor(private readonly serviceJenkins: JenkinsService) {}

  @Delete('/deprovisioning/:email')
  async delete(
    @Res({ passthrough: true }) res: Response,
    @Param('email', new ValidateEmail()) email: string,
    @Headers('x-api-key') secret: unknown,
  ) {
    const response = await this.serviceJenkins.deleteUserOrg(email, secret);
    res.status(response.status).send(response.message);
  }

  @Post('/validate-emails')
  async validateEmails(
    @Res({ passthrough: true }) res: Response,
    @Body() emails: string[],
    @Headers('x-api-key') secret: unknown,
  ) {
    const response = await this.serviceJenkins.validateUsersJenkins(
      emails,
      secret,
    );
    res.status(response.status).send(response.message);
  }

  @Post('/jira')
  async webhookJira(@Body() body: unknown) {
    console.log('Respuesta webhook de JIRA: ', body);
  }
}
