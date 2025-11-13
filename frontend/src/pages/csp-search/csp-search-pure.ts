import _ from 'lodash';

import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { mapOptionsToSelectItems, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';

import { CspSearchFilterEnum } from './csp-search-constants';
import { FiltersState } from './csp-search-reducer';
import { FilterOption, SelectItemFlatten } from './csp-search-model';

export function getSpIcon(profileType: string): string {
    switch (profileType) {
        case SpTypeEnum.Levels:
            return 'profile-level';
        case SpTypeEnum.BestInClass:
            return 'profile-function';
        case SpTypeEnum.ONet:
            return 'profile-task';
        case SpTypeEnum.Custom:
            return 'custom';
        case SpTypeEnum.Ai:
            return 'ai-powered';
    }
}

export function getSpTypeTerm(type: string): string {
    return type === SpTypeEnum.Levels ? 'lib.levelProfileType' : `lib.${_.camelCase(type)}`;
}

export function canDelete(permission: KfIUserPermissions) {
    return permission.access && permission.access.includes('DELETE');
}

export function canCopy(permission: KfIUserPermissions) {
    return permission.access && permission.access.includes('COPY');
}


export function mapSpSearchFilters(
    filters: KfFilterMetadata[],
    excludeFilters: CspSearchFilterEnum[],
    checkedOptions: { [type: string]: _.Dictionary<string> | _.Dictionary<_.Dictionary<string>> }
) {

    const defaultFilters = [
        [CspSearchFilterEnum.ProfileCollections],
        [CspSearchFilterEnum.ProfileType],
        [CspSearchFilterEnum.Grades],
        [CspSearchFilterEnum.Levels],
        [CspSearchFilterEnum.Functions, CspSearchFilterEnum.SubFunctions],
        [CspSearchFilterEnum.SearchSource],
        [CspSearchFilterEnum.Industry],
        [CspSearchFilterEnum.Language],
    ];

    return _.chain(defaultFilters).filter(f => !excludeFilters.some(ef => ef === f[0])).map(type => {
        const filter = filters.find(f => f.name === type[0]);
        if (!filter) {
            return;
        }
        return {
            type,
            term: type[0] === CspSearchFilterEnum.Industry ? _.toLower(`pm.${type.join('_')}`) : `lib.${type.join('_')}`,
            items: mapOptionsToSelectItems(
                filter.options as unknown as FilterOption[],
                [type.join('_')],
                checkedOptions,
                ['searchOn', 'subOptions'],
                type[0] === CspSearchFilterEnum.ProfileType
                    ? (o) => ({ data: { description: o.description }, icon: getSpIcon(o.type as SpTypeEnum) })
                    : undefined
            )
        };
    }).compact()
        .value();
}

export function getSelectedFiltersFlatten(filters: FiltersState) {
    const mapSelectItemFn = (type: CspSearchFilterEnum, term: string, item: SelectItem<string>, parentId?: string | number) =>
        ({ term, type, label: item.label, value: item.value, parentId });

    return _.flatMapDeep(
        filters,
        f => f.items.filter(item => item.checked).map(item =>
            _.isArray(item.value)
                ? [
                    { type: f.type[0], term: `lib.${f.type[0]}`, label: item.label, value: item.id },
                    ..._.flatMapDeep(item.value.filter(subItem => subItem.checked), subItem =>
                        mapSelectItemFn(f.type[1], `lib.${f.type[1]}`, subItem, (item as SelectItem<string>).id))
                ]
                : mapSelectItemFn(
                    f.type[0],
                    f.type[0] === CspSearchFilterEnum.Industry ? _.toLower(`pm.${f.type[0]}`) : `lib.${f.type[0]}`,
                    item as SelectItem<string>
                ))) as SelectItemFlatten[];
}
