import { Schema } from 'mongoose';

export const ARYA_INDUSTRIES = 'AryaIndustries';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const KfAryaIndustriesSchema = new Schema({
    id: Number,
    name: String,
});
