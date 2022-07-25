import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  private lastPostId = 0;
  private posts: Post[] = [];

  create(createPostDto: CreatePostDto) {
    const newPost = {
      id: ++this.lastPostId,
      ...createPostDto,
    };
    this.posts.push(newPost);

    return newPost;
  }

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    const post = this.posts.find((p) => p.id === id);

    if (post) {
      return post;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const index = this.posts.findIndex((p) => p.id === id);

    if (index >= 0) {
      this.posts[index] = { ...this.posts[index], ...updatePostDto };
      return this.posts[index];
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    const index = this.posts.findIndex((p) => p.id === id);

    if (index >= 0) {
      this.posts.splice(index, 1);
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
