import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { ImagesService } from 'src/images/images.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private readonly imageService: ImagesService,
  ) {}
  @UseInterceptors(FilesInterceptor('file', 10))
  @UseGuards(AuthGuard)
  @Post()
  async postProduct(
    @Body() product: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    if (!files) throw new BadRequestException('No Images Provided');
    const userId = (req as any).sub;
    return this.productsService.createProductWithImages(userId, product, files);
  }
  @Get()
  async find(@Query('page') page: number) {
    return `you are in the page number: ${page}`;
  }
  @Get(':id')
  getProduct(@Param() params: { id: number }) {
    return this.productsService.findOne(params.id);
  }
}
