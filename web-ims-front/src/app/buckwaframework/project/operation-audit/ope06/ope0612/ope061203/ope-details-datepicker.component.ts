import { Component, Input, EventEmitter, Output, SimpleChange } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/index';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    selector: 'ope-details-datepicker',
    template: `
        <div class="ui centered grid">
            <div class="eight wide column center">
                <div class="content">
                    <div class="ui form" [formGroup]="changeDetail">
                        <div class="inline fields">
                            <div class="three wide field">
                                <label class="custom-label-w-20 text-right full-width">วันเริ่มต้น</label>
                            </div>
                            <div class="six wide field">
                                <div class="ui calendar" style="width:100%" id="dateCalendarFrom">
                                    <div class="ui input left icon">
                                        <i class="calendar alter nate outline icon"></i>
                                        <input type="calendar" placeholder="วว/ดด/ปปปป" id="dateFrom" formControlName="dateFrom"
                                            name="dateFrom" autocomplete="off">
                                    </div>
                                </div>
                            </div>
                            <div class="three wide field">
                                <label class="custom-label-w-20 text-right full-width">วันที่เดินทาง</label>
                            </div>
                            <div class="six wide field">
                                <div class="ui calendar" style="width:100%" id="dateCalendarTo">
                                    <div class="ui input left icon">
                                        <i class="calendar alter nate outline icon"></i>
                                        <input type="calendar" placeholder="วว/ดด/ปปปป" id="dateTo" formControlName="dateTo" name="dateTo"
                                            autocomplete="off">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class OpeDetailsDatePickerComponent {

    @Input() dateTo: string = "";
    @Output() dateToChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() dateFrom: string = "";
    @Output() dateFromChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() month: number = 1;
    months: any[] = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    planForm: FormGroup;
    changeDetail: FormGroup;
    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {
        this.initialVariable();
        this.changeDetail = this.fb.group({
            id: [''],
            month: [''],
            dateFrom: [''],
            dateTo: [''],
            submitted: ['']
        })
    }

    ngOnInit() {
        // Initial
        $("#year").dropdown('set selected', 2562).css('min-width', '100%');
        $('.dropdown').dropdown();
        let dateMaxFrom = new Date();
        let dateFrom = new Date();
        let dateTo = new Date();
        if (this.dateTo && this.dateFrom && this.month) {
            const dF = this.dateFrom.split('/');
            const dT = this.dateTo.split('/');
            dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
            dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
        }
        $("#dateCalendarFrom").calendar({
            type: "date",
            endCalendar: $('#dateCalendarTo'),
            text: TextDateTH,
            initialDate: dateFrom,
            maxDate: dateMaxFrom,
            formatter: formatter(),
            onChange: (date, text, mode) => {
                // dateFrom.patchValue(text);
                this.dateFromChange.emit(text);
            }
        });
        $("#dateCalendarTo").calendar({
            type: "date",
            startCalendar: $('#dateCalendarFrom'),
            text: TextDateTH,
            initialDate: dateTo,
            formatter: formatter(),
            onChange: (date, text, mode) => {
                // dateTo.patchValue(text);
                this.dateToChange.emit(text);
            }
        });
    }

    ngOnChanges(changes: SimpleChange) {
        if ((changes.previousValue != changes.currentValue) && this.dateTo && this.dateFrom) {
            const dF = this.dateFrom.split('/');
            const dT = this.dateTo.split('/');
            const dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
            const dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
            $("#dateCalendarFrom").calendar('set date', dateFrom);
            $("#dateCalendarTo").calendar('set date', dateTo);
        }
    }

    toSubPage(path: any) {
        this.router.navigate(['/' + path]);
    }

    initialVariable() {
        this.planForm = this.fb.group({
            year: [{ value: "", disabled: false }, Validators.required]
        })
    }

    progressClass(progress: number) {
        if (progress <= 24 && progress >= 0) {
            return 'ui progress red';
        } else if (progress <= 50 && progress >= 25) {
            return 'ui active progress';
        } else if (progress <= 75 && progress >= 51) {
            return 'ui progress warning';
        } else if (progress <= 100 && progress >= 76) {
            return 'ui progress success';
        }
    }

}