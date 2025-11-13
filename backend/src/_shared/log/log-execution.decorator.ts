import { globalInstances } from '../di/global-instances';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { outputLogLevelMessage } from './log';
import { cutExecutionStats } from './log-execution';
import { isNullish } from '../is';
import { LogExecutionOptions } from './log-execution.i';

const output = (logLevel: LogLevel, message: any, contextName: string): void => {
    const logger = globalInstances.Logger;
    if (logger) {
        outputLogLevelMessage(logger, logLevel, message, contextName);
    }
}

const outputResponse = (options: LogExecutionOptions, response: any, time: number, contextName: string): void => {
    const resp: any = {
        execution: { time }
    };
    const stats = cutExecutionStats(response);
    if (!isNullish(stats)) {
        resp.execution.stats = stats;
    }
    if (options.response) {
        resp.response = response;
    }
    output(options.logLevel, resp, contextName);
}

const outputError = (options: LogExecutionOptions, error: any, time: number, contextName: string): void => {
    const resp: any = {
        execution: { time }
    };
    const stats = cutExecutionStats(error);
    if (!isNullish(stats)) {
        resp.execution.stats = stats;
    }
    if (options.response) {
        resp.threw = true;
    }
    output(options.logLevel, resp, contextName);
}

const outputArgs = (options: LogExecutionOptions, args: any, contextName: string): void => {
    if (options.args) {
        const resp: any = { args };
        output(options.logLevel, resp, contextName);
    }
}

let i: number = 0;

export function LogExecution(options?: LogExecutionOptions) {

    options = Object.assign({ logLevel: 'log', args: false, response: false } as LogExecutionOptions, options ?? {});

    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;
        const contextName = [target?.constructor?.name, method.name || propertyName].filter(Boolean).join('.');

        descriptor.value = function () {
            outputArgs(options, arguments, contextName);

            const startTime = performance.now();

            try {

                const value = method.apply(this, arguments);
                if (value instanceof Promise) {
                    return value.then(r => {
                        outputResponse(options, r, performance.now() - startTime, contextName);
                        return r;

                    }).catch(e => {
                        outputError(options, e, performance.now() - startTime, contextName);
                        throw e;
                    });
                }

                outputResponse(options, value, performance.now() - startTime, contextName);
                return value;

            } catch (e: any) {
                outputError(options, e, performance.now() - startTime, contextName);
                throw e;
            }
        };

    };
}
