import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubscribers() {
    return this.subscribersService.send({ cmd: 'get-all-subscribers' }, '');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.send({ cmd: 'add-subscriber' }, subscriber);
  }
}
