import { AppCode as ec } from '../../app.const';
import { Repository } from 'typeorm';
import { KfTarcCertificationEntity } from './kftarc-certification.entity';
import { KfTarcCertificationInterface as Kf } from './kftarc-certification.interface';
import { MapErrors } from '../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toBit, toNumber, toStringOr } from '../../_shared/convert';
import { TypeOrmHelper } from '../../_shared/db/typeorm.helper';

@Injectable()
export class KfTarcCertificationRepository extends Repository<KfTarcCertificationEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(KfTarcCertificationEntity, sql.dataSource.createEntityManager());
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async execGetClientJobCertificates(clientId: number, clientJobId: number): Promise<Kf.DatabaseDTO[]> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.GetClientJobCertificates
                    @ClientID = :clientId,
                    @ClientJobId = :clientJobId
            `,
            {
                clientId: toNumber(clientId),
                clientJobId: toNumber(clientJobId)
            }
        );
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async execUpdateCertificateForClientJob(
        clientId: number,
        clientJobId: number,
        code: string,
        title: string,
        description: string,
        order: number,
        isDeleted: 0 | 1,
        personId: number,
    ): Promise<Kf.DatabaseResponse> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.UpdateCertificateForClientJob
                    @ClientID = :clientId,
                    @ClientJobId = :clientJobId,
                    @CertificateCode = :code,
                    @CertificateTitle = :title,
                    @CertificateDesc = :description,
                    @CertificateOrder = :order,
                    @IsDeleted = :isDeleted,
                    @PersonId = :personId
            `,
            {
                clientId: toNumber(clientId),
                clientJobId: toNumber(clientJobId),
                code: toStringOr(code),
                title: toStringOr(title),
                description: toStringOr(description),
                order: toNumber(order, 0),
                isDeleted: toBit(isDeleted),
                personId: toNumber(personId)
            }
        );
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async execCreateCertificateForClientJob(
        clientId: number,
        clientJobId: number,
        code: string,
        title: string,
        description: string,
        order: number,
        personId: number,
    ): Promise<Kf.DatabaseResponse> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.AddCertificateForClientJob
                    @ClientID = :clientId,
                    @ClientJobId = :clientJobId,
                    @CertificateCode = :code,
                    @CertificateTitle = :title,
                    @CertificateDesc = :description,
                    @CertificateOrder = :order,
                    @PersonId = :personId
            `,
            {
                clientId: toNumber(clientId),
                clientJobId: toNumber(clientJobId),
                code: toStringOr(code),
                title: toStringOr(title),
                description: toStringOr(description),
                order: toNumber(order, 0),
                personId: toNumber(personId)
            }
        );
    }

    @MapErrors({ errorCode: ec.CERTIFICATION_ERR })
    @LogErrors()
    async execUpdateJobCertificateSection( clientJobId: number, hideSection: 0 | 1 ): Promise<Kf.DatabaseResponse> {
        return await this.sql.query(`
                exec SuccessProfile.dbo.UpdateJobCertificateSection
                    @ClientJobId = :clientJobId,
                    @HideSection = :hideSection
            `,
            {
                clientJobId: toNumber(clientJobId),
                hideSection: toBit(hideSection),
            }
        );
    }
}
