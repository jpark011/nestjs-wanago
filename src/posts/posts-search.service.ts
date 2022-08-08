import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import Post from './entities/post.entity';
import { PostSearchBody } from './types/post-search-body.interface';
import { PostSearchResult } from './types/post-search-result.interface';

@Injectable()
export class PostsSearchService {
  index = 'posts';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index<PostSearchBody>(
      {
        index: this.index,
        body: {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.author.id,
        },
      },
      {},
    );
  }

  async search(text: string) {
    const { hits } = await this.elasticsearchService.search<PostSearchBody>(
      {
        index: this.index,
        body: {
          query: {
            multi_match: {
              query: text,
              fields: ['title', 'content'],
            },
          },
        },
      },
      {},
    );
    return hits.hits.map((item) => item._source);
  }

  async remove(postId: number) {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async update(post: Post) {
    const newBody: PostSearchBody = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.author.id,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.elasticsearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
      },
    });
  }
}
