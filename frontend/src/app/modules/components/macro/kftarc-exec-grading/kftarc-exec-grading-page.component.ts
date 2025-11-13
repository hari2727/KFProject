import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { KfThclSuccessprofileService } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-exec-grading-page',
    templateUrl: './kftarc-exec-grading-page.component.html',
    styleUrls: ['./kftarc-exec-grading-page.component.scss'],
})
export class KfTarcExecGradingPageComponent implements AfterViewInit {
    public title: number;
    public jobRoleTypeId: string;
    public standardHayGrade: number;
    public jobId: number;
    public visible = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private successprofileService: KfThclSuccessprofileService,
    ) { }

    ngAfterViewInit() {
        const navigationData = this.activatedRoute.snapshot;
        this.jobId = navigationData.params.jobId;
        this.successprofileService.getSuccessProfileDetails(this.jobId).subscribe((data) => {
            this.title = data.title;
            this.standardHayGrade = data.standardHayGrade;
            this.jobRoleTypeId = data.jobRoleTypeId;
            this.visible = true;
        });
    }

    close() {
        this.location.back();
    }
}
