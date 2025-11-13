import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Loggers } from '../log/loggers';
import { LoggerService } from '../../logger';

@Injectable()
export class AppPerformanceInterceptor implements NestInterceptor {
    protected logger: LoggerService;

    constructor(
        loggers: Loggers
    ) {
        this.logger = loggers.getLogger(AppPerformanceInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        if (req) {

            const contextName = `${req.method} ${req.url}`;

            const before = performance.now();

            return next.handle().pipe(
                catchError(e => {
                    this.logger.error(`Failed after ${(performance.now() - before).toFixed(3)} ms`, contextName);
                    return throwError(e);
                }),
                tap(() => {
                    this.logger.log(`Completed in ${(performance.now() - before).toFixed(3)} ms`, contextName);
                })
            );
        }
        return next.handle();
    }
}
