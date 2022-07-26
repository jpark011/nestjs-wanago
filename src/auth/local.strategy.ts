import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, hashedPassword: string) {
    return this.authenticationService.getAuthenticatedUser(
      email,
      hashedPassword,
    );
  }
}
