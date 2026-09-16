import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '../enums/order-status.enum.js';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  orderId: string;

  @Field(() => OrderStatus)
  status: OrderStatus;
}
