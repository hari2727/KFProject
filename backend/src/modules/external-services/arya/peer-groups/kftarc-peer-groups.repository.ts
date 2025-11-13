import { Repository } from 'typeorm';
import { AppCode as ec } from '../../../../app.const';
import { KfTarcArayPeerGroups } from '../kftarc-arya.interface';
import { KfhubPeerGroupsEntity } from './kftarc-peer-groups.entity';
import { MapErrors } from '../../../../_shared/error/map-errors.decorator';
import { LogErrors } from '../../../../_shared/log/log-errors.decorator';
import { Injectable } from '@nestjs/common';
import { toNumber, toStringOr } from '../../../../_shared/convert';
import { TypeOrmHelper } from '../../../../_shared/db/typeorm.helper';

@Injectable()
export class KfhubPeerGroupsRepository extends Repository<KfhubPeerGroupsEntity> {

    constructor(protected sql: TypeOrmHelper) {
        super(KfhubPeerGroupsEntity, sql.dataSource.createEntityManager());
    }

    @MapErrors({ errorCode: ec.PEER_GROUPS_ERR })
    @LogErrors()
    async getPeerGroups(query: KfTarcArayPeerGroups) {
        return await this.sql.query(`
                Select TOP :count
                    *
                from
                    SuccessProfile.dbo.ViewAryaPeerGroups
                where
                    PeerGroupName like :searchString
                Order by
                    PeerGroupName
            `,
            {
                count: toNumber(query.topCount),
                searchString: '%' + toStringOr(query.searchString) + '%',
            },
        );
    }

    @MapErrors({ errorCode: ec.BULK_CLIENT_NAMES_ERR })
    @LogErrors()
    async getClientNamesBy(ids: string[]) {
        const results = ids.map(id =>
            this.findOne({ where: { PeerGroupID: toNumber(id) } })
        );

        return (await Promise.all(results)).map(o => o.PeerGroupName).join(',');
    }
}
