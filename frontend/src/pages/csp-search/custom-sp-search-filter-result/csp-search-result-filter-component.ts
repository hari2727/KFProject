import * as _ from 'lodash';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {
    expansionAnimations, ExpansionPanelStateEnum, RadioChange
} from '@kf-products-core/kfhub_thcl_lib/presentation';
import {
    checkedSelectItemsToDictByType, findSelectItemByValue, GroupSelectItem, SelectItem
} from '@kf-products-core/kfhub_thcl_lib/transform';
import { Store } from '@ngrx/store';

import { actionFilterChange, actionStoreFilter } from '../../csp-search/csp-search-actions';
import { CspSearchFilterEnum } from '../../csp-search/csp-search-constants';
import { SelectItemFlatten } from '../../csp-search/csp-search-model';
import { getSelectedFiltersFlatten } from '../../csp-search/csp-search-pure';
import { FiltersState } from '../../csp-search/csp-search-reducer';
import { State } from '../../csp-search/csp-search-state';

@Component({
    selector: 'kftarc-csp-search-filter',
    templateUrl: './csp-search-result-filter-component.html',
    styleUrls: ['./csp-search-result-filter-component.scss'],
    animations: [expansionAnimations.indicatorRotate],
})
export class CspSearchFilterComponent implements OnInit {

    selectedFilters: SelectItemFlatten[] = [];

    @Input() filters: FiltersState;

    @Output() onFilterChange: EventEmitter<{ filters: SelectItemFlatten[] }> = new EventEmitter();

    @Output() onClickFilter = new EventEmitter();

    searchFilterEnum = CspSearchFilterEnum;

    constructor(
        private store: Store<State>,
    ) { }

    public ngOnInit(): void {
        this.selectedFilters = getSelectedFiltersFlatten(this.filters);
    }

    getPanelState(expanded): ExpansionPanelStateEnum {
        return expanded ? ExpansionPanelStateEnum.Expanded : ExpansionPanelStateEnum.Collapsed;
    }

    private updateSelectedItems() {
        this.store.dispatch(actionStoreFilter({ filters: checkedSelectItemsToDictByType(this.filters) }));
        this.store.dispatch(actionFilterChange({ filters: _.cloneDeep(this.filters) }));

        this.selectedFilters = getSelectedFiltersFlatten(this.filters);

        this.onFilterChange.emit({ filters: this.selectedFilters });
    }

    emitOnClickFilter() {
        this.onClickFilter.emit('');
    }


    onChangeFilter(item: SelectItem<string>) {
        item.checked = !item.checked;

        this.updateSelectedItems();
    }

    onChangeFunction(selectedItem: _.Dictionary<_.Dictionary<string>>) {
        this.updateSelectedItems();
    }

    removeFilter(type: CspSearchFilterEnum, value: string, parentId: string) {
        const filterByType = this.filters.find(f => f.type.some(t => t === type));

        const items = findSelectItemByValue(filterByType.items, value, parentId);

        if (items.length === 2) {
            const [item, subItem] = items as [GroupSelectItem, SelectItem<string>];
            subItem.checked = false;
            item.checked = item.value.some(v => v.checked);
        } else {
            const [item] = items as [SelectItem<string>];
            item.checked = false;
            if (_.isArray(item.value)) {
                item.value.forEach(v => v.checked = false);
            }
        }

        this.updateSelectedItems();
    }

    removeAllFilters(): void {
        this.filters.forEach(f => {
            f.items.forEach(item => {
                item.checked = false;
                if (_.isArray(item.value)) {
                    item.value.forEach(subItem => subItem.checked = false);
                }
            });
        });

        this.updateSelectedItems();
    }

    onChangeRadio(item: SelectItem<string, any>, items, change: RadioChange) {
        const subItem = change.value as SelectItem<string>;

        items.forEach(it => {
            it.checked = false;
        });
        subItem.checked = !subItem.checked;
        this.updateSelectedItems();
    }
}
