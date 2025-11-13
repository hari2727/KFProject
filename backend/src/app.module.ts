import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './_shared/db/typeorm-config';
import { Loggers } from './_shared/log/loggers';
import { TypeOrmEntityModule } from './_shared/db/typeorm-entity.module';
import {
    ItemModificationProfilesBulkUpdateProfiles,
    ItemModificationSubCategory
} from './modules/bulkmapping/bm-mssql.entity';
import { TaskEntity } from './bulkrunner/data/task.entity';
import { TaskGroupEntity } from './bulkrunner/data/taskgroup.entity';
import { KfTarcCertificationEntity } from './modules/certification/kftarc-certification.entity';
import {
    ClientJob,
    IcJobInsertEntity,
    IcJobPayloadEntity,
    IcJobStatusEntity,
    IcJobTopSkillsEntity
} from './modules/intelligence-cloud/ic.entity';
import { KfTarcContentEntity } from './modules/content/kftarc-content.entity';
import {
    GenerateHCMIntDownloadProfiles,
    GenerateHCMIntDownloadStatus
} from './modules/custom-sp-export/custom-sp-export.entity';
import { KfhubPeerGroupsEntity } from './modules/external-services/arya/peer-groups/kftarc-peer-groups.entity';
import { SuccessProfileExportJSONEntity } from './modules/json/json.entity';
import { PublishStatusEntity } from './modules/publish-status/kftarc-publish-status.entity';
import { KfhubCountryEntity } from './modules/external-services/arya/country/kftarc-country.entity';
import { KfTarcSuccessProfileMatrixEntity } from './modules/matrix/kftarc-sp-matrix.entity';
import { MicroservicesModule } from './modules/custom-sp-export/microservices.module';
import {
    SuccessProfileBulkExportModule
} from './bulkrunner-modules/success-profile-bulk-export/success-profile-bulk-export.module';
import {
    SuccessProfileMatrixExportModule
} from './bulkrunner-modules/success-profile-matrix-export/success-profile-matrix-export.module';
import {
    SuccessProfileSingleExportModule
} from './bulkrunner-modules/success-profile-single-export/success-profile-single-export.module';
import { BulkMappingProfileCollectionsModule } from './modules/bulkmapping-profile-collections/bmpc.module';
import { BulkMappingSkillsModule } from './modules/bulkmapping-skills/bms.module';
import { BulkMappingModule } from './modules/bulkmapping/bm.module';
import { KfTarcCertificationModule } from './modules/certification/kftarc-certification.module';
import { FrameworkModule } from './modules/content-library/competencies/framework/framework.module';
import { ContentLibraryModule } from './modules/content-library/content-library.module';
import { KfTarcContentModule } from './modules/content/kftarc-content.module';
import { KfhubCriticalExperienceModule } from './modules/critical-experience/kfhub-critical-experience.module';
import { HcmExportModule } from './modules/custom-sp-export/custom-sp-export.module';
import { DemoUsersModule } from './modules/demo-users/demo.module';
import { KfTarcAryaModule } from './modules/external-services/arya/kftarc-arya.module';
import { FunctionModule } from './modules/function/function.module';
import { IntelligenceCloudPermissionsModule } from './modules/intelligence-cloud-permissions/icp.module';
import { IntelligenceCloudModule } from './modules/intelligence-cloud/ic.module';
import { IgModule } from './modules/interviewguide/ig.module';
import { JobDescriptionCompanyDetailsModule } from './modules/jobdescription-company-details/jdcd.module';
import {
    KfTarcJobDescriptionsDetailsModule
} from './modules/jobdescriptions-details/kftarc-job-descriptions-details.module';
import { SuccessProfileJsonModule } from './modules/json/json.module';
import { KfTarcPMJobsVisibilityStatusModule } from './modules/jobsvisibility-pm/kftarc-jobsvisibility-pm.module';
import { KfnrModule } from './modules/kfnr/kfnr.module';
import { KfTarcSpMatrixModule } from './modules/matrix/kftarc-sp-matrix.module';
import { ProfileCollectionsModule } from './modules/profile-collections/profile-collections.module';
import { KfTarcProfilesForCompareModule } from './modules/profilesforcompare/kftarc-profiles-for-compare.module';
import { KfTarcPublishStatusModule } from './modules/publish-status/kftarc-publish-status.module';
import { ResponsibilitiesModule } from './modules/responsibilities/responsibilities.module';
import { KfTarcRolesModule } from './modules/roles/kftarc-roles.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import {
    KfTarcSpAndJdModule
} from './modules/search/success-profiles-and-job-descriptions/kftarc-sp-and-jd-search.module';
import { SkillsModule } from './modules/skills/skills.module';
import { KfTarcCompareSkillsModule } from './modules/skillscompare/kftarc-skills-compare.module';
import { SlidersModule } from './modules/sliders/sliders.module';
import {
    KfTarcSuccessProfilesDetailsModule
} from './modules/successprofiles-details/kftarc-success-profiles-details.module';
import { DashboardSummaryModule } from './modules/summary/summary.module';
import { ProfileVersionsModule } from './profile-versions/profile-versions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseConfig } from './_shared/db/mongoose';
import { MongoDbConnectionName } from './models/mongo-db.const';
import { MongooseEntityModule } from './_shared/db/mongoose-entity.module';
import {
    ARYA_INDUSTRIES,
    KfAryaIndustriesSchema
} from './modules/external-services/arya/industries/kftarc-arya-industries.schema';
import {
    IG_CUSTOM_CONTENT_MODEL,
    IgCustContMongooseSchema,
    IgMongooseSchema,
    INTERVIEW_GUIDE_MODEL
} from './modules/interviewguide/database/ig-mongoose.config';
import {
    ARYA_EXCLUDE_KEYS,
    KfAryaExcludeKeysSchema
} from './modules/external-services/arya/exclude-keys/kftarc-arya-exclude-keys.schema';
import { ConfigService } from './_shared/config/config.service';
import { JobPropertyModule } from './modules/job-properties/job-properties.module';
import { SkillComponentModule } from './modules/skill-component/skill-component.module';
import { TypeOrmAppModule } from './_shared/db/typeorm-app.module';
import {
    InterviewGuideSingleExportModule
} from './bulkrunner-modules/interviewguide-single-export/interviewguide-single-export.module';
import { AppBaseModule } from './_shared/app/app.base-module';
import { AppCommonModule } from './_shared/app/app.common-module';
import { LoggerModule } from './logger';

