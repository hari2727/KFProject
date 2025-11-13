import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';
import { map } from 'rxjs/operators';
import { AppResponse } from '../response/app-response';
import { createAppSuccessResponse, sendResponse } from '../response/response';

@Injectable()
export class AppResponseInterceptor implements NestInterceptor {

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => this.sendResponse(context, data)));
    }

    sendResponse(context: ExecutionContext, data: any) {
        const response = context.switchToHttp().getResponse() as Response;

        sendResponse(response,
            data instanceof AppResponse ? data : createAppSuccessResponse(data)
        );
    }
}
