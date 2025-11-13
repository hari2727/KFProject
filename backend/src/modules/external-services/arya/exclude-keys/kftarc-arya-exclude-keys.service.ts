import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { KfTarcExcludeKeysInterface } from './kftarc-arya-exclude-keys.interface';
import { ARYA_EXCLUDE_KEYS } from './kftarc-arya-exclude-keys.schema';
import { MongoDbConnectionName } from '../../../../models/mongo-db.const';

const state = {
    dbResult: null,
};

@Injectable()
export class KfTarcExcludeKeysService {
    constructor(
        @InjectModel(ARYA_EXCLUDE_KEYS, MongoDbConnectionName.SuccessProfile)
        protected model: Model<KfTarcExcludeKeysInterface>,
    ) {
        this.getExcludeKeys();
    }

    protected async getExcludeKeys() {
        if (state?.dbResult) {
            return;
        }
        const [result] = await this.model.find().lean();

        state.dbResult = {};

        state.dbResult.jobTitles = [];
        state.dbResult.skills = [];

        result?.jobTitles.forEach(o => {
            state.dbResult.jobTitles.push(o.toLowerCase());
        });

        result?.skills.forEach(o => {
            state.dbResult.skills.push(o.toLowerCase());
        });
    }

    segregateSkills(aryaSkills: any[]) {
        state.dbResult.skills.forEach(o => {
            let i = 0;
            while (i < aryaSkills.length) {
                const element: string = aryaSkills[i].name;

                const condition = element.toLowerCase().includes(o);

                if (condition) {
                    aryaSkills.splice(i, 1);
                    continue;
                }
                i++;
            }
        });
    }

    segregateJobTitles(aryaJobTitles: any[]) {
        state.dbResult.jobTitles.forEach(o => {
            let i = 0;
            while (i < aryaJobTitles.length) {
                const element: string = aryaJobTitles[i].name;
                const condition = element.toLowerCase().includes(o);
                if (condition) {
                    const tmp = element.split(/[ \/.()+-]+/g);
                    if (!o.includes(' ')) {
                        for (let el of tmp) {
                            if (el.toLowerCase().includes(o.toLowerCase())) {
                                aryaJobTitles.splice(i, 1);
                                i--;
                                break;
                            }
                        }
                    } else {
                        aryaJobTitles.splice(i, 1);
                        continue;
                    }
                }
                i++;
            }
        });
    }
}
