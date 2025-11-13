import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { KfThclDraggableCardComponent } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-jd-draggable-competency-old',
    templateUrl: './jd-draggable-competency.component.html',
    styleUrls: ['./jd-draggable-competency.component.scss'],
})
export class JdDraggableCompetencyComponent extends KfThclDraggableCardComponent implements OnInit {
    @Input() public editable = false;
    @Input() public showHeader = true;
    @Input() public form: UntypedFormGroup = null;
    @Input() isDragEnabled = true;
    @Output() public formChanges: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this.form.valueChanges.subscribe(
            value => this.formChanges.emit(this.form.value),
        );
    }
}
