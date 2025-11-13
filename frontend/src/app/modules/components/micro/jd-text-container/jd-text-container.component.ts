import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'kftarc-jd-text-container',
    templateUrl: './jd-text-container.component.html',
    styleUrls: ['./jd-text-container.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: JdTextContainerComponent,
        multi: true,
    }],
})
export class JdTextContainerComponent implements ControlValueAccessor {
    private valueOnChange: (value: string) => void = _.noop;
    public value = '';
    public editing = false;
    public text = '';
    public resize = 'none';
    public disabled = false;
    @Input() formControlName: string = null;
    @Output() isEditing = new EventEmitter<boolean>();

    public edit(): void {
        this.isEditing.emit(true);
        this.editing = true;
    }

    public save(): void {
        this.value = this.text;
        this.valueOnChange(this.text);
        this.editing = false;
        this.isEditing.emit(false);
    }

    public cancel(): void {
        this.text = this.value;
        this.editing = false;
        this.isEditing.emit(false);
    }

    public writeValue(value: string): void {
        this.value = value;
        this.text = value;
    }

    public registerOnChange(fn: (value: string) => void): void {
        this.valueOnChange = fn;
    }

    public registerOnTouched(): void { }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
