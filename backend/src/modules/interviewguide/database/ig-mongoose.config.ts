import { Schema } from 'mongoose';

export const INTERVIEW_GUIDE_MODEL = 'interviewGuide';
export const IG_CUSTOM_CONTENT_MODEL = 'interviewGuideCustomContent';

const Competency = new Schema({
    id: String,
    globalCode: String,
    name: String,
    description: String,
    isActive: Boolean,
    isCustom: Boolean,
    dateModified: String,
    modifiedBy: Number,
    interviewQuestions: Number,
    potentialUnderuseBehaviors: Number,
    onTargetBehaviors: Number,
    interviewQuestionLevels : {},
    potentialUnderuseBehaviorLevels: {},
    onTargetBehaviorLevels: {}
}, { _id : false });

const CompetencyRoot = new Schema(
    {
        status: String,
        competency: Competency
    }, {
        _id : false
    }
);

export const IgMongooseSchema = new Schema({
    clientId: Number,
    locale: String,
    createdOn: String,
    createdBy: Number,
    status: String,
    competencies: [CompetencyRoot]
});

export const IgCustContMongooseSchema = new Schema({
    clientId: Number,
    locale: String,
    status: String,
    competency: Competency
});