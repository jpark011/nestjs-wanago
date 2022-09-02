import { ObjectWithIdDto } from './../../utils/object-with-id.dto';
import { CreatePostDto } from './../../posts/dto/create-post.dto';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDto)
  post: ObjectWithIdDto;
}
