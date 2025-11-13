import { AppError } from './app-error';
import { HttpException } from '@nestjs/common';
import { ContextError } from './context-error';
import { keepSimple } from '../object';

export const isManagedError = (e: any): boolean =>
    e instanceof AppError || e instanceof HttpException || e instanceof ContextError;

export const simplifyError = (e: any): any => {
    e = simplifyAxiosError(e);
    return e;
}

export const simplifyAxiosError = (e: any): any => {
    try {
        if (e.name === 'AxiosError') {
            delete e.config;
            delete e.request;
            delete e.response.config;
            e.response = keepSimple(e.response);
        }
    } catch (e) {
    }
    return e;
}

export const raise = (value: any): any => {
    throw value;
}
