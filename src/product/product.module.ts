import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from '../database/models/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductWorkspace } from 'src/database/models/productWorkspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductWorkspace])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
