import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environmentReader } from '@kf-products-core/kfhub_lib';
import { KfTarcAppModule } from './app/kftarc-app.module';

  environmentReader.then((environment) => {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (environment['production']) {
        enableProdMode();
    }

    // eslint-disable-next-line no-console
    platformBrowserDynamic().bootstrapModule(KfTarcAppModule).catch(err => console.log(err));
  });
