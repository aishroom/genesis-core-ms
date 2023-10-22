/* eslint-disable @typescript-eslint/no-var-requires */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IElementService } from './IElementService';

@Injectable()
export class ElementService implements IElementService {
  findAll(nameArchitec: string) {
    //TO-DO
    throw new HttpException(
      'we are working on this, you cloud use the mock service...',
      HttpStatus.NOT_FOUND,
    );
  }

  searchPrice() {
    //TO-DO
    throw new HttpException(
      'we are working on this, you cloud use the mock service...',
      HttpStatus.NOT_FOUND,
    );
  }

  findOne(id: number) {
    //TO-DO
    throw new HttpException(
      'we are working on this, you cloud use the mock service...',
      HttpStatus.NOT_FOUND,
    );
  }
}
