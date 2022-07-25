import { PostgresErrorCode } from './../db/postgres-error-codes.enum';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { UsersService } from './../users/users.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import bcrypt, { hash } from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UsersService) {}

  async register(registerDto: CreateUserDto) {
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
