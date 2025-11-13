import { Component, Input } from '@angular/core';
import { SPDescription } from '../../../models/kftarc-summary.model';
import { KfStorageService } from '@kf-products-core/kfhub_lib';
import { SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
@Component({
    selector: 'kftarc-sp-home-card',
    templateUrl: './kftarc-sp-home-card.component.html',
    styleUrls: ['./kftarc-sp-home-card.component.scss'],
})
export class KftarcSpHomeCardComponent {
    @Input()
        profile?: SPDescription;
    public hideTooltip = true;
    public isIcClientUser = false;

    public spTypeEnum = SpTypeEnum;

    constructor(private storageService: KfStorageService) {
        if (this.storageService.getItem('_isIcClient')) {
            this.isIcClientUser = JSON.parse(this.storageService.getItem('_isIcClient'));
        }
    }

    hover(event) {
        if (event?.srcElement) {
            const element = event.srcElement;
            this.hideTooltip = element.offsetHeight >= element.scrollHeight;
        }
    }

}
