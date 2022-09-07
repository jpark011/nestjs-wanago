import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RefreshStrategy } from './refresh.strategy.';

/**
 * 인증 모듈 설명입니다
 * ## 마크업도 지원이 될까요? [컨트롤러 링크]{@link AuthController}
 * @example Example
 * 예시로는 이렇게 쓰일수 있어요
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
