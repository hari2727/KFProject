import { IgDraftTransformer } from '../generate-draft/ig-draft-generator';
import { CustomContentModel as Cc, IgModel as S } from '../model/ig-model.i';
import { IG_CUSTOM_CONTENT_MODEL } from '../database/ig-mongoose.config';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { okResponse } from '../../../common/common.utils';
import { CustomContent } from '../model/ig-mssql.i';
import { IgStatus } from '../model/ig-status.enum';
import { LogErrors } from '../../../_shared/log/log-errors.decorator';
import { Nullable } from '../../../_shared/types';
import { MongoDbConnectionName } from '../../../models/mongo-db.const';

@Injectable()
export class IgCustomCompetenciesService {

    constructor(
        protected draftTransformer: IgDraftTransformer,
        @InjectModel(IG_CUSTOM_CONTENT_MODEL, MongoDbConnectionName.SuccessProfile)
        protected modelCustCont: Model<Cc.CompetencyRoot>,
    ) {
    }

    @LogErrors()
    async getIgCustomContent(clientId: number, locale: string): Promise<Nullable<Cc.CompetencyRoot[]>> {
            const customContent = await this.modelCustCont.find({ clientId: clientId, locale: locale }).lean();
            if (customContent?.length > 1) {
                customContent.sort((a, b) => (a.competency.name > b.competency.name ? 1 : b.competency.name > a.competency.name ? -1 : 0));
            }
            return customContent;
    }

    @LogErrors()
    async updateCustomCompetencyData(custCont: S.Competency, clientId: number, locale: string, userId: string): Promise<any> {
            const custCompetency = this.draftTransformer.enrichCompetencyPayload(custCont, userId);
            const competencyRoot: Cc.CompetencyRoot = { clientId: clientId, locale: locale, status: IgStatus.MODIFIED, competency: custCompetency };
            await this.modelCustCont.updateOne({ clientId: clientId, locale: locale, 'competency.id': custCont.id }, competencyRoot);
            return okResponse;
    }

    @LogErrors()
    protected async updateCustomCompetencyDetails(custCont: CustomContent, clientId: number, locale: string): Promise<any> {
            await this.modelCustCont.updateOne(
                { clientId: clientId, locale: locale, 'competency.id': custCont.CompetencyGUID },
                { 'competency.name': custCont.CompetencyName, 'competency.description ': custCont.CompetencyDescription },
            );
            return okResponse;
    }

    @LogErrors()
    protected async insertEmptyCustomCompetency(custCont: CustomContent, clientId: number, locale: string, userId: string): Promise<any> {
            const emptyCustComp = this.draftTransformer.generateEmptyCompetency(
                custCont.CompetencyGUID,
                custCont.CompetencyGUID,
                custCont.CompetencyName,
                custCont.CompetencyDescription,
                true,
                userId,
            );
            const competencyRoot: Cc.CompetencyRoot = { clientId: clientId, locale: locale, status: IgStatus.MODIFIED, competency: emptyCustComp };
            await this.modelCustCont.insertMany(competencyRoot);
            return okResponse;
    }

    @LogErrors()
    async mergeCustomCompetencies(customContent: CustomContent[], clientId: number, locale: string, userId: string): Promise<any> {
            for (const custCont of customContent) {
                if (+custCont.CustomCompetencyFlag) {
                    const savedCustomContent = await this.getIgCustomContent(clientId, locale);
                    if (savedCustomContent.find(e => e.competency.id === custCont.CompetencyGUID)) {
                        await this.updateCustomCompetencyDetails(custCont, clientId, locale);
                    } else {
                        await this.insertEmptyCustomCompetency(custCont, clientId, locale, userId);
                    }
                }
                return okResponse;
            }
    }
}
