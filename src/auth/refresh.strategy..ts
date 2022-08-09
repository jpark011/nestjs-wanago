import { TokenPayload } from './token-payload.interface';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies.Refresh;
        },
      ]),
      secretOrKey: configService.get('REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, { userId }: TokenPayload) {
    const refreshToken = request.cookies.Refresh;

    return this.usersService.getUserIfRefreshTokenMatches(refreshToken, userId);
  }
}
