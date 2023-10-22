import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../database/models/product.entity';
import { Like, Repository } from 'typeorm';
import { ProductWorkspace } from '../database/models/productWorkspace.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductWorkspace)
    private readonly productWorkspaceRepository: Repository<ProductWorkspace>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['repositories'],
    });
  }

  async findLikeName(name: string): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['repositories'],
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async findById(id: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id: id },
      relations: ['repositories'],
    });
  }

  async createProduct(newProduct: Product): Promise<Product> {
    const savedProduct = await this.productRepository.save(newProduct);
    if (!savedProduct) {
      throw new HttpException(
        `Product ${newProduct.id}, the entity could not be saved. The provided data is invalid or incomplete.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return savedProduct;
  }

  async findAllNoEcosystem(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productWorkspaces', 'productWorkspace')
      .leftJoinAndSelect('productWorkspace.workspace', 'workspace')
      .leftJoinAndSelect('product.repositories', 'repository')
      .where('workspace.isEcosystem = :isEcosystem', { isEcosystem: 0 })
      .groupBy('product.id')
      .getMany();
  }

  async createProductWorkspace(newProductWorskpace: ProductWorkspace) {
    const productWorkspace = await this.productWorkspaceRepository.save(
      newProductWorskpace,
    );
    if (!productWorkspace) {
      throw new HttpException(
        `Product Workspace ${
          (productWorkspace.productId, productWorkspace.workspaceId)
        }, the entity could not be saved. The provided data is invalid or incomplete.`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return productWorkspace;
  }
}
