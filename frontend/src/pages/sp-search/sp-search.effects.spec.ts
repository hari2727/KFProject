import { createSpyObj } from 'jest-createspyobj';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { KfFilterMetadata } from '@kf-products-core/kfhub_lib';
import { KfThclSuccessprofileService } from '@kf-products-core/kfhub_thcl_lib';
import { LocalStorageService } from '@kf-products-core/kfhub_thcl_lib/persistence';
import { Actions, getEffectsMetadata } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { actionFilterQuery } from './sp-search.actions';
import { SpSearchFilterEnum } from './sp-search.constant';
import { SpSearchEffects } from './sp-search.effects';
import { FEATURE_NAME, SpSearchState, State } from './sp-search.state';

import * as spSearchPure from './sp-search.pure';
import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';
import { HttpService } from '../../app/services/http.service';


const metadataResponse = [{
    id: '4',
    name: 'SEARCH_SUCCESS_PROFILES',
    searchOn: [{
        id: '10',
        name: 'LEVELS',
        options: [
            { id: '1', name: '1', value: 'CEO', },
            { id: '2', name: '2', value: 'Senior Executive', },
        ]
    }, {
        id: '12',
        name: 'FUNCTIONS',
        options: [
            {
                id: 'F1032111',
                name: 'F1032111',
                searchOn: {
                    name: 'SUBFUNCTIONS',
                    subOptions: [{
                        id: 'S1032111001', name: 'S1032111001', value: 'SubFunc_1'
                    }]
                }
            },
        ]
    }]
}] as KfFilterMetadata[];

const scheduler = new TestScheduler((actual, expected) =>
    expect(actual).toEqual(expected)
);

describe('SpSearchEffects', () => {
    let localStorage: jest.Mocked<LocalStorageService>;
    let store: jest.Mocked<Store<unknown>>; // TODO replace type any.
    let spService: jest.Mocked<KfThclSuccessprofileService>;
    let httpService: jest.Mocked<HttpService>;

    beforeEach(() => {
        localStorage = createSpyObj(LocalStorageService);
        store = createSpyObj(Store);
        spService = createSpyObj(KfThclSuccessprofileService);
        httpService = createSpyObj(HttpService);
    });

    test('should not dispatch searchChange action', () => {
        const actions$ = new Actions();
        const effect = new SpSearchEffects(httpService, spService, actions$, store as Store<State>, localStorage);
        const metadata = getEffectsMetadata(effect);

        expect(metadata.filterChange.dispatch).toEqual(false);
    });

    test('should not dispatch filterChange action', () => {
        const actions$ = new Actions();
        const effect = new SpSearchEffects(httpService, spService, actions$, store as Store<State>, localStorage);
        const metadata = getEffectsMetadata(effect);

        expect(metadata.filterChange.dispatch).toEqual(false);
    });

    test('should dispatch filterQuery action', () => {
        const actions$ = new Actions();
        const effect = new SpSearchEffects(httpService, spService, actions$, store as Store<State>, localStorage);
        const metadata = getEffectsMetadata(effect);

        expect(metadata.filterQuery.dispatch).toEqual(true);
    });

});


const mapSpSearchFiltersReturn: {
    type: SpSearchFilterEnum[];
    term: string;
    items: (SelectItem<string> | GroupSelectItem)[];
}[] = [{
    type: [SpSearchFilterEnum.ProfileType],
    term: 'lib.PROFILE_TYPE',
    items: [
        { label: 'Level Profiles', id: '1', value: '1', visible: true, checked: false, data: { description: 'description' }, icon: 'profile-level' },
    ]
},
{
    type: [SpSearchFilterEnum.Grades],
    term: 'lib.GRADES',
    items: [{ label: 'a', id: 'a', value: 'a', visible: true, checked: false }]
},
{
    type: [SpSearchFilterEnum.Levels],
    term: 'lib.LEVELS',
    items: [
        { label: 'CEO', id: '1', value: '1', visible: true, checked: false },
    ]
},
{
    type: [SpSearchFilterEnum.Functions, SpSearchFilterEnum.SubFunctions],
    term: 'lib.FUNCTIONS_SUBFUNCTIONS',
    items: [{
        label: '02.19.2021 CL weekly smoke added function',
        id: 'F1032111',
        value: [{
            label: '02.19.2021 CL weekly smoke added subfunc 1',
            id: 'S1032111001',
            value: 'S1032111001',
            visible: true,
            checked: false
        }] as unknown as SelectItem<string>,
        visible: true,
        checked: false,
    } as unknown as GroupSelectItem]
}];
