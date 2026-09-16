import { Field, Float, ObjectType } from '@nestjs/graphql';
import { CartItemType } from './cart-item.type.js';

@ObjectType()
export class CartType {
  @Field()
  id: string;

  @Field(() => [CartItemType])
  items: CartItemType[];

  @Field(() => Float)
  total: number;
}
