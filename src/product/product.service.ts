import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductType } from './interfaces/product';
import { DRIZZLE } from 'src/db/db.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { CreateProductDto } from './dto/create-product.dto';
import { ImagesService } from 'src/images/images.service';
@Injectable()
export class ProductService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    private readonly imagesService: ImagesService,
  ) {}
  async createProductWithImages(
    userId: string,
    product: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const [existingSku] = await this.db
      .select()
      .from(schema.product)
      .where(eq(schema.product.sku, product.sku));

    if (existingSku) {
      throw new ConflictException(`SKU "${product.sku}" is already in use.`);
    }

    return this.db.transaction(async (tx) => {
      try {
        const [newProduct] = await tx
          .insert(schema.product)
          .values({
            name: product.name,
            slug: product.slug || this.slugify(product.name),
            description: product.description ?? '',
            brand: product.brand ?? '',
            sku: product.sku,
            barcode: product.barcode ?? 0,
            categoryId: product.categoryId,
            quantity: product.quantity,
            costPrice: String(product.costPrice),
            sellingPrice: String(product.sellingPrice),
            supplier: product.supplier ?? '',
            restockLevel: product.restockLevel ?? 0,
            waranty: product.warranty ?? '',
            specification: product.specification,
            status: product.status,
            userId,
          })
          .returning();

        const values = files.map((file) => ({
          name: file.filename,
          productId: newProduct.id,
        }));

        const savedImages = await this.imagesService.upload(
          files,
          newProduct.id,
        );

        return { ...newProduct, images: savedImages };
      } catch (error: any) {
        // PostgreSQL unique constraint violation
        if (error?.code === '23505') {
          throw new ConflictException(
            'A field with that value already exists.',
          );
        }
        throw error;
      }
    });
  }

  findOne(id: number): ProductType {
    const prod = null;
    if (!prod) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }
    return prod;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
