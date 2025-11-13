import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { KfLoginService } from '@kf-products-core/kfhub_lib';

let initialized = false;

export const KfTarcInitGuard: CanActivateFn = () => {
    // Skip initialization if already done
    if (initialized) {
        return of(true);
    }

    return inject(KfLoginService).loadProfileManagerData().pipe(
        map(() => {
            initialized = true;
            return true;
        }),
        catchError(() => of(false)),
    );
};
