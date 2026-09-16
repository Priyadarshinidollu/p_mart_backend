import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service.js';
import { PaymentResolver } from './payment.resolver.js';
import { PaymentController } from './payment.controller.js';
import { Payment } from './entities/payment.entity.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule],
  controllers: [PaymentController],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
