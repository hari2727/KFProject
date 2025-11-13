import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppUnhandledExceptionsFilter } from './app-unhandled-exceptions.filter';
import { AppPerformanceInterceptor } from './app-performance.interceptor';
import { AppResponseInterceptor } from './app-response.interceptor';
import { HttpsService } from '../https/https.service';
import { PostInterceptor } from './post.interceptor';
import { Loggers } from '../log/loggers';
import { ConfigService } from '../config/config.service';
import { Caches } from '../cache/caches';
import { CypherService } from '../cypher/cypher.service';
import { getDefaultCypherService } from '../cypher/cypher';
import { ConfigReader } from '../config/reader/reader';
import { getConfigReader } from '../config/reader/registry';

@Global()
@Module({
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppUnhandledExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppPerformanceInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: PostInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: AppResponseInterceptor,
        },
        {
            provide: CypherService,
            useFactory: getDefaultCypherService
        },
        {
            provide: ConfigReader,
            useFactory: getConfigReader
        },
        ConfigService,
        HttpsService,
        Loggers,
        Caches,
    ],
    exports: [
        ConfigService,
        HttpsService,
        Loggers,
        Caches,
    ],
})
export class AppBaseModule { }
