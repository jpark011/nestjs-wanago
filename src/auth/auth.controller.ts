import { AuthModule } from './auth.module';
import { UsersService } from './../users/users.service';
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
import { RefreshGuard } from './refresh.guard';
import User from '../users/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  /**
   * 인증을 수행합니다
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() req: RequestWithUser): User {
    const { user } = req;

    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto): Promise<User> {
    return this.authService.register(registrationData);
  }

  /**
   * 우아우아!
   * @throws {AuthModule}
   * @param {string} req
   * @returns {number}
   */
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessTokenCookie = await this.authService.getCookieWithJwtToken(
      user.id,
    );
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    this.usersService.setCurrentRefreshToken(refreshTokenCookie.token, user.id);

    req.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie.cookie,
    ]);

    return user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logOut(@Req() req: RequestWithUser) {
    await this.usersService.removeRefreshToken(req.user.id);
    req.res.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: RequestWithUser) {
    const { user } = req;
    const accessTokenCookie = await this.authService.getCookieWithJwtToken(
      user.id,
    );

    req.res.setHeader('Set-Cookie', accessTokenCookie);

    return user;
  }
}
