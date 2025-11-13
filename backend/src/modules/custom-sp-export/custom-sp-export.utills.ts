import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoggerService } from '../../logger';
import {
    ContentType,
    ContentTypeExtension,
    HcmCsvExportResponse,
    HCMProfileEnum,
    HcmSpExportData,
    SuccessProfile,
    HcmExcelExportResponse,
    HcmJsonExportResponse,
} from './interfaces';
import * as XLSX from '@sheet/core';
import { CSV_SHEET_NAME_MAP, HEADERS_COLOR } from './custom-export.const';
import { stripObjectKeys } from '../../common/common.utils';
import * as fs from 'fs';
import * as archiver from 'archiver';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Loggers } from '../../_shared/log/loggers';
import { AppResponse } from '../../_shared/response/app-response';
import * as path from 'path';
import { PassThrough } from 'stream';

@Injectable()
export class HcmExportUtils {
    protected logger: LoggerService;
    constructor(protected loggers: Loggers) {
        this.logger = loggers.getLogger(HcmExportUtils.name);
    }

    @LogErrors()
    public async getCustomHCMJSON(data: HcmSpExportData): Promise<HcmJsonExportResponse> {
        const output: SuccessProfile[] = [];

        const jobIdMap: { [jobID: string]: SuccessProfile } = {};

        for (const key in data) {
            for (const entry of data[key as keyof HcmSpExportData]) {
                const jobID = entry.JobID.toString();

                if (!jobIdMap[jobID]) {
                    jobIdMap[jobID] = {
                        JobID: entry.JobID,
                        behavioralCompetencies: [],
                        drivers: [],
                        education: [],
                        generalExperiencies: [],
                        managerialExperiencies: [],
                        responsibilities: [],
                        skills: [],
                        traits: [],
                        // tasks: [],
                        // tools: []
                    };
                }
                const { JobID, 'Job Code': jobCode, 'Job Name': jobName, ...entryWithoutJobID } = entry;

                switch (key as keyof HcmSpExportData) {
                    case 'successProfiles':
                        jobIdMap[jobID] = {
                            JobID: entry.JobID,
                            'Job Code': jobCode,
                            'Job Name': jobName,
                            ...this.formatKeys(entryWithoutJobID),
                            ...jobIdMap[jobID],
                        };
                        break;
                    case 'competencies':
                        jobIdMap[jobID].behavioralCompetencies.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'drivers':
                        jobIdMap[jobID].drivers.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'generalExperiences':
                        jobIdMap[jobID].generalExperiencies.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'managerialExperiences':
                        jobIdMap[jobID].managerialExperiencies.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'responsibilities':
                        jobIdMap[jobID].responsibilities.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'education':
                        jobIdMap[jobID].education.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'skills':
                        jobIdMap[jobID].skills.push(this.formatKeys(entryWithoutJobID));
                        break;
                    case 'traits':
                        jobIdMap[jobID].traits.push(this.formatKeys(entryWithoutJobID));
                        break;
                    // case 'tasks':
                    //     jobIdMap[jobID].tasks.push(this.formatKeys(entryWithoutJobID));
                    //     break;
                    // case 'tools':
                    //     jobIdMap[jobID].tools.push(this.formatKeys(entryWithoutJobID));
                    //     break;
                    default:
                        break;
                }
            }
        }

        for (const grouped of Object.values(jobIdMap)) {
            output.push(grouped);
        }

        return new AppResponse({ data: { successProfile: output } });
    }

