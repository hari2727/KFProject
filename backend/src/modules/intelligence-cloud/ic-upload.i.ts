export interface SkillsFileUploadTargetConfiguration {
    region: string;
    bucket: string;
    path?: string;
    contentType?: string;
    expires?: number;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export interface SkillsFileUploadTargetRequestBody {
    target: string;
    format?: string;
}

export interface SkillsFileUploadResponse {
    url: string;
    contentType: string;
}
