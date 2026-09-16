import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryInput } from './dto/create-category.input.js';
import { UpdateCategoryInput } from './dto/update-category.input.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryInput);

    return this.categoriesRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput): Promise<Category> {
    const category = await this.findOne(id);

    Object.assign(category, updateCategoryInput);

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<Category> {
    const category = await this.findOne(id);

    await this.categoriesRepository.remove(category);

    return category;
  }
}
