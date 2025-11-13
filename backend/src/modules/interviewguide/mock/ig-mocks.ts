import { IgCmsModel } from '../model/ig-cms-model.i';
import { IgModel } from '../model/ig-model.i';
import { IgStatus } from '../model/ig-status.enum';

export module IgMock {
    export const expectedInterviewQuestionLevel = {
        id: 'TJLH-XSQI-DRVK-WWHF',
        description: 'Give me an example of your typical problem-solving approach.',
        isActive: false,
        isCustom: true,
        levels: [
            { globalCode: '1', isApplicable: false, isCustom: false },
            { globalCode: '2', isApplicable: true, isCustom: true },
            { globalCode: '3', isApplicable: true, isCustom: false },
            { globalCode: '4', isApplicable: true, isCustom: false },
        ],
    };

    export const igCmsToken: IgCmsModel.IgGetTokenResponse = {
        success: true,
        token: 'tokenExample',
    };

    export const igCmsResponse: IgCmsModel.IgCms = {
        'id': 'projects.internal.products.reports.interviewGuide.base',
        competencies: [
            {
                'id': 'af90e423-2e72-4eb2-8005-f5df3f1d8688',
                'globalCode': 'bin',
                'name': 'Business Insight',
                'description': 'Applying knowledge of business and the marketplace to advance the organization’s goals.',
                isActive: true,
                isCustom: false,
                'dateModified': '1667819974444',
                interviewQuestions: [
                    {
                        'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                        'description': 'What are three trends in your current industry?',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                        'description': 'Tell me about a successful business and why you think it is successful.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                        'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                        'description': 'Tell me about a failing business and why you think it is struggling.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                        'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                        'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
                potentialUnderuseBehaviors: [
                    {
                        'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                        'description': 'Doesn’t understand how businesses work.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                        'description': 'Not interested in broad business issues or trends.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                        'description': 'Doesn’t understand the relationship between different business elements.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                        'description': 'Doesn’t apply business knowledge and information.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                        'description': 'Too internally focused on only their organization.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                        description: "Doesn't ensure that the team understands broad business issues or trends.",
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                        'description': 'Doesn’t leverage the relationship between different business elements.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                        'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                        description: "Doesn't ensure that the organization understands broad business issues or trends.",
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                        'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
                onTargetBehaviors: [
                    {
                        'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                        'description': 'Understands how businesses work.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                        'description': 'Understands the relationship between different aspects of business.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                        'description': 'Aware of current business trends.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                        'description': 'Applies business knowledge to job.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                        'description': 'Understands the competition.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                        'description': 'Ensures that the team is aware of current business trends.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                        'description': 'Applies and shares business knowledge related to organization/industry.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                        'description': 'Leverages insights for competitive advantage.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                        'description': 'Ensures that the organization is aware of current business trends.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
            },
            {
                'id': 'cfa238d3-69df-4d6c-a068-bf7fbcb31397',
                'globalCode': 'mcx',
                'name': 'Manages Complexity',
                'description': 'Making sense of complex, high quantity, and sometimes contradictory information to effectively solve problems.',
                isActive: true,
                isCustom: false,
                'dateModified': '1667819974444',
                interviewQuestions: [
                    {
                        'id': '980b8836-0705-4c84-b144-edf1de08423f',
                        'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                        'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                        'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                        'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '53fb139a-1c18-441b-b702-c04e21481782',
                        'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ]
                    },
                    {
                        'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                        'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                        'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                        'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                        'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                        'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                        'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                        'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
                potentialUnderuseBehaviors: [
                    {
                        'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                        'description': 'Sees things as more simple than they are.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                        'description': 'Doesn’t take time to define the essence of the problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            7,
                            8
                        ]
                    },
                    {
                        'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                        'description': 'Draws on limited sources of information.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ]
                    },
                    {
                        'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                        'description': 'Allows intuition to override the facts.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                        description: "Doesn't apply systematic problem-solving methods.",
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                        'description': 'Doesn’t take time to help people define the essence of the problem.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                        description: "Doesn't stimulate critical thinking in others.",
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                        'description': 'Draws on limited sources of information and data analysis.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                        description: "Doesn't recognize complex challenges that may emerge.",
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
                onTargetBehaviors: [
                    {
                        'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                        'description': 'Clearly defines the problem before acting.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                        'description': 'Can see root causes.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                        'description': 'Explores multiple sources for information.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ]
                    },
                    {
                        'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                        'description': 'Understands what’s relevant/significant and what isn’t.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6
                        ]
                    },
                    {
                        'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                        'description': 'Can evaluate the consequences of different options.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4
                        ]
                    },
                    {
                        'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                        'description': 'Ensures that people clearly define the problem before acting.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                        'description': 'Helps others see root causes.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8
                        ]
                    },
                    {
                        'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                        'description': 'Coaches others to evaluate consequences of different options.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6
                        ]
                    },
                    {
                        'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                        'description': 'Approaches problem solving from a systems perspective.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                        'description': 'Synthesizes information from multiple sources.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                        'description': 'Deploys resources for effective information gathering and data analysis.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                    {
                        'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                        'description': 'Anticipates complex challenges that the organization may face.',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8
                        ]
                    },
                ],
            },
        ],
    };

    export const igCmsMappedCompBin: IgModel.Competency = {
        "id": "af90e423-2e72-4eb2-8005-f5df3f1d8688",
        "globalCode": "bin",
        "name": "Business Insight",
        "description": "Applying knowledge of business and the marketplace to advance the organization’s goals.",
        "isActive": true,
        "isCustom": false,
        "dateModified": "1667819974444",
        "interviewQuestionLevels": {
            "1": [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '2': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '3': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '4': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '5': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '6': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '7': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                    'description': 'What are three trends in your current industry?',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                    'description': 'Tell me about a successful business and why you think it is successful.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                    'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                    'description': 'Tell me about a failing business and why you think it is struggling.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                    'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        potentialUnderuseBehaviorLevels: {
            '1': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                    'description': 'Not interested in broad business issues or trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                    'description': 'Doesn’t understand the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                    'description': 'Doesn’t apply business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '2': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                    'description': 'Not interested in broad business issues or trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                    'description': 'Doesn’t understand the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                    'description': 'Doesn’t apply business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '3': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                    'description': 'Not interested in broad business issues or trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                    'description': 'Doesn’t understand the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                    'description': 'Doesn’t apply business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '4': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                    'description': 'Not interested in broad business issues or trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                    'description': 'Doesn’t understand the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                    'description': 'Doesn’t apply business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '5': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                    description: "Doesn't ensure that the team understands broad business issues or trends.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                    'description': 'Doesn’t leverage the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                    'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '6': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                    description: "Doesn't ensure that the team understands broad business issues or trends.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                    'description': 'Doesn’t leverage the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                    'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '7': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                    'description': 'Doesn’t leverage the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                    description: "Doesn't ensure that the organization understands broad business issues or trends.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                    'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                    'description': 'Doesn’t understand how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                    'description': 'Too internally focused on only their organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                    'description': 'Doesn’t leverage the relationship between different business elements.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                    description: "Doesn't ensure that the organization understands broad business issues or trends.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                    'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        onTargetBehaviorLevels: {
            '1': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                    'description': 'Aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                    'description': 'Applies business knowledge to job.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                    'description': 'Understands the competition.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '2': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                    'description': 'Aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                    'description': 'Applies business knowledge to job.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                    'description': 'Understands the competition.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '3': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                    'description': 'Aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                    'description': 'Applies business knowledge to job.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                    'description': 'Understands the competition.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '4': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                    'description': 'Aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                    'description': 'Applies business knowledge to job.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                    'description': 'Understands the competition.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '5': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                    'description': 'Ensures that the team is aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                    'description': 'Applies and shares business knowledge related to organization/industry.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                    'description': 'Leverages insights for competitive advantage.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '6': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                    'description': 'Ensures that the team is aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                    'description': 'Applies and shares business knowledge related to organization/industry.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                    'description': 'Leverages insights for competitive advantage.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
            ],
            '7': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                    'description': 'Applies and shares business knowledge related to organization/industry.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                    'description': 'Leverages insights for competitive advantage.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                    'description': 'Ensures that the organization is aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                    'description': 'Understands how businesses work.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                    'description': 'Understands the relationship between different aspects of business.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                    'description': 'Applies and shares business knowledge related to organization/industry.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                    'description': 'Leverages insights for competitive advantage.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                    'description': 'Ensures that the organization is aware of current business trends.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        interviewQuestions: 6,
        potentialUnderuseBehaviors: 10,
        onTargetBehaviors: 9
    };

    export const igCmsMappedCompMcx: IgModel.Competency = {
        'id': 'cfa238d3-69df-4d6c-a068-bf7fbcb31397',
        'globalCode': 'mcx',
        'name': 'Manages Complexity',
        'description': 'Making sense of complex, high quantity, and sometimes contradictory information to effectively solve problems.',
        isActive: true,
        isCustom: false,
        'dateModified': '1667819974444',
        interviewQuestionLevels: {
            '1': [
                {
                    'id': '980b8836-0705-4c84-b144-edf1de08423f',
                    'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                    'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                    'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '2': [
                {
                    'id': '980b8836-0705-4c84-b144-edf1de08423f',
                    'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                    'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                    'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '3': [
                {
                    'id': '980b8836-0705-4c84-b144-edf1de08423f',
                    'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                    'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                    'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '4': [
                {
                    'id': '980b8836-0705-4c84-b144-edf1de08423f',
                    'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                    'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                    'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
            ],
            '5': [
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                    'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                    'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                    'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '6': [
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '53fb139a-1c18-441b-b702-c04e21481782',
                    'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                    'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                    'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                    'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '7': [
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                    'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                    'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                    'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                    'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                    'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                    'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                    'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                    'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                    'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        potentialUnderuseBehaviorLevels: {
            '1': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                    description: "Doesn't apply systematic problem-solving methods.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '2': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                    description: "Doesn't apply systematic problem-solving methods.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '3': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                    description: "Doesn't apply systematic problem-solving methods.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '4': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                    description: "Doesn't apply systematic problem-solving methods.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '5': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                    'description': 'Doesn’t take time to help people define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                    description: "Doesn't stimulate critical thinking in others.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '6': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                    'description': 'Draws on limited sources of information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                    'description': 'Doesn’t take time to help people define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                    description: "Doesn't stimulate critical thinking in others.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '7': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                    'description': 'Draws on limited sources of information and data analysis.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                    description: "Doesn't recognize complex challenges that may emerge.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                    'description': 'Sees things as more simple than they are.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                    'description': 'Doesn’t take time to define the essence of the problem.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        7,
                        8
                    ]
                },
                {
                    'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                    'description': 'Allows intuition to override the facts.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                    'description': 'Draws on limited sources of information and data analysis.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                    description: "Doesn't recognize complex challenges that may emerge.",
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        onTargetBehaviorLevels: {
            '1': [
                {
                    'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                    'description': 'Clearly defines the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                    'description': 'Can see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                    'description': 'Can evaluate the consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '2': [
                {
                    'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                    'description': 'Clearly defines the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                    'description': 'Can see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                    'description': 'Can evaluate the consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '3': [
                {
                    'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                    'description': 'Clearly defines the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                    'description': 'Can see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                    'description': 'Can evaluate the consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '4': [
                {
                    'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                    'description': 'Clearly defines the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                    'description': 'Can see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                    'description': 'Can evaluate the consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4
                    ]
                },
            ],
            '5': [
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                    'description': 'Ensures that people clearly define the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                    'description': 'Helps others see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                    'description': 'Coaches others to evaluate consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '6': [
                {
                    'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                    'description': 'Explores multiple sources for information.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                    'description': 'Understands what’s relevant/significant and what isn’t.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6
                    ]
                },
                {
                    'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                    'description': 'Ensures that people clearly define the problem before acting.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
                {
                    'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                    'description': 'Helps others see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                    'description': 'Coaches others to evaluate consequences of different options.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6
                    ]
                },
            ],
            '7': [
                {
                    'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                    'description': 'Helps others see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                    'description': 'Approaches problem solving from a systems perspective.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                    'description': 'Synthesizes information from multiple sources.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                    'description': 'Deploys resources for effective information gathering and data analysis.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                    'description': 'Anticipates complex challenges that the organization may face.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
            '8': [
                {
                    'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                    'description': 'Helps others see root causes.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        5,
                        6,
                        7,
                        8
                    ]
                },
                {
                    'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                    'description': 'Approaches problem solving from a systems perspective.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                    'description': 'Synthesizes information from multiple sources.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                    'description': 'Deploys resources for effective information gathering and data analysis.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
                {
                    'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                    'description': 'Anticipates complex challenges that the organization may face.',
                    isActive: true,
                    isCustom: false,
                    'levels': [
                        7,
                        8
                    ]
                },
            ],
        },
        interviewQuestions: 12,
        potentialUnderuseBehaviors: 9,
        'onTargetBehaviors': 12
    };

    export const igCmsMappedBase: IgModel.CompetencyRoot[] = [
        {
            status: IgModel.Status.BASE,
            'competency': igCmsMappedCompBin
        },
        {
            status: IgModel.Status.BASE,
            'competency': igCmsMappedCompMcx
        },
    ];

    export const igCmsMappedStandart: IgModel.CompetencyRoot[] = [
        {
            status: IgModel.Status.PUBLISHED,
            'competency': igCmsMappedCompBin
        },
        {
            status: IgModel.Status.PUBLISHED,
            'competency': igCmsMappedCompMcx
        },
    ];
    export const igCmsIdBin = 'af90e423-2e72-4eb2-8005-f5df3f1d8688';

    export const updatedStandartCompsFromDB = [
        {
            GlobalSubCategoryCode: 'MCX',
            CompetencyGUID: 'guidqwe',
            CompetencyName: 'MCX test name',
            CompetencyDescription: 'whatever desc',
            CustomCompetencyFlag: '0',
            isActive: '1',
        },
        {
            GlobalSubCategoryCode: 'BIN',
            CompetencyGUID: 'guidqwe1',
            CompetencyName: 'BIN test name',
            CompetencyDescription: 'BIN trst name',
            CustomCompetencyFlag: '0',
            isActive: '0',
        },
    ];

    export const standartCompsFromDB = [
        {
            GlobalSubCategoryCode: 'BIN',
            CompetencyGUID: igCmsMappedCompBin.id,
            CompetencyName: igCmsMappedCompBin.name,
            CompetencyDescription: igCmsMappedCompBin.description,
            CustomCompetencyFlag: igCmsMappedCompBin.isCustom ? '1' : '0',
            isActive: igCmsMappedCompBin.isActive ? '1' : '0',
        },
        {
            GlobalSubCategoryCode: 'MCX',
            CompetencyGUID: igCmsMappedCompMcx.id,
            CompetencyName: igCmsMappedCompMcx.name,
            CompetencyDescription: igCmsMappedCompMcx.description,
            CustomCompetencyFlag: igCmsMappedCompMcx.isCustom ? '1' : '0',
            isActive: igCmsMappedCompMcx.isActive ? '1' : '0',
        },
    ];

    export const draft: IgModel.Draft = {
        clientId: 111,
        locale: 'en',
        createdOn: '1667819974444',
        createdBy: 111,
        status: IgStatus.MODIFIED,
        competencies: igCmsMappedStandart,
    };

    export const draftWithUpdatedStandartNames: IgModel.Draft = {
        clientId: 111,
        'locale': 'en',
        'createdOn': '1667819974444',
        createdBy: 111,
        status: IgModel.Status.MODIFIED,
        competencies: [
            {
                status: IgModel.Status.PUBLISHED,
                competency: {
                    'id': 'af90e423-2e72-4eb2-8005-f5df3f1d8688',
                    'globalCode': 'bin',
                    'name': 'BIN test name',
                    'description': 'Applying knowledge of business and the marketplace to advance the organization’s goals.',
                    isActive: false,
                    isCustom: false,
                    'dateModified': '1667819974444',
                    interviewQuestionLevels: igCmsMappedCompBin.interviewQuestionLevels,
                    potentialUnderuseBehaviorLevels: igCmsMappedCompBin.potentialUnderuseBehaviorLevels,
                    onTargetBehaviorLevels: igCmsMappedCompBin.onTargetBehaviorLevels,
                    interviewQuestions: 6,
                    potentialUnderuseBehaviors: 10,
                    'onTargetBehaviors': 9
                },
            },
            {
                status: IgModel.Status.PUBLISHED,
                competency: {
                    'id': 'cfa238d3-69df-4d6c-a068-bf7fbcb31397',
                    'globalCode': 'mcx',
                    'name': 'MCX test name',
                    'description': 'Making sense of complex, high quantity, and sometimes contradictory information to effectively solve problems.',
                    isActive: true,
                    isCustom: false,
                    'dateModified': '1667819974444',
                    interviewQuestionLevels: igCmsMappedCompMcx.interviewQuestionLevels,
                    potentialUnderuseBehaviorLevels: igCmsMappedCompMcx.potentialUnderuseBehaviorLevels,
                    onTargetBehaviorLevels: igCmsMappedCompMcx.onTargetBehaviorLevels,
                    interviewQuestions: 12,
                    potentialUnderuseBehaviors: 9,
                    'onTargetBehaviors': 12
                },
            },
        ],
    };

    export const generatedDraft: IgModel.Draft = {
        clientId: 111,
        competencies: [
            {
                competency: {
                    'dateModified': '1667819974444',
                    'description': 'Making sense of complex, high quantity, and sometimes contradictory information to effectively solve problems.',
                    'globalCode': 'mcx',
                    'id': 'cfa238d3-69df-4d6c-a068-bf7fbcb31397',
                    interviewQuestionLevels: {
                        '1': [
                            {
                                'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                                'id': '980b8836-0705-4c84-b144-edf1de08423f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                                'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                                'id': '980b8836-0705-4c84-b144-edf1de08423f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                                'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                                'id': '980b8836-0705-4c84-b144-edf1de08423f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                                'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                                'id': '980b8836-0705-4c84-b144-edf1de08423f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                                'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                                'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                                'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                                'id': '53fb139a-1c18-441b-b702-c04e21481782',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                                'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                                'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                                'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                                'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                                'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                                'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                                'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                                'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                                'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                                'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                                'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                                'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    interviewQuestions: 12,
                    isActive: true,
                    isCustom: false,
                    'name': 'Manages Complexity',
                    onTargetBehaviorLevels: {
                        '1': [
                            {
                                'description': 'Clearly defines the problem before acting.',
                                'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Can see root causes.',
                                'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Can evaluate the consequences of different options.',
                                'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'Clearly defines the problem before acting.',
                                'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Can see root causes.',
                                'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Can evaluate the consequences of different options.',
                                'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'Clearly defines the problem before acting.',
                                'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Can see root causes.',
                                'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Can evaluate the consequences of different options.',
                                'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'Clearly defines the problem before acting.',
                                'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Can see root causes.',
                                'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Can evaluate the consequences of different options.',
                                'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Ensures that people clearly define the problem before acting.',
                                'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Helps others see root causes.',
                                'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Coaches others to evaluate consequences of different options.',
                                'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'Explores multiple sources for information.',
                                'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Understands what’s relevant/significant and what isn’t.',
                                'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Ensures that people clearly define the problem before acting.',
                                'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Helps others see root causes.',
                                'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Coaches others to evaluate consequences of different options.',
                                'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'Helps others see root causes.',
                                'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Approaches problem solving from a systems perspective.',
                                'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Synthesizes information from multiple sources.',
                                'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Deploys resources for effective information gathering and data analysis.',
                                'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Anticipates complex challenges that the organization may face.',
                                'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'Helps others see root causes.',
                                'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Approaches problem solving from a systems perspective.',
                                'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Synthesizes information from multiple sources.',
                                'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Deploys resources for effective information gathering and data analysis.',
                                'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Anticipates complex challenges that the organization may face.',
                                'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    onTargetBehaviors: 12,
                    potentialUnderuseBehaviorLevels: {
                        '1': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't apply systematic problem-solving methods.",
                                'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't apply systematic problem-solving methods.",
                                'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't apply systematic problem-solving methods.",
                                'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't apply systematic problem-solving methods.",
                                'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to help people define the essence of the problem.',
                                'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                description: "Doesn't stimulate critical thinking in others.",
                                'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information.',
                                'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to help people define the essence of the problem.',
                                'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                description: "Doesn't stimulate critical thinking in others.",
                                'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information and data analysis.',
                                'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't recognize complex challenges that may emerge.",
                                'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'Sees things as more simple than they are.',
                                'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t take time to define the essence of the problem.',
                                'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Allows intuition to override the facts.',
                                'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Draws on limited sources of information and data analysis.',
                                'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't recognize complex challenges that may emerge.",
                                'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    'potentialUnderuseBehaviors': 9
                },
                status: IgModel.Status.PUBLISHED,
            },
            {
                competency: {
                    'dateModified': '1667819974444',
                    'description': 'Applying knowledge of business and the marketplace to advance the organization’s goals.',
                    'globalCode': 'bin',
                    'id': 'af90e423-2e72-4eb2-8005-f5df3f1d8688',
                    interviewQuestionLevels: {
                        '1': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                                'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8,
                                ]
                            },
                            {
                                description:
                                    'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                                'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'What are three trends in your current industry?',
                                'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a successful business and why you think it is successful.',
                                'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                                'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Tell me about a failing business and why you think it is struggling.',
                                'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8,
                                ]
                            },
                            {
                                description:
                                    'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                                'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    interviewQuestions: 6,
                    isActive: true,
                    isCustom: false,
                    modifiedBy: 111,
                    'name': 'Business Insight',
                    onTargetBehaviorLevels: {
                        '1': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Aware of current business trends.',
                                'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Applies business knowledge to job.',
                                'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Understands the competition.',
                                'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Aware of current business trends.',
                                'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Applies business knowledge to job.',
                                'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Understands the competition.',
                                'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Aware of current business trends.',
                                'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Applies business knowledge to job.',
                                'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Understands the competition.',
                                'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Aware of current business trends.',
                                'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Applies business knowledge to job.',
                                'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Understands the competition.',
                                'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Ensures that the team is aware of current business trends.',
                                'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Applies and shares business knowledge related to organization/industry.',
                                'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Leverages insights for competitive advantage.',
                                'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Ensures that the team is aware of current business trends.',
                                'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Applies and shares business knowledge related to organization/industry.',
                                'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Leverages insights for competitive advantage.',
                                'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Applies and shares business knowledge related to organization/industry.',
                                'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Leverages insights for competitive advantage.',
                                'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Ensures that the organization is aware of current business trends.',
                                'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'Understands how businesses work.',
                                'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Understands the relationship between different aspects of business.',
                                'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Applies and shares business knowledge related to organization/industry.',
                                'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Leverages insights for competitive advantage.',
                                'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Ensures that the organization is aware of current business trends.',
                                'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    onTargetBehaviors: 9,
                    potentialUnderuseBehaviorLevels: {
                        '1': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Not interested in broad business issues or trends.',
                                'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t understand the relationship between different business elements.',
                                'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t apply business knowledge and information.',
                                'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '2': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Not interested in broad business issues or trends.',
                                'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t understand the relationship between different business elements.',
                                'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t apply business knowledge and information.',
                                'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '3': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Not interested in broad business issues or trends.',
                                'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t understand the relationship between different business elements.',
                                'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t apply business knowledge and information.',
                                'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '4': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Not interested in broad business issues or trends.',
                                'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t understand the relationship between different business elements.',
                                'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Doesn’t apply business knowledge and information.',
                                'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                        ],
                        '5': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't ensure that the team understands broad business issues or trends.",
                                'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Doesn’t leverage the relationship between different business elements.',
                                'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                                'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '6': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't ensure that the team understands broad business issues or trends.",
                                'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                            {
                                'description': 'Doesn’t leverage the relationship between different business elements.',
                                'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                                'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6
                                ]
                            },
                        ],
                        '7': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t leverage the relationship between different business elements.',
                                'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't ensure that the organization understands broad business issues or trends.",
                                'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                                'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                        '8': [
                            {
                                'description': 'Doesn’t understand how businesses work.',
                                'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Too internally focused on only their organization.',
                                'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    1,
                                    2,
                                    3,
                                    4,
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t leverage the relationship between different business elements.',
                                'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    5,
                                    6,
                                    7,
                                    8
                                ]
                            },
                            {
                                description: "Doesn't ensure that the organization understands broad business issues or trends.",
                                'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                            {
                                'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                                'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                                isActive: true,
                                isCustom: false,
                                'levels': [
                                    7,
                                    8
                                ]
                            },
                        ],
                    },
                    'potentialUnderuseBehaviors': 10
                },
                'status': IgModel.Status.MODIFIED
            },
        ],
        createdBy: 111,
        'createdOn': '1667819974444',
        'locale': 'en',
        'status': IgModel.Status.MODIFIED
    };

    export const draftToCmsStructure: IgCmsModel.IgCms = {
        competencies: [
            {
                'dateModified': '1667819974444',
                'description': 'Applying knowledge of business and the marketplace to advance the organization’s goals.',
                'globalCode': 'bin',
                'id': 'af90e423-2e72-4eb2-8005-f5df3f1d8688',
                interviewQuestions: [
                    {
                        'description': 'What are three trends in your current industry?',
                        'id': '4e7cf4df-bdbe-4ab9-811a-b4ff99244acf',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about a successful business and why you think it is successful.',
                        'id': '3c2aa971-c8a6-4058-98fa-c933bd3b4850',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about three advantages that your most recent organization’s competitors have.',
                        'id': '95742644-ad27-4706-b4ca-dfb9554627e2',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about a failing business and why you think it is struggling.',
                        'id': '72655b97-2e20-4499-b07e-79bb991fa23c',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you made.',
                        'id': '5b84b3c5-6c9c-421c-802d-71ce04038e0b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Tell me about a time your knowledge of marketplace trends influenced a decision you or your leadership team made.',
                        'id': 'dea492f3-93ab-4867-be37-d89bf58c5838',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
                isActive: true,
                isCustom: false,
                'name': 'Business Insight',
                onTargetBehaviors: [
                    {
                        'description': 'Understands how businesses work.',
                        'id': 'f033a26b-e07b-4352-9015-f1037160ee7e',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Understands the relationship between different aspects of business.',
                        'id': '1481a7ae-5c88-4024-9a10-c034a7d3ff32',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Aware of current business trends.',
                        'id': 'f573f695-7dc9-4f97-bb66-0a0d95992366',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Applies business knowledge to job.',
                        'id': 'c26b1c1f-7f36-46b8-a2f3-89aeddebb66b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Understands the competition.',
                        'id': '1ba1d3ad-d22b-498b-82c8-8f6f19cb2548',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Ensures that the team is aware of current business trends.',
                        'id': '6cfabfa7-65ea-4dc0-98bd-301d66de200f',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Applies and shares business knowledge related to organization/industry.',
                        'id': '05ee7260-d05a-4713-839b-0e0fea181a9d',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Leverages insights for competitive advantage.',
                        'id': 'ea4a980a-d587-4b75-a376-6ad7559c3e18',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Ensures that the organization is aware of current business trends.',
                        'id': '49d671a5-bd3c-4687-ac02-7fd8aa82b38b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
                potentialUnderuseBehaviors: [
                    {
                        'description': 'Doesn’t understand how businesses work.',
                        'id': 'a1adda6c-af14-45e5-b7f8-94ac27f5ab85',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Not interested in broad business issues or trends.',
                        'id': '70d357f2-92a9-43db-bd02-ec7b7a18128e',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Doesn’t understand the relationship between different business elements.',
                        'id': '4c1a603b-ef51-4999-907f-439cc61b6bcc',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Doesn’t apply business knowledge and information.',
                        'id': 'c36972f1-24e2-4eea-8395-365442d3e8c0',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Too internally focused on only their organization.',
                        'id': '9a674c1b-5727-4b0a-a067-bb8b8b6ff4d4',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        description: "Doesn't ensure that the team understands broad business issues or trends.",
                        'id': 'dfbfa244-d42e-4673-9494-315d8fb84115',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Doesn’t leverage the relationship between different business elements.',
                        'id': '0a02f094-92ec-4baa-bc8a-f5779576730a',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Doesn’t ensure that the team applies business knowledge and information.',
                        'id': 'e66b898c-eb89-4155-b9a0-90478a17ccbf',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        description: "Doesn't ensure that the organization understands broad business issues or trends.",
                        'id': 'cc9263dd-1e6a-4ae4-ad10-ec644f20d0e7',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Doesn’t ensure that the organization applies business knowledge and information.',
                        'id': '5fdc56f2-5c4a-4bdf-9114-25b31bf4a5be',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
            },
            {
                'dateModified': '1667819974444',
                'description': 'Making sense of complex, high quantity, and sometimes contradictory information to effectively solve problems.',
                'globalCode': 'mcx',
                'id': 'cfa238d3-69df-4d6c-a068-bf7fbcb31397',
                interviewQuestions: [
                    {
                        'description': 'Tell me about a time you used a process or procedure to solve a problem.',
                        'id': '980b8836-0705-4c84-b144-edf1de08423f',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Tell me about a time when your chosen solution didn’t work, and you had to rethink the problem from scratch.',
                        'id': '6a4e7db9-ee5a-4c00-b84e-d591dd65c428',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Describe a time you were faced with a complex problem and had to get to the essence in a short time period.',
                        'id': 'b5010d9d-9ae6-4657-bf54-336404b4a960',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Tell me about a time you incorporated information from multiple angles to get the full picture of a problem.',
                        'id': '66fda8ce-8096-4822-a81e-2f34a524ecf0',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Describe a time you faced conflicting data about a problem and you weren’t sure how to approach it.',
                        'id': '53fb139a-1c18-441b-b702-c04e21481782',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Tell me about a time you came up with an effective process or procedure to solve a complex problem.',
                        'id': '491ad8eb-a8c7-410f-a1eb-7b2210ee3eef',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Describe a time your team was faced with a complex problem and had to get to the essence in a short time period.',
                        'id': 'fc231e6f-e008-4d93-a96e-2715af41a39e',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Tell me about a time you considered information from multiple angles to get the full picture of a problem.',
                        'id': '1462dbae-b112-4209-8a48-d2aa1645350b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Describe how you have created an environment that supports cross-functional analysis and problem solving.',
                        'id': 'b6b15c47-e9e4-46c8-8f4a-92632d4bc0fd',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about a time you led the analysis of system-wide interdependencies to find an effective solution.',
                        'id': '30d0036b-b6b0-4b19-8b2c-6ea86a613420',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Tell me about a time you found a work problem to be significantly more complex than you initially thought.',
                        'id': 'e2b61d6c-421b-4d36-8c73-28215183686a',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Describe a time you recognized a significant complex problem emerging in the organization.',
                        'id': '2c1c5883-fd1c-412b-a555-06ac59f3f33c',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
                isActive: true,
                isCustom: false,
                'name': 'Manages Complexity',
                onTargetBehaviors: [
                    {
                        'description': 'Clearly defines the problem before acting.',
                        'id': 'af146286-5d25-4ecb-8c41-9b8f862cac1b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Can see root causes.',
                        'id': '8da6d63a-0a3c-4bab-8668-536abcb648e0',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Explores multiple sources for information.',
                        'id': '377ffe65-56a3-4626-aff5-e017b4b83d70',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Understands what’s relevant/significant and what isn’t.',
                        'id': '710e611d-8209-4c4a-80da-6a54bfbb1556',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Can evaluate the consequences of different options.',
                        'id': '5456e2fa-0846-48b3-a971-47509ef26241',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Ensures that people clearly define the problem before acting.',
                        'id': '5a492144-b69f-4769-87c8-ce9cc657c3c4',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Helps others see root causes.',
                        'id': 'd5046905-89f1-44fc-b8e8-a8dcd57f388a',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Coaches others to evaluate consequences of different options.',
                        'id': '5eefbec9-0853-40da-9a9a-5089ac2fb2b0',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Approaches problem solving from a systems perspective.',
                        'id': 'cb7eb392-e9ab-425e-8c36-663394910230',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Synthesizes information from multiple sources.',
                        'id': '0641590b-7a60-4a12-aa4a-2537895d996d',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Deploys resources for effective information gathering and data analysis.',
                        'id': '307e38a3-17ac-4f4e-aa2c-bb3c381820c7',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Anticipates complex challenges that the organization may face.',
                        'id': '90ebb77b-c610-4673-9b42-bdcf87d4b4c2',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
                potentialUnderuseBehaviors: [
                    {
                        'description': 'Sees things as more simple than they are.',
                        'id': '29e93cd6-61dd-4f1f-ab7b-435c41c6b18b',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Doesn’t take time to define the essence of the problem.',
                        'id': 'a64c1c30-9d86-4dbc-8e55-ffa2ad4b6830',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            7,
                            8,
                        ],
                    },
                    {
                        'description': 'Draws on limited sources of information.',
                        'id': 'e6bc5c05-4eb5-45a2-8b72-fd5ee054894a',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Allows intuition to override the facts.',
                        'id': '3f2e9678-cea7-427f-9a98-6f129cbe48a8',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            7,
                            8,
                        ],
                    },
                    {
                        description: "Doesn't apply systematic problem-solving methods.",
                        'id': '9af426cf-c349-438f-9e1f-c1bfa9d1c22c',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            1,
                            2,
                            3,
                            4,
                        ],
                    },
                    {
                        'description': 'Doesn’t take time to help people define the essence of the problem.',
                        'id': 'd7d930cf-ea90-4558-ae14-efce24b2b2c9',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        description: "Doesn't stimulate critical thinking in others.",
                        'id': '5d66dd00-f29f-4c9e-b7bd-c4e71ba5e2db',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            5,
                            6,
                        ],
                    },
                    {
                        'description': 'Draws on limited sources of information and data analysis.',
                        'id': '6103dab0-cb78-4fe8-b842-54b93f50f536',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                    {
                        description: "Doesn't recognize complex challenges that may emerge.",
                        'id': '6a008e56-7757-44e6-869b-4b13868c61bc',
                        isActive: true,
                        isCustom: false,
                        'levels': [
                            7,
                            8,
                        ],
                    },
                ],
            },
        ],
        'id': 'projects.internal.products.reports.clients.111.customInterviewGuide',
        'lang': 'en-US',
    };
}