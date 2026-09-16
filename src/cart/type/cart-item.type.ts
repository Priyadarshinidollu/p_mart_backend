import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ProductType } from '../../products/type/product.type.js';

@ObjectType()
export class CartItemType {
  @Field()
  id: string;

  @Field(() => ProductType)
  product: ProductType;

  @Field(() => Int)
  quantity: number;
}
