import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePostDto {
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
