export const UCPRawResponseMock = [
    {
        ClientJobID: 954367,
        ManagementLevel: 'Lvl_06',
        Progression: 'Lvl_06_01',
        DemoVersion: 'universal',
        NormCountry: 'GLOBAL',
        NormVersion: 2,
        SliderStartDate: 45391.51060408565,
        SliderAnswerSequence: 1,
        SliderBlock: 'RPO_JP_LIKERT_001',
        SliderQuestion: 'CL_LK5_JAR_03',
        SliderTime: 45391.51060408565,
        SliderAnswer: 5,
        Blocksequence: 1,
        SliderCompletedDate: 45391.51060408565,
        CulturalStartDate: null,
        CulturalAnswerSequence: null,
        CulturalBlock: null,
        CulturalQuestion: null,
        CulturalTime: null,
        CulturalAnswer: null,
        CulturalCompletedDate: null,
    },
    {
        ClientJobID: 954367,
        ManagementLevel: 'Lvl_06',
        Progression: 'Lvl_06_01',
        DemoVersion: 'universal',
        NormCountry: 'GLOBAL',
        NormVersion: 2,
        SliderStartDate: 45391.51060408565,
        SliderAnswerSequence: 1,
        SliderBlock: 'RPO_JP_LIKERT_001',
        SliderQuestion: 'CL_LK5_JAC_03',
        SliderTime: 45391.51060408565,
        SliderAnswer: 4.73,
        Blocksequence: 1,
        SliderCompletedDate: 45391.51060408565,
        CulturalStartDate: null,
        CulturalAnswerSequence: null,
        CulturalBlock: null,
        CulturalQuestion: null,
        CulturalTime: null,
        CulturalAnswer: null,
        CulturalCompletedDate: null,
    },
];

export const UpcJsonMock = {
    engagementAttributes: { managementLevel: 'Lvl_06', progression: 'Lvl_06_01', demoVersion: 'universal', normCountry: 'GLOBAL', normVersion: 2 },
    sections: {
        jobAnalysis: {
            startDate: 45391.51060408565,
            completedDate: 45391.51060408565,
            answers: [
                { answersequence: 1, block: 'RPO_JP_LIKERT_001', question: 'CL_LK5_JAR_03', time: 45391.51060408565, answer: 5, blocksequence: 1 },
                { answersequence: 1, block: 'RPO_JP_LIKERT_001', question: 'CL_LK5_JAC_03', time: 45391.51060408565, answer: 4.73, blocksequence: 1 },
            ],
        },
        companyCulture: { completedDate: 45391.51060408565, startDate: 45391.51060408565, answers: [] },
    },
};

export const UPCAPIResponseMock = {
    content: {
        roleRequirementQA: [
            {
                ucpCode: 'CA_LK5_JAM_03_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JANew_03_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JANew_04_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JAP_02_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JAP_03_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JAR_01_02',
                sliderValue: 67.3234621650499,
            },
            {
                ucpCode: 'CA_LK5_JAA_01_02',
                sliderValue: 60.7700365624208,
            },
            {
                ucpCode: 'CA_LK5_JAC_01_02',
                sliderValue: 60.7700365624208,
            },
            {
                ucpCode: 'CA_LK5_JAC_03_02',
                sliderValue: 60.7700365624208,
            },
            {
                ucpCode: 'CA_LK5_JANew_05_02',
                sliderValue: 60.7700365624208,
            },
            {
                ucpCode: 'CA_LK5_JANew_06_02',
                sliderValue: 60.7700365624208,
            },
            {
                ucpCode: 'CA_LK5_JAR_04_02',
                sliderValue: 57.0379494033254,
            },
            {
                ucpCode: 'CA_LK5_JAS_02_02',
                sliderValue: 57.0379494033254,
            },
            {
                ucpCode: 'CA_LK5_JANew_07_02',
                sliderValue: 57.0379494033254,
            },
            {
                ucpCode: 'CA_LK5_JANew_08_02',
                sliderValue: 57.0379494033254,
            },
            {
                ucpCode: 'CA_LK5_JANew_02_02',
                sliderValue: 74.1873509008372,
            },
            {
                ucpCode: 'CA_LK5_JAU_02_02',
                sliderValue: 74.1873509008372,
            },
            {
                ucpCode: 'CA_LK5_JAP_01_02',
                sliderValue: 66.1277780955807,
            },
            {
                ucpCode: 'CA_LK5_JANew_09_02',
                sliderValue: 69.1592109510131,
            },
        ],
    },
    normInfo: {
        level_norm: 'level_average',
        region_norm: 'region_average',
        industry_norm: 'industry_average',
        function_norm: 'function_average',
        source: 'long-form',
        demo_version: 'universal',
        norm_version: '20240208',
    },
    normName: {
        normRegion: 13,
        normVersion: 3,
        managementLevel: 10,
        demoVersion: 2,
    },
};

