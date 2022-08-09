import { TokenPayload } from './token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { PostgresErrorCode } from '../db/postgres-error-codes.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import bcrypt, { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getCookieForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  async register(registerDto: RegisterDto) {
    const hashed = await bcrypt.hash(registerDto.password, 10);

    try {
      const createdUser = await this.userService.create({
        ...registerDto,
        password: hashed,
      });

      createdUser.password = undefined;

      return createdUser;
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      throw err;
    }
  }

  async getAuthenticatedUser(email: string, hashedPassword: string) {
    try {
      const user = await this.userService.getByEmail(email);

      await this.verifyPassword(user.password, hashedPassword);
      user.password = undefined;
      return user;
    } catch {
      throw new HttpException('Wrong crendential', HttpStatus.BAD_REQUEST);
    }
  }

  async getCookieWithJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_SECRET'),
      expiresIn: this.configService.get('REFRESH_EXPIRATION'),
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'REFRESH_EXPIRATION',
    )}`;

    return {
      cookie,
      token,
    };
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      hashedPassword,
      plainTextPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Wrong crendential', HttpStatus.BAD_REQUEST);
    }
  }
}
