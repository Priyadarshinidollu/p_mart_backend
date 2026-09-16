import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int, { defaultValue: 0 })
  stock: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;
}
