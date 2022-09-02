import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetCommentDto {
  @Type(() => Number)
  @IsOptional()
  postId: number;
}
