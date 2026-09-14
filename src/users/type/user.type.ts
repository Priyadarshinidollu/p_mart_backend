import { InputType, Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserType {
 @Field()
  id: string;
  @Field()
  phone: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  address: string;

  @Field()
  email: string;

  @Field()
  gender: string;

  @Field(() => GraphQLISODateTime)
  dateOfBirth: Date;
}
