import { Module } from "@nestjs/common";
import { UserService } from "../../common/user/user.service";
import { JobDescriptionCompanyDetailsDataService } from "./jdcd-data-service";
import { JobDescriptionCompanyDetailsController } from "./jdcd.controller";
import { JobDescriptionCompanyDetailsService } from "./jdcd.service";

@Module({
    providers: [
        UserService,
        JobDescriptionCompanyDetailsDataService,
        JobDescriptionCompanyDetailsService,
    ],
    controllers: [
        JobDescriptionCompanyDetailsController,
    ],
})
export class JobDescriptionCompanyDetailsModule {}
