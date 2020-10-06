import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ResponseData } from 'models/response-data.model';
import { Store } from '@ngrx/store';
import { FormSearch } from './ope07.model';
import { AddFormSearch } from './ope07.action';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';
import * as moment from 'moment';
import { Observable } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-ope07',
  templateUrl: './ope07.component.html',
  styleUrls: ['./ope07.component.css']
})
export class Ope07Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "การวิเคราะห์แนวโน้มภาพรวมการเสียภาษี", route: "#" },
  ];
  formSearch: FormSearch
  formGroup: FormGroup
  taxTypeList: any;
  loading: boolean = false;
  dataStore: any;
  previousYearList: string[] = ['1', '2', '3', '4', '5'];
  saerch: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<any>,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getTaxTypeList();
    this.dataStore = this.store.select(state => state.ope07).subscribe(res => {
      console.log('ngOnInit store ==>', res)

      if (Utils.isNull(res.formSearch.taxType)) { this.taxTypeChange(res.formSearch.taxType); }

      this.radioChange(res.formSearch.checkType);
      this.formGroup.patchValue({
        taxType: res.formSearch.taxType,
        checkType: res.formSearch.checkType,
        budgetYear: res.formSearch.budgetYear,
        monthStart: res.formSearch.monthStart, //TextDateTH.months[parseInt(res.formSearch.monthStart)],
        monthEnd: res.formSearch.monthEnd, //TextDateTH.months[parseInt(res.formSearch.monthEnd)],
        previousYear: res.formSearch.previousYear,
        newRegId: res.formSearch.newRegId,
        cusFullname: res.formSearch.cusFullname,
        facFullname: res.formSearch.facFullname,
      });
      $("#taxType").dropdown('set selected', this.formGroup.get('taxType').value);
    });

  }
  ngAfterViewInit(): void {
    $("#taxType").dropdown('set selected', this.formGroup.get('taxType').value);
    $("#previousYear").dropdown();
    this.callCalendarDefault('calendarBudgetYear', 'budgetYear', 'year', 'year')
    this.callCalendarDefault('calendarMonthStart', 'monthStart', 'month', 'month-year')
    this.callCalendarDefault('calendarMonthEnd', 'monthEnd', 'month', 'month-year')
  }
  callCalendarDefault(id: string, formControlName: string, type: string, format: string, maxDate: Date = new Date()): void {
    let startCalendar = '';
    if (formControlName == 'monthEnd') {
      startCalendar = $("#calendarMonthStart")
    }
    var maxDateMoment = moment(maxDate);
    var newMaxDate = new Date();
    if (0 >= Math.ceil(maxDateMoment.diff(moment(), 'months', true))) {
      newMaxDate = maxDate;
    }

    $(`#${id}`).calendar({
      startCalendar: startCalendar,
      maxDate: newMaxDate,
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(`${format}`),
      onChange: (date, text) => {
        let result = text;
        if ("monthStart" == formControlName) {
          var addDate = moment(date).add(11, 'M').toDate();
          this.formGroup.get('monthEnd').reset();
          this.callCalendarDefault('calendarMonthEnd', 'monthEnd', 'month', 'month-year', addDate);
        }
        // if (format == 'month') {
        //   result = TextDateTH.months.findIndex(e => e == result)
        //   result = String(parseInt(result));
        //   this.formGroup.get('budgetYear').patchValue(date.getFullYear() + 543)
        // }

        this.formGroup.get(`${formControlName}`).patchValue(result);
        console.log('callCalendarDefault formGroup.value', this.formGroup.value)
      }
    });
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      taxType: ['', Validators.required],
      checkType: ['1'],
      budgetYear: [''],
      monthStart: [''],
      monthEnd: [''],
      previousYear: [''],
      newRegId: [''],
      cusFullname: [''],
      facFullname: [''],
      monthNum: [0]
    })
  }
  validateField(name: string) {
    this.formGroup.get(name).valid;
    return this.formGroup.get(name).invalid && this.saerch;
  }

  search() {
    this.saerch = true;
    if (!this.formGroup.invalid) {
      console.log('search ==> ', this.formGroup.value)
      this.calculateMonth().subscribe(res => {
        this.addDataStore();
      });
    }
  }
  clear() {
    this.saerch = false;
    console.log('clear')
    this.formGroup.reset();
    this.formGroup.patchValue({ checkType: '1' });
    this.addDataStore();
    this.router.navigate(['/ope07']);
  }
  radioChange(value) {
    console.log('radioChange', value)
    if (value == '1') {
      this.formGroup.get('budgetYear').enable();
      this.formGroup.get('monthStart').disable();
      this.formGroup.get('monthEnd').disable();
      // this.formGroup.patchValue({
      //   budgetYear: '',
      //   newRegId: '',
      //   cusFullname: '',
      // })
    } else if (value == '2') {
      this.formGroup.get('budgetYear').disable();
      this.formGroup.get('monthStart').enable();
      this.formGroup.get('monthEnd').enable();
      // this.formGroup.patchValue({
      //   monthStart: '',
      //   monthEnd: '',
      //   newRegId: '',
      //   cusFullname: '',
      // })
    } else { }
  }

  calculateMonth(): Observable<any> {
    return new Observable(obs => {
      if (Utils.isNotNull(this.formGroup.get('monthStart').value) && Utils.isNotNull(this.formGroup.get('monthEnd').value)) {
        let splitStart = this.formGroup.get('monthStart').value.split("/");
        let splitEnd = this.formGroup.get('monthEnd').value.split("/");
        let myDateStart = moment([parseInt(splitStart[1]) - 543, parseInt(splitStart[0]) - 1, 1]);
        let myDateEnd = moment([parseInt(splitEnd[1]) - 543, splitEnd[0] - 1, 1]);

        let diff = myDateEnd.diff(myDateStart, 'months');
        console.log('diff', diff)
        this.formGroup.get('monthNum').patchValue(diff + 1);
        obs.next(diff + 1);
      } else {
        obs.next(12);
      }
    })
  }

  taxTypeChange(taxType) {
    // if(Utils.isNull(this.formGroup.get('taxType').value)){
    // this.addDataStore();
    // }

    switch (this.formGroup.get('taxType').value) {
      case "A1": this.router.navigate(['/ope07/1']); break;
      case "A2": this.router.navigate(['/ope07/2']); break;
      case "A3": this.router.navigate(['/ope07/3']); break;
      default: {
        break;
      }
    }
    // this.formGroup.patchValue({
    //   budgetYear: '',
    //   monthStart: '',
    //   monthEnd: '',
    //   previousYear: '',
    //   newRegId: '',
    //   cusFullname: '',
    // })
    if ('A1' == taxType) {
      this.formGroup.get('checkType').patchValue('1');
      this.formGroup.get('checkType').enable();
      this.formGroup.get('budgetYear').enable();
      this.formGroup.get('monthStart').disable();
      this.formGroup.get('monthEnd').disable();
      this.formGroup.get('previousYear').disable();
    } else if ('A2' == taxType) {
      this.formGroup.get('checkType').patchValue('2');
      this.formGroup.get('checkType').disable();
      this.formGroup.get('budgetYear').disable();
      this.formGroup.get('monthStart').enable();
      this.formGroup.get('monthEnd').enable();
      this.formGroup.get('previousYear').enable()      
    } else if ('A3' == taxType) {
      this.formGroup.get('checkType').patchValue('1');
      this.formGroup.get('checkType').disable();
      this.formGroup.get('budgetYear').enable();
      this.formGroup.get('monthStart').disable();
      this.formGroup.get('monthEnd').disable();
      this.formGroup.get('previousYear').enable()
    } else { }
  }

  addDataStore() {
    this.formSearch = {
      taxType: this.formGroup.get('taxType').value,
      checkType: this.formGroup.get('checkType').value,
      budgetYear: this.formGroup.get('budgetYear').value,
      monthStart: this.formGroup.get('monthStart').value,
      monthEnd: this.formGroup.get('monthEnd').value,
      previousYear: this.formGroup.get('previousYear').value,
      newRegId: this.formGroup.get('newRegId').value,
      cusFullname: this.formGroup.get('cusFullname').value,
      monthNum: this.formGroup.get('monthNum').value,
      facFullname: this.formGroup.get('facFullname').value
    }
    //this.formSearch = this.formGroup.value as FormSearch;
    console.log('addDataStore', this.formSearch)
    this.store.dispatch(new AddFormSearch(this.formSearch));
  }
  //======================= backend =========================

  getTaxTypeList() {
    this.ajax.doPost('preferences/parameter/OA_ANALYSIS_TAX_TYPE', {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getTaxTypeList ==> ", res.data);
        this.taxTypeList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log('Error getTaxTypeList !');
      }
    });
  }

}
