import { LogLevel } from '@nestjs/common/services/logger.service';

export interface LogExecutionOptions {
    logLevel?: LogLevel;
    args?: boolean;
    response?: boolean;
}
