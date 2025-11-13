import { Injectable } from "@nestjs/common";
import { IgSkill, IgSkillDetachedQuestion, IgSkillDTO, IgSkillQuestionDTO } from "./skills-service.types";
import { QuestionCategory, QuestionsState } from "./skills.const";

@Injectable()
export class IgSkillsMapperService {

    mapSkillDTO(dto: IgSkillDTO): IgSkill {
        return {
            id: dto.id,
            globalCode: dto.code,
            name: dto.name || dto.code,
            description: dto.description || dto.code,
            onTargetBehaviors: dto.positiveBehaviourCount,
            potentialUnderuseBehaviors: dto.negativeBehaviourCount,
            interviewQuestions: dto.questionareCount,
            isActive: dto.isActive,
            isCustom: dto.isCustom,
            dateModified: dto.modifiedOn || null,
        };
    }

    mapSkillQuestionDTO(dto: IgSkillQuestionDTO): IgSkillDetachedQuestion {
        return {
            clientId: dto.clientId,
            skillId: dto.skillId,
            id: dto.id,
            code: dto.code,
            type: this.detectQuestionCategory(dto.type),
            level: dto.level,
            description: dto.description,
            status: this.detectQuestionsState(dto.status),
            isActive: dto.isActive,
            isCustom: dto.isCustom,
            dateModified: dto.modifiedOn,
        };
    }

    detectQuestionCategory(value: string): QuestionCategory {
        const _value = value.toLowerCase();
        return (
            _value.includes('positive') ? QuestionCategory.Positive :
                _value.includes('negative') ? QuestionCategory.Negative :
                    QuestionCategory.Questionnaire
        );
    }

    detectQuestionsState(value: string | null): QuestionsState {
        const _value = value?.toLowerCase();
        return (
            (!_value || _value.includes('base')) ? QuestionsState.Original :
                QuestionsState.Modified
        );
    }
}
