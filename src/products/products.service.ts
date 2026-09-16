import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { CreateProductInput } from './dto/create-product.input.js';
import { UpdateProductInput } from './dto/update-product.input.js';
import { ProductFilterArgs } from './dto/product-filter.args.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(createProductInput: CreateProductInput): Promise<Product> {
    const product = this.productsRepository.create({
      ...createProductInput,
      price: createProductInput.price.toFixed(2),
    });

    return this.productsRepository.save(product);
  }

  findAll(filter: ProductFilterArgs = {}): Promise<Product[]> {
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (filter.categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId: filter.categoryId });
    }

    if (filter.search) {
      query.andWhere('product.name ILIKE :search', { search: `%${filter.search}%` });
    }

    return query
      .take(filter.limit ?? 20)
      .skip(filter.offset ?? 0)
      .getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductInput: UpdateProductInput): Promise<Product> {
    const product = await this.findOne(id);
    const { price, ...rest } = updateProductInput;

    Object.assign(product, rest);

    if (price !== undefined) {
      product.price = price.toFixed(2);
    }

    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<Product> {
    const product = await this.findOne(id);

    await this.productsRepository.remove(product);

    return product;
  }

  /**
   * Atomically decrements stock, failing if there isn't enough on hand.
   * Must run inside the same transaction as order creation to avoid overselling.
   */
  async decrementStock(manager: EntityManager, productId: string, quantity: number): Promise<Product> {
    const product = await manager.findOne(Product, { where: { id: productId } });

    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Insufficient stock for product "${product.name}"`);
    }

    product.stock -= quantity;

    return manager.save(product);
  }
}
