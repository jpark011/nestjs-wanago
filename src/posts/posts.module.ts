import { SearchModule } from './../search/search.module';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsSearchService } from './posts-search.service';
import Post from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), SearchModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
