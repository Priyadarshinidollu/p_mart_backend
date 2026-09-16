import { BadRequestException, Controller, Headers, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentService } from './payment.service.js';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @HttpCode(HttpStatus.OK)
  @Post('webhook')
  async webhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
    if (!req.rawBody || !signature) {
      throw new BadRequestException('Missing Stripe signature or raw body');
    }

    let event;
    try {
      event = this.paymentService.constructWebhookEvent(req.rawBody, signature);
    } catch {
      throw new BadRequestException('Invalid Stripe webhook signature');
    }

    await this.paymentService.handleWebhookEvent(event);

    return { received: true };
  }
}
