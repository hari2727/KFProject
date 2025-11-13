import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../_shared/config/config.service';

export interface S3PreSignOptions {
    Bucket?: string;
    ResponseContentDisposition?: string;
    RespondWithContentDisposition?: boolean;
    Expires?: number;
    Filename?: string;
    Key: string;
}

@Injectable()
export class S3Util {

    constructor(
        protected configService: ConfigService,
    ) {
    }

    buildClientOptions(override?: Partial<S3.Types.ClientConfiguration>): S3.Types.ClientConfiguration {
        return Object.assign({
            signatureVersion: 'v4',
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            region: this.configService.get('AWS_REGION'),
        }, override || {});
    }

    buildPutObject(override?: Partial<S3.Types.PutObjectRequest>): S3.Types.PutObjectRequest {
        return Object.assign({
            Bucket: this.configService.get('AWS_BUCKET'),
            CacheControl: 'no-cache',
            ACL: 'private'
        }, override || {}) as S3.Types.PutObjectRequest;
    }

    getSignedUrlOptionsToGet(override: S3PreSignOptions): S3PreSignOptions {
        const options = Object.assign({
            Bucket: this.configService.get('AWS_BUCKET'),
            Expires: 900,
        }, override || {}) as S3PreSignOptions;

        if (options.Filename !== undefined) {
            const fileName = encodeURIComponent(override.Filename);
            options.ResponseContentDisposition = `attachment; filename=${fileName}; filename*=UTF-8''${fileName}`;
            delete options.Filename;
        }
        if (options.RespondWithContentDisposition === false) {
            delete options.ResponseContentDisposition;
        }
        delete options.RespondWithContentDisposition;
        return options;
    }

    getSignedUrlOptionsToGetUpload(upload: ManagedUpload.SendData, override?: Partial<S3PreSignOptions>): S3PreSignOptions {
        const key = upload.Key || upload['key'];
        return this.getSignedUrlOptionsToGet(Object.assign({ ...(override || {} )}, {
            Bucket: upload.Bucket,
            Key: key,
            Filename: override?.Filename || key.split('/').pop(),
        }) as S3PreSignOptions);
    }

    getSignedUrlToGet(s3: S3, override?: S3PreSignOptions): string {
        return s3.getSignedUrl('getObject', this.getSignedUrlOptionsToGet(override));
    }

    getSignedUrlToGetUpload(s3: S3, upload: ManagedUpload.SendData, override?: Partial<S3PreSignOptions>): string {
        return s3.getSignedUrl('getObject', this.getSignedUrlOptionsToGetUpload(upload, override));
    }

}
