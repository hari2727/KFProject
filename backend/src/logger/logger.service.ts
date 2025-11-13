import { Injectable } from '@nestjs/common';
import { Logger, LogLevel, ServiceName } from 'kfone-common-library';

@Injectable()
export default class LoggerService {
  private static instance: LoggerService;
  private readonly logger: Logger;

  private constructor() {
    this.logger = new Logger(ServiceName.PROFILEMANAGER);
  }


  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  // NestJS-compatible log method that always uses INFO level
  log(message: string, context?: string): void {
    if (context) {
      this.logger.log(message, LogLevel.INFO, context);
    } else {
      this.logger.log(message, LogLevel.INFO);
    }
  }

  info(message: string, ...optionalParams: any[]): void {
    this.logger.info(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.logger.debug(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.logger.error(message, ...optionalParams);
  }

  // Additional NestJS LoggerService methods
  verbose(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  fatal(message: string, context?: string): void {
    this.logger.error(message, context);
  }
}

export const KF1Logger: LoggerService = LoggerService.getInstance();
