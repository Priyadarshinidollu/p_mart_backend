import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service.js';
import { CategoriesResolver } from './categories.resolver.js';
import { Category } from './entities/category.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesResolver, CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
