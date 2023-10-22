import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IElementService } from './IElementService';

@Controller('element')
export class ElementController {
  constructor(
    @Inject('ElementService')
    private readonly elementService: IElementService,
  ) {}
  @Get('/')
  findAllElem(@Query('nameArchitec') nameArchitec: string) {
    return this.elementService.findAll(nameArchitec);
  }

  @Get('/:id')
  findOneElem(@Param('id') id: string) {
    return this.elementService.findOne(+id);
  }
}
