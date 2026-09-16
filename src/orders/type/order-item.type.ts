import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ProductType } from '../../products/type/product.type.js';

@ObjectType()
export class OrderItemType {
  @Field()
  id: string;

  @Field(() => ProductType)
  product: ProductType;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;
}
