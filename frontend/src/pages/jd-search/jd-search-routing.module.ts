import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JdSearchFilterResolver } from './jd-search-filter/jd-search-filter.resolver';

import { JdSearchPage } from './jd-search.page';

const routes: Routes = [
    {
        path: '',
        component: JdSearchPage,
        resolve: { searchFilters: JdSearchFilterResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JdSearchRoutingModule { }
