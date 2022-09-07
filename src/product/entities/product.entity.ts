import { BookProperties } from './../types/book-properties.interface';
import { CarProperties } from './../types/car-properties.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductCategory } from './product-category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(
    () => ProductCategory,
    (category: ProductCategory) => category.products,
  )
  category: ProductCategory;

  @Column({ type: 'jsonb' })
  properties: CarProperties | BookProperties;
}
