import { nestToTypeOrmLoggingLevels } from './db.const';
import { Loggers } from '../log/loggers';
import { TypeOrmLogger } from './typeorm-logger';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { ConfigService } from '../config/config.service';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { configLogLevelsVariableName, defaultLogLevels, logLevelsJoiner } from '../log/log.const';
import { configValueToArray } from '../config/config';

export const configTypeOrmLogLevelsVariableName = 'MSSQL_LOGGING_LEVELS';

export const getTypeOrmDefaultLogLevels = (configService: ConfigService): LogLevel[] =>
    configValueToArray(
        configService.get(configTypeOrmLogLevelsVariableName) ||
        configService.get(configLogLevelsVariableName) ||
        defaultLogLevels
    ).map(s => s.trim().toLowerCase()) as LogLevel[];

export const getTypeOrmLoggingLevels = (configService: ConfigService): string[] => {
    const typeORMLogLevels = [];
    for (const logLevel of getTypeOrmDefaultLogLevels(configService)) {
        typeORMLogLevels.push(...(nestToTypeOrmLoggingLevels[logLevel] || []));
    }
    return [...new Set(typeORMLogLevels)];
}

export const getTypeOrmConfig = (configService: ConfigService, logs: Loggers, dbNameEnvKey: string): TypeOrmModuleOptions => {
    return {
        type: 'mssql',
        host: configService.get('MSSQL_HOST'),
        port: +configService.get('MSSQL_PORT'),
        username: configService.get('MSSQL_U'),
        password: configService.get('MSSQL_P'),
        database: configService.get(dbNameEnvKey) ?? dbNameEnvKey,
        entities: ['**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: getTypeOrmLoggingLevels(configService),
        logger: new TypeOrmLogger(configService, logs.getLogger()),
        connectTimeout: 300000,
        requestTimeout: 300000,
        extra: {
            trustServerCertificate: true,
        },
    } as TypeOrmModuleOptions;
}
