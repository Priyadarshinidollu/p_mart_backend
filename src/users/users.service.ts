import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { CreateUserInput } from './dto/create-user.input.js';
import { UpdateUserInput } from './dto/update-user.input.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(createUserInput);

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneBy(key: FindOptionsWhere<User>): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: key,
    });

    if (!user) {
      const condition = Object.entries(key)
        .map(([field, value]) => `${field} "${value}"`)
        .join(', ');

      throw new NotFoundException(`User with ${condition} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOneBy({ id });

    Object.assign(user, updateUserInput);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOneBy({ id });

    await this.usersRepository.remove(user);

    return user;
  }
}
