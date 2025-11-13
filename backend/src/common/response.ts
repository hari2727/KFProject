import { Response } from "express";
import { HttpException } from "@nestjs/common";

export interface CustomResponseOptions {
    status: number;
    headers?: { [header: string] : string };
    raw?: boolean;
}

export class CustomResponse {
    constructor(
        public readonly body: any,
        public readonly options?: Partial<CustomResponseOptions>,
    ) {}
}

interface ResponsePayload<T = void> {
    success: boolean;
    status: {
        code: string;
        message: any;
    };
    data?: T;
}

const buildSuccessResponse = <T>(data: T = undefined, code: string = 'RES.200'): ResponsePayload<T> => {
    return {
        success: true,
        status: {
            code,
            message: '',
        },
        data,
    };
}

const buildErrorResponse = <T>(error: any, code: string = 'RES.500'): ResponsePayload<T> => {
    return {
        success: false,
        status: {
            code,
            message: error,
        },
        data: null,
    };
}

export const sendResponse = (response: Response, data: any, options?: Partial<CustomResponseOptions>): Response => {
    response.status(options?.status ?? 200);

    for (const [k, v] of Object.entries(options?.headers ?? {})) {
        response.setHeader(k, v);
    }

    return response.send(data);
}

export const handleSuccess = <T>(response: Response, data: any, options?: Partial<CustomResponseOptions>): Response => {
    const _options: Partial<CustomResponseOptions> = { ...(options || {}) };
    let body;

    if (data instanceof CustomResponse) {
        Object.assign(_options, data.options ?? {});
        body = data.body;

    } else {
        body = data;
    }

    if (!_options.raw) {
        body = buildSuccessResponse(data);
    }

    _options.status ??= 200;

    return sendResponse(response, body, _options);
}

export const handleError = <T>(response: Response, data: any, options?: Partial<CustomResponseOptions>): Response => {
    const _options: Partial<CustomResponseOptions> = { ...(options || {}) };
    let body;

    if (data instanceof CustomResponse) {
        Object.assign(_options, data.options ?? {});
        body = data.body;

    } else if (data instanceof HttpException) {
        Object.assign(_options, { status: data.getStatus() } as Partial<CustomResponseOptions>);
        body = data.getResponse();

    } else if (data instanceof Error) {
        body = data.message;

    } else {
        body = data;
    }

    if (!_options.raw) {
        body = buildErrorResponse(body);
    }

    _options.status ??= 500;

    return sendResponse(response, body, _options);
}

export const handleCallback = async (response: Response, cb: () => Promise<any>, options?: Partial<CustomResponseOptions>): Promise<any> => {
    try {
        return handleSuccess(response, await cb(), options);
    } catch (e: any) {
        return handleError(response, e, options);
    }
}
