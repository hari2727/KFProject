import {
    Component,
    Input,
} from '@angular/core';

export interface KfTarcSPTiles {
    name?: string;
    totalElements?: number;
    topElements: {
        name: string;
    }[];
}

@Component({
    selector: 'kftarc-sp-tiles',
    templateUrl: './kftarc-sp-tiles.component.html',
    styleUrls: ['./kftarc-sp-tiles.component.scss'],
})
export class KfTarcSPTilesComponent {

    private _borderColor = '#3acdd2';

    @Input() public tiles: KfTarcSPTiles = null;

    @Input()
    public set borderColor(color: string) {
        this._borderColor = color;
        this.tileStyles.borderColor = color;
    }

    public get borderColor(): string {
        return this._borderColor;
    }

    public tileStyles = {
        borderColor: '#3acdd2',
    };

}
