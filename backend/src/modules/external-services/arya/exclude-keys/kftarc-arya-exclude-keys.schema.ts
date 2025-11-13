import { Schema } from 'mongoose';

export const ARYA_EXCLUDE_KEYS = 'exclude_arya_keys';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const KfAryaExcludeKeysSchema = new Schema({
    skills: [String],
    jobTitles: [String],
});