export const AssessmentRawResponseMock = [
    {
        ClientJobID: 954367,
        kfLevelGlobalCode: 'Lvl_06_01',
        KFRoleLevelID: 2,
        NormCountry: 'GLOBAL',
        NormVersion: 2,
        UCPCode: 'CL_LK5_JAR_03',
        SliderValue: 5,
        CultureCode: null,
        CulturalValue: null,
    },
    {
        ClientJobID: 954367,
        kfLevelGlobalCode: 'Lvl_06_01',
        KFRoleLevelID: 2,
        NormCountry: 'GLOBAL',
        NormVersion: 2,
        UCPCode: 'CL_LK5_JAC_03',
        SliderValue: 4.73,
        CultureCode: null,
        CulturalValue: null,
    },
];

export const AssessmentAPIResponseMock = {
    responseCode: 'RES.20000',
    responseMessage: 'Success',
    data: {
        sections: [
            {
                id: 4635,
                name: 'Traits',
                description:
                    'Traits are personality characteristics that exert a strong influence on behavior. These include attitudes, such as optimism, and other natural leanings, such as social astuteness.',
                code: 'TRAITS',
                categories: [
                    {
                        id: '49097',
                        name: 'Traits',
                        description: 'Traits',
                        subCategories: [
                            {
                                id: 425501,
                                definition: 'A tendency to work intensely to achieve and exceed difficult standards.',
                                type: 'C',
                                globalCode: 'NA',
                                descriptions: [
                                    {
                                        name: 'Need for Achievement',
                                        level: 8,
                                        score: 7.64022682923589,
                                        description: 'A tendency to work intensely to achieve and exceed difficult standards.',
                                    },
                                ],
                            },
                            {
                                id: 425487,
                                definition:
                                    'The extent to which a person is likely to tackle problems in a novel way, see patterns in complex information, and pursue deep understanding.',
                                type: 'C',
                                globalCode: 'CU',
                                descriptions: [
                                    {
                                        name: 'Curiosity',
                                        level: 7,
                                        score: 7.21044162878407,
                                        description:
                                            'The extent to which a person is likely to tackle problems in a novel way, see patterns in complex information, and pursue deep understanding.',
                                    },
                                ],
                            },
                            {
                                id: 425504,
                                definition: 'The degree of consistency between a person’s words and actions.',
                                type: 'C',
                                globalCode: 'CR',
                                descriptions: [
                                    {
                                        name: 'Credibility',
                                        level: 7,
                                        score: 7.18930665819783,
                                        description: "The degree of consistency between a person's words and actions.",
                                    },
                                ],
                            },
                            {
                                id: 425489,
                                definition: 'Comfort with uncertain, vague, or contradictory information that prevents a clear understanding or direction.',
                                type: 'C',
                                globalCode: 'TA',
                                descriptions: [
                                    {
                                        name: 'Tolerance of Ambiguity',
                                        level: 7,
                                        score: 6.92299653845678,
                                        description:
                                            'Comfort with uncertain, vague, or contradictory information that prevents a clear understanding or direction.',
                                    },
                                ],
                            },
                            {
                                id: 425493,
                                definition: 'The ability to stay calm and poised in stressful, difficult, or ambiguous situations.',
                                type: 'C',
                                globalCode: 'CP',
                                descriptions: [
                                    {
                                        name: 'Composure',
                                        level: 7,
                                        score: 6.89702133668213,
                                        description: 'The ability to stay calm and poised in stressful, difficult, or ambiguous situations.',
                                    },
                                ],
                            },
                            {
                                id: 425486,
                                definition: 'Comfort with unanticipated changes of direction or approach.',
                                type: 'C',
                                globalCode: 'AD',
                                descriptions: [
                                    {
                                        name: 'Adaptability',
                                        level: 7,
                                        score: 6.83224081434281,
                                        description: 'Comfort with unanticipated changes of direction or approach.',
                                    },
                                ],
                            },
                            {
                                id: 425494,
                                definition:
                                    'The degree to which a person tends to disregard disappointment, is satisfied with who they are, and expects the future to be bright.',
                                type: 'C',
                                globalCode: 'OP',
                                descriptions: [
                                    {
                                        name: 'Optimism',
                                        level: 7,
                                        score: 6.59964959025925,
                                        description: 'The degree to which people are comfortable with themselves and positive about life.',
                                    },
                                ],
                            },
                            {
                                id: 425503,
                                definition: 'The degree to which a person is convinced that they control the course of events in their life.',
                                type: 'C',
                                globalCode: 'CF',
                                descriptions: [
                                    {
                                        name: 'Confidence',
                                        level: 7,
                                        score: 6.58808478098552,
                                        description: 'The degree to which a person is convinced that they control the course of events in their lives.',
                                    },
                                ],
                            },
                            {
                                id: 425496,
                                definition:
                                    'A desire to consider and explore differences in perspective, thought, and experience of people from a variety of backgrounds.',
                                type: 'S',
                                globalCode: 'OD',
                                descriptions: [
                                    {
                                        name: 'Openness to Differences',
                                        level: 7,
                                        score: 6.57360766787016,
                                        description:
                                            'A desire to consider and explore differences in perspective, thought, and experience of persons from a variety of backgrounds.',
                                    },
                                ],
                            },
                            {
                                id: 425484,
                                definition: 'The natural inclination to engage with and interact with others.',
                                type: 'S',
                                globalCode: 'SO',
                                descriptions: [
                                    {
                                        name: 'Sociability',
                                        level: 6,
                                        score: 6.48146993568113,
                                        description: 'The natural inclination to engage with and interact with others.',
                                    },
                                ],
                            },
                            {
                                id: 425490,
                                definition: 'A willingness to take a stand or to take chances based on limited information.',
                                type: 'S',
                                globalCode: 'RI',
                                descriptions: [
                                    {
                                        name: 'Risk-Taking',
                                        level: 6,
                                        score: 6.38481341608736,
                                        description: 'A willingness to take a stand or take chances based on limited information.',
                                    },
                                ],
                            },
                            {
                                id: 425502,
                                definition:
                                    'A tendency toward passionate and steadfast pursuit of personally valued long-term or lifetime goals, despite obstacles, discouragement, or distraction.',
                                type: 'S',
                                globalCode: 'PE',
                                descriptions: [
                                    {
                                        name: 'Persistence',
                                        level: 6,
                                        score: 6.36914165317114,
                                        description:
                                            'A tendency toward passionate and steadfast pursuit of long-term goals, in spite of obstacles, discouragement, or distraction.',
                                    },
                                ],
                            },
                            {
                                id: 425499,
                                definition: 'An expectation of honesty and forthrightness on the part of oneself and others.',
                                type: 'S',
                                globalCode: 'TR',
                                descriptions: [
                                    {
                                        name: 'Trust',
                                        level: 6,
                                        score: 6.16277818033332,
                                        description: 'An expectation of honesty and forthrightness on the part of oneself and others.',
                                    },
                                ],
                            },
                            {
                                id: 425483,
                                definition: 'The degree to which a person enjoys taking charge and directing others.',
                                type: 'S',
                                globalCode: 'AS',
                                descriptions: [
                                    {
                                        name: 'Assertiveness',
                                        level: 6,
                                        score: 6.1248883698554,
                                        description: 'The degree to which people enjoy taking charge and directing others.',
                                    },
                                ],
                            },
                            {
                                id: 425498,
                                definition: 'A preference for aligning with a larger team or organization toward a common goal.',
                                type: 'S',
                                globalCode: 'AF',
                                descriptions: [
                                    {
                                        name: 'Affiliation',
                                        level: 6,
                                        score: 6.056390326803,
                                        description: 'A preference for aligning with a larger team or organization toward a common goal.',
                                    },
                                ],
                            },
                            {
                                id: 425481,
                                definition: 'Being attuned to others’ feelings, motivations, and concerns.',
                                type: 'S',
                                globalCode: 'EM',
                                descriptions: [
                                    {
                                        name: 'Empathy',
                                        level: 6,
                                        score: 5.92723043795161,
                                        description: "Being attuned to others' feelings,motivations and concerns.",
                                    },
                                ],
                            },
                            {
                                id: 425492,
                                definition: 'Maintaining broad, receptive, and non-judgmental attention to present experience.',
                                type: 'S',
                                globalCode: 'SS',
                                descriptions: [
                                    {
                                        name: 'Situational Self-Awareness',
                                        level: 6,
                                        score: 5.8993451342894,
                                        description: "The ability to stay attuned to one's own experiences, motivations, and reactions in the present moment.",
                                    },
                                ],
                            },
                            {
                                id: 425482,
                                definition: 'The ability to motivate and persuade others.',
                                type: 'S',
                                globalCode: 'IN',
                                descriptions: [
                                    {
                                        name: 'Influence',
                                        level: 6,
                                        score: 5.7459501253874,
                                        description: 'The ability to motivate and persuade others.',
                                    },
                                ],
                            },
                            {
                                id: 425497,
                                definition: 'The degree to which a person is seen as courteous, free from self-absorption, and easy to get along with.',
                                type: 'S',
                                globalCode: 'HU',
                                descriptions: [
                                    {
                                        name: 'Humility',
                                        level: 6,
                                        score: 5.73147182380756,
                                        description:
                                            'The degree to which a person is seen as courteous, free from self-absorption, and easy to get along with.',
                                    },
                                ],
                            },
                            {
                                id: 425488,
                                definition: 'Preference for organization, procedure, and exactitude.',
                                type: 'S',
                                globalCode: 'FO',
                                descriptions: [
                                    {
                                        name: 'Focus',
                                        level: 5,
                                        score: 5.16919282985521,
                                        description: 'Preference for organization, procedure, and exactitude.',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                id: 5409,
                name: 'Drivers',
                description:
                    "Drivers are the preferences, values, and motivations that influence a person's career aspirations. They lie at the heart of critical questions: What is important to me? What do I find rewarding?",
                code: 'DRIVERS',
                categories: [
                    {
                        id: '50645',
                        name: 'Drivers',
                        description: 'Drivers',
                        subCategories: [
                            {
                                id: 431134,
                                definition: 'Motivated by achievement in the face of tough obstacles.',
                                type: 'C',
                                globalCode: 'CHAL',
                                descriptions: [
                                    {
                                        name: 'Challenge',
                                        level: 7,
                                        score: 6.52753878652753,
                                        description: 'Motivated by achievement in the face of tough obstacles.',
                                    },
                                ],
                            },
                            {
                                id: 431132,
                                definition: 'A preference for work-related interdependence, group decision making, and pursuing shared goals.',
                                type: 'C',
                                globalCode: 'COLL',
                                descriptions: [
                                    {
                                        name: 'Collaboration',
                                        level: 6,
                                        score: 6.43180860753357,
                                        description: 'A preference for work-related interdependence, group decision making, and pursuing shared goals.',
                                    },
                                ],
                            },
                            {
                                id: 431136,
                                definition: 'Prefers to work freely, autonomously, and with limited involvement by others.',
                                type: 'C',
                                globalCode: 'INDY',
                                descriptions: [
                                    {
                                        name: 'Independence',
                                        level: 6,
                                        score: 6.30774010882938,
                                        description: 'Prefers an entrepreneurial approach and limited organizational constraints.',
                                    },
                                ],
                            },
                            {
                                id: 431133,
                                definition: 'Motivated to seek influence, recognition, and increasing levels of responsibility.',
                                type: 'C',
                                globalCode: 'POWR',
                                descriptions: [
                                    {
                                        name: 'Power',
                                        level: 6,
                                        score: 5.57095496133508,
                                        description: 'Motivated to seek influence, recognition, and increasing levels of responsibility.',
                                    },
                                ],
                            },
                            {
                                id: 431131,
                                definition: 'Motivated to integrate work and life in a sustainable, enjoyable, and meaningful way.',
                                type: 'C',
                                globalCode: 'BALA',
                                descriptions: [
                                    {
                                        name: 'Balance',
                                        level: 4,
                                        score: 4.48973768712946,
                                        description: 'Motivated to integrate work and life in a sustainable, enjoyable, and meaningful way.',
                                    },
                                ],
                            },
                            {
                                id: 431135,
                                definition: 'A preference for process-oriented, structured, and stable work environments.',
                                type: 'C',
                                globalCode: 'STRC',
                                descriptions: [
                                    {
                                        name: 'Structure',
                                        level: 4,
                                        score: 3.82976495720895,
                                        description: 'A preference for process-oriented, structured, and stable work environments.',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

export const AssesmentAPIPayloadMock = {
    driversCultureRankings: [],
    roleRequirementQA: [
        { ucpCode: 'CL_LK5_JAR_03', sliderValue: 5 },
        { ucpCode: 'CL_LK5_JAC_03', sliderValue: 4.73 },
    ],
    kfLevelGlobalCode: 'Lvl_06_01',
    normCountry: 'GLOBAL',
    normVersion: 2,
    kfRoleLevelId: 2,
    jobId: 954367,
};
