

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UploadStateEnum, UploadStatusEnum } from '@kf-products-core/kfhub_lib/presentation';

@Component({
    selector: 'kftarc-sp-publish-to-workdays',
    templateUrl: './sp-publish-to-workdays.component.html',
    styleUrls: ['./sp-publish-to-workdays.component.scss'],
})
export class SpPublishToWorkdaysComponent {
    uploadName: string;
    uploadStateEnum = UploadStateEnum;

    @Input() uploaderState;
    @Input() progressBarState: UploadStatusEnum;
    @Input() uploaderDisabled: boolean;

    @Output() onFileAttach = new EventEmitter<File>();
    @Output() onCancelAttach = new EventEmitter<void>();

    constructor() { }

    onFilesAttached(file: File[]) {
        this.uploadName = file[0].name;

        this.onFileAttach.emit(file[0]);
    }

    onClickDownload() {
    }

    onCanceledUpload() {
        this.onCancelAttach.emit();
    }
}
