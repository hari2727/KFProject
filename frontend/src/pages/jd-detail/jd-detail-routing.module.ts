import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JdDetailEditGuard } from './jd-detail-edit.guard';
import { JdDetailEditPage } from './jd-detail-edit.page';
import { JdDetailEditResolver } from './jd-detail-edit.resolver';
import { JdDetailPage } from './jd-detail.page';
import { JdDetailResolver } from './jd-detail.resolver';

const routes: Routes = [
    {
        path: '',
        component: JdDetailPage,
        resolve: { job: JdDetailResolver }
    },
    {
        path: 'edit',
        component: JdDetailEditPage,
        resolve: { job: JdDetailEditResolver },
        canActivate: [JdDetailEditGuard],
        canDeactivate: [JdDetailEditGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class JdDetailRoutingModule { }
