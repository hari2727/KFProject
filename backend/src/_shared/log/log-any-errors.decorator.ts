import { globalInstances } from '../di/global-instances';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { isNotLogged, markLogged, outputLogLevelMessage } from './log';

const handleError = (logLevel: LogLevel, e: any, contextName: string): void => {
    if (isNotLogged(e)) {
        const logger = globalInstances.Logger;
        if (logger) {
            outputLogLevelMessage(logger, logLevel, e, contextName);
            markLogged(e);
        }
    }
};

export function LogAnyErrors(logLevel: LogLevel = 'debug') {

    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;
        const contextName = [target?.constructor?.name, method.name || propertyName].join('.');

        descriptor.value = function () {

            try {
                const value = method.apply(this, arguments);
                if (value instanceof Promise) {
                    return value.catch(e => {
                        handleError(logLevel, e, contextName);
                        throw e;
                    });
                }
                return value;

            } catch (e: any) {
                handleError(logLevel, e, contextName);
                throw e;
            }
        };
    };
}