@Module({
    imports: [
        AppBaseModule,
        AppCommonModule,
        TypeOrmAppModule,

        ScheduleModule.forRoot(),

        MongooseModule.forRootAsync({
            connectionName: MongoDbConnectionName.SuccessProfile,
            useFactory: (config: ConfigService) => getMongooseConfig(config, 'MONGO_DB_SUCCESSPROFILES'),
            inject: [ ConfigService ],
        }),

        MongooseEntityModule.forRoot(MongoDbConnectionName.SuccessProfile, {
            [ARYA_INDUSTRIES]: KfAryaIndustriesSchema,
            [ARYA_EXCLUDE_KEYS]: KfAryaExcludeKeysSchema,
            [INTERVIEW_GUIDE_MODEL]: IgMongooseSchema,
            [IG_CUSTOM_CONTENT_MODEL]: IgCustContMongooseSchema,
        }),

        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService, logs: Loggers) => getTypeOrmConfig(config, logs, 'MSSQL_DB_PRIMARY'),
            inject: [ ConfigService, Loggers ],
        }),

        TypeOrmEntityModule.forRoot([
            ClientJob,
            GenerateHCMIntDownloadProfiles,
            GenerateHCMIntDownloadStatus,
            IcJobInsertEntity,
            IcJobPayloadEntity,
            IcJobStatusEntity,
            IcJobTopSkillsEntity,
            ItemModificationProfilesBulkUpdateProfiles,
            ItemModificationSubCategory,
            KfTarcCertificationEntity,
            KfTarcContentEntity,
            KfTarcSuccessProfileMatrixEntity,
            KfhubCountryEntity,
            KfhubPeerGroupsEntity,
            PublishStatusEntity,
            SuccessProfileExportJSONEntity,
            TaskEntity,
            TaskGroupEntity,

            // TestEntity,
        ]),

        BulkMappingModule,
        BulkMappingProfileCollectionsModule,
        BulkMappingSkillsModule,
        ContentLibraryModule,
        DashboardSummaryModule,
        DemoUsersModule,
        FrameworkModule,
        FunctionModule,
        HcmExportModule,
        IgModule,
        IntelligenceCloudModule,
        IntelligenceCloudPermissionsModule,
        JobDescriptionCompanyDetailsModule,
        JobPropertyModule,
        KfTarcAryaModule,
        KfTarcCertificationModule,
        KfTarcCompareSkillsModule,
        KfTarcContentModule,
        KfTarcJobDescriptionsDetailsModule,
        KfTarcPMJobsVisibilityStatusModule,
        KfTarcProfilesForCompareModule,
        KfTarcPublishStatusModule,
        KfTarcRolesModule,
        KfTarcSpAndJdModule,
        KfTarcSpMatrixModule,
        KfTarcSuccessProfilesDetailsModule,
        KfhubCriticalExperienceModule,
        KfnrModule,
        MicroservicesModule,
        ProfileCollectionsModule,
        ProfileVersionsModule,
        ResponsibilitiesModule,
        SchedulerModule,
        SkillsModule,
        SlidersModule,
        InterviewGuideSingleExportModule,
        SuccessProfileBulkExportModule,
        SuccessProfileJsonModule,
        SuccessProfileMatrixExportModule,
        SuccessProfileSingleExportModule,
        SkillComponentModule,
        LoggerModule,

        // TestModule,
        // Test3Module,
    ],
})
export class ApplicationModule {}
