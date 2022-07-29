import { RegisterDto } from './dto/register.dto';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';

import User from '../users/entities/user.entity';
import exp from 'constants';
import { provideMock } from '../utils/testing.utils';

describe('AuthService', () => {
  const TOKEN = 'abcd1234';
  const EXP_TIME = 3600;
  let authService: AuthService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      imports: [],
      providers: [
        provideMock(JwtService, {
          sign: jest.fn().mockReturnValue(TOKEN),
        }),
        provideMock(ConfigService, {
          get: jest.fn().mockReturnValue(EXP_TIME),
        }),
        provideMock(UsersService, { create: jest.fn().mockReturnValue({}) }),
        AuthService,
      ],
    }).compile();

    authService = mod.get(AuthService);
  });

  describe('getCookieForLogOut', () => {
    test('should return cookie with jwt token', async () => {
      const cookie = authService.getCookieForLogOut();

      expect(cookie).toEqual(`Authentication=; HttpOnly; Path=/; Max-Age=0`);
    });
  });

  describe('getCookieWithJwtToken', () => {
    test('should return cookie with jwt token', async () => {
      const userId = 123;
      const cookie = await authService.getCookieWithJwtToken(userId);

      expect(cookie).toEqual(
        `Authentication=${TOKEN}; HttpOnly; Path=/; Max-Age=${EXP_TIME}`,
      );
    });
  });

  describe.skip('register', () => {
    test('should create new user', async () => {
      const registerDto: RegisterDto = {
        name: 'Park',
        password: 'abcd1234',
        email: 'abcd@abc.com',
      };
      const user = await authService.register(registerDto);

      expect(user).toMatchObject(registerDto);
    });
  });
});
