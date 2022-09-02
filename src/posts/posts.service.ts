import { PostsSearchService } from './posts-search.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
  ) {}

  async create(createPostDto: CreatePostDto, author: User) {
    const newPost = this.postsRepository.create({ ...createPostDto, author });
    await this.postsRepository.save(newPost);
    this.postsSearchService.indexPost(newPost);

    return newPost;
  }

  async findAll(offset?: number, limit?: number) {
    const [items, count] = await this.postsRepository.findAndCount({
      relations: ['author'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return { items, count };
  }

  async findOne(id: number) {
    const post = this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (post) {
      return post;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);

    const updatedPost = await this.postsRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      return updatedPost;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);

    if (deleteResponse.affected) {
      await this.postsSearchService.remove(id);
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async searchForPosts(text: string, offset?: number, limit?: number) {
    const results = await this.postsSearchService.search(text);
    const ids = results.map(({ id }) => id);

    if (!ids.length) {
      return [];
    }
    const [items, count] = await this.postsRepository.findAndCount({
      where: { id: In(ids) },
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {};
  }
}
