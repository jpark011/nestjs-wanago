import { LogLevel } from '@nestjs/common';

export function getLogLevels(): LogLevel[] {
  if (process.env.NODE_ENV === 'production') {
    return ['log', 'warn', 'error'];
  }

  return ['error', 'warn', 'log', 'verbose', 'debug'];
}
