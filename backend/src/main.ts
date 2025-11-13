import path = require('node:path');
import { ApplicationModule } from './app.module';
import { bootstrapApp } from './_shared/bootstrap/bootstrap';
import { tryRequire } from './_shared/fs';
import { getConfigService } from './_shared/config/config';
import { ConfigLoaderService } from './_shared/config/config.loader';
// import { AppConfigReader } from './_shared/config/reader/app.config.reader';
import { JsonConfigReader } from './_shared/config/reader/json.reader';
import { secretManagerConfig } from './_shared/config/secret-manager.config';
import { isLocal } from './utils';
import { KF1Logger } from './logger/logger.service';

async function bootstrap() {
    await secretManagerConfig();
    const configLoader = new ConfigLoaderService();
    const loadedConfig = await configLoader.loadConfig();
    // TODO: Replace JsonConfigReader with AppConfigReader when migrating 
    // from env.json file to app config service

    // const config = getConfigService(new AppConfigReader(loadedConfig));
    let env_path = path.join(__dirname, `/environments/env.${loadedConfig?.APP_ENV || 'local'}.json`);

    if (isLocal()) {
        env_path = 'env.json';
    }

    const config = getConfigService(new JsonConfigReader(env_path));
    await bootstrapApp(ApplicationModule,
        {
            version: tryRequire('package.json')?.version,
        },
        config
    );
}

bootstrap().catch(error => {
    KF1Logger.error('Failed to start application', error);
    process.exit(1);
});
