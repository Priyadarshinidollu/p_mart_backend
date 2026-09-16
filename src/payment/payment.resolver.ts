import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service.js';
import { PaymentIntentType } from './type/payment-intent.type.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/current-user.decorator.js';

@UseGuards(AuthGuard)
@Resolver(() => PaymentIntentType)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => PaymentIntentType)
  createPaymentIntent(
    @CurrentUser() user: JwtUser,
    @Args('orderId') orderId: string,
  ): Promise<PaymentIntentType> {
    return this.paymentService.createPaymentIntent(user, orderId);
  }
}
