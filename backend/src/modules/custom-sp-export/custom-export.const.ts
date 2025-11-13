import { HcmSpExportData } from './interfaces';

export const BATCH_SIZE = 4000;
export const LIGHTWEIGHT_ENTRIES_BATCH_SIZE = 3000;
export const HEADERS_COLOR = '#E2F0D9';

export const CSV_SHEET_NAME_MAP: Record<keyof HcmSpExportData, string> = {
    competencies: 'behavioralCompetencies',
    drivers: 'drivers',
    education: 'education',
    generalExperiences: 'generalExperience',
    managerialExperiences: 'managerialExperience',
    responsibilities: 'responsibilities',
    skills: 'skills',
    successProfiles: 'successProfiles',
    tasks: 'tasks',
    tools: 'tools',
    traits: 'traits',
};
