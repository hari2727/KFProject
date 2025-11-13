
import { of, Observable, ConnectableObservable } from 'rxjs';
import { Injectable } from '@angular/core';
import { KfAuthService } from '@kf-products-core/kfhub_lib';
import * as _ from 'lodash';
import { KfThclSPSharedConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import { map, catchError, publishReplay, delay } from 'rxjs/operators';

export interface KfTarcMarketSkill {
    name: string;
    isMatching?: boolean;
}

export interface KfTarcSkillsFilterItem {
    id: number;
    name: string;
    isSelected?: boolean;
    isHidden?: boolean;
}

export type KfTarcSkillCompareSections = 'market' | 'industry' | 'peers';

export interface KfTarcFiltersChange {
    selectedSkillsCompareSection: KfTarcSkillCompareSections;
    selectedSkillFilter?: KfTarcSkillsFilterItem[];
}

export interface KfTarcAltTitle {
    name: string;
}

interface SkillsCache {
    [id: string]: Observable<KfTarcMarketSkill[]>;
}

interface TitlesCache {
    [id: string]: Observable<KfTarcAltTitle[]>;
}

@Injectable()
export class KfTarcMarketSkillsService {
    private industriesCache$: Observable<KfTarcSkillsFilterItem[]> = null;
    private skillsCache: SkillsCache = {};
    private titlesCache: TitlesCache = {};

    constructor(
        private consts: KfThclSPSharedConstantsService,
        private authService: KfAuthService,
    ) { }

    updateDiffs(skills1: KfTarcMarketSkill[] = [], skills2: KfTarcMarketSkill[] = []) {
        const names1 = new Set(_.map(skills1, s => s.name.toLocaleLowerCase()));
        const names2 = new Set(_.map(skills2, s => s.name.toLocaleLowerCase()));
        for (const skill of skills1) {
            this.setMatch(skill, names2);
        }
        for (const skill of skills2) {
            this.setMatch(skill, names1);
        }
    }

    public getSkills(
        type: 'ORG_SKILL' | 'MARKET_SKILL',
        spName: string, countryId: number,
        additionalFilters: { [name: string]: string } = {},
    ): Observable<KfTarcMarketSkill[]> {
        const topCount = 10;
        const filters = { ...{ type, spName, topCount, countryId }, ...additionalFilters };
        let url = this.consts.getSkillsUrl();
        let prefix = '?';
        let cacheKey = '';
        for (const [key, val] of _.toPairs(filters)) {
            cacheKey += `${prefix}${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`;
            prefix = '&';
        }
        if (this.skillsCache[cacheKey]) {
            const item$ = this.skillsCache[cacheKey];
            return item$.pipe(map(d => _.cloneDeep(d)));
        }
        url += cacheKey;
        const req$ = this.authService.authHttpCallv2('GET', url, null, { requestType: 'background' }).pipe(
            map(data => data ? data.skills || [] : []),
            catchError(() => of([])),
        );
        const cacheItem$ = req$.pipe(publishReplay(1));
        this.skillsCache[cacheKey] = cacheItem$;
        (cacheItem$ as ConnectableObservable<number>).connect();
        return cacheItem$.pipe(map(d => _.cloneDeep(d)));
    }

    public getIndustriesFilterData(): Observable<KfTarcSkillsFilterItem[]> {
        if (this.industriesCache$) {
            return this.industriesCache$.pipe(map(d => _.cloneDeep(d)));
        }
        const url = this.consts.getIndustriesUrl();
        const req$ = this.authService.authHttpCallv2('GET', url, null).pipe(
            map(data => data ? data : []),
            catchError(() => of([])),
        );
        const cacheItem$ = req$.pipe(publishReplay(1));
        this.industriesCache$ = cacheItem$;
        (cacheItem$ as ConnectableObservable<number>).connect();
        return cacheItem$.pipe(map(d => _.cloneDeep(d)));
    }

    public getPeersFilterData(search: string): Observable<KfTarcSkillsFilterItem[]> {
        const url = `${this.consts.getPeersUrl()}?searchString=${encodeURIComponent(search)}&topCount=100`;
        return this.authService.authHttpCallv2('GET', url, null).pipe(
            map(data => _.map(data, item => ({ id: item.PeerGroupID, name: item.PeerGroupName }))),
            catchError(() => of([])),
        );
    }

    private setMatch(skill: KfTarcMarketSkill, otherSkills: Set<string>) {
        if (otherSkills.has(skill.name)) {
            skill.isMatching = true;
        } else {
            skill.isMatching = false;
        }
    }

    public getAltTitles(spName: string, countryId: number): Observable<KfTarcAltTitle[]> {
        const cacheKey = `?spName=${encodeURIComponent(spName)}&countryId=${encodeURIComponent(String(countryId))}&topCount=20`;
        if (this.titlesCache[cacheKey]) {
            const item$ = this.titlesCache[cacheKey];
            return item$.pipe(map(d => _.cloneDeep(d)));
        }
        const url = this.consts.getAltTitlesUrl() + cacheKey;
        const req$ = this.authService.authHttpCallv2('GET', url, null, { requestType: 'background' }).pipe(
            map(data => data ? data.jobTitles || [] : []),
            catchError(() => of([])),
        );
        const cacheItem$ = req$.pipe(publishReplay(1));
        this.titlesCache[cacheKey] = cacheItem$;
        (cacheItem$ as ConnectableObservable<number>).connect();
        return cacheItem$.pipe(map(d => _.cloneDeep(d)));
    }
}
