import { Injectable } from '@nestjs/common';
import {
    KfTarcContentInterface as Kf,
    KfTarcHandleLearningContentResponse,
    KfTarcLearningAssetsByCompsRoleLevelsRaw,
    KfTarcLearningContentBody,
    KfTarcLearningContentDTO,
    KfTarcLearningContentResponse,
    KfTarcQuery
} from './kftarc-content.interface';
import { KfTarcUtil } from './kftarc-content.utils';
import { KfTarchContentRepository } from './kftarc-content.repository';

@Injectable()
export class KfTarcContentService extends KfTarcUtil {
    constructor(
        protected kfTarcContentRepository: KfTarchContentRepository,
    ) {
        super();
    }

    validateContent(body: Kf.RequestBody) {
            let group = this.groupByLearningAssetID(body.learningAssets);
            const ruleOne = this.ruleOne(group as any);
            group = group.filter((obj, i) => {
                if (i === ruleOne.deleteArrayById.find(o => o === i)) {
                    return false;
                }
                return true;
            });

            const ruleTwo = this.ruleTwo(group, this.lastRankFromRule(ruleOne));
            const ruleThree = this.ruleThree(group, this.lastRankFromRule(ruleTwo));
            const allRules = [...ruleOne.result, ...ruleTwo.result, ...ruleThree.result];

            return {
                learningAssets: allRules,
            };
    }

    lastRankFromRule(rule: Kf.RuleResult): string {
        try {
            const { rank } = rule.result[rule.result.length - 1];
            return (rank || 0) + '';
        } catch {
            return 0 + '';
        }
    }

    async getLearningContent(query: KfTarcLearningContentDTO): Promise<KfTarcLearningContentResponse> {
        const { loggedInUserClientId, clientId, successProfileId, locale, outputType } = query;
        let userClientId = clientId || +outputType || loggedInUserClientId;
        return { learningAssets: await this.kfTarcContentRepository.getLearningAssetsByJobId(userClientId, successProfileId, locale) };
    }

    async handleLearningContent(query: KfTarcLearningContentDTO): Promise<KfTarcHandleLearningContentResponse> {
        const content = await this.getLearningContent(query);
        const result = this.validateContent(content);
        return this.mapLearningContent(result.learningAssets);
    }

    async getLearningAssetsByCompsRoleLevels(query: KfTarcLearningContentDTO): Promise<KfTarcLearningAssetsByCompsRoleLevelsRaw> {
        let userClientId = +query.clientId || +query.loggedInUserClientId;
        return this.kfTarcContentRepository.getLearningAssetsByCompsRoleLevelsSP(userClientId, query.spCodes, query.locale);
    }

    async lcPost(body: KfTarcLearningContentBody, query: KfTarcQuery) {
        const behComps = this.addDelimiter(body.behCompCodes, '|');

        const techComps = this.addDelimiter(body.techCompIds, '|');
        let userClientId = +query.clientId || +query.loggedInUserClientId;

        const data = await this.kfTarcContentRepository.getLearningAssetByCompsJobId(
            userClientId,
            behComps,
            techComps,
            body.successprofileId,
            query.locale,
        );

        // const data = postMockResponse;

        return this.mapLearningContentPost(data as any);
    }
}
