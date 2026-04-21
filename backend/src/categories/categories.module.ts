import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryRepository } from './category.repository';

/**
 * CategoriesModule
 * Provides the full categories domain:
 *   Endpoints:
 *     GET    /categories              — paginated flat list
 *     GET    /categories/tree         — full nested tree
 *     GET    /categories/:slug        — single category with parent + children
 *     GET    /categories/:slug/products — paginated products for a category
 *     POST   /categories              — create category (admin)
 *     PUT    /categories/:id          — update category (admin)
 *     DELETE /categories/:id          — delete category (admin, safe)
 */
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
