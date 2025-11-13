import { Response } from 'express';
import { AppResponseOptions, SimpleAppResponseOptions } from './app-response.options';
import { AppResponse } from './app-response';
import { HttpStatus } from '@nestjs/common';
import { _filterStopWords } from '../filter';
import { getAppTag } from '../bootstrap/bootstrap';

export const sendResponse = (response: Response, options: AppResponseOptions | AppResponse): Response => {

    if (options instanceof AppResponse) {
        return sendResponse(response, options.options);
    }

    if (options.status) {
        response.status(options.status);
    }

    if (options.headers) {
        response.set(options.headers);
    }

    const appTag = getAppTag();
    if (appTag) {
        response.setHeader('X-AppTag', appTag);
    }

    if (options.location) {
        response.location(options.location);
    }

    if (options.contentType) {
        response.contentType(options.contentType);
    }

    if (options.data) {
        if (options.data instanceof Buffer) {
            response.send(options.data);
        } else {
            response.json(options.data);
        }
    }

    return response;
}

export const createAppSuccessResponse = (data: unknown, options?: SimpleAppResponseOptions | undefined): AppResponse => {
    const _options: any = options ? { ...options } : {};
    _options.status ??= HttpStatus.OK;
    return createAppResponse(data, _options, true);
}

export const createAppFailureResponse = (data: unknown, options?: SimpleAppResponseOptions | undefined): AppResponse => {
    const _options: any = options ? { ...options } : {};
    _options.status ??= HttpStatus.INTERNAL_SERVER_ERROR;

    return createAppResponse(data, _options, false);
}

const createAppResponse = (payload: unknown, options: SimpleAppResponseOptions, isSuccessful: boolean): AppResponse => {
    const status = options?.status;
    const code = options?.code ?? `RES.${status}`;
    const message = _filterStopWords(options?.message ?? '');
    const data = isSuccessful ? payload : undefined;
    const error = isSuccessful ? undefined : payload;

    return new AppResponse({
        status,
        data: {
            status: {
                code,
                message,
            },
            error,
            data,
        }
    });
}
