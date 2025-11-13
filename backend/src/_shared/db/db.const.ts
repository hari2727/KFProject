import { NestLogLevel, TypeOrmLogLevel } from '../log/log.i';
import { LogLevel } from 'kfone-common-library';

export const nestToTypeOrmLoggingLevels: { [ nestLogLevel: string ]: TypeOrmLogLevel[] } = Object.freeze({
    'log': ['log'],
    'warn': ['warn'],
    'error': ['error', 'warn'],
    'fatal': ['error'],
    'verbose': ['log', 'warn', 'error', 'info', 'query', 'schema', 'migration'],
    'debug': ['info', 'query', 'schema', 'migration'],
});

export const typeOrmToNestLoggingLevels: { [ typeOrmEvent: string ]: NestLogLevel[] } = Object.freeze({
    'log': ['log', 'verbose'],
    'warn': ['warn', 'error', 'verbose'],
    'query-slow': ['warn', 'debug', 'verbose'],
    'error': ['error', 'fatal', 'verbose'],
    'query-error': ['error', 'fatal', 'verbose'],
    'info': ['debug', 'verbose'],
    'query': ['debug', 'verbose'],
    'schema': ['debug', 'verbose'],
    'schema-build': ['debug', 'verbose'],
    'migration': ['debug', 'verbose'],
    'all': ['verbose']
});
