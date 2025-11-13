import { HttpClient } from '@angular/common/http';
import { KfCustomMultiPathJsonLoader } from '@kf-products-core/kfhub_lib';

export function httpLoaderFactory(http: HttpClient) {
    return new KfCustomMultiPathJsonLoader(http, ['/app/lib/languages/', '/app/tarc/languages/']);
}
