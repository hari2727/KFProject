import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CspSearchPage } from './csp-search.page';
import { CSpSearchResolver } from './csp-search.resolver';

const routes: Routes = [
    {
        path: 'search',
        component: CspSearchPage,
        resolve: { searchFilters: CSpSearchResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CspSearchRoutingModule { }
