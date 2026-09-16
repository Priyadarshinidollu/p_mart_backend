import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ProductFilterArgs {
  @Field({ nullable: true })
  search?: string;

  @Field(() => String, { nullable: true })
  categoryId?: string;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;
}
