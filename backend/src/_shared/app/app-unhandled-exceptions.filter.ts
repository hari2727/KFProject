import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, } from '@nestjs/common';
import { Loggers } from '../log/loggers';
import { colorReset } from '../log/log.const';
import { AppError } from '../error/app-error';
import { LoggerService } from '../../logger';
import { isManagedError, simplifyError } from '../error/error';
import { isInstanceOf, isNullish } from '../is';
import { ContextError } from '../error/context-error';
import { sendResponse } from '../response/response';
import { AppResponse } from '../response/app-response';
import { Request } from 'express';
import { ConfigService } from '../config/config.service';
import { _filterStopWords } from '../filter';
import { toBoolean } from '../convert';

@Catch()
export class AppUnhandledExceptionsFilter implements ExceptionFilter {
    protected logger: LoggerService;
    protected bodyAllowedMethods = ['POST', 'PUT', 'PATCH'];
    protected colorsEnabled: boolean;

    constructor(
        loggers: Loggers,
        configService: ConfigService
    ) {
        this.logger = loggers.getLogger('*');
        this.colorsEnabled = toBoolean(configService.get('LOGGING_COLORS'));
    }

    catch(e: any, host: ArgumentsHost): void {
        const http = host.switchToHttp();
        const req: Request = http.getRequest();
        const scope = [req.method, req.url].join(' ');

        e = simplifyError(e);

        if (this.bodyAllowedMethods.includes(req.method) && !isNullish(req.body)) {
            this.logger.error(`${this.colorsEnabled ? colorReset : ''}Body: ${JSON.stringify(req.body, null, 4)}`, e, scope);
        } else {
            this.logger.error(e, scope);
        }

        let message: unknown;
        let status: unknown;
        let errorCode: unknown;
        let cause: unknown;

        if (e instanceof ContextError) {
            message = e.message;
            cause = e.cause;
        } else if (e instanceof AppError) {
            message = e.getResponse();
            status = e.getStatus();
            errorCode = e.errorCode;
            cause = e.cause;
        } else if (e instanceof HttpException) {
            message = e.getResponse();
            status = e.getStatus();
            cause = e.cause;

            if (message && typeof message === 'object') {
                // @ts-ignore
                message = message.message ?? message.error ?? message;
                errorCode = `RES.${status}`;
            }
        } else if (e instanceof Error) {
            message = e.message;
            // @ts-ignore
            errorCode = e.status;
            // @ts-ignore
            cause = e.cause;
        } else {
            const et = typeof e;
            if (['string'].includes(et)) {
                message = e;
            } else if (!['function', 'symbol'].includes(et)) {
                cause = e;
            }
        }

        if (!isManagedError(e) && isInstanceOf(e, Error)) {
            message = 'Unexpected error';
        }
        if (cause && isInstanceOf(cause, Error)) {
            cause = undefined;
        }

        const _status = Number(status) || HttpStatus.INTERNAL_SERVER_ERROR;
        const _message = _filterStopWords(message ?? '');
        let _cause = undefined;
        if (!isNullish(cause)) {
            _cause = _filterStopWords(cause.toString());
        }
        if (_cause === _message) {
            _cause = undefined;
        }

        sendResponse(http.getResponse(), new AppResponse({
            status: Number(status) || HttpStatus.INTERNAL_SERVER_ERROR,
            data: {
                status: {
                    code: errorCode ?? `RES.${_status}`,
                    message: _message,
                },
                error: _cause,
            }
        }))
    }
}
