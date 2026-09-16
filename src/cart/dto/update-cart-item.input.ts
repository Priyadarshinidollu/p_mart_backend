import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartItemInput {
  @Field()
  productId: string;

  @Field(() => Int)
  quantity: number;
}
