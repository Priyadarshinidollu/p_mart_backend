import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from './entities/payment.entity.js';
import { PaymentStatus } from './enums/payment-status.enum.js';
import { PaymentIntentType } from './type/payment-intent.type.js';
import { OrdersService } from '../orders/orders.service.js';
import { OrderStatus } from '../orders/enums/order-status.enum.js';
import { Role } from '../auth/roles.enum.js';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly currency: string;
  private readonly webhookSecret: string;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly ordersService: OrdersService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('stripe.secretKey'));
    this.currency = this.configService.get<string>('stripe.currency') ?? 'usd';
    this.webhookSecret = this.configService.getOrThrow<string>('stripe.webhookSecret');
  }

  async createPaymentIntent(
    requester: { sub: string; role: Role },
    orderId: string,
  ): Promise<PaymentIntentType> {
    const order = await this.ordersService.findOne(orderId, requester);

    if (order.status !== OrderStatus.Pending) {
      throw new BadRequestException('Order is not awaiting payment');
    }

    const amount = Math.round(Number(order.totalAmount) * 100);

    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency: this.currency,
      metadata: { orderId: order.id },
    });

    let payment = await this.paymentsRepository.findOne({ where: { orderId: order.id } });

    if (!payment) {
      payment = this.paymentsRepository.create({
        orderId: order.id,
        amount: order.totalAmount,
        currency: this.currency,
      });
    }

    payment.stripePaymentIntentId = intent.id;
    payment.status = PaymentStatus.Pending;
    await this.paymentsRepository.save(payment);

    return { paymentId: payment.id, clientSecret: intent.client_secret! };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.markPaymentStatus(
          (event.data.object as Stripe.PaymentIntent).id,
          PaymentStatus.Succeeded,
        );
        break;
      case 'payment_intent.payment_failed':
        await this.markPaymentStatus(
          (event.data.object as Stripe.PaymentIntent).id,
          PaymentStatus.Failed,
        );
        break;
    }
  }

  private async markPaymentStatus(stripePaymentIntentId: string, status: PaymentStatus): Promise<void> {
    const payment = await this.paymentsRepository.findOne({ where: { stripePaymentIntentId } });

    if (!payment) {
      return;
    }

    payment.status = status;
    await this.paymentsRepository.save(payment);

    if (status === PaymentStatus.Succeeded) {
      await this.ordersService.updateStatus(payment.orderId, OrderStatus.Paid);
    }
  }
}
