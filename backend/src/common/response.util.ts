import { Response } from 'express';

export const sendRawResponse = (response: Response, data: any, status = 200, headers?: { [header: string] : string }): any => {
    if (status) {
        response.status(status);
    }
    if (headers) {
        for (const header in headers) {
            response.setHeader(header, headers[header]);
        }
    }
    return response.send(data);
}
