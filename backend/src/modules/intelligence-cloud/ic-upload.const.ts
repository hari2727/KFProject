import { SkillsFileUploadTargetConfiguration } from './ic-upload.i';

export enum SkillsUploadFormat {
    XLSX = 'xlsx',
    JSON = 'json',
}

export const defaultUploadFormat = SkillsUploadFormat.XLSX;

export const defaultContentTypes: { [format: string] : string } = {
    [SkillsUploadFormat.XLSX]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    [SkillsUploadFormat.JSON]: 'application/json',
};

export const defaultUploadPaths: { [format: string] : string } = {
    [SkillsUploadFormat.XLSX]: 'IntelligenceCloud/*_upload_bics.xlsx',
    [SkillsUploadFormat.JSON]: 'IntelligenceCloud/*_upload_bics.json',
};

export const defaultExpiration = 60_000;

export const skillsFileUploadTargets: { [name: string ]: SkillsFileUploadTargetConfiguration } = {
    'test': {
        region: 'us-east-1',
        bucket: 'test.org.thm.admin',
    },
    'staging': {
        region: 'us-east-1',
        bucket: 'stage.org.thm.admin',
    },
    'prod-us': {
        region: 'us-east-1',
        bucket: 'prod.org.thm.admin',
    },
    'prod-us-dr': {
        region: 'us-west-2',
        bucket: 'dr.prod.org.thm.admin',
    },
    'prod-eu': {
        region: 'eu-central-1',
        bucket: 'prod.org.thm.admin.eu',
    },
    'prod-eu-dr': {
        region: 'eu-west-1',
        bucket: 'dr.prod.org.thm.admin.eu',
    },
    'prod-cn': {
        region: 'ap-east-1',
        bucket: 'prod.org.thm.admin.cn',
    },
    'prod-beijing': {
        region: 'cn-north-1',
        bucket: 'prod.org.thm.admin.cn',
    },
};
