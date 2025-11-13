export enum SkillsRoute {
    BASE = 'advanced-skills',

    JOB_CATEGORY = '/jobcategory',
    LANGUAGES = '/languages',
    LEGACY_LANGUAGES = '/legacy-languages',
    NEW_SKILLS = '/newskills',
    GET_TECHNICAL_COMPETENCIES = '/getTechnicalCompetencies',
    ID = '/:id',
    TECHNICAL_COMPETENCY_MODEL = '/technicalcompetencymodel',
    
    // New routes
    PUBLISH = '/publish',
    OLD_MODELS = '/old-models',
    STATUS = '/status',
    SKILL_ID = '/:skillId',
    MODELS = '/newskills-models',
    PUBLISH_SKILLS = '/publish',
    OLD_MODELS_FOR_SKILLS_BY_MODEL_ID = '/oldskills-models/:id',
    UPDATE_MODEL_ITEM_STATUS = '/action/update-technical-competency-model-status',
    UPDATE_MODEL = '/action/update-technical-competency-model/:skillId',
    SEARCH_FILTER= '/search-filter'
}
