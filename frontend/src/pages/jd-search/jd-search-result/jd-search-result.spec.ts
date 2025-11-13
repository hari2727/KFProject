/* eslint-disable max-classes-per-file */
import { CdkTableModule } from '@angular/cdk/table';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { KfIconModule } from '@kf-products-core/kfhub_lib/presentation';
import { TranslateMockModule } from '@kf-products-core/kfhub_lib/testing';
import { KfTableModule, KfTableUi, ThclDropdownModule } from '@kf-products-core/kfhub_thcl_lib/presentation';
import { fireEvent, render, waitFor } from '@testing-library/angular';

import { jdColumns, jdColumnSource } from '../jd-search.constant';
import { JdMenuCell, JdSearchRow } from '../jd-search.model';
import { JdSearchResultComponent } from './jd-search-result.component';
import { SpTypeEnum } from '@kf-products-core/kfhub_thcl_lib/domain';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const fakeDataSource: JdSearchRow[] = [{
    createdBy: 'CLM Test Company 2 User',
    date: 'Feb 05, 2021',
    function: 'Corporate Affairs',
    id: '132234' as any,
    level: 'Individual Contributor',
    menu: {
        accessRoles: 'READ_EDIT_PUBLISH_DELETE',
        enableProfileMatchTool: true,
        id: '132234' as any,
        jobRoleTypeId: 'HYX03',
        profileType: SpTypeEnum.Custom,
        source: [{
            id: 26436,
            type: 'LAST_MODIFIED_BY',
        }, {
            id: 26436,
            type: 'CREATED_BY',
        }],
        standardHayGrade: '21' as any,
        title: 'Chief Wellness Officer COPY',
        totalPoints: 954,
    } as JdMenuCell,

    name: {
        href: '/tarc/sp/detail/132224',
        text: 'Cyber Security Analyst I COPY',
    },
}];

test('renders the shown rows of total rows numbers', async () => {
    const { component } = await setup();

    component.getByText('1 of 20', { exact: false });
});


async function setup() {
    const inputs = {
        columns: jdColumns,
        columnSource: jdColumnSource,
        dataSource: fakeDataSource,
        totalRows: 20
    };

    const outputs = {
        onScrollDown: { emit: jest.fn() } as any,
    };

    const props = {
        pageIndex: 1
    };

    const componentProperties = { ...inputs, ...outputs, ...props };

    const component = await render(JdSearchResultComponent, {
        componentProperties,
        imports: [
            TranslateMockModule,
            RouterTestingModule,
            CdkTableModule,
            KfIconModule,
            ThclDropdownModule,
            KfTableModule,
        ],
        schemas: [NO_ERRORS_SCHEMA],
    });

    return {
        component,
    };
}
