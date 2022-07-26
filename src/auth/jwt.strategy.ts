import { TokenPayload } from './token-payload.interface';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
      usernameField: 'email',
    });
  }

  async validate({ userId }: TokenPayload) {
    return this.usersService.getById(userId);
  }
}
