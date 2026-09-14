import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
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
