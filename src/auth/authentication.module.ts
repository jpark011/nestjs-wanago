import { LocalStrategy } from './local.strategy';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthenticationService, LocalStrategy],
})
export class AuthenticationModule {}
