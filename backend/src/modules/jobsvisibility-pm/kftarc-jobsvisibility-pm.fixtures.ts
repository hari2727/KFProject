export namespace queryObjMocks {
    export const dboQueryObject = { clientId: 14319 };
    export const dboMutationObject = { clientId: 14319, hideJobInPM: 0 };
}

export namespace execStoreProcMocks {
    export const mutationMockDbDataSuccess = [
        {
            StatusCode: 0,
            ExceptionCode: 'RES.20000',
        },
    ];
    export const mutationMockDbDataFailure = [
        {
            StatusCode: 1,
            ExceptionCode: 'RES.20299',
        },
    ];
    export const defaultQueryParams = {
        clientId: 14139,
        hideJobInPM: 0,
    };

    export const dboMutation = `exec SuccessProfile.dbo.KFArchitectBulkUpdateHideJobs :clientId, :hideJobInPM`;
    export const dboQuery = `exec SuccessProfile.dbo.GetKFArchitectHideJobInPMStatus :clientId`;
}

export namespace globalService {
    export const queryParams = {
        loggedInUserClientId: 14319,
        userId: 12345,
        locale: 'en',
    };
}
