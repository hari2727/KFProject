import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../../logger';
import { toPropertyName } from '../../../common/common.utils';
import { IcExportRepository } from './export.repository';
import { ExportQueryParams, ExportRequestBody, PageDataResponse, } from './export.interface';
import { Buffer } from 'buffer';
import * as XLSX from '@sheet/core';
import { WorkBook } from '@sheet/core';
import * as moment from 'moment';
import {
    EntityKeyColumnName,
    ExportContentType,
    ExportOutputLocation,
    ExportOutputLocations,
    ExportType,
    MainPageName,
    OutputStructureFormat,
    OutputType,
    PageDataConfigs,
    S3UploadLocalPath,
    SharedColumnNames,
    XlsxColumnDefaultWidth,
    XlsxColumnWidths,
    XlsxHeaderColor,
} from './export.const';
import { S3 } from 'aws-sdk';
import { ContentTypes } from '../../../common/common.const';
import { Response } from 'express';
import { sendRawResponse } from '../../../common/response.util';
import * as FormData from 'form-data';
import axios from 'axios';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Loggers } from '../../../_shared/log/loggers';
import { ConfigService } from '../../../_shared/config/config.service';
import { S3Util } from '../../../common/s3-util';

@Injectable()
export class IcExportService {
    protected logger: LoggerService;
    protected defaultExportOutputLocation: ExportOutputLocation;

    constructor(
        protected repository: IcExportRepository,
        protected loggers: Loggers,
        protected configService: ConfigService,
        protected s3util: S3Util,
    ) {
        this.logger = loggers.getLogger(IcExportService.name);
        this.defaultExportOutputLocation =
            this.configService.get('IC_BIC_PROFILES_UPLOAD_DEFAULT_TARGET') as ExportOutputLocation;
    }

    @LogErrors()
    async exportProfiles(body: ExportRequestBody, response?: Response): Promise<any> {
            this.validateRequestBody(body);

            body.locale = 'en';
            body.version = body.version || OutputStructureFormat.UnpackedMap;
            body.format = body.format || ExportType.Xlsx;
            body.output = body.output || OutputType.S3;
            body.target = Object.values(ExportOutputLocation).includes(body.target)
                ? body.target
                : this.defaultExportOutputLocation;

            const format = String(body.format);
            const fileName = this.generateFileName(body, format);
            const contentType = ExportContentType[format];

            const data = await this.getAllPagesData(body);

            let result: any;
            let buffer: Buffer;

            if (body.format === ExportType.Json) {
                result = { jobs: this.convertDataToJson(data, body.version) };
                if (body.output !== OutputType.Inline) {
                    buffer = Buffer.from(JSON.stringify(result, null, 4), 'utf-8');
                }
            } else {
                buffer = await this.convertDataToExcel(data);
            }

            if (buffer) {
                if (body.output === OutputType.S3) {
                    result = { url: await this.uploadToS3(buffer, fileName, contentType) };
                } else if (body.output === OutputType.Beehive) {
                    result = { beehiveSuccess : await this.uploadToBeehive(body.target, buffer, fileName, contentType) };
                } else {
                    return response ? this.sendAsAttachment(response, buffer, fileName, contentType) : null;
                }
            }

            if (result) {
                return response ? sendRawResponse(response, result) : null;
            }

        return null;
    }

    convertDataToJson(data: PageDataResponse[], version: OutputStructureFormat): any {
        const mainPageName = toPropertyName(MainPageName);
        const baseJobStructure = {};
        const pageNames = [];

        for (let i = 0; i < PageDataConfigs.length; i++) {
            const pageName = toPropertyName(PageDataConfigs[i].pageName);
            pageNames.push(pageName);
            baseJobStructure[pageName] = [];
        }

        const jobsMap = {};

        for (let i = 0; i < pageNames.length; i++) {
            const pageName = pageNames[i];

            for (const row of data[i]) {
                const key = row[EntityKeyColumnName];
                if (key) {

                    jobsMap[key] = jobsMap[key] || {
                        ...JSON.parse(JSON.stringify(baseJobStructure))
                    };
                    jobsMap[key][pageName].push(row);

                    if (pageName !== mainPageName) {
                        for (const n of SharedColumnNames) {
                            delete row[n];
                        }
                    }
                }
            }
        }

        if (version === OutputStructureFormat.Map) {
            return jobsMap;
        }

        const jobsArray = Object.values(jobsMap);

        if (version === OutputStructureFormat.List) {
            return jobsArray;
        }

        for (const job of jobsArray) {
            const generalData = job[mainPageName];
            if (generalData) {
                Object.assign(job, generalData.length ? generalData[0] : {});
            }
            delete job[mainPageName];
        }

        if (version === OutputStructureFormat.UnpackedMap) {
            return jobsMap;
        }

        if (version === OutputStructureFormat.UnpackedList) {
            return jobsArray;
        }

        return jobsArray;
    }

    async convertDataToExcel(data: PageDataResponse[]): Promise<Buffer> {
        const pagesSheets = await this.createAllPagesSheets(data);
        const workbook = this.putSheetsInWorkbook(pagesSheets);

        return this.transformWorkbookIntoExcel(workbook);
    }

