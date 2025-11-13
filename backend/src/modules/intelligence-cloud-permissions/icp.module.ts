import { Module } from '@nestjs/common';
import { IntelligenceCloudPermissionsService } from './icp.service';
import { IntelligenceCloudPermissionsDataService } from './icp.data.service';
import { IntelligenceCloudPermissionsController } from './icp.controller';

@Module({
    providers: [
        IntelligenceCloudPermissionsService,
        IntelligenceCloudPermissionsDataService,
    ],
    controllers: [IntelligenceCloudPermissionsController],
})
export class IntelligenceCloudPermissionsModule {}
