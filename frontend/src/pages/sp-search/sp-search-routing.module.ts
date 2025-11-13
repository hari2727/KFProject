import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpSearchResolver } from './sp-search.resolver';

import { SpSearchPage } from './sp-search.page';
import { SpMatrixPage } from './sp-matrix.page';

const routes: Routes = [
    {
        path: 'search',
        component: SpSearchPage,
        resolve: { searchFilters: SpSearchResolver }
    },
    {
        path: 'matrix',
        component: SpMatrixPage,
        resolve: { searchFilters: SpSearchResolver }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpSearchRoutingModule { }
