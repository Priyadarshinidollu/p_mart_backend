import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service.js';
import { ProductsResolver } from './products.resolver.js';
import { Product } from './entities/product.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