    private formatKeys = (data: any) => {
        if (Array.isArray(data)) {
            return data.map(this.formatKeys);
        } else if (typeof data === 'object' && data !== null) {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => {
                    let newKey = key
                        .replace(/ /g, '')
                        .replace(/\//g, '')
                        .replace(/\(Inc WC points\)/g, 'IncWCpoints'); // Adjust specific keys
                    return [newKey, value];
                })
            );
        }
        return data;
    };

    @LogErrors()
    public async getHcmCsv(data: HcmSpExportData): Promise<HcmCsvExportResponse> {
        data = this.stripIdsFromHcmExportData(data);

        const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
        const sheetsData: { sheetName: string; fileName: string; fullPath: string }[] = [];
        const zipFileName = `KornFerry_CustomSP_Extract_${timestamp}.zip`;

        const delimiter = ',';

        for (const key in data) {
            const sheetName = CSV_SHEET_NAME_MAP[key as keyof HcmSpExportData];

            const csvData = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data[key]), {
                FS: delimiter,
                forceQuotes: true,
            });

            const fileName = `${sheetName}_${timestamp}.csv`;
            const fullPath = path.resolve(fileName);

            fs.writeFileSync(fullPath, csvData);
            sheetsData.push({ sheetName, fileName, fullPath });
        }

        const archive = archiver('zip', { zlib: { level: 9 } });
        const stream = new PassThrough();
        const chunks: Buffer[] = [];

        stream.on('data', (chunk) => chunks.push(chunk));

        archive.on('error', (err) => {
            this.logger.error('Archive error:', err);
            throw new InternalServerErrorException('Could not create ZIP');
        });

        // Add all CSV files to the archive
        for (const sheet of sheetsData) {
            if (fs.existsSync(sheet.fullPath)) {
                archive.file(sheet.fullPath, { name: sheet.fileName });
            }
        }

        archive.pipe(stream);
        archive.finalize().catch((err) => {
            this.logger.error('Finalization error:', err);
            throw new InternalServerErrorException('ZIP finalization failed');
        });

        // Await stream end to collect buffer
        await new Promise<void>((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        // Delete temp files after some delay
        setTimeout(() => {
            for (const sheet of sheetsData) {
                if (fs.existsSync(sheet.fullPath)) {
                    fs.unlink(sheet.fullPath, () => {});
                }
            }
        }, 10_000);

        const zipBuffer = Buffer.concat(chunks);

        return new AppResponse({
            status: 200,
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=${zipFileName}`,
            },
            data: zipBuffer,
        });
    }

    @LogErrors()
    public async getHcmExcel(data: HcmSpExportData, clientId: number): Promise<HcmExcelExportResponse> {
        data = this.stripIdsFromHcmExportData(data);

        const wb = XLSX.utils.book_new();

        const [
            competenciesSheet,
            driversSheet,
            educationSheet,
            generalExpSheet,
            managerialExpSheet,
            responsibilitiesSheet,
            skillsSheet,
            successProfilesSheet,
            tasksSheet,
            toolsSheet,
            traitsSheet,
        ] = [
            data.competencies,
            data.drivers,
            data.education,
            data.generalExperiences,
            data.managerialExperiences,
            data.responsibilities,
            data.skills,
            data.successProfiles,
            data.tasks,
            data.tools,
            data.traits,
        ].map((sheetData) => this.convertToSheet(sheetData));

        XLSX.utils.book_append_sheet(wb, successProfilesSheet, 'Success Profiles');
        XLSX.utils.book_append_sheet(wb, responsibilitiesSheet, 'Responsibilities');
        XLSX.utils.book_append_sheet(wb, tasksSheet, 'Tasks');
        XLSX.utils.book_append_sheet(wb, competenciesSheet, 'Behavioral Competencies');
        XLSX.utils.book_append_sheet(wb, skillsSheet, 'Skills');
        XLSX.utils.book_append_sheet(wb, toolsSheet, 'Tools');
        XLSX.utils.book_append_sheet(wb, educationSheet, 'Education');
        XLSX.utils.book_append_sheet(wb, generalExpSheet, 'General Experiences');
        XLSX.utils.book_append_sheet(wb, managerialExpSheet, 'Managerial Experiences');
        XLSX.utils.book_append_sheet(wb, traitsSheet, 'Traits');
        XLSX.utils.book_append_sheet(wb, driversSheet, 'Drivers');

        const excel = this.transformWorkbookIntoExcel(wb, clientId);

        return excel;
    }

    @LogErrors()
    private stripIdsFromHcmExportData(data: HcmSpExportData): HcmSpExportData {
        return {
            competencies: data.competencies.map((item) => stripObjectKeys(item, ['Behavioral Competency ID'])),
            drivers: data.drivers.map((item) => stripObjectKeys(item, ['Driver ID'])),
            education: data.education.map((item) => stripObjectKeys(item, ['Education ID'])),
            generalExperiences: data.generalExperiences.map((item) => stripObjectKeys(item, ['General Experience ID'])),
            managerialExperiences: data.managerialExperiences.map((item) =>
                stripObjectKeys(item, ['Managerial Experience ID'])
            ),
            responsibilities: data.responsibilities.map((item) => stripObjectKeys(item, ['Responsibility ID'])),
            skills: data.skills.map((item) => stripObjectKeys(item, ['Skill ID'])),
            tasks: data.tasks.map((item) => stripObjectKeys(item, ['Task ID'])),
            successProfiles: data.successProfiles,
            tools: data.tools.map((item) => stripObjectKeys(item, ['Tool ID', 'Example ID'])),
            traits: data.traits.map((item) => stripObjectKeys(item, ['Trait ID'])),
        };
    }

    @LogErrors()
    private styleColumns(data: {}[], ws: XLSX.WorkSheet) {
        if (!data?.length) {
            return null;
        }
        const row = data[0];
        const styles = [];
        for (const key in row) {
            switch (key.trimEnd()) {
                case HCMProfileEnum.DESCRIPTION:
                case HCMProfileEnum.DESCRIPTION:
                case HCMProfileEnum.BEHAVIORAL_NAME:
                case HCMProfileEnum.RESPONSIBILITY_DESCRIPTION:
                case HCMProfileEnum.BEHAVIORAL_COMPETENCY_DESCRIPTION:
                case HCMProfileEnum.TECHNICAL_COMPETENCY_DESCRIPTION:
                case HCMProfileEnum.SKILL_DESCRIPTION:
                case HCMProfileEnum.EDUCATION_DESCRIPTION:
                case HCMProfileEnum.SKILL_COMPONENTS:
                    styles.push({ width: 60 });
                    break;
                case HCMProfileEnum.JOB_CODE:
                case HCMProfileEnum.JOB_ID:
                case HCMProfileEnum.JRT_DETAIL_ID:
                case HCMProfileEnum.JOB_FAMILY_ID:
                case HCMProfileEnum.JOB_SUBFAMILY_ID:
                case HCMProfileEnum.REFERENCE_LEVEL:
                case HCMProfileEnum.KF_LEVEL_CODE:
                case HCMProfileEnum.CREATED_ON:
                case HCMProfileEnum.MODIFIED_ON:
                case HCMProfileEnum.MODIFIED_ON:
                case HCMProfileEnum.SHORT_PROFILE:
                case HCMProfileEnum.UNIQUE_ID:
                case HCMProfileEnum.LEVEL:
                case HCMProfileEnum.IMPORTANT:
                case HCMProfileEnum.TYPE:
                case HCMProfileEnum.TASK_ORDER:
                case HCMProfileEnum.TOOL_ORDER:
                case HCMProfileEnum.EXAMPLE_ORDER:
                    styles.push({ width: 17 });
                    break;
                default:
                    styles.push({ width: 30 });
                    break;
            }
        }
        ws['!cols'] = styles;
    }

    @LogErrors()
    private styleCells(ws: XLSX.WorkSheet) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        XLSX.utils.sheet_set_range_style(ws, range, {
            alignment: {
                vertical: 'top',
                wrapText: true,
            },
        });
        const rowRange = XLSX.utils.encode_range({ c: range.s.c, r: 0 }, { c: range.e.c, r: 0 });
        XLSX.utils.sheet_set_range_style(ws, rowRange, {
            fgColor: { rgb: HEADERS_COLOR },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            incol: { style: 'thin' },
            alignment: { horizontal: 'center' },
            bold: true,
        });
    }

    @LogErrors()
    private transformWorkbookIntoExcel(wb: XLSX.WorkBook, clientId: number): HcmExcelExportResponse {
        const contentType = ContentType.EXCEL;
        const fileName = `KornFerry${+clientId}CustomHCMSPExport.${ContentTypeExtension[contentType] || 'raw'}`;

        const result = XLSX.write(wb, {
            cellStyles: true,
            compression: true,
            bookSST: true,
            type: 'buffer',
            bookType: 'xlsx',
        });

        return new AppResponse({
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename=${fileName}`,
            },
            data: result,
        });
    }

    @LogErrors()
    private convertToSheet(entries: any[]): XLSX.WorkSheet {
        (entries || []).forEach((element) => {
            if (element?.JobID) {
                element.JobID = +element.JobID;
            }
        });
        let ws = XLSX.utils.json_to_sheet(entries);
        if (ws === null) {
            ws = XLSX.utils.aoa_to_sheet([]);
        }
        this.styleColumns(entries, ws);
        this.styleCells(ws);
        return ws;
    }
}
