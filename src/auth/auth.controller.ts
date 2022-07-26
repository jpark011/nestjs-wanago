import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RequestWithUser } from './request-with-user.interface';
import { response, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  authenticate(@Req() req: RequestWithUser) {
    const { user } = req;
    user.password = undefined;

    return user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() req: RequestWithUser, @Res() res: Response) {
    const { user } = req;
    const cookie = await this.authService.getCookieWithJwtToken(user.id);

    res.setHeader('Set-Cookie', cookie);
    user.password = undefined;

    return res.send(user);
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async logOut(@Res() res: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());

    return res.sendStatus(200);
  }
}
