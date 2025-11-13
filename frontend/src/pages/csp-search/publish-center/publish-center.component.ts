import { Component, OnDestroy, OnInit, ElementRef, ViewChild, EventEmitter, Output, HostListener } from '@angular/core';
import { HttpService } from '../../../app/services/http.service';
import _ from 'lodash';
import { ExportedProfile, PcColumn, PublishCenterData } from '../csp-search-model';
import { PublishCenterColumnsEnum, SortDirectionEnum, ProfileType, exportedJobcolumnSource } from '../csp-search-constants';

@Component({
    selector: 'kftarc-csp-publish-center',
    templateUrl: './publish-center.component.html',
    styleUrls: ['./publish-center.component.scss'],
})

export class PublishCenterComponent implements OnInit, OnDestroy {
    constructor(private httpService: HttpService) { }
    authorName: string;
    downloadDate: string;
    profileCount: number;
    currentPagePopup: string;
    ismodelOpen: boolean;
    exportJobdataSource: { 'JOB CODE': string; NAME: string; 'LAST MODIFIED': string; 'MODIFIED BY': string }[];
    CompletedStatus = 'Completed';
    ProfileType = ProfileType;
    pageIndex = 0;
    page = 1; // Current page
    limit = 10; // Number of items per page
    isLoading = false;
    totalPages = 0;
    totalResults = 0;
    sortedColumn: string | null;
    DOWNLOAD: string;
    EXPORT: string;
    HCM: string;
    JSON: string;
    EXCEL: string;
    CSV: string;
    TYPE: string;
    NUMBER_OF_PROFILES: string;
    NAME: string;
    STATUS: string;
    FAILED: string;
    EXPORTED_ON: string;
    sortDirection: SortDirectionEnum | '' = '';
    publishCenterType = JSON.parse(sessionStorage.getItem('publishCenterType'));
    dataSource: PublishCenterData[] = [];

    infiniteScrollDisabled = false;

    columnSource: PcColumn[] = PublishCenterColumnsEnum;

    exportedJobcolumnSource: PcColumn[] = exportedJobcolumnSource;

    @Output() onScrollDown = new EventEmitter<{ pageIndex: number; sortColumn: string; sortOrder: string }>();

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    ngOnInit() {
        this.fetchPublishCenterData();
        this.DOWNLOAD = 'download';
        this.TYPE = 'type';
        this.EXPORT = 'export';
        this.HCM = 'hcm';
        this.JSON = 'json';
        this.EXCEL = 'excel';
        this.CSV = 'csv';
        this.NUMBER_OF_PROFILES = 'numberOfProfiles';
        this.NAME = 'name';
        this.STATUS = 'status';
        this.FAILED = 'failed';
        this.EXPORTED_ON = 'exportedOn';
    }

    public fetchPublishCenterData() {
        if (this.isLoading) return; // Prevent multiple calls
        this.isLoading = true;

        this.httpService.getPublishCenterDetails(
            this.page, this.limit, this.sortedColumn, this.sortDirection
        ).subscribe({
            next: (res) => {
                if (res) {
                    if (this.page === 1) {
                        this.dataSource = res.results || []; // Replace data when fetching first page
                    } else {
                        this.dataSource = [...this.dataSource, ...res.results || []]; // Append only on scroll
                    }

                    this.totalResults = res.total;
                    this.totalPages = Math.ceil(this.totalResults / this.limit);
                    this.infiniteScrollDisabled = this.dataSource.length >= this.totalResults;
                }
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.dataSource = [];
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    @HostListener('window:scroll', [])
    onScroll(): void {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 10 && !this.isLoading && !this.infiniteScrollDisabled) {
            this.page += 1;
            this.fetchPublishCenterData();
        }
    }

    public scrollDown() {
        if (this.pageIndex < this.totalPages) {
            this.pageIndex += 1;
            this.onScrollDown.emit({ pageIndex: this.pageIndex, sortColumn: this.sortedColumn, sortOrder: this.sortDirection });
        }
    }

    public openProfileDetailPopup(row: PublishCenterData) {
        if(row.type === 'hcm') {
            this.currentPagePopup = ProfileType.export;
        } else {
            this.currentPagePopup = ProfileType.download;
        }
        this.ismodelOpen = true;
        this.authorName = row.name;
        this.downloadDate = row.exportedOn;
        this.getPorfileCount(row.exportID, row.numberOfProfiles);
    }

    public closeModal() {
        this.ismodelOpen = !this.ismodelOpen;
    }

    private async getPorfileCount(exportId: string, limit: number) {
        const response: ExportedProfile = await this.httpService.getProfileCountDetails(
            exportId, limit).toPromise();
 
        this.exportJobdataSource = response.results.map(item => ({
            'JOB CODE': item.JobCode,
            NAME: item.JobName,
            'LAST MODIFIED': new Date(item.ModifiedOn).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            'MODIFIED BY': item.ModifiedByName
        }));
        this.profileCount = this.exportJobdataSource.length;
        if (!response) {
            // this.dataSource = [];
            return;
        }
    }
 

    sortData(column: string) {
        if (this.sortedColumn === column) {
            this.sortDirection = this.sortDirection === SortDirectionEnum.Ascending ? SortDirectionEnum.Descending : SortDirectionEnum.Ascending;
        } else {
            this.sortedColumn = column;
            this.sortDirection = SortDirectionEnum.Ascending;
        }
        // Reset pagination and data source when sorting
        this.page = 1;
        this.dataSource = [];
        this.infiniteScrollDisabled = false;

        this.fetchPublishCenterData();
    }

    getSortIndicator(column: string): string {
        if (this.sortedColumn === column) {
            return this.sortDirection === SortDirectionEnum.Ascending ? '▲' : '▼';
        }
        return '▼';
    }

    getSortIndicatorOpacity(column: string): number {
        return this.sortedColumn === column ? 1 : 0.5;
    }

    ngOnDestroy(): void { }
}
