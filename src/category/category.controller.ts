import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import * as createCategoryDTO from './dto/create-category.dto';
import { CategoryService } from './category.service';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  async createCat(@Body() categ: createCategoryDTO.CreateCategory) {
    return this.categoryService.createCategory(categ);
  }
  @Get()
  async find() {
    return this.categoryService.findAll();
  }
  @Get(':id')
  getCategory(@Param() params: { id: string }) {
    return this.categoryService.findOne(params.id);
  }
}
