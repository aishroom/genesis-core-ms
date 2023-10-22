import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('')
  async findAll() {
    return this.productService.findAll();
  }

  @Get('/name/:name')
  async findByName(@Param('name') name: string) {
    return this.productService.findLikeName(name);
  }

  @Get('/id/:id')
  async findById(@Param('id') id: number) {
    const res = await this.productService.findById(id);
    if (res == null) {
      throw new NotFoundException();
    }
    return res;
  }

  @Get('/noEcosystem')
  async findAllNoEcosystem() {
    return this.productService.findAllNoEcosystem();
  }
}
