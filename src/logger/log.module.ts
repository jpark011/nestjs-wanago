import { CustomLogger } from './custom-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsService } from './logs.service';
import { Module } from '@nestjs/common';
import Log from './log.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Log])],
  providers: [LogsService, CustomLogger],
  exports: [CustomLogger],
})
export class LogModule {}
