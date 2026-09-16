import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module.js';
import configuration from './config/configuration.js';
import { Graphql as NestGraphql} from './graphql/graphql.module.js';
import { PgModule } from './database/postgres.module.js';
import { AuthModule } from './auth/auth.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ProductsModule } from './products/products.module.js';
import { CartModule } from './cart/cart.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { PaymentModule } from './payment/payment.module.js';
export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    cache:true
  }),
NestGraphql,
PgModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
   
  ObserveModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    appKey: config.getOrThrow('APP_TELEMETRY_KEY'),
    appSecret: config.getOrThrow('APP_SECRET_KEY'),
    // serviceId: config.get('SERVICE_ID', 'cats-app'),
    serviceId: 'p-mart-backend',
    // serviceVersion: config.get('GIT_SHA'),
  })
}),

    UsersModule,

    AuthModule,

    CategoriesModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
