import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TextDateTH, formatter } from 'helpers/index';
import { ExciseService } from 'services/index';

declare var $: any;
@Component({
  selector: 'app-int01-details-datepicker',
  templateUrl: './int01-details-datepicker.component.html',
  styleUrls: ['./int01-details-datepicker.component.css']
})
export class Int01DetailsDatepickerComponent implements OnInit {

  @Input() dateTo: string = "";
  @Output() dateToChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() dateFrom: string = "";
  @Output() dateFromChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() month: number = 1;

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "แผนประจำปี สารละลายประเภทไฮโดรคาร์บอน", route: "#" }
  ];
  months: any[] = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  planForm: FormGroup;
  changeDetail: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private exciseService: ExciseService
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

  }

  ngAfterViewInit() {
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