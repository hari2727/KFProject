import { Module } from "@nestjs/common";
import { JobPropertyController } from "./job-properties.controller";
import { JobPropertyRepository } from "./job-properties.repository";
import { JobPropertyService } from "./job-properties.service";
import { JobPropertyTransformer } from "./job-properties.transformer";

@Module({
    providers: [
        JobPropertyService,
        JobPropertyRepository,
        JobPropertyTransformer,
    ],
    controllers: [
        JobPropertyController
    ],
})
export class JobPropertyModule {}
