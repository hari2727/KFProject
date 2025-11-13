import { Injectable } from '@nestjs/common';
import { AppCode as ec } from '../../app.const';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {
    defaultContentTypes,
    defaultExpiration,
    defaultUploadFormat,
    defaultUploadPaths,
    skillsFileUploadTargets,
} from './ic-upload.const';
import {
    SkillsFileUploadResponse,
    SkillsFileUploadTargetConfiguration,
    SkillsFileUploadTargetRequestBody,
} from './ic-upload.i';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { ConfigService } from '../../_shared/config/config.service';

@Injectable()
export class IcUploadService {
  protected amazonAccessKeyId: string;
  protected amazonSecretAccessKey: string;
  protected allowedUploadTargets: string[];

  constructor(
      protected configService: ConfigService,
  ) {
    this.amazonAccessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    this.amazonSecretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
    this.allowedUploadTargets = (this.configService.get('IC_BIC_SKILLS_XLSX_UPLOAD_TARGETS') || '').split(/,\s*/);
  }

    @MapErrors({ errorCode: ec.INPUT_VAL_ERR })
    @LogErrors()
    async getSkillsFileUploadURL(body: SkillsFileUploadTargetRequestBody): Promise<SkillsFileUploadResponse> {
        const target = body.target;
        if (!target) {
            throw 'No target provided';
        }

        const defaultConfig = skillsFileUploadTargets[target];
        if (!defaultConfig) {
            throw 'Unknown target';
        }

        if (!this.allowedUploadTargets.includes(target)) {
            throw 'Target not allowed';
        }

        let customContentType;
        let customUploadPath;

        if (body.format) {

            customContentType = defaultContentTypes[body.format];
            customUploadPath = defaultUploadPaths[body.format];

            if (!customContentType || !customUploadPath) {
                throw 'Unsupported format provided';
            }
        }

        const config = Object.assign({}, defaultConfig);
        const format = body.format || defaultUploadFormat;

        config.contentType = customContentType || config.contentType || defaultContentTypes[format];
        config.path = customUploadPath || config.path || defaultUploadPaths[format];

        if (!config.contentType) {
            throw 'Unknown contentType for given format';
        }

        if (!config.path) {
            throw 'Unknown upload path for given format';
        }

        return {
            url: await this.getSignedUploadURL(config),
            contentType: config.contentType,
        };
  }

  protected async getSignedUploadURL(uploadConfig: SkillsFileUploadTargetConfiguration): Promise<string> {
    const s3 = new S3({
      signatureVersion: 'v4',
      accessKeyId: uploadConfig.accessKeyId || this.amazonAccessKeyId,
      secretAccessKey: uploadConfig.secretAccessKey || this.amazonSecretAccessKey,
      region: uploadConfig.region,
    });
    return await s3.getSignedUrlPromise('putObject', {
      Bucket: uploadConfig.bucket,
      Key: uploadConfig.path.split('*').join(uuidv4()),
      Expires: uploadConfig.expires || defaultExpiration,
      ContentType: uploadConfig.contentType,
      ACL: 'private',
    });
  }

}
