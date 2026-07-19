import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ImagesService } from 'src/images/images.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ImagesService, AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
