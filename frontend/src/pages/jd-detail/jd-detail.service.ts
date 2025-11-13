import { Injectable, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { actionClearCerts } from './certs.actions';
import { actionJdRemove } from './jd-detail.actions';

import { State } from './jd-detail.state';

@Injectable()
export class JdDetailService {
    onLeaveJdSub: Subscription;

    constructor(
        private router: Router,
        private store: Store<State>,
    ) {
    }

    ngOninit() {
    }

    subscribeOnLeaveJd() {
        if (!this.onLeaveJdSub) {
            this.onLeaveJdSub = this.router.events.pipe(
                filter(event => event instanceof NavigationStart && !event.url.includes('jd/detail')),
                take(1),
            ).subscribe((event) => {
                this.clearJdAndCerts();

                this.onLeaveJdSub.unsubscribe();
                this.onLeaveJdSub = undefined;
            });
        }
    }

    clearJdAndCerts() {
        this.store.dispatch(actionJdRemove());
        this.store.dispatch(actionClearCerts());
    }
}
