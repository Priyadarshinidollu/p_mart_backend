import { Field, Float, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { CategoryType } from '../../categories/type/category.type.js';

@ObjectType()
export class ProductType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  isActive: boolean;

  @Field(() => CategoryType, { nullable: true })
  category?: CategoryType | null;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
