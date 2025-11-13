import * as _ from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
    AfterViewInit, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnDestroy, OnInit,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GroupSelectItem, SelectItem } from '@kf-products-core/kfhub_thcl_lib/transform';

import { Accordion, ExpansionPanel } from '@kf-products-core/kfhub_thcl_lib/presentation';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'csp-kfthcl-nested-filter',
    templateUrl: './csp-nested-filter.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CspNestedDropdown),
        multi: true,
    }],
    styleUrls: ['./csp-nested-filter.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CspNestedDropdown implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

    @Input() placeholderTerm: string;
    items: GroupSelectItem[];

    search = '';
    readonly searchTerm$ = new BehaviorSubject<string>('');
    searchSub: Subscription;

    public onChange: (items: GroupSelectItem[]) => void = _.noop;

    public onTouched: Function;

    @ViewChild(Accordion, { static: true }) accordion: Accordion;

    constructor(
        public elementRef: ElementRef,
        private cd: ChangeDetectorRef,
    ) { }

    writeValue(items: SelectItem<SelectItem<string>[]>[]): void {
        this.items = items;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    ngOnInit() {
        this.searchSub = this.searchTerm$.pipe(
            debounceTime(250),
            distinctUntilChanged(),
        ).subscribe((term) => {
            if (!this.items) {
                return;
            }
            const trimmedTerm = term.trim();
            if (_.isEmpty(trimmedTerm)) {
                this.items.forEach(item => {
                    item.visible = true;

                    item.value.forEach((subItem, i) => {
                        subItem.visible = true;
                    });
                });

                setTimeout(() => {
                    this.togglePanels('close', 'visible');
                }, 0);
                this.cd.markForCheck();

                return;
            }

            const regex = new RegExp(_.escapeRegExp(term.trim()), 'i');

            this.items.forEach((item) => {
                item.visible = false;
                item.value.forEach((subItem, i) => {
                    subItem.visible = subItem.label.search(regex) > -1;
                    item.visible = item.visible || subItem.visible;

                    if (i === item.value.length - 1 && !item.visible) {
                        item.visible = item.label.search(regex) > -1;
                    }
                });
            });

            setTimeout(() => {
                this.togglePanels('open', 'visible');
            }, 0);
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.togglePanels('open', 'checked');
        }, 0);
    }

    ngOnDestroy(): void {
        if (this.searchSub) {
            this.searchSub.unsubscribe();
        }
    }

    onChangeSearch(searchTerm: string) {
        if (searchTerm.length === 1) {
            return;
        }

        this.searchTerm$.next(searchTerm);
    }

    onChangeItem(item: GroupSelectItem, checked: boolean, panel: ExpansionPanel) {
        item.value.forEach(v => v.checked = checked);

        if (checked) {
            panel.open();
        }

        this.onChange(this.items);
    }

    onChangeSubItem(item: GroupSelectItem, i: number, checked: boolean) {
        item.value[i].checked = checked;
        item.checked = item.value.some(v => v.checked);

        this.onChange(this.items);
    }

    private togglePanels(toggle: keyof Pick<ExpansionPanel, 'open' | 'close'>, ...props: ('visible' | 'checked')[]) {

        const isOpenFilterFn = (panel: ExpansionPanel) =>
            props.some((prop) => panel.optionalData[prop] === (toggle === 'open'));

        const panelsToOpen = this.accordion.panels.filter(isOpenFilterFn);
        const panelsToClose = this.accordion.panels.filter(p => !isOpenFilterFn(p));

        panelsToOpen.forEach((panel) => panel['open']());
        panelsToClose.forEach((panel) => panel['close']());
    }
}
