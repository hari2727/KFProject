import { LoggerService } from '../../logger';
import { NestLogLevel } from '../log/log.i';
import { outputLogLevelMessage } from '../log/log';
import { typeOrmToNestLoggingLevels } from './db.const';
import { Logger } from 'typeorm/logger/Logger';
import { ConfigService } from '../config/config.service';
import { getTypeOrmDefaultLogLevels } from './typeorm-config';

export class TypeOrmLogger implements Logger {

    protected nestLogLevels: NestLogLevel[];

    constructor(
        protected configService: ConfigService,
        protected logger: LoggerService,
        protected prefix: string = 'TypeOrm',
    ) {
        this.nestLogLevels = getTypeOrmDefaultLogLevels(configService);
    }

    logQuery(query: string, parameters?: any[]): void {
        this.writeLog('query', this.stripEmptyKeys({ query, parameters }));
    }

    logQueryError(error: string | Error, query: string, parameters?: any[]): void {
        this.writeLog('query-error', this.stripEmptyKeys({ error, query, parameters }));
    }

    logQuerySlow(time: number, query: string, parameters?: any[]): void {
        this.writeLog('query-slow', this.stripEmptyKeys({ time, query, parameters }));
    }

    logSchemaBuild(message: string): void {
        this.writeLog('schema', message);
    }

    logMigration(message: string): void {
        this.writeLog('migration', message);
    }

    log(level: 'log' | 'info' | 'warn', message: any): void {
        this.writeLog(level, message);
    }

    protected stripEmptyKeys<T>(value: T): Partial<T> {
        if (value && typeof value === 'object') {
            for (const k in value) {
                if (value[k] === undefined) {
                    delete value[k];
                }
            }
        }
        return value;
    }

    protected writeLog(logLevel: string, message: any, ...optionalParams: any[]): void {
        for (const nestLogLevel of typeOrmToNestLoggingLevels[logLevel] || []) {
            if (this.nestLogLevels.includes(nestLogLevel)) {
                return outputLogLevelMessage(
                    this.logger,
                    nestLogLevel,
                    message,
                    ...optionalParams,
                    [
                        this.prefix,
                        logLevel.toUpperCase()
                    ].join('.')
                )
            }
        }
    }
}
