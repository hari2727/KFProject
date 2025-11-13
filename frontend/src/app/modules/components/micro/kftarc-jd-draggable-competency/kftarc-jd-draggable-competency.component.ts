import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { KfThclDraggableCardComponent } from '@kf-products-core/kfhub_thcl_lib';

@Component({
    selector: 'kftarc-jd-draggable-competency',
    templateUrl: './kftarc-jd-draggable-competency.component.html',
    styleUrls: ['./kftarc-jd-draggable-competency.component.scss'],
})
export class KfTarcJdDraggableCompetencyComponent extends KfThclDraggableCardComponent implements OnInit, OnChanges {
    @Input() public editable = false;
    @Input() public showHeader = false;
    @Input() public form: UntypedFormGroup = null;
    @Input() public isDragEnabled = false;
    @Input() public titleVisible = false;
    @Input() public sectionVisible = false;
    @Input() public removedItems = [];
    @Output() public formChanges: EventEmitter<any> = new EventEmitter<any>();
    public dragIcon = 'all';
    public descriptionArray = [];

    ngOnInit() {
        this.form.valueChanges.subscribe(() => this.formChanges.emit(this.form.value));
        this.descriptionArray = this.form.value.description && this.form.value.description.split('\n') || [];
    }

    get isNotVisible() {
        return this.removedItems.find(id => this.form.value.id === id);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('titleVisible' in changes || 'sectionVisible' in changes) {
            this.dragIcon = this.titleVisible && this.sectionVisible ? 'all' : 'desc';
        }
    }
}
