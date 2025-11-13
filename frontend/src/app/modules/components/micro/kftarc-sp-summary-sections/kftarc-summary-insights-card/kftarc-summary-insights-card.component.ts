import { Component, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '@kf-products-core/kfhub_lib';

@Component({
    selector: 'kftarc-summary-insights-card',
    templateUrl: './kftarc-summary-insights-card.component.html',
    styleUrls: ['./kftarc-summary-insights-card.component.scss'],
})

export class KfTarcSummaryInsightsCardComponent {
    @Input() title = '';
    @Input() icon = '';
    appUrlPrefix: string = environment().appUrlPrefix;
}
