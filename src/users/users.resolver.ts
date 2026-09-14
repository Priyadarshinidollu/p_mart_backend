import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service.js';
// import { User } from './entities/user.entity.js';
import { CreateUserInput } from './dto/create-user.input.js';
import { UpdateUserInput } from './dto/update-user.input.js';
import { UserType as User } from './type/user.type.js';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id') id: string): Promise<User> {
    return this.usersService.findOneBy({id});
  }

  @Mutation(() => User)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(
      updateUserInput.id,
      updateUserInput,
    );
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
