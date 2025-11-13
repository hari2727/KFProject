import { Module } from '@nestjs/common';
import { KfTarcSpMatrixRepository } from './kftarc-sp-matrix.repository';
import { KfTarcSpMatrixService } from './kftarc-sp-matrix.service';
import { KfTarcSpMatrixController } from './kftarc-sp-matrix.controller';

@Module({
    providers: [
        KfTarcSpMatrixService,
        KfTarcSpMatrixRepository,
    ],
    controllers: [
        KfTarcSpMatrixController,
    ],
})
export class KfTarcSpMatrixModule {}
