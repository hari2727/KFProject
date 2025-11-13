import { HttpException, HttpStatus } from '@nestjs/common';
import { AppErrorOptions } from './app-error.options';

export class AppError extends HttpException {
    readonly errorCode: unknown;

    constructor(response: string | object, status?: HttpStatus, options?: AppErrorOptions | undefined) {
        super(response, status);
        this.errorCode = options?.errorCode;
        this.cause = options?.cause;
    }
}
