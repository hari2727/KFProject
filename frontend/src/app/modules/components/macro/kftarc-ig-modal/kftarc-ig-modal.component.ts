import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { KfTarcIGService, KfTarcIIGSplit } from '../../../services/kftarc-sp-ig.service';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KfLoadingControllerService, environment } from '@kf-products-core/kfhub_lib';
import { KfThclSPSharedService, fileReportType, KFIFileAction } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-ig-modal',
    templateUrl: './kftarc-ig-modal.component.html',
    styleUrls: ['./kftarc-ig-modal.component.scss'],
})
export class KfTarcIgModalComponent implements OnInit, OnDestroy {
    @Input() id: number;

    @Input() url: string;

    @Input() compIds: string[] = [];

    @Input() visible = false;

    @Input() name: string;

    @Output() visibleChange = new EventEmitter<boolean>();

    master = null;
    splits: KfTarcIIGSplit[] = [];
    selectedSplit?: KfTarcIIGSplit;

    fg: UntypedFormGroup;

    igType = 'master';
    igFormat = 'pdf';

    subs: Subscription[] = [];

    clmgTalentArchitectConfig = environment().clmgTalentArchitectConfig;
    languages: { id: string; name: string }[] = [];
    private destroy$ = new Subject<void>();

    constructor(
        private igService: KfTarcIGService,
        private spinner: KfLoadingControllerService,
        private spShared: KfThclSPSharedService,
    ) {
        this.fg = new UntypedFormGroup({
            radio: new UntypedFormControl(),
            dd: new UntypedFormControl(),
            language: new UntypedFormControl(),
            igFormat: new UntypedFormControl(),
        });
    }

    ngOnInit() {
        this.languages = this.clmgTalentArchitectConfig.iglanguages;

        const sub = this.fg.valueChanges.subscribe((data) => {
            if (data.dd != null) {
                this.selectedSplit = _.find(this.splits, s => s.counts === data.dd);
            } else {
                this.selectedSplit = null;
            }
            this.igType = data.radio;
            this.igFormat = data.igFormat;
        });
        this.subs.push(sub);
        this.resetForm();
    }

    ngOnDestroy() {
        for (const sub of this.subs) {
            sub.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    getSplits() {
        this.igService.getSplits(this.url, this.compIds).subscribe((data) => {
            this.master = data.master;
            this.splits = data.splits;
            // need to wait till template code is updated...
            setTimeout(() => this.resetForm());
        });
    }

    resetForm() {
        this.fg.controls.dd.setValue(2);
        this.fg.controls.radio.setValue('master');
        this.fg.controls.language.setValue(undefined);
        this.fg.controls.igFormat.setValue('pdf');
    }

    visibleHandler($event) {
        if ($event) {
            this.getSplits();
        }
        this.visibleChange.next($event);
    }

    close() {
        this.visible = false;
        this.visibleChange.next(false);
        this.spinner.spinnerClose();

        this.resetForm();
    }

    hasWarning() {
        return this.igType !== 'master' && this.selectedSplit && this.selectedSplit.hasDuplicates;
    }

    download() {
        const locale = this.fg.controls.language.value;
        const igFormat = this.fg.controls.igFormat.value;
        if (this.igType === 'master' && this.master) {
            this.spinner.spinnerOpen();
            this.igService.downloadMasterGuide(this.master.url, this.id, locale, this.name, igFormat).pipe(takeUntil(this.destroy$))
                .subscribe(
                    (success) => this.spShared.callAuditLog(igFormat, fileReportType.INTERVIEW_GUIDE, true, KFIFileAction.DOWNLOAD),
                    (error) => this.spShared.callAuditLog(igFormat, fileReportType.INTERVIEW_GUIDE, false, KFIFileAction.DOWNLOAD),
                    () => this.close(),
                );
        } else {
            if (this.selectedSplit) {
                this.spinner.spinnerOpen();
                this.igService.downloadSplitGuides(this.selectedSplit, this.id, locale, this.name, igFormat).pipe(takeUntil(this.destroy$))
                    .subscribe(
                        (success) => this.spShared.callAuditLog(igFormat, fileReportType.INTERVIEW_GUIDE, true, KFIFileAction.DOWNLOAD),
                        (error) => this.spShared.callAuditLog(igFormat, fileReportType.INTERVIEW_GUIDE, false, KFIFileAction.DOWNLOAD),
                        () => this.close()
                    );
            }
        }
    }
}
