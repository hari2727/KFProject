import { Pipe, PipeTransform } from '@angular/core';
import { SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';

@Pipe({
    name: 'kftarcRelatedSpIcon',
    pure: true,
})
export class KfTarcRelatedSpIconPipe implements PipeTransform {
    transform(profileType: string): string {
        let icon = '';
        switch (profileType) {
            case SpTypeEnum.Levels:
                icon = 'profile-level';
                break;
            case SpTypeEnum.BestInClass:
                icon = 'profile-function';
                break;
            case SpTypeEnum.ONet:
                icon = 'profile-task';
                break;
            case SpTypeEnum.Custom:
                icon = 'custom';
                break;
            case SpTypeEnum.Ai:
                icon = 'ai-powered';
                break;
        }
        return icon;
    }
}
