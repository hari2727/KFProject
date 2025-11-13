import { INestApplication, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { globalInstances } from '../di/global-instances';
import { _bodyParserOptions, AppBootstrapOptions } from './bootstrap.options';
import { ConfigService } from '../config/config.service';
import { isNullish } from '../is';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { toBoolean, toNumber } from '../convert';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { writeFileSync } from 'node:fs';
import { getUTCParts } from '../date';
import { secretManagerConfig } from './../config/secret-manager.config';
import { KF1Logger } from '../../logger/logger.service';

let appTag: string;

export const toAppBootstrapOptions = async (options: AppBootstrapOptions, config: ConfigService): Promise<AppBootstrapOptions> => {

    options ??= {};

    options.port ??= toNumber(config.get('APP_PORT'));
    options.host ??= config.get('APP_HOST') ?? '0.0.0.0';
    options.name ??= config.get('APP_NAME') ?? `${options.host}:${options.port}`;
    options.endPointUri ??= config.get('API_ENDPOINT_URI');
    options.version ??= options.name;
    options.httpsEnabled ??= toBoolean(config.get('HTTPS_ENABLED'));
    if (options.httpsEnabled) {
        const httpsOptions = options.httpsOptions ?? { private_Key: '', public_certificate: '' };
        try {
            const secretManagerData = await secretManagerConfig();
            if (secretManagerData?.private_Key) {
                httpsOptions.private_Key = secretManagerData.private_Key;
                httpsOptions.public_certificate = secretManagerData.public_certificate;
            }
        } catch (error) {
            KF1Logger.error('Failed to load HTTPS certificates from secrets manager', error);
        };
        options.httpsOptions =  httpsOptions;
    }

    // @ts-ignore
    const bodyParser: _bodyParserOptions = options?.bodyParser ?? {};
    bodyParser.limit ??= config.get('INPUT_BODY_LIMIT') ?? '100mb';
    options.bodyParser = bodyParser;


    options.swaggerEnabled ??= toBoolean(config.get('SWAGGER_ENABLED'));
    if (options.swaggerEnabled) {
        const swaggerOptions = options.swaggerOptions ?? {};
        swaggerOptions.version ??= options.version;
        swaggerOptions.title ??= options.name;
        swaggerOptions.endPointUri ??= config.get('SWAGGER_ENDPOINT_URI') ?? '/swagger';
        swaggerOptions.outputFile ??= config.get('SWAGGER_OUTPUT_FILE');
        options.swaggerOptions = swaggerOptions;
    }

    return options;
};

export const getAppTag = (): string => {
    return appTag;
}

export const buildAppTag = (appVersion: any): string => {
    return [appVersion, getUTCParts().slice(1, -1).join('')].filter(i => !isNullish(i)).join('/');
}

export const bootstrapApp = async (appModule: any, options: AppBootstrapOptions, config: ConfigService): Promise<INestApplication> => {
    options = await toAppBootstrapOptions(options, config);

    appTag = buildAppTag(options.version);

    const app = await createApp(appModule, options);
    return await startApp(app, options);
}

export const createApp = async (appModule: any, options: AppBootstrapOptions): Promise<INestApplication> => {

    const appOptions: NestApplicationOptions = {};
    if (options.httpsEnabled) {
        appOptions.httpsOptions = {
            key: options.httpsOptions.private_Key,
            cert: options.httpsOptions.public_certificate
        };
    }

    const app: INestApplication = await NestFactory.create(appModule, appOptions);

    if (options.bodyParser) {
        const limit = options.bodyParser.limit;
        app.use(bodyParser.json({ limit }));
        app.use(bodyParser.urlencoded({ limit, extended: true }));
    }

    if (options.swaggerEnabled) {
        const config = new DocumentBuilder()
            .setTitle(options.swaggerOptions.title)
            .setVersion(options.swaggerOptions.version)
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        if (options.swaggerOptions.outputFile) {
            writeFileSync(options.swaggerOptions.outputFile, JSON.stringify(document, null, 4));
        }
        SwaggerModule.setup(options.swaggerOptions.endPointUri, app, document);
    }

    app.enableCors();
    app.setGlobalPrefix(
        options.endPointUri,
        {
            exclude: [{ path: '/health', method: RequestMethod.GET }]
        }
    );
  
    return app;
}

export const startApp = async (app: INestApplication, options: AppBootstrapOptions): Promise<INestApplication> => {
    const port = options.port;
    const host = options.host;
    const name = options.name;
    const protocol = options.httpsEnabled ? 'HTTPS' : 'HTTP';
    
    app.getHttpAdapter().getInstance().get('/', (_req: any, res: any) => res.status(200).send('OK'));

    await app.listen(port, host).then(() =>
        globalInstances.Logger?.log(`'${name}' started on port ${host}:${port} using ${protocol} protocol`, 'App')
    );
    return app;
}
