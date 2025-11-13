import { IgModel } from './ig-model.i';

export module IgCmsXmlModel {

    export interface Request extends IgModel.Draft {
    }

    export interface Response {
        id: string;
        header: {
            content: {
                reportTitle: string;
                displayName: string;
                reportDate: string;
            };
        };
        footer: {
            config: {
                showPageNumber: string;
            };
            content: {
                copyright: string;
                copyrightGeneric: string;
            };
        };
        sections: {
            frontCover: {
                type: string;
                config: {
                    coverImagePath: string;
                    coverImageFormat: string;
                    clientLogoPosition: string;
                    solutionTextColour: string;
                    titleTextColour: string;
                    subTitleTextColour: string;
                    metadataTextColour: string;
                    metadataDetailsTextColour: string;
                    textInputTextColour: string;
                    footerBarColour: string;
                    displayKornFerryLogo: string;
                    displayTextInputs: string;
                };
                content: {
                    title: string;
                    subTitle: string;
                    solutionName: string;
                    copyright: string;
                    metaData: {
                        organization: NameDescription;
                        reportDate: NameDescription;
                        reportBy: NameDescription;
                    };
                    textInputs: {
                        interviewedBy: NameDescription;
                        interviewedDate: NameDescription;
                    };
                };
            };
            aboutThisInterviewGuide: {
                type: string;
                config: Config;
                components: {
                    title: {
                        type: string;
                        config: {
                            level: string;
                        };
                        content: {
                            text: string;
                        };
                    };
                    intro: {
                        type: string;
                        content: {
                            text: string;
                        };
                    };
                    tableOfContents: {
                        type: string;
                    };
                };
            };
            competencies: {
                type: string;
                config: Config;
                content: {
                    title: string;
                    description: string;
                };
                components: {
                    competencies: {
                        type: string;
                        config: {
                            hideProbes: string;
                            hideLowerAndHigher: string;
                        };
                        content: {
                            title: string;
                            ratingLabel: string;
                            questionsLabel: string;
                            higherLabel: string;
                            lowerLabel: string;
                            probes: {
                                [key: string]: TitleDesc;
                            };
                            scale: {
                                notAtAll: string;
                                underDevelop: string;
                                competent: string;
                                veryStrong: string;
                                outstand: string;
                                noEvidence: string;
                            };
                            definitions: {
                                [key: string]: NameDefinition;
                            };
                            questionContent: {
                                [key: string]: StageCollection;
                            };
                        };
                    };
                };
            };
            interviewSummary: {
                type: string;
                config: {
                    showHeaderFooter: string;
                    showInTableOfContents: string;
                    useTitleAsHeading: string;
                };
                content: {
                    title: string;
                };
                components: {
                    summary: {
                        type: string;
                        config: {
                            hideComments: string;
                            hideRecommendations: string;
                            hideInterviewerData: string;
                        };
                        content: {
                            title: string;
                            ratingLabel: string;
                            scale: {
                                notAtAll: string;
                                underDevelop: string;
                                competent: string;
                                veryStrong: string;
                                outstand: string;
                                noEvidence: string;
                            };
                            interviewedBy: NameDefinition;
                            interviewedDate: NameDefinition;
                            commentsLabel: string;
                            competenciesLabel: string;
                            competenciesDefinitions: {
                                [key: string]: NameDefinition;
                            };
                            traitsLabel: string;
                            TraitsDefinitionCollection: {
                                [key: string]: TraitsDefinitionCollection;
                            };
                            driversLabel: string;
                            driversDefinitions: {
                                [key: string]: NameDefinition;
                            };
                        };
                    };
                };
            };
            Notes: {
                type: string;
                config: {
                    showHeaderFooter: string;
                    showInTableOfContents: string;
                    useTitleAsHeading: string;
                };
                content: {
                    title: string;
                };
                components: {
                    textbox: {
                        type: string;
                        config: {
                            width: string;
                            height: string;
                            multiline: string;
                        };
                    };
                };
            };
            disclaimer: {
                type: string;
                config: {
                    displayAboutKornFerry: string;
                };
                content: {
                    aboutKF: {
                        title: string;
                        desc1: string;
                        copyright: string;
                        disclaimer: string;
                        copyrightGeneric: string;
                    };
                    privacyPolicy: {
                        privacyPolicy: string;
                    };
                    versionDetails: {
                        date: string;
                        contentVersion: string;
                        contentLanguage: string;
                        surveys: string;
                    };
                };
            };
        };
        docMetaData: {
            id: string;
            lang: string;
            tag: string;
        };
    }

    export interface TraitsDefinitionCollection {
        [key: string]: TraitsDefinition;
    }

    export interface TraitsDefinition {
        title: string;
        definition: string;
        longName: string;
        abbreviation: string;
        globalCode: string;
    }

    export interface TitleDesc {
        title: string;
        desc: string;
    }

    export interface NameDefinition {
        name: string;
        definition: string;
    }

    export interface NameDescription {
        name: string;
        definition: string;
    }

    export interface Stage {
        themesPositive: TeamCollection;
        themesNegative: TeamCollection;
        questions: QuestionCollection;
    }

    export interface TeamCollection {
        theme1: string;
        theme2: string;
        theme3: string;
        theme4: string;
        theme5: string;
    }

    export interface QuestionCollection {
        q1: string;
        q3: string;
        q5: string;
        q7: string;
        q9: string;
    }

    export interface StageCollection {
        stage1: Stage;
        stage2: Stage;
        stage3: Stage;
        stage4: Stage;
    }

    export interface Config {
        showHeaderFooter: string;
        showInTableOfContents: string;
        useTitleAsHeading: string;
    }
}

export module IgCmsModel {
    export interface IgCms {
        id?: string,
        lang?: string,
        Message?: string,
        competencies?: Competency[]
    }
    export interface Competency {
        id: string;
        globalCode: string;
        name: string;
        description: string;
        isActive: boolean;
        isCustom: boolean;
        dateModified: string;
        interviewQuestions: IgModel.LevelQuestionary[];
        potentialUnderuseBehaviors: IgModel.LevelQuestionary[];
        onTargetBehaviors: IgModel.LevelQuestionary[];
    }

    export interface IgCmsPublishResponse {
        status?: string | object;
    }

    export interface IgGetTokenResponse {
        success: boolean;
        token?: string;
        message?: string;
    }
}
