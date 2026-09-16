import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductInput } from './dto/create-product.input.js';
import { UpdateProductInput } from './dto/update-product.input.js';
import { ProductFilterArgs } from './dto/product-filter.args.js';
import { ProductType } from './type/product.type.js';
import { toProductType } from './products.mapper.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../auth/roles.enum.js';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => ProductType)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
  ): Promise<ProductType> {
    return toProductType(await this.productsService.create(createProductInput));
  }

  @Query(() => [ProductType], { name: 'products' })
  async findAll(@Args() filter: ProductFilterArgs): Promise<ProductType[]> {
    const products = await this.productsService.findAll(filter);

    return products.map(toProductType);
  }

  @Query(() => ProductType, { name: 'product' })
  async findOne(@Args('id') id: string): Promise<ProductType> {
    return toProductType(await this.productsService.findOne(id));
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => ProductType)
  async updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ): Promise<ProductType> {
    return toProductType(
      await this.productsService.update(updateProductInput.id, updateProductInput),
    );
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => ProductType)
  async removeProduct(@Args('id') id: string): Promise<ProductType> {
    return toProductType(await this.productsService.remove(id));
  }
}
