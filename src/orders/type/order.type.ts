import { Field, Float, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { OrderItemType } from './order-item.type.js';
import { OrderStatus } from '../enums/order-status.enum.js';

@ObjectType()
export class OrderType {
  @Field()
  id: string;

  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field(() => Float)
  totalAmount: number;

  @Field()
  shippingAddress: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
