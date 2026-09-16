import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AddCartItemInput {
  @Field()
  productId: string;

  @Field(() => Int, { defaultValue: 1 })
  quantity: number;
}
