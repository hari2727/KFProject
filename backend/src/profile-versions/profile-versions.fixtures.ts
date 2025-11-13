import { ProfileVersionsRawResponse } from './profile-versions.interface';

export const ProfileVersionsRawResponseMock: ProfileVersionsRawResponse[] = [
    {
        ClientJobID: 12811,
        VersionNo: '1.1.0',
        OrderNo: 1,
    },
    {
        ClientJobID: 92727,
        VersionNo: '1.2.0',
        OrderNo: 2,
    },
];

export const ProfileVersionsResponseMock = [
    {
        jobId: 12811,
        version: '1.1.0',
        order: 1,
    },
    {
        jobId: 92727,
        version: '1.2.0',
        order: 2,
    },
];
