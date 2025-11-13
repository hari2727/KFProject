import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    checkedSelectItemsToDictByType, findSelectItemByValue, SelectItem
} from '@kf-products-core/kfhub_thcl_lib/transform';
import { Store } from '@ngrx/store';

import {
    actionFilterChange, actionFilterRemoveAll, actionSearchChange
} from '../jd-search.actions';
import { JdSearchFilterEnum } from '../jd-search.constant';
import { SelectItemFlatten } from '../jd-search.model';
import { FiltersState } from '../jd-search.reducer';
import { State } from '../jd-search.state';

@Component({
    selector: 'kftarc-jd-search-filter',
    templateUrl: './jd-search-filter.component.html',
    styleUrls: ['./jd-search-filter.component.scss'],

})
export class JdSearchFilterComponent implements OnInit, OnDestroy {

    search = '';
    search$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    filters: FiltersState;
    selectedFilters: SelectItemFlatten[] = [];

    @Input() placeholder = '';

    @Output() onFilterChange: EventEmitter<any> = new EventEmitter();


    searchFilterEnum = JdSearchFilterEnum;

    subs: Subscription[] = [];
    initilazed: boolean;

    constructor(
        private route: ActivatedRoute,
        private store: Store<State>,
    ) { }

    public ngOnInit(): void {
        const [search, filters] = this.route.snapshot.data.searchFilters;
        this.search = search;
        this.filters = _.cloneDeep(filters); // prevents ngrx immutability issues;
        this.selectedFilters = this.getSelectedFiltersFlatten(this.filters);

        this.updateSelectedItems();
        setTimeout(() => (this.initilazed = true), 50);


        const searchSub = this.search$.pipe(
            filter(() => this.initilazed),
            debounceTime(250),
            distinctUntilChanged(),
        ).subscribe((term) => {
            this.search = _.isString(term) && term.length > 1 ? term : '';

            this.onFilterChange.emit({ search: this.search, filters: this.selectedFilters });
            this.store.dispatch(actionSearchChange({ search: this.search }));

        });
        this.subs.push(searchSub);
    }

    onChangeSearch(searchTerm: string) {
        if (searchTerm.length === 1) {
            return;
        }

        this.search$.next(searchTerm);
    }

    private updateSelectedItems() {
        this.selectedFilters = this.getSelectedFiltersFlatten(this.filters);

        this.store.dispatch(actionFilterChange({ filters: checkedSelectItemsToDictByType(this.filters) }));

        this.onFilterChange.emit({ search: this.search, filters: this.selectedFilters });
    }

    private getSelectedFiltersFlatten(filters: FiltersState) {
        const mapSelectItemFn = (type: JdSearchFilterEnum, term: string, item: SelectItem<string>, parentId?: string) =>
            ({ term, type, label: item.label, value: item.value, parentId });

        return _.flatMapDeep(
            filters,
            f => f.items.filter(item => item.checked).map(item =>
                mapSelectItemFn(f.type[0], `lib.${f.type[0]}`, item as SelectItem<string>))) as SelectItemFlatten[];
    }

    onChangeFilter(item: SelectItem<string>) {
        item.checked = !item.checked;

        this.updateSelectedItems();
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.forEach((subscription$: Subscription) => {
                subscription$.unsubscribe();
            });
            this.subs = null;
        }

        this.store.dispatch(actionFilterRemoveAll());
    }


    removeFilter(type: JdSearchFilterEnum, value: string, parentId: string) {
        const filterByType = this.filters.find(f => f.type.some(t => t === type));

        const items = findSelectItemByValue(filterByType.items, value, parentId) as (SelectItem<string>)[];

        const [item] = items as [SelectItem<string>];
        item.checked = false;

        this.updateSelectedItems();
    }

    removeAllFilters(): void {
        this.filters.forEach(f => {
            f.items.forEach(item => {
                item.checked = false;
            });
        });

        this.updateSelectedItems();
    }
}
