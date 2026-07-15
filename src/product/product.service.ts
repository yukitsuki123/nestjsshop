import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductType } from './interfaces/product';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateCategory } from './dto/create-product.dto';
import * as schema from '../db/schema'
@Injectable()
export class ProductService {
  constructor(@Inject(DRIZZLE) private readonly db:NodePgDatabase){}
  createProduct(product: ProductType) {
    
  }
  async createCategory(category:CreateCategory){
    const [newCategory] = await this.db
          .insert(schema.categories)
          .values({
            name:category.name,
            userId:category.userId
          })
          .returning();
        return newCategory;
  }
  findOne(id: number): ProductType {
    const prod = null
    if (!prod) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }
    return prod;
  }
}
