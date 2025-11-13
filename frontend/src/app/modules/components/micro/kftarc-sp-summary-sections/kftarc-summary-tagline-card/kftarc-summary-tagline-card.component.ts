import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { environment } from '@kf-products-core/kfhub_lib';

@Component({
    selector: 'kftarc-sp-tagline-card',
    templateUrl: './kftarc-summary-tagline-card.component.html',
    styleUrls: ['./kftarc-summary-tagline-card.component.scss'],
})

export class KfTarcSummaryTaglineCardComponent {
    @Input() title = '';
    @Input() description = '';
    @Input() icon = '';
    @Input() width = 'md'; // take variable 'sm', 'md', 'lg'
    @Output() openSlider = new EventEmitter<string>();
    appUrlPrefix: string = environment().appUrlPrefix;

    public onMagnify(): void {
        this.openSlider.emit(this.title);
    }
}
