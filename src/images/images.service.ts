import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import Multer from 'multer';
@Injectable()
export class ImagesService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase) {}
  async upload(files: Express.Multer.File[], product_id: string) {
    const [existed_product] = await this.db
      .select()
      .from(schema.product)
      .where(eq(schema.product.id, product_id));
    if (!existed_product) {
      throw new NotFoundException(
        `Product is not existed with id:${product_id}`,
      );
    }
    const values = files.map((file) => ({
      name: file.originalname,
      filename: file.filename, // stored filename
      path: `/uploads/${file.filename}`, // URL path
      product_id: product_id,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const [saved] = await this.db
      .insert(schema.images)
      .values(values as any)
      .returning();
    return saved;
  }

  findAll() {
    return `This action returns all images`;
  }

  findOne(id: number) {
    return `This action returns a #${id} image`;
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
