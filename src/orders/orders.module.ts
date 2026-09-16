import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service.js';
import { OrdersResolver } from './orders.resolver.js';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { CartModule } from '../cart/cart.module.js';
import { ProductsModule } from '../products/products.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartModule, ProductsModule],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
