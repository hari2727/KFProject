import { Injectable } from '@angular/core';
import { KfAuthService, KfFilterMetadata, KfSharedConstantsService, KfStorageService, KfStoreTypeEnum } from '@kf-products-core/kfhub_lib';
import { KfThclTalentArchitectConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import { getFilterEncodedQuery, SortableColumn } from '@kf-products-core/kfhub_thcl_lib/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CertSection } from '../../pages/jd-detail/jd-detail.model';
import { JdSearch, Paging } from '../../pages/jd-search/jd-search.model';
import { SpSearch } from '../../pages/sp-search/sp-search.model';
import { UniversalCompanyDesc } from '../modules/components/macro/job-description/search/jd-search.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { getEncodedQuery } from '../../pages/csp-search/csp-search-constants';
import { ExportedProfile, PcApiResponse } from '../../pages/csp-search/csp-search-model';

@Injectable()
export class HttpService {

    constructor(
        private authService: KfAuthService,
        private sharedService: KfSharedConstantsService,
        private talentArchitectConstants: KfThclTalentArchitectConstantsService,
        private http: HttpClient,
        public storageService: KfStorageService,
    ) {

    }

    spSearchMetadata(check?: any): Observable<KfFilterMetadata[]> {
        const url = `${this.talentArchitectConstants.getSuccessprofilesBaseUrl()}/?outputType=METADATA&type=CAREER_ARCHITECTURE_VIEW`;
        if ([null, undefined, true].includes(check)) {
            return this.authService.authHttpCallv2('GET', url, null, {requestType:'hidden'}).pipe(map(data => data.metadata));
        } else{
            const cachedPermissions = this.storageService.getItem('metaDataPMFilter', KfStoreTypeEnum.SESSION);
            if(!cachedPermissions) {
                return new Observable<KfFilterMetadata[]>(observer => {
                    observer.next([]);
                    observer.complete();
                });
            }else{
                return new Observable<KfFilterMetadata[]>(observer => {
                    observer.next([JSON.parse(cachedPermissions) as KfFilterMetadata]);
                    observer.complete();
                });
            }
        }
    }

    spSearchFilter(
        searchColumn: string,
        searchString: string,
        pageIndex: number,
        pageSize: number,
        sorting: SortableColumn<string>[],
        filters: { type: string; value: string }[],
    ): Observable<{jobs: SpSearch[]; paging: Paging}> {
        const baseUrl = `${this.talentArchitectConstants.getAPIUrl(this.talentArchitectConstants.SUCCESSPROFILES_URL)}/search`;
        const encodedQuery = getFilterEncodedQuery(searchColumn, searchString, sorting, filters, pageIndex, pageSize);

        const url = `${baseUrl}?type=${this.talentArchitectConstants.SUCCESSPROFILE_SEARCH_TYPE}&${encodedQuery}`;
        const requestType = 'blocking';
        const requestGroups = ['thcl:sp-search'];
        return this.authService.authHttpCallv2('GET', url, null, { requestType, requestGroups });
    }

    spCustomSearchFilter(
        searchColumn: string,
        searchString: string,
        pageIndex: number,
        pageSize: number,
        sorting: SortableColumn<string>[],
        filters: { type: string; value: string }[],
    ): Observable<{jobs: SpSearch[]; paging: Paging}> {
        const baseUrl = `${this.talentArchitectConstants.getAPIUrl(this.talentArchitectConstants.SUCCESSPROFILES_URL)}/search`;
        const encodedQuery = getFilterEncodedQuery(searchColumn, searchString, sorting, filters, pageIndex, pageSize);

        const url = `${baseUrl}?type=SEARCH_MY_ORG_PROFILES&${encodedQuery}`;
        const requestType = 'blocking';
        const requestGroups = ['thcl:sp-search'];
        return this.authService.authHttpCallv2('GET', url, null, { requestType, requestGroups });
    }

    jdSearchFilter(
        searchColumn: string,
        searchString: string,
        pageIndex: number,
        pageSize: number,
        sorting: SortableColumn<string>[],
        filters: { type: string; value: string }[],
    ): Observable<{jobs: JdSearch[]; paging: Paging}> {
        const baseUrl = `${this.talentArchitectConstants.getAPIUrl(this.talentArchitectConstants.SUCCESSPROFILES_URL)}/search`;
        const encodedQuery = getFilterEncodedQuery(searchColumn, searchString, sorting, filters, pageIndex, pageSize);

        const url = `${baseUrl}?type=${this.talentArchitectConstants.JOBDESCRIPTION_SEARCH_TYPE}&${encodedQuery}`;
        const requestType = 'blocking';
        const requestGroups = ['thcl:jd-search'];
        return this.authService.authHttpCallv2('GET', url, null, { requestType, requestGroups });
    }

    getUniversalCompanyDesc(companyId?: number): Observable<UniversalCompanyDesc> {
        const url = `${this.sharedService.getBaseApiUrl()
            + this.sharedService.getApiVersion()
            + this.sharedService.JOB_DESCRIPTIONS_URL}/companydetails?outputType=ABOUT_THE_COMPANY`;
        return this.authService.authHttpCallv2('GET', url, null, {});
    }

    updateUniversalCompanyDesc(companyDesc: UniversalCompanyDesc) {
        const url = `${this.sharedService.getBaseApiUrl()
            + this.sharedService.getApiVersion()
            + this.sharedService.JOB_DESCRIPTIONS_URL}/companydetails`;

        return this.authService.authHttpCallv2('PUT', url, companyDesc);
    }

    getCerts(jdId: number): Observable<CertSection> {
        let baseUrl = this.talentArchitectConstants.getSuccessprofilesBaseUrl();

        const session = this.authService.getSessionInfo();
        const { ClientId } = session.Client;
        const { UserId, Locale } = session.User;

        const url = `${baseUrl}/certification?clientJobId=${jdId}&userId=${UserId}&loggedInUserClientId=${ClientId}&locale=${Locale}`;
        return this.authService.authHttpCallv2('GET', url, null, {});
    }

    updateCerts(jdId: number, certSection: CertSection): Observable<void> {
        const baseUrl = this.talentArchitectConstants.getSuccessprofilesBaseUrl();

        const session = this.authService.getSessionInfo();
        const { ClientId } = session.Client;
        const { UserId, Locale } = session.User;

        const url = `${baseUrl}/certification?clientJobId=${jdId}&userId=${UserId}&loggedInUserClientId=${ClientId}&locale=${Locale}`;
        return this.authService.authHttpCallv2('POST', url, certSection);
    }

    downloadFiles(selectedSuccessProfileIds: string[], format: string): Observable<Blob | any> {
        const authToken = this.authService.AuthToken;
        const baseUrl = this.talentArchitectConstants.getSuccessprofilesBaseUrl();
        const session = this.authService.getSessionInfo();
        const { ClientId } = session.Client;
        const { Locale } = session.User;

        const url = `${baseUrl}/hcm/export?clientId=${ClientId}&lcid=${Locale}`;
        const body = {
            downloadFormat: format,
            successprofileIds: selectedSuccessProfileIds
        };

        // Set appropriate headers for file download (Excel/CSV)
        const headers = new HttpHeaders({
            authToken,
            'ps-session-id': this.storageService.getItem('ps-session-id'),
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json'
        });

        // Perform the HTTP request with responseType 'blob' for binary data
        if (format === 'excel' || format === 'csv') {
            // Explicitly set responseType to 'blob'
            return this.http.post<Blob>(url, body, { headers, responseType: 'blob' as 'json' });
        } else {
            // Explicitly set responseType to 'json'
            return this.http.post<any>(url, body, { headers, responseType: 'json' });
        }
    }

    getPublishCenterDetails(page: number, limit: number, sortColumn: string, sortOrder: string): Observable<PcApiResponse> {
        const baseUrl = `${this.sharedService.getBaseApiUrl() + this.sharedService.getApiVersion()}/aiauto/client-jobs/export/get-export-records`;
        const encodedQuery = getEncodedQuery(page, limit, sortColumn, sortOrder);
        const authToken = this.authService.AuthToken;
        const timeStamp = +new Date().getTime();
        const url = `${baseUrl}?${encodedQuery}&_=${timeStamp}`;
        const headers = new HttpHeaders({
            Accept: 'application/json, text/plain, */*',
            authToken,
            'ps-session-id': this.storageService.getItem('ps-session-id'),
        });
        return this.http.get<PcApiResponse>(url, { headers });
    }

    getProfileCountDetails(exportId: string, limit: number): Observable<ExportedProfile> {
        const authToken = this.authService.AuthToken;
        const session = this.authService.getSessionInfo();
        const { ClientId } = session.Client;
        const { Locale } = session.User;
        const baseUrl = `${this.sharedService.getBaseApiUrl() + this.sharedService.getApiVersion()}/aiauto/client-jobs/export/get-export-details`;
        const url = `${baseUrl}/${exportId}?loggedInUserClientId=${ClientId}&locale=${Locale}&page=1&limit=${limit}&sortColumn=DownloadedOn&sortOrder=desc&userId=0`;
        const headers = new HttpHeaders({
            Accept: 'application/json, text/plain, */*',
            authToken,
            'ps-session-id': this.storageService.getItem('ps-session-id'),
        });
        return this.http.get<ExportedProfile>(`${url + (url.indexOf('?') === -1 ? '?' : '&')}_=${new Date().getTime()}`, { headers });
    }
}
