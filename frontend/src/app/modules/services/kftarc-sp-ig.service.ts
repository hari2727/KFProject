
import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { KfThclSPSharedService, KfThclSPSharedConstantsService } from '@kf-products-core/kfhub_thcl_lib';
import * as _ from 'lodash';
import { tap } from 'rxjs/operators';
import { KfAuthService, KfStorageService, KfLoadingControllerService } from '@kf-products-core/kfhub_lib';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

export interface KfTarcIIGSplit {
    counts: number;
    urls: string[];
    hasDuplicates?: boolean;
}

export interface KfTarcIIGSplits {
    master: {
        url: string;
    };
    splits: KfTarcIIGSplit[];
}

@Injectable()
export class KfTarcIGService {
    constructor(
        private spShared: KfThclSPSharedService,
        private consts: KfThclSPSharedConstantsService,
        public authService: KfAuthService,
        public storageService: KfStorageService,
        private spinner: KfLoadingControllerService,
        private http: HttpClient,
    ) { }

    getSplits(masterUrl: string, compData: string[]): Observable<KfTarcIIGSplits> {
        const apiUrl = this.consts.getIgSplitsUrl();
        const data = { masterUrl, compData };
        return this.authService.authHttpCallv2('POST', apiUrl, data);
    }

    downloadInterviewGuide(url: string,  data: any): Observable<any> {

        return this.authService.authHttpCallv2('POST', url, data);
    }

    downloadSplitGuides(split: KfTarcIIGSplit, id: number, reportLocale: string, name: string, format?: string) {
        return forkJoin([..._.map(split.urls, url => this.spShared.getInterviewGuideBlob(this.setReportLocale(url, reportLocale, format)))]).pipe(
            tap((res: Blob[]) => _.forEach(res, (blob, part) => this.spShared.generateFileFromBlob(blob, `${id}_${part + 1}`, name, format))),
        );
    }

    downloadMasterGuide(url: string, id: number, reportLocale: string, name: string, format?: string) {
        return this.spShared.getInterviewGuideBlob(this.setReportLocale(url, reportLocale, format)).pipe(
            tap(blob => this.spShared.generateFileFromBlob(blob, id, name, format)),
        );
    }

    setReportLocale(url: string, value: string, format?: string) {
        const urlParams = new URL(url);
        urlParams.searchParams.set('reportLocale', value);
        if (format === 'docx') {
            urlParams.searchParams.set('o_reportFormat', format);
        }
        return urlParams.toString();
    }
}
