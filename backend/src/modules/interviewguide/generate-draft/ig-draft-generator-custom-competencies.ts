import { CustomContentModel as Cc, IgModel as S } from '../model/ig-model.i';
import { clone } from '../../../common/common.utils';
import { Injectable } from '@nestjs/common';
import { CustomContent } from '../model/ig-mssql.i';
import { IgDraftTransformer } from './ig-draft-generator';

@Injectable()
export class IgDraftTransformerCustomCompetencies {

    constructor(protected transformer: IgDraftTransformer) {}

    generateCustomContentDraft(
        clientId: number,
        locale: string,
        userId: string,
        igDraft: S.Draft,
        igCms: S.CompetencyRoot[],
        cusomContent: CustomContent[],
    ): S.Draft {
        const generatedDraft = this.transformer.generateDraftTemplate(clientId, locale, userId, igDraft, igCms);
        const draftWithCustComps = this.enrichWithEmptyCustomComps(generatedDraft, userId, cusomContent);
        return this.updateStandartCompsNames(draftWithCustComps, cusomContent);
    }

    protected enrichWithEmptyCustomComps(draft: S.Draft, userId: string, cusomContent: CustomContent[]): S.Draft {
        const draftToSave = clone<S.Draft>(draft);
        cusomContent.forEach(cC => {
            if (+cC.CustomCompetencyFlag) {
                const id = cC.GlobalSubCategoryCode || cC.CompetencyGUID;
                const competency: S.Competency = this.transformer.generateEmptyCompetency(
                    id,
                    id,
                    cC.CompetencyName,
                    cC.CompetencyDescription,
                    !!cC.CustomCompetencyFlag,
                    userId,
                );
                draftToSave.competencies.push({ status: S.Status.MODIFIED, competency: competency });
            }
        });
        return draftToSave;
    }

    enrichDraftWithCustomComps(draft: S.Draft, customContent: Cc.CompetencyRoot[]): S.Draft {
        const draftToSave = clone<S.Draft>(draft);
        customContent.forEach(custComp => {
            const compRoot: S.CompetencyRoot = { status: custComp.status, competency: custComp.competency };
            draftToSave.competencies.push(compRoot);
        });
        return draftToSave;
    }

    protected updateStandartCompsNames(draft: S.Draft, cusomContent: CustomContent[]): S.Draft {
        //this probably should be done in different place
        const draftToSave = clone<S.Draft>(draft);
        cusomContent.forEach(cC => {
            if (!cC.CustomCompetencyFlag) {
                const compIndex = draftToSave.competencies.findIndex(obj => obj.competency.id === (cC.GlobalSubCategoryCode || cC.CompetencyGUID));
                if (compIndex !== -1) draftToSave.competencies[compIndex].competency.name = cC.CompetencyName;
            }
        });
        return draftToSave;
    }
}
