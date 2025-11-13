import { IncomingHttpHeaders } from 'http';

export interface ArchiveS3FilesCallback {
    method: string;
    url: string;
    headers: IncomingHttpHeaders;
}

export interface AWSBucketCollectionInfo {
    bucket: string;
    region: string;
    filePaths: string[];
    fileNames: string[];
}

export interface HashedAWSBucketCollectionInfo  {
    filePaths: string[];
    fileNames: string[];
    filesHash: string;
}
