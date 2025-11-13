import { Global, Module } from '@nestjs/common';
import LoggerService from './logger.service';

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useFactory: () => LoggerService.getInstance(),
    },
  ],
  exports: [LoggerService],
})
export default class LoggerModule {}