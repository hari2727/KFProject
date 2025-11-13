import { locale } from 'moment';
import { QueryProps } from '../../../../common/common.interface';

export interface TranslationsQuery extends QueryProps.Default {
    factorId: string;
    clusterId: string | null;
    competencyModelId: string;
    competencyModelVersion: string;
}

export interface Translation {
    locale: string;
    factorName: string;
    clusterName?: string;
}

export interface TranslationDBResponse {
    LCID: string;
    FactorName: string;
    ClusterName?: string;
}
