import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateCategory } from './dto/create-category.dto';
import * as schema from '../db/schema';
import { CategoryType } from './interfaces/category';
import { eq } from 'drizzle-orm';
@Injectable()
export class CategoryService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}

  async createCategory(category: CreateCategory) {
    const [newCategory] = await this.db
      .insert(schema.categories)
      .values({
        name: category.name,
        userId: category.userId,
      })
      .returning();
    return `category created: ${newCategory.name}.with id ${newCategory.id}`;
  }
  async findAll() {
    const categories = await this.db.select().from(schema.categories);
    return categories;
  }
  async findOne(id: string): Promise<CategoryType[]> {
    const category = await this.db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.userId, id));
    if (!category) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }
    return category;
  }
}
