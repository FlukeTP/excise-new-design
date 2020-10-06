import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, digit } from 'app/buckwaframework/common/helper/datepicker';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { Router } from '@angular/router'; import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import * as moment from 'moment';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { ObjMonth } from '../../table-custom/table-custom.model';
declare var $: any;
@Component({
  selector: 'app-ta0401',
  templateUrl: './ta0401.component.html',
  styleUrls: ['./ta0401.component.css']
})
export class Ta0401Component implements OnInit {

  datas: any[] = []
  recordTotal: number = 0
  objMonth: ObjMonth = new ObjMonth();

  month: any;
  formatter1: any;
  formatter2: any;
  selectedStartMonth: any = null;
  selectedSEndMonth: any = null;
  selectStartDateObj: any = null;
  selectEndDateObj: any = null;
  submit: boolean = false;
  loading: boolean = false;
  mainCondFreqTypeList: ParamGroup[] = [];
  formGroup: FormGroup;
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'ค้นหาข้อมูลการชำระภาษีของผู้ประกอบการตามเงื่อนไขที่กำหนด', route: '#' },
  ];

  sectors: any[] = [];
  areas: any[] = [];
  facTypeList: any[] = [];
  taMainCondRange: ParamGroup[] = [];
  showTaxMonth: boolean = false;
  checkedRadio: string = '1';
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService
  ) {
    this.selectStartDateObj = null;
    this.formatter1 = formatter('month-year');
    this.formatter2 = formatter('month-year');
    this.formatter1.cell = (cell, date, cellOptions) => {
      if (date.getMonth() % TextDateTH.months.findIndex(obj => obj == $("#dateStart").val().split(" ")[0])) {
      }
    }
    this.formatter2.cell = (cell, date, cellOptions) => {
      if (date.valueOf() > new Date().valueOf()) {
        cell[0].className = "link disabled";
        return;
      }


      if (this.selectedStartMonth % 2 === 0) {
        if ((date.getMonth() % 2) === 1) {
          cell[0].className = "link";
        } else {
          cellOptions.disabled = true;
          cell[0].className = "link disabled";
        }
      } else if (this.selectedStartMonth % 2 === 1) {
        if ((date.getMonth() % 2) === 0) {
          cell[0].className = "link";
        } else {
          cell[0].className = "link disabled";
        }
      }
    }
  }

  // ====================datatable start
  pageChangeOutput(e) {
    console.log("pageChangeOutput e: ", e);
    this.formGroup.patchValue({
      start: e.start,
      length: e.length
    })

    if (this.formGroup.get('dateStart').valid && this.formGroup.get('dateEnd').valid && this.formGroup.get('radioChecked').value == '2') {
      this.getOperator(this.formGroup.value);
    } else {
      if (this.formGroup.get('budgetYear').valid && this.formGroup.get('radioChecked').value == '1') {
        this.getOperator(this.formGroup.value);
      }
    }
  }
  // ====================datatable end
  createForm() {
    this.formGroup = this.formBuilder.group({
      radioChecked: ['1'],
      budgetYear: [{ value: '', disabled: false }, Validators.required],
      dateStart: [{ value: '', disabled: true }, Validators.required],
      dateEnd: [{ value: '', disabled: true }, Validators.required],
      dateRange: [''],

      tax: [''],
      taxMonthStart: [0],
      taxMonthEnd: [0],

      taxHalf: [''],
      taxHalfPercent1: [0],
      taxHalfPercent2: [0],
      taxHalfPercent3: [0],

      except: [''],
      exceptMonthStart: [0],
      exceptMonthEnd: [0],

      exceptฺbetween: [''],
      exceptฺbetweenPercent: [0],

      newRegId: [''],

      start: [0],
      length: [10],
      flagPage: ['client-side']
    });
  }
  ngOnInit() {
    this.createForm();
    this.getSector();
    this.getFacTypeList();
    this.getMainCondFreqType();
    this.getTaMainCondRange();
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown();

    $("#calendarYear").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formGroup.get("budgetYear").patchValue(text);
        this.objMonth.yearMonthStart = "10/" + (parseInt(date.getFullYear()) + 542);
        this.objMonth.monthTotal = 12;
        this.objMonth.monthStart = 10;
        this.formGroup.get('dateRange').patchValue('12')
      }
    });

    $("#calendar").calendar({
      endCalendar: $("#calendar1"),
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter1,
      onChange: (date, text) => {
        this.selectedStartMonth = date.getMonth();
        this.selectStartDateObj = date;
        this.formGroup.get("dateStart").patchValue(text);
        this.objMonth.yearMonthStart = text;
      }
    });
    $("#calendar1").calendar({
      startCalendar: $("#calendar"),
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter2,
      onChange: (date, text) => {
        this.selectedSEndMonth = date.getMonth();
        this.selectEndDateObj = date;
        this.formGroup.get("dateEnd").patchValue(text);

        // calculate date range
        let dateS = moment([this.selectStartDateObj.getFullYear(), this.selectStartDateObj.getMonth(), 1]);
        let dateE = moment([date.getFullYear(), date.getMonth(), 1]);
        console.log("dateRange : ", dateE.diff(dateS, 'months', true) + 1);
        this.formGroup.get('dateRange').patchValue(dateE.diff(dateS, 'months', true) + 1);

        this.objMonth.monthTotal = this.formGroup.get('dateRange').value;
        this.objMonth.monthStart = this.selectStartDateObj.getMonth() + 1;
        this.objMonth.yearMonthEnd = text

        console.log("objMonth : ", this.objMonth)
      }
    });
    this.formGroup.get('radioChecked').patchValue('1');
    this.radioChange(this.formGroup.get('radioChecked').value);
  }

  radioChange(e) {
    this.checkedRadio = e;
    console.log("radioChange : ", this.formGroup.value)
    if (e == '1') {

      this.formGroup.get('budgetYear').enable();
      this.formGroup.get('dateStart').disable();
      this.formGroup.get('dateEnd').disable();

    } else {
      this.formGroup.get('budgetYear').disable();
      this.formGroup.get('dateStart').enable();
      this.formGroup.get('dateEnd').enable();
    }

    console.log(this.formGroup.get('budgetYear').disabled)
  }
  checkTax() {
    console.log("checkTax : ", this.formGroup.value);
    if (this.formGroup.get('taxMonthStart').value <= 0) {
      this.formGroup.get('taxMonthStart').patchValue(0);
    }
    if (this.formGroup.get('taxMonthEnd').value <= 0) {
      this.formGroup.get('taxMonthEnd').patchValue(0);
    }
  }

  onChangeSector(e) {
    $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 1 : months + 1;
  }

  search() {
    // set office code
    console.log("Search : ", this.formGroup.value);

    this.submit = true;
    if (this.formGroup.get('dateStart').valid && this.formGroup.get('dateEnd').valid && this.formGroup.get('radioChecked').value == '2') {
      console.log("search : ", this.formGroup.value);
      console.log("dateStart : ", this.formGroup.get('dateStart').valid);
      console.log("dateEnd : ", this.formGroup.get('dateEnd').valid);

      this.objMonth.yearMonthStart = this.formGroup.get('dateStart').value;
      this.objMonth.yearMonthEnd = this.formGroup.get('dateEnd').value;
      this.getOperator(this.formGroup.value);

    } else {

      console.log(this.formGroup.get('budgetYear').valid);
      if (this.formGroup.get('budgetYear').valid && this.formGroup.get('radioChecked').value == '1') {


        let date = moment(this.objMonth.yearMonthStart, "MM/YYYY");
        console.log("date : ", date);

        let addDateMonth = moment(date).add(this.objMonth.monthTotal - 1, 'month').calendar();

        let editYearMonthEnd = moment(addDateMonth).format("MM/YYYY");
        let arrYearMonthEnd = editYearMonthEnd.split("/");
        let newYearEnd = Number(arrYearMonthEnd[1]);
        let yearMonthEnd = (arrYearMonthEnd[0] + "/" + newYearEnd).toString();
        console.log("yearMonthStart : ", this.objMonth.yearMonthStart)
        console.log("yearMonth : ", yearMonthEnd)
        this.formGroup.get('dateStart').patchValue(this.objMonth.yearMonthStart);
        this.formGroup.get('dateEnd').patchValue(yearMonthEnd);
        this.objMonth.yearMonthStart = this.formGroup.get('dateStart').value;
        this.objMonth.yearMonthEnd = this.formGroup.get('dateEnd').value;
        console.log("search : ", this.formGroup.value);

        this.getOperator(this.formGroup.value);
        if (this.formGroup.get('radioChecked').value == '1') {
          this.formGroup.patchValue({
            dateStart: '',
            dateEnd: '',
          })
        }
      }
    }
  }

  clear() {
    this.submit = false;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    this.formGroup.reset();
    this.formGroup.patchValue({
      start: 0,
      length: 10,
      radioChecked: '1'

    })
    this.datas = [];
    console.log("clear formGroup", this.formGroup)
    this.radioChange(this.formGroup.get('radioChecked').value);
  }

  isRequired(name, radioChecked) {
    console.log('radioChecked : ', this.formGroup.get('radioChecked').value)
    console.log('checkedRadio : ', this.checkedRadio);
    return !this.formGroup.get(`${name}`).valid && this.submit && this.checkedRadio === radioChecked;
  }


  //===================================> backend <==============================

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }

  getOperator = (formvo): any => {
    this.loading = true;
    this.ajax.doPost("ta/tax-operator2/preview-data", formvo).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {


        res.data.datas.forEach(element => {
          element.sumTaxAmtG1 = this.formaterDecimal(element.sumTaxAmtG1);
          element.sumTaxAmtG2 = this.formaterDecimal(element.sumTaxAmtG2);
          element.taxAmtChnPnt = this.formaterDecimal(element.taxAmtChnPnt);
          element.taxAmtSd = this.formaterDecimal(element.taxAmtSd);
          element.taxAmtMaxPnt = this.formaterDecimal(element.taxAmtMaxPnt);
          element.taxAmtMean = this.formaterDecimal(element.taxAmtMean);
          element.taxAmtMinPnt = this.formaterDecimal(element.taxAmtMinPnt);
          element.regCapital = this.formaterDecimal(element.regCapital);
          for (let i = 0; i < element.taxAmtList.length; i++) {
            if ("-" != element.taxAmtList[i]) {
              element.taxAmtList[i] = this.formaterDecimal(element.taxAmtList[i]);
            }
          }
        });
        console.log("res getOperator : ", res.data.datas);
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getOperator  :", res.message);
      }
      this.loading = false;
    })
  }

  getMainCondFreqType() {
    this.ajax.doPost("preferences/parameter/TA_MAIN_COND_FREQ_TYPE", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getMainCondFreqType : ", res.data);
        this.mainCondFreqTypeList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getMainCondFreqType  :", res.message);
      }
    })
  }

  getFacTypeList() {
    this.ajax.doPost("preferences/parameter/EXCISE_FACTORY_TYPE", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.facTypeList = res.data;
        console.log("getFacTypeList : ", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

  getTaMainCondRange() {
    this.ajax.doPost("preferences/parameter/TA_MAIN_COND_RANGE", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getTaMainCondRange : ", res.data);
        this.taMainCondRange = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getMainCondFreqType  :", res.message);
      }
    })
  }

  formaterDecimal(value: any) {
    if (value == "" || value == null) {
      return "-";
    } else {
      return Utils.moneyFormatDecimal(value);
    }
  }
}

interface ParamGroup {
  paramCode: string;
  value1: string;
}
