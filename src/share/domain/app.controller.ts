/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Get,
  Options,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('')
export class AppController {
  @Get('/healthCheck')
  getmove() {
    return 'ok';
  }
}
