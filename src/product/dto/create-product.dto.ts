// src/products/dto/create-product.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  IsEnum,
  ArrayMinSize,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required.' })
  name!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product image is required.' })
  @IsString({ each: true })
  images!: string[]; // base64 strings from frontend

  @IsUUID('4', { message: 'A valid category is required.' })
  categoryId!: string;

  @IsString()
  @IsNotEmpty({ message: 'SKU is required.' })
  sku!: string;

  @IsNumber()
  @Min(0, { message: 'Quantity cannot be negative.' })
  @Type(() => Number)
  quantity!: number;

  @IsNumber()
  @Min(0, { message: 'Selling price cannot be negative.' })
  @Type(() => Number)
  sellingPrice!: number;

  @IsNumber()
  @Type(() => Number)
  costPrice!: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  barcode?: number;

  @IsString()
  @IsOptional()
  supplier?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  restockLevel?: number;

  @IsString()
  @IsOptional()
  warranty?: string;

  @IsOptional()
  specification?: Record<string, any>;

  @IsEnum(['active', 'draft', 'out_of_stock', 'discontinued'])
  @IsOptional()
  status?: 'active' | 'draft' | 'out_of_stock' | 'discontinued';
}
