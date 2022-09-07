import { ObjectWithIdDto } from './../../utils/object-with-id.dto';
import { Product } from '../entities/product.entity';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDto)
  category: ObjectWithIdDto;
}
