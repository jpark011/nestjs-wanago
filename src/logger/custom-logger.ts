import { ConfigService } from '@nestjs/config';
import { LogsService } from './logs.service';
import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
} from '@nestjs/common';
import { getLogLevels } from '../utils/get-log-levels';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    private logsService: LogsService,
  ) {
    super(context, { ...options, logLevels: getLogLevels() });
  }

  log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'log',
    });
  }
  error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
  verbose(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    this.logsService.createLog({
      message,
      context,
      level: 'error',
    });
  }
}
