import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Log from './log.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async createLog(log: Partial<Log>) {
    const newLog = await this.logRepository.create(log);
    await this.logRepository.save(newLog, { data: { isCreatingLogs: true } });

    return newLog;
  }
}
