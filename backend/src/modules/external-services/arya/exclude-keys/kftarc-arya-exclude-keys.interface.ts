import { Document } from 'mongoose';

export interface KfTarcExcludeKeysInterface extends Document {
    skills: string[];
    jobTitles: string[];
}
