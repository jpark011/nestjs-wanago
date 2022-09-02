import { GetCommentsHandler } from './queries/get-comments.handler';
import { CreateCommentHandler } from './commands/create-comment.handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentsController],
  providers: [CreateCommentHandler, GetCommentsHandler],
})
export class CommentsModule {}
