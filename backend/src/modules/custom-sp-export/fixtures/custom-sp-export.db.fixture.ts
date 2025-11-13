import { getJson } from './csv';
import {
    BehavioralCompetencyRaw,
    DriverRaw,
    EducationRaw,
    GeneralExperienceRaw,
    SpRaw,
    ManagerialExperienceRaw,
    ResponsibilityRaw,
    SkillRaw,
    TraitRaw,
} from '../interfaces';

export const competenciesRaw: BehavioralCompetencyRaw[] =
    getJson<BehavioralCompetencyRaw>('competencies');

export const driversRaw: DriverRaw[] = getJson<DriverRaw>('drivers');

export const educationRaw: EducationRaw[] = getJson<EducationRaw>('educations');

export const generalExperienceRaw: GeneralExperienceRaw[] =
    getJson<GeneralExperienceRaw>('general-experiences');

export const managerialExperienceRaw: ManagerialExperienceRaw[] =
    getJson<ManagerialExperienceRaw>('managerial-experiences');

export const responsibilitiesRaw: ResponsibilityRaw[] =
    getJson<ResponsibilityRaw>('responsibilities');

export const skillsRaw: SkillRaw[] = getJson<SkillRaw>('skills');

export const traitsRaw: TraitRaw[] = getJson<TraitRaw>('traits');

export const spRaw: SpRaw[] = getJson<SpRaw>('success-profiles');
