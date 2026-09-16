import { InputType, Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Role } from '../../auth/roles.enum.js';

@ObjectType()
export class UserType {
 @Field()
  id: string;

  @Field(() => Role)
  role: Role;

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
