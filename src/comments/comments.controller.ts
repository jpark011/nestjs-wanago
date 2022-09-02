import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { CreateCommentCommand } from './commands/create-comment.command';
import { RequestWithUser } from './../auth/request-with-user.interface';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentDto } from './dto/get-comment.dto';
import { GetCommentsQuery } from './queries/get-comments.query';

@Controller('comments')
export class CommentsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;

    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
