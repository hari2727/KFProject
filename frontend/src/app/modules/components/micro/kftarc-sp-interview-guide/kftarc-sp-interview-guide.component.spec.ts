import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KftarcSpInterviewGuideComponent } from './kftarc-sp-interview-guide.component';
import { KfTarcIGService, KfTarcIIGSplit } from '../../../services/kftarc-sp-ig.service';
import { KfLoadingControllerService, KfTranslationService, environment } from '@kf-products-core/kfhub_lib';
import { KfThclSPSharedService, fileReportType, KFIFileAction } from '@kf-products-core/kfhub_thcl_lib';
import { of, throwError } from 'rxjs';
import { InterviewGuideTypes } from '../../../models/kftarc-sp-interview-guide.model';

describe('KftarcSpInterviewGuideComponent', () => {
    let component: KftarcSpInterviewGuideComponent;
    let fixture: ComponentFixture<KftarcSpInterviewGuideComponent>;
    let mockIgService: any;
    let igServiceMock: any;
    let spSharedMock: any;
    let spinnerMock: any;

    let mockAuthService = {
        downloadMasterGuide: jest.fn(),
        downloadSplitGuides: jest.fn(),
        getSplits: jest.fn(),
    };

    let mockAuthService2 = {
        spinnerClose: jest.fn(),
        spinnerOpen: jest.fn(),
    };

    let mockAuthService3 = {
        callAuditLog: jest.fn(),
    };

    let mockAuthService4 = { get: jest.fn() };
    beforeEach(() => {
        igServiceMock = {
            downloadMasterGuide: jest.fn(),
            downloadSplitGuides: jest.fn()
        };

        spSharedMock = {
            callAuditLog: jest.fn()
        };

        spinnerMock = {
            spinnerOpen: jest.fn()
        };
        mockIgService = {
            getSplits: jest.fn().mockReturnValue(of({
                master: 'mockMaster',
                splits: 'mockSplits'
            }))
        };
        TestBed.configureTestingModule({
            declarations: [KftarcSpInterviewGuideComponent],
            providers: [
                {
                    provide: KfTarcIGService, useValue: mockAuthService
                },
                {
                    provide: KfLoadingControllerService, useValue: mockAuthService2
                },
                {
                    provide: KfThclSPSharedService, useValue: mockAuthService3
                },
                {
                    provide: KfTranslationService, useValue: mockAuthService4
                }
            ],
        });
        fixture = TestBed.createComponent(KftarcSpInterviewGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe to fg.valueChanges and update selectedSplit, igType, and igFormat', () => {
        component.ngOnInit();
        component.selectedSplit = { counts: 2, urls: ['url1', 'url2'], hasDuplicates: false };
        expect(component.selectedSplit).toEqual({ counts: 2, urls: ['url1', 'url2'], hasDuplicates: false });
        expect(component.igType).toBe('master');
        expect(component.igFormat).toBe('pdf');
    });

    it('should call resetForm and splitValueFunction on ngOnInit', () => {
        const testMock = jest.spyOn(component, 'ngOnInit');
        component.ngOnInit();
        expect(testMock).toHaveBeenCalled();
    });

    it('should call resetForm after a timeout', (done) => {
        const resetFormock = jest.spyOn(component, 'resetForm');
        component.resetForm();
        setTimeout(() => {
            expect(resetFormock).toHaveBeenCalled();
            done();
        }, 0);
    });

    it('should download master guide and log success', () => {
        component.igType = InterviewGuideTypes.MASTER;
        component.master = { url: 'test-url' };

        component.download();
        const spinnerOpenMock = jest.spyOn(spinnerMock, 'spinnerOpen');
        const downloadMasterGuideMock = jest.spyOn(igServiceMock, 'downloadMasterGuide');
        const callAuditLogMock = jest.spyOn(spSharedMock, 'callAuditLog');
        spinnerMock.spinnerOpen();
        igServiceMock.downloadMasterGuide('test-url', component.id, 'en', component.name, 'pdf');
        spSharedMock.callAuditLog('pdf', 'INTERVIEW_GUIDE', true, 'DOWNLOAD');
        expect(spinnerOpenMock).toHaveBeenCalled();
        expect(downloadMasterGuideMock).toHaveBeenCalledWith('test-url', component.id, 'en', component.name, 'pdf');
        expect(callAuditLogMock).toHaveBeenCalledWith('pdf', 'INTERVIEW_GUIDE', true, 'DOWNLOAD');
    });

    it('should download master guide and log error', () => {
        component.igType = InterviewGuideTypes.MASTER;
        component.master = { url: 'test-url' };

        component.download();
        const spinnerOpenMock = jest.spyOn(spinnerMock, 'spinnerOpen');
        const downloadMasterGuideMock = jest.spyOn(igServiceMock, 'downloadMasterGuide');
        const callAuditLogMock = jest.spyOn(spSharedMock, 'callAuditLog');
        spinnerMock.spinnerOpen();
        igServiceMock.downloadMasterGuide('test-url', component.id, 'en', component.name, 'pdf');
        spSharedMock.callAuditLog('pdf', 'INTERVIEW_GUIDE', false, 'DOWNLOAD');
        expect(spinnerOpenMock).toHaveBeenCalled();
        expect(downloadMasterGuideMock).toHaveBeenCalledWith('test-url', component.id, 'en', component.name, 'pdf');
        expect(callAuditLogMock).toHaveBeenCalledWith('pdf', 'INTERVIEW_GUIDE', false, 'DOWNLOAD');
    });


    it('should download split guides and log success', () => {
        component.selectedSplit = {
            counts: 2,
            urls: ['url1', 'url2'],
            hasDuplicates: false
        };
        component.download();
        const spinnerOpenMock = jest.spyOn(spinnerMock, 'spinnerOpen');
        const downloadMasterGuideMock = jest.spyOn(igServiceMock, 'downloadMasterGuide');
        const callAuditLogMock = jest.spyOn(spSharedMock, 'callAuditLog');
        spinnerMock.spinnerOpen();
        igServiceMock.downloadMasterGuide('split-data', component.id, 'en', component.name, 'pdf');
        spSharedMock.callAuditLog('pdf', 'INTERVIEW_GUIDE', true, 'DOWNLOAD');
        expect(spinnerOpenMock).toHaveBeenCalled();
        expect(downloadMasterGuideMock).toHaveBeenCalledWith('split-data', component.id, 'en', component.name, 'pdf');
        expect(callAuditLogMock).toHaveBeenCalledWith('pdf', 'INTERVIEW_GUIDE', true, 'DOWNLOAD');
    });

    it('should download split guides and log error', () => {
        component.selectedSplit = {
            counts: 2,
            urls: ['url1', 'url2'],
            hasDuplicates: false
        };

        component.download();

        const spinnerOpenMock = jest.spyOn(spinnerMock, 'spinnerOpen');
        const downloadMasterGuideMock = jest.spyOn(igServiceMock, 'downloadMasterGuide');
        const callAuditLogMock = jest.spyOn(spSharedMock, 'callAuditLog');
        spinnerMock.spinnerOpen();
        igServiceMock.downloadMasterGuide('split-data', component.id, 'en', component.name, 'pdf');
        spSharedMock.callAuditLog('pdf', 'INTERVIEW_GUIDE', false, 'DOWNLOAD');
        expect(spinnerOpenMock).toHaveBeenCalled();
        expect(downloadMasterGuideMock).toHaveBeenCalledWith('split-data', component.id, 'en', component.name, 'pdf');
        expect(callAuditLogMock).toHaveBeenCalledWith('pdf', 'INTERVIEW_GUIDE', false, 'DOWNLOAD');
    });

});
