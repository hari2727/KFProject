import {
    Component,
    Input,
} from '@angular/core';

export interface KfTarcSPSalaryRangeData {
    lowLevel: string;
    averageLevel: string;
    highLevel: string;
    label: string;
}

@Component({
    selector: 'kftarc-sp-salary-range',
    templateUrl: './kftarc-sp-salary-range.component.html',
    styleUrls: ['./kftarc-sp-salary-range.component.scss'],
})
export class KfTarcSpSalaryRangeComponent {
    @Input() public data: KfTarcSPSalaryRangeData;
    @Input() public averageColor = '#566fd6';
}
