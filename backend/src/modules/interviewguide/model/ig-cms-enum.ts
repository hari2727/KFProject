export enum CmsApi {
    AUTHENTICATE = '/authenticate',
    IG = '/internal/caas/publications/interviewGuides/',
    GET_IG_CLIENT_ID_PREFIX = 'projects.internal.products.reports.clients.',
    CLIENT_ID_POSTFIX = '.customInterviewGuide',
    GET_IG_BASE_CONTENT = 'projects.internal.products.reports.interviewGuide.base',
    BASE_SINGLE_COMP = '/competencies/'
}

export enum CmsEnvs {
    DEV = 'dev',
    'DEV-INT' = 'dev',
    TEST = 'playground',
    STAGE = 'qa',
    PROD = 'prod',
    'PROD-CN' = 'prod',
    'PROD-EU' = 'prod',
    'PROD-CN-BEIJING' = 'prod',
}

export enum CompetencyType {
    BASE = 'base',
    CUSTOM = 'custom',
    STANDART = 'standart'
}
