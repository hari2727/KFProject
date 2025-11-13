import { Injectable } from '@nestjs/common';
import { RequestCommon } from '../../common/common.utils';
import { AppCode as ec } from '../../app.const';
import { KfTarcCertificationInterface as Kf } from './kftarc-certification.interface';
import { KfTarcCertificationRepository } from './kftarc-certification.repository';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { HttpsService } from '../../_shared/https/https.service';
import { ConfigService } from '../../_shared/config/config.service';
import { safeString } from '../../_shared/safety';

@Injectable()
export class KfTarcCertificationService extends RequestCommon {

    constructor(
        protected kfTarcContentRepository: KfTarcCertificationRepository,
        protected https: HttpsService,
        protected configService: ConfigService,
    ) {
        super(configService);
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    protected async getPermissions(request: Kf.RequestWithHeaders): Promise<Kf.SuccessProfilesPermissions> {
            const authToken = request.headers.authtoken;
            const psSessionId = request.headers['ps-session-id'];
            const url = this.getPermissionsUrl();
            const headers = this.getKfhubApiHeaders(authToken, psSessionId);
            const permissions = await this.https.get(url, headers);
            return permissions as Kf.SuccessProfilesPermissions;
    }

    @MapErrors({ errorCode: ec.EXTERNAL_CALL_ERR })
    @LogErrors()
    protected renameCertificateColumns(data: Kf.DatabaseDTO[]): Kf.RenamedDatabaseDTO[] {
            const responseArray: Kf.RenamedDatabaseDTO[] = [];
            data.forEach(cert => {
                const certObj = {} as Kf.RenamedDatabaseDTO;
                Object.entries(cert).forEach(([key, value]) => {
                    let keyName: string;
                    switch (key) {
                        case 'CertificateCode':
                            keyName = 'code';
                            break;
                        case 'CertificateTitle':
                            keyName = 'name';
                            break;
                        case 'CertificateDesc':
                            keyName = 'description';
                            break;
                        case 'CertificateOrder':
                            keyName = 'order';
                            break;
                        default:
                            keyName = key.charAt(0).toLowerCase() + key.slice(1);
                    }
                    certObj[keyName] = value;
                });
                responseArray.push(certObj);
            });
            return responseArray;
    }

    @LogErrors()
    protected async selectCertificatesFromDB(query: Kf.GetCertificatesQueryParams): Promise<Kf.RenamedDatabaseDTO[]> {
            const { loggedInUserClientId, clientJobId } = query;
            const data: Kf.DatabaseDTO[] = await this.kfTarcContentRepository.execGetClientJobCertificates(loggedInUserClientId, clientJobId);
            return this.renameCertificateColumns(data);
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async getCertificates(query: Kf.GetCertificatesQueryParams, request: Kf.RequestWithHeaders): Promise<Kf.GetCertificatesResponse> {
            await this.getPermissions(request);
            const data: Kf.RenamedDatabaseDTO[] = await this.selectCertificatesFromDB(query);
            let hideSection = false;
            let foundCertificates: Kf.FoundCertificate[] = [];
            if ( data.length !== 0 ) {
                hideSection = !!data[0]?.hideSection;
                //removing hideSection and maxCode prop from each cert and add to result array if DB response isn't null
                //if there is no certs in DB, storeProc will still return one with all null props
                if (data[0].code || data.length !== 1) {
                    data.forEach(cert => {
                        const { hideSection, maxCode, ...resCert } = cert;
                        foundCertificates.push(resCert);
                    });
            }};

            const response: Kf.GetCertificatesResponse = {
                code: "CERTTIFICATIONS",
                name: "Licenses and Certifications",
                hideSection: hideSection,
                hideNames: false,
                certs: foundCertificates,
            };
            return response;
    }

    protected escapeQuotes(text: string): string {
        return text?.replace(/'/g,"''");
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async postCertificates(query: Kf.PostCertificatesQueryParams, request: Kf.RequestWithHeaders, body: Kf.PostCertificatesPayload): Promise<Kf.DatabaseResponse> {
            const { certs, hideSection } = body;
            const { clientJobId } = query;
            //check for permissons
            await this.getPermissions(request);
            //update Certification section status if it was provided
            if (typeof hideSection !== 'undefined') {
                const hideSectionNum = hideSection ? 1 : 0;
                this.kfTarcContentRepository.execUpdateJobCertificateSection(clientJobId, hideSectionNum);
            }
            //check if all certificates for Update exist
            const missingCerts = await this.selectCertsMissingInDB(query, certs);
            if (missingCerts.length !== 0) {
                throw safeString(`Some certificates are missing in DB: ${missingCerts.join(', ')}`);
            }
            //select last cert Id from DB to generate new ones
            const lastCertId = await this.selectLastCertIdExtractedFromCodeFromDB(query);
            //sort certs array and rank 'order' property from 1 to the last
            let sortNum = 1;
            const sortedCerts = certs
                .sort((certP, certN) => (certP.order < certN.order ? -1 : 1))
                .map((cert) => {
                    if (cert.method !== Kf.HttpMethodType.DELETE) cert.order = sortNum++;
                    return cert;
                });
            //run ADD or EDIT proc for all certificates
            let nextCertId = lastCertId;

            await Promise.all(sortedCerts.map(async certOrig => {
                const cert = { ...certOrig };
                cert.description = this.escapeQuotes(cert.description);
                cert.name = this.escapeQuotes(cert.name);
                if (cert.method === undefined) {
                    cert.method = Kf.HttpMethodType.NOT_SPECIFIED;
                }
                switch (cert.method) {
                    case Kf.HttpMethodType.POST:
                        await this.createCertificate(query, cert, ++nextCertId);
                        break;
                    case Kf.HttpMethodType.PUT:
                    case Kf.HttpMethodType.DELETE:
                        await this.updateCertificate(query, cert);
                        break;
                    case Kf.HttpMethodType.NOT_SPECIFIED://method prop can be missing if there weren't any changes on cert, but its order should be updated anyway
                        await this.updateCertificate(query, cert);
                        break;
                }
            }));
            return {
                StatusCode: 200,
                ExceptionCode: ec.SUCCESS,
            };
    }

    protected async selectCertsMissingInDB(query: Kf.PostCertificatesQueryParams, body: Kf.PostPayloadSinglCert[]): Promise<string[]> {
        //Check if all job's certificates exist in DB
        const dbDataJobCerts = await this.selectCertificatesFromDB(query);
        if (!dbDataJobCerts.length) {
            return [];
        }

        const missingCertificates: string[] = [];
        for ( const bodyCert of body) {
            let missingInDb = true;
            if ( bodyCert.method === Kf.HttpMethodType.POST ) {
                missingInDb = false;
                break;
            }
            for (let dbCert of dbDataJobCerts) {
                if (dbCert.code === bodyCert.code) {
                    missingInDb = false;
                    break;
                }
            }
            missingInDb && missingCertificates.push(bodyCert.code);
        };

        if (missingCertificates.length) {
            return missingCertificates;
        }
        return [];
    }

    @LogErrors()
    protected async selectLastCertIdExtractedFromCodeFromDB(query: Kf.GetCertificatesQueryParams): Promise<number> {
            const { loggedInUserClientId, clientJobId } = query;
            const data: Kf.DatabaseDTO[] = await this.kfTarcContentRepository.execGetClientJobCertificates(loggedInUserClientId, clientJobId);
            const lastCertId = data[0].MaxCode || 0;
            return lastCertId;
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    protected async createCertificate(query: Kf.PostCertificatesQueryParams, cert: Kf.PostPayloadSinglCert, nextCertId: number): Promise<Kf.DatabaseResponse> {
            const { loggedInUserClientId, clientJobId, userId } = query;
            const { name, description, order } = cert;
            const code = `CERT${clientJobId}_${nextCertId}`;
            return await this.kfTarcContentRepository.execCreateCertificateForClientJob(
                loggedInUserClientId, clientJobId, code, name, description, order, userId);
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    protected async updateCertificate(query: Kf.PostCertificatesQueryParams, cert: Kf.PostPayloadSinglCert): Promise<Kf.DatabaseResponse> {
            const { loggedInUserClientId, clientJobId, code, name, description, order, userId } = { ...query, ...cert };
            const isDeleted = cert.method === Kf.HttpMethodType.DELETE ? 1 : 0;
            return await this.kfTarcContentRepository.execUpdateCertificateForClientJob(
                loggedInUserClientId, clientJobId,
                code, name, description, order,
                isDeleted, userId,
            );
    }
}
