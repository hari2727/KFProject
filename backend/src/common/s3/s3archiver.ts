import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ArchiveS3FilesCallback } from './s3archiver.interface';
import { AwsS3Config, S3Archive } from './s3archiver.const';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { ConfigService } from '../../_shared/config/config.service';

@Injectable()
export class S3Archiver {
    s3: S3;
    bucket: string;

    constructor(
        protected configService: ConfigService,
    ) {
        const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
        const region = this.configService.get('AWS_REGION');
        this.bucket = this.configService.get('AWS_BUCKET');
        this.s3 = new S3({ signatureVersion: 'v4', accessKeyId, secretAccessKey, region });
    }

    @LogErrors()
    async archiveS3Files<T = any>(
        bucket: string,
        region: string,
        filePaths: string[],
        archiveType: string,
        clientId: number,
        archiveHash: string,
        callback: ArchiveS3FilesCallback,
        fileNames?: string[],
        transitionData?: T,
    ) {
            const startTemplateKey = [S3Archive.ROOT_FOLDER, archiveType, clientId, archiveHash + '_' + S3Archive.TRIGGER_SUFFIX].join('/');

            const startTemplateBody = {
                sourceBucket: bucket,
                sourceRegion: region,
                sourceFileKeys: filePaths,
                callback: callback,
                custom: {
                    fileNames: fileNames,
                    transitData: transitionData,
                },
            };

            await this.uploadToS3({
                Bucket: this.bucket,
                Key: startTemplateKey,
                Body: Buffer.from(JSON.stringify(startTemplateBody)),
            });
    }

    parseBucketAndFileKeyFromFileUrl(fileUrl: string) {
        const parseFileUrl = new RegExp(/^https:\/\/(.*?)\.?s3\.amazonaws\.com\/(.*)\?/);
        const fileData = fileUrl.match(parseFileUrl);
        let bucket = fileData[1];
        let fileKey = fileData[2];
        if (!bucket) {
            const parseSuffix = new RegExp(/^(.*?)\/(.*)/);
            const fileDataSuffix = fileData[2].match(parseSuffix);
            bucket = fileDataSuffix[1];
            fileKey = fileDataSuffix[2];
        }
        return { bucket, fileKey };
    }

    protected async uploadToS3(params: S3.PutObjectRequest) {
        params.ACL = AwsS3Config.ACL;
        await this.s3.putObject(params).promise();
    }
}
