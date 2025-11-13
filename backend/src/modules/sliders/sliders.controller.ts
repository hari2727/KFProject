import { Controller, Get, Query } from '@nestjs/common';
import { KfTarcSlidersRoute } from './sliders.route';
import { SlidersService } from './sliders.service';
import { SliderQuery } from './sliders.interface';

@Controller(KfTarcSlidersRoute.BASE)
export class SlidersController {
    constructor(protected service: SlidersService) {}

    // apiTitle: 'Migrate all custom SP from 2018 to 2024 for clients who opt to move.',
    @Get(KfTarcSlidersRoute.MIGRATE)
    async migrateCustomSP(@Query() query: SliderQuery): Promise<void> {
        await this.service.migrateCustomSPs(query);
    }
}
