import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductType } from './interfaces/product';

@Injectable()
export class ProductService {
  private readonly products: ProductType[] = [
    { id: 1, name: 'Razer mouse', price: 30 },
    { id: 2, name: 'Razer keyboard', price: 33 },
    { id: 3, name: 'Razer pad', price: 35 },
    { id: 4, name: 'Razer headset', price: 36 },
  ];
  createProduct(product: ProductType) {
    this.products.push(product);
  }
  findOne(id: number): ProductType {
    const prod = this.products.find((p) => p.id == id);
    if (!prod) {
      throw new NotFoundException(`Product with id:${id} not found`);
    }
    return prod;
  }
}
