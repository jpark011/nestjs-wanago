import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestWithUser } from './request-with-user.interface';
import { Request, response, Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() req: RequestWithUser) {
    const { user } = req;

    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() req: RequestWithUser) {
    const { user } = req;
    const cookie = await this.authService.getCookieWithJwtToken(user.id);

    req.res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logOut(@Req() req: Request) {
    req.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }
}
