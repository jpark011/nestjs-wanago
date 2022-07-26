import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