    protected validateRequestBody(body: ExportRequestBody): void {
        if (body.clientId === undefined) {
            throw 'No clientId provided';
        }

        if (!Number(body.clientId)) {
            throw 'Bad clientId provided';
        }

        if (body.jobId !== undefined && !Number(body.jobId)) {
            throw 'Bad jobId provided';
        }

        if (body.guid !== undefined && (typeof body.guid !== 'string' || !body.guid)) {
            throw 'Bad guid provided';
        }

        if (body.locale !== undefined && (typeof body.locale !== 'string' || !body.locale || /[^a-z\-]/i.test(body.locale))) {
            throw 'Bad locale provided';
        }

        if (body.format !== undefined && !Object.values(ExportType).includes(body.format)) {
            throw 'Bad format';
        }

        if (body.version !== undefined && !Object.values(OutputStructureFormat).includes(body.version)) {
            throw 'Bad version';
        }

        if (body.output !== undefined && !Object.values(OutputType).includes(body.output)) {
            throw 'Bad output';
        }
    }

    protected async getAllPagesData(body: ExportRequestBody): Promise<PageDataResponse[]> {
        const params = body as ExportQueryParams;
        return Promise.all(PageDataConfigs.map(pageConfig => this.repository.getPageData(pageConfig, params)));
    }

    protected async createAllPagesSheets(data: PageDataResponse[]): Promise<XLSX.WorkSheet[]> {
        return Promise.all(data.map(d => this.convertPageToSheet(d)));
    }

    protected putSheetsInWorkbook(sheets: XLSX.WorkSheet[]): WorkBook {
        const wb = XLSX.utils.book_new();
        for (let i = 0; i < PageDataConfigs.length; i++) {
            XLSX.utils.book_append_sheet(wb, sheets[i], PageDataConfigs[i].pageName);
        }
        return wb;
    }

    protected transformWorkbookIntoExcel(wb: WorkBook): Buffer {
        return XLSX.write(wb, {
            cellStyles: true,
            bookSST: true,
            bookType: 'xlsx',
            type: 'buffer',
            compression: true,
        });
    }

    protected async uploadToS3(data: Buffer, fileName: string, contentType: ContentTypes): Promise<string> {
        const s3 = new S3(this.s3util.buildClientOptions());

        const upload = await s3.upload(this.s3util.buildPutObject({
            Body: data,
            Key: `${S3UploadLocalPath}/${fileName}`,
            ContentType: contentType,
        })).promise();

        return this.s3util.getSignedUrlToGetUpload(s3, upload);
    }

    protected obtainICSubscriptionKey(target: ExportOutputLocation): string {
        const subscriptionKey = this.configService.get(`IC_BIC_PROFILES_UPLOAD_KEY_${target}`);
        if (!subscriptionKey) {
            throw `No subscriptionKey configured for target '${target}'`;
        }
        return subscriptionKey;
    }

    @LogErrors()
    protected async uploadToBeehive(target: ExportOutputLocation, fileData: Buffer, fileName: string, contentType: ContentTypes): Promise<boolean> {
        const formData = new FormData();
        formData.append('file', fileData, { filename: fileName });
        const config = ExportOutputLocations[target];
        const subscriptionKey = this.obtainICSubscriptionKey(target);
        try {
            await axios.post(config.url, formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Ocp-Apim-Subscription-Key': subscriptionKey,
                },
            });
        } catch (e) {
            let url = 'unsuccessful';
            try {
                url = await this.uploadToS3(fileData, fileName, contentType);
            } catch (e) {
                throw e;
            }
            this.logger.error(`uploadToBeehive: failed ('${e.message}'), url is ${config.url}, new file location is ${url}`);
            throw e;
        }
        return true;
    }

    protected sendAsAttachment(response: Response, data: Buffer, fileName: string, contentType: ContentTypes): any {
        return sendRawResponse(response, data, 200, {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename=${fileName}`,
        });
    }

    protected convertPageToSheet(entries: PageDataResponse): XLSX.WorkSheet {
        let ws = XLSX.utils.json_to_sheet(entries);
        if (ws === null) {
            // Writes only headers to worksheet when empty response ([]) from database
            const row = Object.keys(entries.columns);
            ws = XLSX.utils.aoa_to_sheet([row]);
        }
        this.styleColumns(entries, ws);
        this.styleCells(ws);
        return ws;
    }

    protected styleColumns(entries: PageDataResponse, ws: XLSX.WorkSheet): void {
        if (!entries?.length) {
            return null;
        }
        const row = entries[0];
        const styles = [];
        for (const key in row) {
            styles.push({ width: XlsxColumnWidths[key.trim()] || XlsxColumnDefaultWidth });
        }
        ws['!cols'] = styles;
    }

    protected styleCells(ws: XLSX.WorkSheet): void {
        const range = XLSX.utils.decode_range(ws['!ref']);
        XLSX.utils.sheet_set_range_style(ws, range, {
            alignment: {
                vertical: 'top',
                wrapText: true,
            },
        });
        const rowRange = XLSX.utils.encode_range({ c: range.s.c, r: 0 }, { c: range.e.c, r: 0 });
        XLSX.utils.sheet_set_range_style(ws, rowRange, {
            fgColor: { rgb: XlsxHeaderColor },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
            left: { style: 'thin' },
            top: { style: 'thin' },
            incol: { style: 'thin' },
            alignment: { horizontal: 'center' },
            bold: true,
        });
    }

    protected generateFileName(body: ExportRequestBody, extension: string): string {
        const fileName = [
            'Custom SP & JD Export',
            body.clientId,
            body.jobId,
            body.guid ? 'Bulk' : '',
            body.locale,
            moment().format('YYYYMMDD_hhmmss'),
        ].filter(Boolean).join(' ').replace(/\s+/g, '_');
        return `${fileName}.${extension}`;
    }
}
