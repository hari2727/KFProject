import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class PostInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const http = context.switchToHttp();

        if (http.getRequest<Request>().method === 'POST') {
            const resp = http.getResponse<Response>();

            if (resp.statusCode === 201) {
                resp.status(HttpStatus.OK);
            }
        }
        return next.handle();
    }
}
