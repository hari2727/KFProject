export class KfTracAryaAuthenticate {
    StatusCode: string;
    Status: string;
    AuthToken: string;
    Reason: null;
}

export namespace KfTracArya {
    export class Response {
        Total: number;
        States: State[];
        CompaniesStats: CompaniesStat[];
        IndustriesStats: IndustriesStat[];
        SkillsStats: SkillsStat[];
        FeederTitlesStats: any[];
        SimilarTitlesStats: SimilarTitlesStat[];
    }

    export class CompaniesStat {
        CompanyName: string;
        Count: number;
    }

    export class IndustriesStat {
        IndustryName: string;
        Count: number;
    }

    export class SimilarTitlesStat {
        SimilarTitle: string;
        Count: number;
    }

    export class SkillsStat {
        SkillName: string;
        Count: number;
    }

    export class State {
        StateName: string;
        Count: number;
        StateCode: string;
    }
}
