import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryInput } from './dto/create-category.input.js';
import { UpdateCategoryInput } from './dto/update-category.input.js';
import { CategoryType } from './type/category.type.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../auth/roles.enum.js';

@Resolver(() => CategoryType)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => CategoryType)
  createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryType> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [CategoryType], { name: 'categories' })
  findAll(): Promise<CategoryType[]> {
    return this.categoriesService.findAll();
  }

  @Query(() => CategoryType, { name: 'category' })
  findOne(@Args('id') id: string): Promise<CategoryType> {
    return this.categoriesService.findOne(id);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => CategoryType)
  updateCategory(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryType> {
    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => CategoryType)
  removeCategory(@Args('id') id: string): Promise<CategoryType> {
    return this.categoriesService.remove(id);
  }
}
