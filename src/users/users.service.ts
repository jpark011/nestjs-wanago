import { ConfigService } from '@nestjs/config';
import { buffer } from 'stream/consumers';
import { FilesService } from './../files/files.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private filesService: FilesService,
    private configService: ConfigService,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exit',
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (user) {
      return user;
    }

    throw new HttpException(
      'User with this email does not exit',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(userData: CreateUserDto) {
    const newUser = this.userRepository.create(userData);

    await this.userRepository.save(newUser);

    return newUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      currentRefreshToken: hashed,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getById(userId);
    const isMatch = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    if (isMatch) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    this.userRepository.update(userId, {
      currentRefreshToken: null,
    });
  }

  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    await this.userRepository.update(userId, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteAvatar(userId: number) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }
}
