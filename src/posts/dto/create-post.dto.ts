import { IsNotEmpty, IsString } from 'class-validator';
export class CreatePostDto {
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];
}
