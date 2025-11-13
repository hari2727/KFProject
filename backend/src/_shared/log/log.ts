import { LogLevel } from '@nestjs/common/services/logger.service';
import { LoggerService } from '../../logger';
import { configLogLevelsVariableName, defaultLogLevels, logLevelsJoiner } from './log.const';
import { ConfigService } from '../config/config.service';
import { isNullish } from '../is';
import { simplifyError } from '../error/error';
import { configValueToArray } from '../config/config';

export const LoggedMarker = Symbol('LoggedMarker');

export const outputLogLevelMessage = (logger: LoggerService, logLevel: LogLevel, message: any, ...optionalParams: any[]): void => {
    message = simplifyError(message);

    if (logLevel === 'error') {
        logger.error(message, ...optionalParams);
    } else if (logLevel === 'warn') {
        logger.warn(message, ...optionalParams);
    } else if (logLevel === 'debug') {
        logger.debug(message, ...optionalParams);
    } else if (logLevel === 'verbose') {
        logger.verbose(message, ...optionalParams);
    } else if (logLevel === 'fatal') {
        logger.fatal(message, ...optionalParams);
    } else {
        logger.log(message, ...optionalParams)
    }
}

export const getDefaultLogLevels = (configService: ConfigService): LogLevel[] =>
    configValueToArray(
        configService.get(configLogLevelsVariableName) ||
        defaultLogLevels
    ).map(s => s.trim().toLowerCase()) as LogLevel[];

export const isNotLogged = (value: any): any => {
    try {
        return isNullish(value[LoggedMarker]);
    } catch (e) {
        return true;
    }
}

export const markLogged = (value: any): any => {
    try {
        value[LoggedMarker] = true;
    } catch (e) {
    }
}
