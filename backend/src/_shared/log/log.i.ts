import { LogLevel as _TypeOrmLogLevel } from 'typeorm/logger/Logger';
import { LogLevel as _NestLogLevel } from '@nestjs/common/services/logger.service';

export type TypeOrmLogLevel = _TypeOrmLogLevel;
export type NestLogLevel = _NestLogLevel;
