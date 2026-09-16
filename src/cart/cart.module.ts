import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service.js';
import { CartResolver } from './cart.resolver.js';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule],
  providers: [CartResolver, CartService],
  exports: [CartService],
})
export class CartModule {}
