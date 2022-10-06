import { PostsSearchService } from './posts-search.service';
import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import User from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import Post from './entities/post.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private postsSearchService: PostsSearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPostDto: CreatePostDto, author: User) {
    const newPost = this.postsRepository.create({ ...createPostDto, author });
    await this.postsRepository.save(newPost);
    this.postsSearchService.indexPost(newPost);
    await this.clearCache();

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
      await this.clearCache();

      return updatedPost;
    }

    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);

    if (deleteResponse.affected) {
      await this.postsSearchService.remove(id);
      await this.clearCache();
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

  private async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith(GET_POSTS_CACHE_KEY)) {
        this.cacheManager.del(key);
      }
    });
  }
}

export const GET_POSTS_CACHE_KEY = 'GET_POSTS_CACHE';
