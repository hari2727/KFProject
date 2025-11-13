import cluster from 'cluster';
import { locale } from 'moment';

export const LanguageTranslationsMocK = [
    {
        LCID: 'en',
        FactorName: 'FactorName1',
        ClusterName: 'ClusterName1',
    },
];

export const TranslationsQuery = {
    competencyModelId: '1',
    competencyModelVersion: '1',
    factorId: '1',
    clusterId: '1',
    locale: 'en',
    loggedInUserClientId: 1,
    userId: 1,
};

export const ResponseWithOutClusterName = [
    {
        locale: 'en',
        factorName: 'FactorName1',
    },
];

export const ResponseWithClusterName = [
    {
        locale: 'en',
        factorName: 'FactorName1',
        clusterName: 'ClusterName1',
    },
];
