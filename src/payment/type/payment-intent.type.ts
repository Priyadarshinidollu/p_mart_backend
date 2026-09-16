import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentIntentType {
  @Field()
  paymentId: string;

  @Field()
  clientSecret: string;
}
