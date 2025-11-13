import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { KfIUserPermissions } from '@kf-products-core/kfhub_lib/auth';
import { mapOptionsToSelectItems } from '@kf-products-core/kfhub_thcl_lib/transform';
import * as _ from 'lodash';
import { JdSearchFilterEnum } from './jd-search.constant';
import { FilterOption } from './jd-search.model';


export function canDelete(permission: KfIUserPermissions) {
    return permission.access && permission.access.includes('DELETE');
}

export function canCopy(permission: KfIUserPermissions) {
    return permission.access && permission.access.includes('COPY');
}

export function mapJdSearchFilters(
    filters: KfFilterMetadata[],
    checkedOptions: { [type: string]: _.Dictionary<string> }
) {

    const defaultFilters = [
        [JdSearchFilterEnum.Levels],
        [JdSearchFilterEnum.Functions],
    ];

    return defaultFilters.map(type => {
        const filter = filters.find(f => f.name === type[0]);
        return {
            type,
            term: `lib.${type.join('_')}`,
            items: mapOptionsToSelectItems(
                filter.options as unknown as FilterOption[],
                [type.join('_')],
                checkedOptions,
                ['searchOn', 'subOptions'],
            )
        };
    });
}
