import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}
  @Get()
  async find(@Query('page') page: number) {
    return `you are in the page number: ${page}`;
  }
  @Get(':id')
  getProduct(@Param() params: { id: number }) {
    return this.productsService.findOne(params.id);
  }
  
}
