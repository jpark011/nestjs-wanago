import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  getAllProductCategories() {
    return this.productCategoriesRepository.find();
  }

  async createProductCategory(category: CreateProductCategoryDto) {
    const newProductCategory = await this.productCategoriesRepository.create(
      category,
    );
    await this.productCategoriesRepository.save(newProductCategory);
    return newProductCategory;
  }
}
