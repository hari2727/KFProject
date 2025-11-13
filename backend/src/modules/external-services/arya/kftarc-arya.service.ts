import { KfhubCountryRepository } from './country/kftarc-country.repository';
import { Injectable } from '@nestjs/common';
import { AryaClient } from './http-client/kftarc-arya-https-client.service';
import {
    KfTarcAlternativeJobsParams,
    KfTarcArayPeerGroups,
    KfTarcAryaSkillCompareDto,
    KfTarcAryaSkills,
    KfTarcAryaSkillsEnum,
} from './kftarc-arya.interface';
import { KfTracArya } from './http-client/kftarc-arya-https-client.interface';
import { ARYA_INDUSTRIES } from './industries/kftarc-arya-industries.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KfTarcIndustriesInterface } from './industries/kftarc-arya-industries.interface';
import { KfhubPeerGroupsRepository } from './peer-groups/kftarc-peer-groups.repository';
import { KfTarcExcludeKeysService } from './exclude-keys/kftarc-arya-exclude-keys.service';
import { AppCode as ec } from '../../../app.const';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { MapErrors } from '../../../_shared/error/map-errors.decorator';
import { MongoDbConnectionName } from '../../../models/mongo-db.const';

@Injectable()
export class KfTarcAryaService {

    protected industries;

    constructor(
        @InjectModel(ARYA_INDUSTRIES, MongoDbConnectionName.SuccessProfile)
        protected industriesModel: Model<KfTarcIndustriesInterface>,
        protected peerGroupsRepo: KfhubPeerGroupsRepository,
        protected countryRepo: KfhubCountryRepository,
        protected excludeKeyService: KfTarcExcludeKeysService,
        protected arya: AryaClient,
    ) {}

    compareSkills(body: KfTarcAryaSkillCompareDto) {
        return {
            missingSkills: ['python', '.net'],
        };
    }

    @MapErrors({ errorCode: ec.SKILL_ERR })
    @LogErrors()
    async getSkills(query: KfTarcAryaSkills) {
        let result: KfTracArya.Response;

        const countryId = await this.getAryaCountryIdFor(query.countryId);

        if (!countryId) {
            return this.skillResponseHandler(null);
        }

        switch (query.type) {
            case KfTarcAryaSkillsEnum.ORGANIZATION:
                result = await this.getOrgSkills(query, countryId);
                break;

            case KfTarcAryaSkillsEnum.MARKET:
                result = await this.getMarketSkills(query, countryId);
        }

        const response = this.skillResponseHandler(result);

        this.excludeKeyService.segregateSkills(response.skills);

        this.reduceTo(response.skills, +query.topCount);

        return response;
    }

    @MapErrors({ errorCode: ec.ORG_SKILL_ERR })
    @LogErrors()
    async getOrgSkills(query, countryId) {
        return await this.arya.agent(query.spName, countryId, query.clientNames);
    }

    @MapErrors({ errorCode: ec.MARKET_SKILLS_ERR })
    @LogErrors()
    async getMarketSkills(query, countryId): Promise<any> {
        let clientNames = '';
        let industries;

        if (query.peerGroupIds) {
            const arrayOfClintIds = query.peerGroupIds.split(',');
            /**
             *
             * Get client names from peerGroupId joined by "," eg:: "Apple,IBM"
             *
             */
            clientNames = await this.peerGroupsRepo.getClientNamesBy(arrayOfClintIds);
        }

        if (query.industryId) {
            industries = await this.getAryaIndustriesFor(query.industryId);

            if (!industries) {
                return this.skillResponseHandler(null);
            }
        }

        return await this.arya.agent(query.spName, countryId, clientNames, industries);
    }

    async jobTitles(query: KfTarcAlternativeJobsParams) {
        const countryId = await this.getAryaCountryIdFor(query.countryId);

        if (!countryId) {
            return this.jobTitlesResponseHandler(null);
        }
        const result = await this.arya.agent(query.spName, countryId);

        const response = this.jobTitlesResponseHandler(result);

        this.excludeKeyService.segregateJobTitles(response.jobTitles);

        this.reduceTo(response.jobTitles, +query.topCount);

        return response;
    }

    protected jobTitlesResponseHandler(result) {
        const response = {
            jobTitles: [],
        };

        if (!result || !result.SimilarTitlesStats || !result.SimilarTitlesStats.length) {
            return response;
        }

        result.SimilarTitlesStats.forEach(o => {
            response.jobTitles.push({
                name: o.SimilarTitle,
                count: o.Count,
            });
        });
        return response;
    }

    protected isEmpty(result) {
        if (result == null) {
            return true;
        }
        return Object.keys(result).length == 0;
    }

    protected skillResponseHandler(result) {
        const response = {
            skills: [],
        };

        if (this.isEmpty(result)) {
            return response;
        }
        result.SkillsStats.forEach(o => {
            response.skills.push({
                name: o.SkillName,
                count: o.Count,
            });
        });
        return response;
    }

    /*
        Get industries failed
      */
    @MapErrors({ errorCode: ec.INDUSTRIES_ERR })
    @LogErrors()
    async getIndustries() {
        if (!this.industries) {
            this.industries = await this.industriesModel.find().lean();
        }
        return this.industries;
    }

    peerGroups(query: KfTarcArayPeerGroups) {
        return this.peerGroupsRepo.getPeerGroups(query);
    }

    protected async getAryaCountryIdFor(talentHubCountryId) {
        const countryMapping = await this.countryRepo.getAllCountries();
        const found = countryMapping.find(o => o.CountryID == talentHubCountryId);
        if (found == undefined || found.AryaCountryId == 'NULL' || found.AryaCountryId == 0) {
            return null;
        }
        return found.AryaCountryId;
    }

    protected async getAryaIndustriesFor(industryId = '') {
        const industries = await this.getIndustries();

        const found = industries.find(o => o.id == +industryId);
        if (!found) {
            return null;
        }
        return found.name;
    }

    protected reduceTo(data: any[], topCount) {
        if (data.length > topCount) {
            data.length = topCount;
        }
    }
}
