import { HttpStatus } from '@nestjs/common';

export interface AppResponseOptions<T = unknown> {
    readonly status?: HttpStatus;
    readonly headers?: { [name: string]: string | number | string[] | number[] };
    readonly location?: string;
    readonly contentType?: string;
    readonly data: T;
}

export interface SimpleAppResponseOptions {
    readonly status?: HttpStatus;
    readonly code?: string;
    readonly message?: string;
}
