import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CheckoutInput {
  @Field()
  shippingAddress: string;
}
