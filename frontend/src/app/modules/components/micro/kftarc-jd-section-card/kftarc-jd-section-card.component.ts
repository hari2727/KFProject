import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'kftarc-jd-section-card',
    templateUrl: './kftarc-jd-section-card.component.html',
    styleUrls: ['./kftarc-jd-section-card.component.scss'],
})
export class KfTarcJdSectionCardComponent {
    @Input() public icon = null;
    @Input() public title = '';
    @Input() public action = null;
    @Output() public actionClicked = new EventEmitter();
    public contentVisible = true;

    public toggleContent(): void {
        this.contentVisible = !this.contentVisible;
    }

    public getToggleText(): string {
        return this.contentVisible ? 'showing section' : 'hiding section';
    }

    public getToggleIcon(): string {
        return this.contentVisible ? 'arrow-down' : 'arrow-up';
    }
}
