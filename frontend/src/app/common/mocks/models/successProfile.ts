/* eslint-disable max-len */
import { KfISuccessProfile } from '@kf-products-core/kfhub_lib';
import _ from 'lodash';

export const SUCCESS_PROFILE_MOCK: KfISuccessProfile = {
    id: 226754,
    title: 'TEST 2 OVERALL RATIONALE DEVELOPMENT TEST 2 OVERALL RATIONALE DEVELOPMENTTEST 2 OVERALL RATIONALE DEVELO',
    description: 'Performs simple tasks or more complex tasks under supervision.',
    status: 'DRAFT',
    companyId: 23139,
    jobLevel: 'Specialist Professional',
    jobRoleTypeId: 'ASA1',
    standardHayGrade: '08',
    customGradeSetId: '2',
    regionalNormData: {
        normId: 248,
        normCountryId: 1,
        isGlobalRole: true,
        normReportCode: 'NV2.0-12',
    },
    grade: {
        standardHayGrade: 15,
    },
    companyDescription: 'Kornferry',
    finalizedResponsibilities: 1,
    jobExportUrl: 'https://0f5lv6cm91.execute-api.us-east-1.amazonaws.com/current/download/sucessprofile?spId=18160',
    interviewGuideUrl: 'https://testproductsapi.kornferry.com/v1/hrms/successprofiles/interviewguide?jobId=18160&reportType=InterviewGuide&reportLocale=en&reportClientId=23139',
    noOfDependantJobs: 0,
    familyName: 'Administration / support / service',
    subFamilyName: 'Clerical Services',
    isTemplateJob: false,
    isCustomizableForAssessments: true,
    kf4dFunctionCode: 'Fun_02',
    profileType: 'CUSTOM_PROFILE',
    accessRoles: 'READ_EDIT_PUBLISH_DELETE_COPY',
    kfLevelMappings: {
        level: {
            globalCode: 'Lvl_06',
            label: 'Individual Contributor',
        },
        management: {
            globalCode: 'Lvl_06',
            label: 'Individual Contributor',
        },
        progression: {
            globalCode: 'Lvl_06_06',
            label: 'Routine Contributor',
        },
        roleLevel: {
            id: 5,
            label: 'Entry',
            defaultType: 'ENTRY',
        },
    },
    parentJobDetails: {
        id: 1448,
        title: 'Administrative Assistant I',
        description: 'Administration / support / service/Clerical Services (8)',
        jobRoleTypeId: 'ASA1',
        standardHayGrade: '08',
    },
    sources: [
        {
            id: 26406,
            type: 'CREATED_BY',
            firstName: 'clm',
            lastName: 'user one',
            effectiveDateTime: 1529943717663,
        },
        {
            id: 26406,
            type: 'LAST_MODIFIED_BY',
            firstName: 'clm',
            lastName: 'user one',
            effectiveDateTime: 1529943731167,
        },
    ],
    sections: [
        {
            id: 16,
            name: 'Responsibilities',
            description: 'Responsibilities are the tasks or duties that must be performed well to succeed in a role.',
            levelDescription: 'The level shown, on a scale of 1 to 13, indicates the responsibility required. The higher the level, the greater the amount of responsibility. Shown are the Responsibilities selected for this role, ordered by importance.',
            order: 1,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'RESPONSIBILITY',
            codeId: '1',
            sectionGroup: {
                id: 2,
                code: 'ROLE_REQUIREMENTS',
                name: 'Role Requirements',
                description: 'Role Requirements',
            },
            categories: [
                {
                    id: '101',
                    name: 'Administrative Services',
                    description: 'ADD DESCRIPTION',
                    subCategories: [
                        {
                            id: 477,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'ADM',
                            descriptions: [
                                {
                                    name: 'Administration',
                                    level: 1,
                                    description: 'Enters data into standard company systems.',
                                },
                            ],
                        },
                        {
                            id: 478,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'COR',
                            descriptions: [
                                {
                                    name: 'Correspondence',
                                    level: 1,
                                    description: 'Opens and distributes mail.',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '108',
                    name: 'Information',
                    description: 'The application of techniques to collect manage and disseminate information within and outside the organization to enable managers to make quicker and better decisions.',
                    subCategories: [
                        {
                            id: 503,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'DOCM',
                            descriptions: [
                                {
                                    name: 'Document Management',
                                    level: 1,
                                    description: 'Files records and/or documents according to specific instructions.',
                                },
                            ],
                        },
                        {
                            id: 504,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'DOCP',
                            descriptions: [
                                {
                                    name: 'Document Preparation',
                                    level: 1,
                                    description: 'Inputs given content into standard templates, while also photocopying and collating materials.',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '101',
                    name: 'Administrative Services',
                    description: 'ADD DESCRIPTION',
                    subCategories: [
                        {
                            id: 479,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'LOA',
                            descriptions: [
                                {
                                    name: 'Logistics / Arrangements',
                                    level: 1,
                                    description: 'Provides information about the availability of people or facilities.',
                                },
                            ],
                        },
                        {
                            id: 480,
                            shortProfile: 'A2',
                            type: 'C',
                            userEdited: false,
                            globalCode: 'WOA',
                            descriptions: [
                                {
                                    name: 'Work Scheduling / Allocation',
                                    level: 1,
                                    description: 'Works according to an assigned schedule.',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '104',
                    name: 'Client & Customer Management',
                    description: 'The process by which client, customers and business partners and dealt with and managed',
                    subCategories: [
                        {
                            id: 488,
                            shortProfile: 'A2',
                            type: 'S',
                            userEdited: false,
                            globalCode: 'CMMI',
                            descriptions: [
                                {
                                    name: 'Client & Customer Management (Internal)',
                                    level: 1,
                                    description: 'Interacts courteously to exchange information.',
                                },
                            ],
                        },
                    ],
                },
                {
                    id: '108',
                    name: 'Information',
                    description: 'The application of techniques to collect manage and disseminate information within and outside the organization to enable managers to make quicker and better decisions.',
                    subCategories: [
                        {
                            id: 501,
                            shortProfile: 'A2',
                            type: 'S',
                            userEdited: false,
                            globalCode: 'DCA',
                            descriptions: [
                                {
                                    name: 'Data Collection & Analysis',
                                    level: 1,
                                    description: 'Performs basic data entry tasks.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 88,
            name: 'Behavioral Competencies',
            description: 'Behavioral competencies  are observable behaviors and skills that matter most for success at work.',
            levelDescription: 'The level shown, on a scale of 1 to 8, indicates the proficiency required. The higher the level, the more proficiency required. Shown are the Behavioral Competencies selected for this role, ordered by importance.',
            order: 2,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'BEHAVIORAL_SKILLS',
            codeId: '1',
            sectionGroup: {
                id: 2,
                code: 'ROLE_REQUIREMENTS',
                name: 'Role Requirements',
                description: 'Role Requirements',
            },
            categories: [
                {
                    id: '248',
                    name: 'CLM Test Company Behavior',
                    description: 'CLM Test Company Behavior',
                    subCategories: [
                        {
                            id: 8970,
                            cmmId: '2654641c-eddc-41e1-967e-270f8dd6a1a3',
                            userEdited: false,
                            globalCode: 'EAC',
                            descriptions: [
                                {
                                    name: 'Ensures accountability',
                                    level: 1,
                                    levelLabel: '1 Contributes dependently Meets',
                                    description: 'Holds self and others accountable to meet commitments. For example, operates with a clear sense of responsibility; learns about, and adheres to, most policies, procedures, and work requirements. Takes steps to ensure work is done properly, communicates status, and addresses any errors.',
                                },
                            ],
                        },
                        {
                            id: 8993,
                            cmmId: 'da6773e8-6883-458a-ace7-de922fa7e7cb',
                            userEdited: false,
                            globalCode: 'AEX',
                            descriptions: [
                                {
                                    name: 'Plans and aligns',
                                    level: 1,
                                    levelLabel: '1 Contributes dependently Meets',
                                    description: 'Plans and prioritizes work to meet commitments aligned with organizational goals. For example, gains a clear understanding of the main tasks needed to complete work in the right sequence. Identifies the support and resources needed to carry out plans; delivers on time at an acceptable quality level.',
                                },
                            ],
                        },
                        {
                            id: 8975,
                            cmmId: '18edacc1-0a25-4b6c-945f-b2148f845bb3',
                            userEdited: false,
                            globalCode: 'COM',
                            descriptions: [
                                {
                                    name: 'Communicates effectively',
                                    level: 1,
                                    levelLabel: '1 Contributes dependently Meets',
                                    description: 'Develops and delivers multi-mode communications that convey a clear understanding of the unique needs of different audiences. For example, pays attention to others\' insights, advice, or instruction, grasping the main elements. Promptly shares relevant information with the right amount of detail.',
                                },
                            ],
                        },
                        {
                            id: 8974,
                            cmmId: '318d86f8-3846-4da8-a866-6eff6f40b4f5',
                            userEdited: false,
                            globalCode: 'COL',
                            descriptions: [
                                {
                                    name: 'Collaborates - wusmoketest.0614',
                                    level: 1,
                                    levelLabel: '1 Contributes dependently Meets',
                                    description: 'Builds partnerships and works collaboratively with others to meet shared objectives. For example, learns how to operate as a team player, contributing actively to the group\'s efforts. Seeks others\' inputs, appreciates their contributions; offers to help when the need is clear.',
                                },
                            ],
                        },
                        {
                            id: 9003,
                            cmmId: '8b43d713-29fd-4ab1-b100-9fbe12af34a5',
                            userEdited: false,
                            descriptions: [
                                {
                                    name: 'Tech savvy Testjune14th',
                                    level: 1,
                                    levelLabel: '1 Contributes dependently Meets',
                                    description: 'Anticipates and adopts innovations in business-building digital and technology applications. For example, makes effective use of the latest technologies required for success in the role; grasps the main terminology. Learns and adopts new technologies, although may require some time to master the changes.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            name: 'Technical Competencies',
            description: 'Technical competencies are the abilities and skills needed for effective performance in specific fields or functions.',
            levelDescription: 'The level shown, on a scale of 1 to 5, indicates the proficiency required. The higher the level, the more proficiency required. Shown are the Technical Competencies selected for this role, ordered by importance.',
            order: 3,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'TECHNICAL_SKILLS',
            codeId: '1',
            sectionGroup: {
                id: 2,
                code: 'ROLE_REQUIREMENTS',
                name: 'Role Requirements',
                description: 'Role Requirements',
            },
            categories: [
                {
                    id: '17',
                    name: 'GENERIC KNOWLEDGE SKILLS & ABILITIES',
                    description: 'GENERIC KNOWLEDGE SKILLS & ABILITIES',
                    subCategories: [
                        {
                            id: 67,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Verbal Communication',
                                    level: 1,
                                    description: 'Uses clear and effective elementary verbal communications skills under supervision to express ideas, request actions and formulate plans or policies.',
                                },
                            ],
                        },
                        {
                            id: 59,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Numerical Skills',
                                    level: 1,
                                    description: 'Uses an elementary understanding of numerical concepts to perform mathematical operations such as report analysis under supervision.',
                                },
                            ],
                        },
                        {
                            id: 49,
                            userEdited: false,
                            globalCode: 'COSK',
                            descriptions: [
                                {
                                    name: 'Computer skills',
                                    level: 1,
                                    description: 'Supports business processes under supervision by applying an elementary understanding and effective use of standard office equipment and standard software packages.',
                                },
                            ],
                        },
                        {
                            id: 60,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Planning and Organizing',
                                    level: 1,
                                    description: 'Works under supervision at an elementary level to plan, organize, prioritize and oversee activities to efficiently meet business objectives.',
                                },
                            ],
                        },
                        {
                            id: 61,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Policy and procedures',
                                    level: 1,
                                    description: 'Works under supervision at an elementary level to develop, monitor, interpret and understand policies and procedures, while making sure they match organizational strategies and objectives.',
                                },
                            ],
                        },
                        {
                            id: 52,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Data Collection and analysis',
                                    level: 1,
                                    description: 'Works under supervision to perform elementary data analysis for use in reports to help guide decision making.',
                                },
                            ],
                        },
                        {
                            id: 53,
                            userEdited: false,
                            globalCode: 'XXX',
                            descriptions: [
                                {
                                    name: 'Data Management',
                                    level: 1,
                                    description: 'Works under supervision at an elementary level to acquire, organize, protect and process data to fulfill business objectives.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 3,
            name: 'Education',
            description: 'Education is the level of general education typically needed to succeed in a role.',
            levelDescription: 'The level shown, on a scale 1 to 7, indicates the education level typical of someone in this role. The levels are from the international standard levels of education.',
            order: 4,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'EDUCATION',
            codeId: '1',
            sectionGroup: {
                id: 2,
                code: 'ROLE_REQUIREMENTS',
                name: 'Role Requirements',
                description: 'Role Requirements',
            },
            categories: [
                {
                    id: '35',
                    name: 'All Education',
                    description: 'All Education levels',
                    subCategories: [
                        {
                            id: 165,
                            userEdited: false,
                            descriptions: [
                                {
                                    name: 'General Education',
                                    level: 3,
                                    description: 'Secondary / Intermediate + (5 GCSE)',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 4,
            name: 'Experience',
            description: 'Experience is the level of general and managerial experience typically needed to succeed in a role.',
            levelDescription: 'The level shown, on a scale 1 to 9, indicates the levels of general and managerial experience typical of someone in this role.',
            order: 5,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'EXPERIENCE',
            codeId: '1',
            sectionGroup: {
                id: 2,
                code: 'ROLE_REQUIREMENTS',
                name: 'Role Requirements',
                description: 'Role Requirements',
            },
            categories: [
                {
                    id: '40',
                    name: 'Work Experience',
                    description: 'Work Experience Description',
                    subCategories: [
                        {
                            id: 166,
                            userEdited: false,
                            globalCode: 'GENX',
                            descriptions: [
                                {
                                    name: 'General Experience',
                                    level: 2,
                                    description: 'None',
                                },
                            ],
                        },
                        {
                            id: 167,
                            userEdited: false,
                            globalCode: 'MGRX',
                            descriptions: [
                                {
                                    name: 'Managerial Experience',
                                    level: 2,
                                    description: 'None',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 19,
            name: 'Traits',
            description: 'Traits are personality characteristics that exert a strong influence on behavior. These include attitudes, such as optimism, and other natural leanings, such as social astuteness.',
            levelDescription: 'The level shown, on a scale of 1 to 10 (low to high, with 5.5 being typical), indicates the minimum level expected of a solid contributor.  Of the available traits, 8 are shown and ordered by importance.',
            order: 19,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'TRAITS',
            codeId: '1',
            sectionGroup: {
                id: 3,
                code: 'PERSONAL_CHARACTERISTICS',
                name: 'Personal Characteristics',
                description: 'Personal Characteristics',
            },
            categories: [
                {
                    id: '149',
                    name: 'Traits',
                    description: 'Traits',
                    subCategories: [
                        {
                            id: 2566,
                            userEdited: true,
                            globalCode: 'FO',
                            descriptions: [
                                {
                                    name: 'Focus',
                                    level: 8,
                                    description: 'Preference for organization, procedure, and exactitude.',
                                },
                            ],
                        },
                        {
                            id: 2575,
                            userEdited: true,
                            globalCode: 'HU',
                            descriptions: [
                                {
                                    name: 'Humility',
                                    level: 7,
                                    description: 'The degree to which a person is seen as courteous, free from self-absorption, and easy to get along with.',
                                },
                            ],
                        },
                        {
                            id: 2577,
                            userEdited: true,
                            globalCode: 'TR',
                            descriptions: [
                                {
                                    name: 'Trust',
                                    level: 7,
                                    description: 'An expectation of honesty and forthrightness on the part of oneself and others.',
                                },
                            ],
                        },
                        {
                            id: 2580,
                            userEdited: true,
                            globalCode: 'PE',
                            descriptions: [
                                {
                                    name: 'Persistence',
                                    level: 6,
                                    description: 'A tendency toward passionate and steadfast pursuit of long-term goals, in spite of obstacles, discouragement, or distraction.',
                                },
                            ],
                        },
                        {
                            id: 2573,
                            userEdited: true,
                            descriptions: [
                                {
                                    name: 'Agreeableness',
                                    level: 6,
                                    description: 'Considerate, collaborative, inclusive.',
                                },
                            ],
                        },
                        {
                            id: 2574,
                            userEdited: true,
                            globalCode: 'OD',
                            descriptions: [
                                {
                                    name: 'Openness to Differences',
                                    level: 6,
                                    description: 'A desire to consider and explore differences in perspective, thought, and experience of persons from a variety of backgrounds.',
                                },
                            ],
                        },
                        {
                            id: 2582,
                            userEdited: true,
                            globalCode: 'CR',
                            descriptions: [
                                {
                                    name: 'Credibility',
                                    level: 6,
                                    description: 'The degree of consistency between a person\'s words and actions.',
                                },
                            ],
                        },
                        {
                            id: 2578,
                            userEdited: true,
                            descriptions: [
                                {
                                    name: 'Striving',
                                    level: 5,
                                    description: 'Driven, reliable, persistent.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 20,
            name: 'Drivers',
            description: 'Drivers are the preferences, values, and motivations that influence a person\'s career aspirations. They lie at the heart of critical questions: What is important to me? What do I find rewarding?',
            levelDescription: 'The level shown, on a scale of 1 to 10 (low to high, with 5.5 being typical), indicates the minimum level expected of a solid contributor.  Shown are all six Drivers, ordered by importance to role.',
            order: 20,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'DRIVERS',
            codeId: '1',
            sectionGroup: {
                id: 3,
                code: 'PERSONAL_CHARACTERISTICS',
                name: 'Personal Characteristics',
                description: 'Personal Characteristics',
            },
            categories: [
                {
                    id: '150',
                    name: 'Drivers',
                    description: 'Drivers',
                    subCategories: [
                        {
                            id: 2587,
                            userEdited: true,
                            globalCode: 'STRC',
                            descriptions: [
                                {
                                    name: 'Structure',
                                    level: 9,
                                    description: 'A preference for process-oriented, structured, and stable work environments.',
                                },
                            ],
                        },
                        {
                            id: 2588,
                            userEdited: true,
                            globalCode: 'INDY',
                            descriptions: [
                                {
                                    name: 'Independence',
                                    level: 5,
                                    description: 'Prefers an entrepreneurial approach and limited organizational constraints.',
                                },
                            ],
                        },
                        {
                            id: 2584,
                            userEdited: true,
                            globalCode: 'COLL',
                            descriptions: [
                                {
                                    name: 'Collaboration',
                                    level: 5,
                                    description: 'A preference for work-related interdependence, group decision making, and pursuing shared goals.',
                                },
                            ],
                        },
                        {
                            id: 2583,
                            userEdited: true,
                            globalCode: 'BALA',
                            descriptions: [
                                {
                                    name: 'Balance',
                                    level: 4,
                                    description: 'Motivated to integrate work and life in a sustainable, enjoyable, and meaningful way.',
                                },
                            ],
                        },
                        {
                            id: 2586,
                            userEdited: true,
                            globalCode: 'CHAL',
                            descriptions: [
                                {
                                    name: 'Challenge',
                                    level: 4,
                                    description: 'Motivated by achievement in the face of tough obstacles.',
                                },
                            ],
                        },
                        {
                            id: 2585,
                            userEdited: true,
                            globalCode: 'POWR',
                            descriptions: [
                                {
                                    name: 'Power',
                                    level: 4,
                                    description: 'Motivated to seek influence, recognition, and increasing levels of responsibility.',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 21,
            name: 'Cognitive Abilities',
            description: 'Traits are personality characteristics that exert a strong influence on behavior. These include attitudes, such as optimism, and other natural leanings, such as social astuteness.',
            levelDescription: 'The level shown, on a scale of 1 to 10 (low to high, with 5.5 being typical), indicates the minimum level expected of a solid contributor.  Of the available traits, 8 are shown and ordered by importance.',
            order: 21,
            isRequiredForPublish: true,
            isEditable: true,
            code: 'COGNITIVE_ABILITIES',
            codeId: '1',
            sectionGroup: {
                id: 3,
                code: 'PERSONAL_CHARACTERISTICS',
                name: 'Personal Characteristics',
                description: 'Personal Characteristics',
            },
            cognitiveAbilities: [
                {
                    id: '24',
                    name: 'Numerical',
                    description: 'Plan, administer, and control budgets for contracts, equipment, and supplies.',
                    optional: false,
                },
                {
                    id: '25',
                    name: 'Numerical',
                    description: 'Plan, administer, and control budgets for contracts, equipment, and supplies.',
                    optional: false,
                },
                {
                    id: '26',
                    name: 'Logcal',
                    description: 'Plan, administer, and control budgets for contracts, equipment, and supplies.',
                    optional: false,
                },
            ],
        },
        {
            id: 40,
            name: 'Tasks',
            description: 'Tasks',
            isRequiredForPublish: true,
            code: 'TASKS',
            order: 22,
            isEditable: true,
            codeId: '1',
            sectionGroup: {
                id: 5,
                name: 'TASKS & SKILLS',
                description: 'TASKS & SKILLS',
            },
            tasks: [
                {
                    id: 24,
                    name: 'Plan, administer, and control budgets for contracts, equipment, and supplies.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 4.06,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 26,
                    name: 'Hire and terminate clerical and administrative personnel.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.95,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 19,
                    name: 'Direct or coordinate the supportive services department of a business, agency, or organization.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.92,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 18,
                    name: 'Monitor the facility to ensure that it remains safe, secure, and well-maintained.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.89,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 25,
                    name: 'Oversee construction and renovation projects to improve efficiency and to ensure that facilities meet environmental, health, and security standards, and comply with government regulations.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.72,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 21,
                    name: 'Prepare and review operational reports and schedules to ensure accuracy and efficiency.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.71,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 20,
                    name: 'Set goals and deadlines for the department.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.70,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 27,
                    name: 'Oversee the maintenance and repair of machinery, equipment, and electrical and mechanical systems.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.70,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 23,
                    name: 'Acquire, distribute and store supplies.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.38,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 29,
                    name: 'Participate in architectural and engineering planning and design, including space and installation management.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.33,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 28,
                    name: 'Manage leasing of facility space.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.33,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 22,
                    name: 'Analyze internal processes and recommend and implement procedural or policy changes to improve operations, such as supply changes or the disposal of records.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.33,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 30,
                    name: 'Conduct classes to teach procedures to staff.',
                    isCore: true,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 3.19,
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 31,
                    name: 'Dispose of, or oversee the disposal of, surplus or unclaimed property.',
                    isCore: false,
                    scales: [
                        {
                            id: 'IM',
                            name: 'Importance',
                            scaleMinimum: 1,
                            scaleMaximum: '5',
                            categories: [
                                {
                                    id: 1,
                                    description: 'Importance',
                                    scaleActualValue: 2.72,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 41,
            name: 'Tools',
            description: 'Tools',
            isRequiredForPublish: true,
            code: 'TOOLS',
            order: 23,
            isEditable: true,
            codeId: '1',
            sectionGroup: {
                id: 5,
                name: 'TASKS & SKILLS',
                description: 'TASKS & SKILLS',
            },
            toolsCommodities: [
                {
                    code: '44101809',
                    title: 'Desktop calculator',
                    userEdited: false,
                    tools: [
                        {
                            title: '10-key calculators',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211507',
                    title: 'Desktop computers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Desktop computers',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '44101508',
                    title: 'Laser fax machine',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Laser facsimile machines',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43191501',
                    title: 'Mobile phones',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Mobile phones',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211503',
                    title: 'Notebook computers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Laptop computers',
                            isHotTool: false,
                        },
                        {
                            title: 'Notebook computers',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211508',
                    title: 'Personal computers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Personal computers',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211504',
                    title: 'Personal digital assistant PDAs or organizers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Personal digital assistants PDA',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '44101501',
                    title: 'Photocopiers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Photocopying equipment',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211711',
                    title: 'Scanners',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Scanners',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43191507',
                    title: 'Special purpose telephones',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Multi-line telephone systems',
                            isHotTool: false,
                        },
                    ],
                },
                {
                    code: '43211509',
                    title: 'Tablet computers',
                    userEdited: false,
                    tools: [
                        {
                            title: 'Tablet computers',
                            isHotTool: false,
                        },
                    ],
                },
            ],
        },
        {
            id: 42,
            name: 'Technology',
            description: 'Technology',
            isRequiredForPublish: true,
            code: 'TECHNOLOGY',
            order: 24,
            isEditable: true,
            codeId: '1',
            sectionGroup: {
                id: 5,
                name: 'TASKS & SKILLS',
                description: 'TASKS & SKILLS',
            },
            technologyCommodities: [
                {
                    code: '43231602',
                    title: 'Enterprise resource planning ERP software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Dynamics GP',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Oracle Hyperion',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Oracle PeopleSoft',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Oracle PeopleSoft Financials',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Sage MAS 200 ERP',
                            isHotTechnology: true,
                        },
                        {
                            title: 'SAP',
                            isHotTechnology: true,
                        },
                        {
                            title: 'SAP Business Objects',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232306',
                    title: 'Data base user interface and query software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Data entry software',
                            isHotTechnology: true,
                        },
                        {
                            title: 'FileMaker Pro',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Microsoft Access',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Yardi',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Sage 300 Construction and Real Estate',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43233501',
                    title: 'Electronic mail software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'IBM Notes',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Microsoft Outlook',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Email software',
                            isHotTechnology: false,
                        },
                        {
                            title: 'Novell GroupWise',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43231601',
                    title: 'Accounting software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Fund accounting software',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Intuit QuickBooks',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Sage 50 Accounting',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232705',
                    title: 'Internet browser software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Internet Explorer',
                            isHotTechnology: false,
                        },
                        {
                            title: 'Web browser software',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43232112',
                    title: 'Desktop publishing software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Publisher',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Adobe Systems Adobe PageMaker',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43231505',
                    title: 'Human resources software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Human resource management software HRMS',
                            isHotTechnology: true,
                        },
                        {
                            title: 'ADP Enterprise HRMS',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43232605',
                    title: 'Analytical or scientific software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Minitab',
                            isHotTechnology: true,
                        },
                        {
                            title: 'SPSS',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43231507',
                    title: 'Project management software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Project',
                            isHotTechnology: true,
                        },
                        {
                            title: 'Microsoft SharePoint',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232305',
                    title: 'Data base reporting software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'SAP BusinessObjects Crystal Reports',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43232610',
                    title: 'Medical software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'PracticeWorks Systems Kodak WINOMS CS',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43231513',
                    title: 'Office suite software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Office',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43233004',
                    title: 'Operating system software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Windows XP',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43232104',
                    title: 'Word processing software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Word',
                            isHotTechnology: false,
                        },
                    ],
                },
                {
                    code: '43232604',
                    title: 'Computer aided design CAD software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Autodesk AutoCAD',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232201',
                    title: 'Content workflow software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Atlassian JIRA',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232303',
                    title: 'Customer relationship management CRM software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Blackbaud The Raiser\'s Edge',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232304',
                    title: 'Data base management system software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Teradata Database',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232202',
                    title: 'Document management software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Adobe Systems Adobe Acrobat',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43231604',
                    title: 'Financial analysis software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Delphi Technology',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232102',
                    title: 'Graphics or photo imaging software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Visio',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232309',
                    title: 'Information retrieval or search software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'LexisNexis',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232106',
                    title: 'Presentation software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft PowerPoint',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232110',
                    title: 'Spreadsheet software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'Microsoft Excel',
                            isHotTechnology: true,
                        },
                    ],
                },
                {
                    code: '43232107',
                    title: 'Web page creation and editing software',
                    userEdited: false,
                    technologies: [
                        {
                            title: 'LinkedIn',
                            isHotTechnology: true,
                        },
                    ],
                },
            ],
        },
    ],
    jdModelId: 132,
    assessments: [
        {
            id: 10,
            name: 'Competencies',
            kfasAssessmentId: '3',
            type: 'DIMENSIONS',
            order: '10',
            isMandatory: true,
            targetScore: 35,
            isTimedAssessment: false,
            estimatedTimeInSeconds: 1800,
        },
        {
            id: 7,
            name: 'Cognitive: Checking',
            kfasAssessmentId: '17',
            type: 'ASPECTS_CHECKING',
            order: '8',
            isMandatory: true,
            targetScore: 35,
            isTimedAssessment: true,
            estimatedTimeInSeconds: 480,
        },
        {
            id: 5,
            name: 'Cognitive: Numerical',
            kfasAssessmentId: '15',
            type: 'ASPECTS_NUMERICAL',
            order: '5',
            isMandatory: false,
            targetScore: 35,
            isTimedAssessment: true,
            estimatedTimeInSeconds: 900,
        },
        {
            id: 6,
            name: 'Cognitive: Verbal',
            kfasAssessmentId: '16',
            type: 'ASPECTS_VERBAL',
            order: '4',
            isMandatory: true,
            targetScore: 35,
            isTimedAssessment: true,
            estimatedTimeInSeconds: 780,
        },
    ],
    hayPoints: {
        totalPoints: 571,
        min: 0,
        max: 22697,
        jeScores: [
            {
                id: 1,
                jeScoreType: 'KNOW_HOW',
                points: 304,
                rationaleDescription: 'KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE KNOW HOW MOCK RATIONALE',
                options: [
                    {
                        id: 1,
                        type: 'PRACTICAL_TECHNICAL_KNOWLEDGE',
                        code: 'F',
                    },
                    {
                        id: 2,
                        type: 'MANAGERIAL_KNOWLEDGE',
                        code: 'I+',
                    },
                    {
                        id: 3,
                        type: 'COMMUNICATION_INFLUENCING_SKILL',
                        code: '2',
                    },
                ],
            },
            {
                id: 2,
                jeScoreType: 'PROBLEM_SOLVING',
                points: 115,
                rationaleDescription: 'PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION PROBLEM SOLVING RATIONALE DESCRIPTION',
                options: [
                    {
                        id: 1,
                        type: 'FREEDOM_THINK',
                        code: 'E',
                    },
                    {
                        id: 2,
                        type: 'THINKING_CHALLENGE',
                        code: '3+',
                    },
                    {
                        id: 3,
                        type: 'PROBLEM_SOLVING_PERCENTAGE',
                        code: '0.38',
                    },
                ],
            },
            {
                id: 3,
                jeScoreType: 'ACCOUNTABILITY',
                points: 152,
                rationaleDescription: 'ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION ACCOUNTABILITY RATIONALE DESCRIPTION',
                options: [
                    {
                        id: 3,
                        type: 'FREEDOM_ACT',
                        code: 'E-',
                    },
                    {
                        id: 2,
                        type: 'AREA_IMPACT',
                        code: 'N',
                    },
                    {
                        id: 3,
                        type: 'NATURE_IMPACT',
                        code: 'V+',
                    },
                ],
            },
            {
                id: 4,
                jeScoreType: 'WORKING_CONDITIONS',
                rationaleDescription: 'WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION WORKING CONDITIONS RATIONALE DESCRIPTION',
                options: [
                    {
                        id: 1,
                        type: 'PHYSICAL_EFFORT',
                    },
                    {
                        id: 2,
                        type: 'PHYSICAL_ENVIRONMENT',
                    },
                    {
                        id: 3,
                        type: 'SENSORY_ATTENTION',
                    },
                    {
                        id: 4,
                        type: 'MENTAL_STRESS',
                    },
                ],
            },
        ],
        wcTotalPoints: 571,
        overallRationale: 'THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS IS OVERALL RATIONALE THIS',
    },
    traitsAndDrivers: {
        roleRequirementsQuestions: [
            {
                ucpCode: 'CL_LK5_JAR_03',
                questionText: 'Having high profile responsibility.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '1',
            },
            {
                ucpCode: 'CL_LK5_JAC_01',
                questionText: 'Taking charge and implementing new initiatives.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '2',
            },
            {
                ucpCode: 'CL_LK5_JAC_03',
                questionText: 'Providing vision concerning long term goals.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '3',
            },
            {
                ucpCode: 'CL_LK5_JAC_02',
                questionText: 'Making significant change in the area of responsibility.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '4',
            },
            {
                ucpCode: 'CL_LK5_JAS_01',
                questionText: 'Determining work procedures for others, assigning specific duties',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '5',
            },
            {
                ucpCode: 'CL_LK5_JAD_01',
                questionText: 'Making final decisions',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '6',
            },
            {
                ucpCode: 'CL_LK5_JAP_01',
                questionText: 'Holding others accountable when tasks or projects don’t go well.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '7',
            },
            {
                ucpCode: 'CL_LK5_JAM_04',
                questionText: 'Relying on deep expertise.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '8',
            },
            {
                ucpCode: 'CL_LK5_JAP_03',
                questionText: 'Bargaining or negotiating with others to win their support.',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '9',
            },
            {
                ucpCode: 'CL_LK5_JAU_02',
                questionText: 'Often collaborating to get work done',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '10',
            },
            {
                ucpCode: 'CL_LK5_JAU_01',
                questionText: 'Interacting with customers',
                sliderValue: 3.804934876,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '11',
            },
            {
                ucpCode: 'CL_LK5_JAP_04_R',
                questionText: 'Relying on social skills.',
                sliderValue: 2.930992416,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '12',
            },
            {
                ucpCode: 'CL_LK5_JAP_02',
                questionText: 'Influencing without formal authority.',
                sliderValue: 2.930992416,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '13',
            },
            {
                ucpCode: 'CL_LK5_JAP_04',
                questionText: 'Relying more on technical than social skills.',
                sliderValue: 2.930992416,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '14',
            },
            {
                ucpCode: 'CL_LK5_JAS_03',
                questionText: 'Carefully following rules and regulations',
                sliderValue: 2.930992416,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '15',
            },
            {
                ucpCode: 'CL_LK5_JAS_02',
                questionText: 'Following detailed instructions from supervisors.',
                sliderValue: 2.930992416,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '16',
            },
            {
                ucpCode: 'CL_LK5_JAR_04',
                questionText: 'Doing one task or activity at a time and working at a steady pace.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '17',
            },
            {
                ucpCode: 'CL_LK5_JAC_04',
                questionText: 'Following established processes for predictable outcomes.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '18',
            },
            {
                ucpCode: 'CL_LK5_JAR_02',
                questionText: 'Achieving goals with constrained or limited resources.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '19',
            },
            {
                ucpCode: 'CL_LK5_JAR_01',
                questionText: 'Often meeting challenging time demands.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '20',
            },
            {
                ucpCode: 'CL_LK5_JAA_01',
                questionText: 'Analyzing and synthesizing information',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '21',
            },
            {
                ucpCode: 'CL_LK5_JAM_03',
                questionText: 'Solving problems that have no obvious correct answers.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '22',
            },
            {
                ucpCode: 'CL_LK5_JAM_02',
                questionText: 'Often doing something unfamiliar.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '23',
            },
            {
                ucpCode: 'CL_LK5_JAM_01',
                questionText: 'Tackling quick changing objectives.',
                sliderValue: 3.810214521,
                sliderMinimum: 1,
                sliderMaximum: 5,
                order: '24',
            },
        ],
        driverCultureRankings: [
            {
                name: 'Collaborative',
                description: 'Shared Mission, Continuous Development and Improvement, Collaboration, Empowerment',
                cultureCode: 'JS_COL_CULTR_CARD',
                order: '1',
                value: '1',
            },
            {
                name: 'Innovative',
                description: 'Entrepreneurship, Market Foresight and Disruption, Cutting Edge Innovation, Strategic Partnership',
                cultureCode: 'JS_INN_CULTR_CARD',
                order: '2',
                value: '3',
            },
            {
                name: 'Structured',
                description: 'Efficiency, Structure, Control, Consistency, Rules, Tradition, Norms, Performance, Accountability',
                cultureCode: 'JS_REG_CULTR_CARD',
                order: '3',
                value: '5',
            },
            {
                name: 'Competitive',
                description: 'Competition, Customer and External Focus, Drive for Results, Market Share,',
                cultureCode: 'JS_CMP_CULTR_CARD',
                order: '4',
                value: '7',
            },
        ],
    },
    properties: {
        jobProperties: [
            {
                id: '1266',
                benchmark: '1',
                props: {
                    id: '30875'
                }
            },
            {
                id: '1270',
                props: {
                    id: '226694'
                }
            }
        ]
    },
    hasJobEvaluationAccess: true,
    hasEditJobEvaluationAccess: true,
    shortProfile: 'A1',
    jobCode: '',
    hideJobInPM: 0,
    isGradeOverriddenByJE: true,
    showBCRecommendations: false,
    showTCRecommendations: false,
};

function flattenSuccessProfile(job: any): any {
    const result = _.cloneDeep(job);
    _.forEach(result.sections, (section) => {
        const subCategories = _.flatMap(section.categories, 'subCategories');
        _.assign(section, {
            subCategories,
            categories: undefined,
        });
    });
    return result;
}

export const successProfile = flattenSuccessProfile(SUCCESS_PROFILE_MOCK);
