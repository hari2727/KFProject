import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'kftarc-jd-section-header-text',
    templateUrl: './kftarc-jd-section-header-text.component.html',
    styleUrls: ['./kftarc-jd-section-header-text.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: KfTarcJdSectionHeaderTextComponent,
        multi: true,
    }],
})
export class KfTarcJdSectionHeaderTextComponent implements ControlValueAccessor {
    private _onChange = (v: any) => { };
    @Input() title = '';
    @Input() maxlength: number;
    @Input() formControlName = '';
    @Input() countVisible = true;
    @Input() showHideSection: any[] = null;
    @Input() isSingle = false;

    value = '';
    first = true;
    contentVisible = true;
    isExpandable = true;
    previousValue: string;


    valueOnChange(value: string) {
        if (!this.first && this.previousValue !== value) {
            this.previousValue = value;
            this.value = value;

            this._onChange(value);
        }
    }

    writeValue(value: string): void {
        if (_.isNil(value)) {
            value = '';
        }

        this.first = false;
        this.previousValue = value;

        this.value = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(): void { }

    toggle(): void {
        this.isExpandable = !this.isExpandable;
        if (!this.isExpandable) {
            this.contentVisible = false;
        } else {
            this.contentVisible = true;
        }
    }
}
