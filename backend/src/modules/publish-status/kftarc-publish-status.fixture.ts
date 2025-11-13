import { PublishStatusQuery, PublishType } from './kftarc-publish-status.interface';
import { generateUUIDv4 } from '../../common/common.utils';

export module GetPublishStatusMock {
    export const randomString: string = generateUUIDv4();

    export const queryParams: PublishStatusQuery = {
        locale: 'en-US',
        loggedInUserClientId: 23139,
        userId: 1234,
        publishType: PublishType.BEHAVIOR_COMPETENCY,
        sortColumn: '',
        sortBy: 'asc',
        pageIndex: '1',
        pageSize: '30',
    };

    export const expectedJson = {
        publishedRecords: [
          {
            id: 4,
            publishedStatus: 'IN_PROGRESS',
            publishedDate: '2022-11-30T09:22:54.570Z',
            RequestPublishDate: '2022-11-30T09:22:54.570Z',
            successProfilesCount: 2200,
            competenciesDataCount: 2,
            totalPublishedRecords: 1,
            publishType: 'BEHAVIOR_COMPETENCY',
            requester: {uid:26406,firstName:"clm",lastName:"user one",fullName:"clmuser one"}
          }
        ],
        paging: {
          pageIndex: 1,
          pageSize: 30,
          totalPages: 1,
          totalPublishedRecords: 1
        }
      }

    export const expectedPagingjson = {
        pageIndex: 1,
        pageSize: 30,
        totalPages: 1,
        totalPublishedRecords: 3,
    };

    export const expectedPublishedRecordsJson = {
        id: 1,
        publishedStatus: 'QUEUED',
        publishedDate: '2022-11-30T07:33:39.950Z',
        successProfilesCount: 10,
        competenciesDataCount: 6,
        RequestPublishDate: "2022-11-30T07:33:39.950Z",
        totalPublishedRecords: 3,
        publishType: PublishType.BEHAVIOR_COMPETENCY,
        requester: {
            uid: 26406,
            firstName: 'clm',
            lastName: 'user one',
            fullName: 'clmuser one',
        },
    };

    export const singleDbRecord = [
        {
            ItemModificationID: 1,
            PublishStatus: 'QUEUED',
            RequestPublishDate: '2022-11-30T07:33:39.950Z',
            ProfileNumber: 10,
            CompetencyNumber: 6,
            PublishedDate: '2022-11-30T07:33:39.950Z',
            TotalPublishedRecords: 3,
            PublishType: PublishType.BEHAVIOR_COMPETENCY,
            PersonId: 26406,
            ClientId: 12025,
            FirstName: 'clm',
            LastName: 'user one'
        },
    ];

    export const mockDbData = [
        {
          ItemModificationID: 4,
          ClientId: 23139,
          PersonId: 26406,
          FirstName: 'clm',
          LastName: 'user one',
          RequestPublishDate: '2022-11-30T09:22:54.570Z',
          PublishedDate: '2022-11-30T09:22:54.570Z',
          ProfileNumber: 2200,
          CompetencyNumber: 2,
          PublishStatus: 'IN_PROGRESS',
          TotalPublishedRecords: 1,
          PublishType: 'BEHAVIOR_COMPETENCY'
        }
    ];

    export const republishBody = { itemModification: '456' };
}


