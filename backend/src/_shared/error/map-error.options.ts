import { HttpStatus } from '@nestjs/common';

export interface MapErrorOptions {
    message?: string;
    status?: HttpStatus;
    errorCode?: unknown;
}
