import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/index';
import * as moment from 'moment';
import { Utils } from 'helpers/index';

declare var $: any;

@Component({
  selector: 'app-ta010101',
  templateUrl: './ta010101.component.html',
  styleUrls: ['./ta010101.component.css']
})
export class Ta010101Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();

  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b08.label, route: this.b.b08.route }
  ];

  loading: boolean = false;
  condForm: FormGroup;
  numMonthLevel: any[];
  dateStart: any;
  dateEnd: any;
  submitted: boolean = false;
  hasCondForm: boolean = false;
  rangeTypeUndef: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router,
  ) { }

  // ================= Initial setting =====================
  ngOnInit() {
    this.setCondForm();

    this.getMainCondRange();
    this.getLastCondForm();
  }

  ngAfterViewInit(): void {
    this.callDropDown();
    $("#calendarYear").calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date, text) => {
        this.condForm.get("budgetYear").patchValue(text);
        this.getCondForm();
      }
    });
    $("#regDateStart").calendar({
      // endCalendar: $('#regDateEnd'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.condForm.get('regDateStart').patchValue(text);
        let regDateStart = moment(date);
        let regDateEnd = this.condForm.get('regDateEnd').value.split("/");
        let newRegDateEnd = moment(`${regDateEnd[2]-543}-${regDateEnd[1]}-${regDateEnd[0]}`);
        
        if (regDateStart.isAfter(newRegDateEnd, 'days')) {
          this.condForm.get('regDateEnd').patchValue("");
        }
      }
    });
    $("#regDateEnd").calendar({
      startCalendar: $('#regDateStart'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.condForm.get('regDateEnd').patchValue(text);
      }
    });
    $("#calendarAnalysisStart").calendar({
      // endCalendar: $('#calendarAnalysisEnd'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.condForm.get('calendarAnalysisStart').patchValue(text);
        //compare compMonthNum
        let compMonthNum = this.condForm.get('compMonthNum').value;
        let compareYearStart = moment(date).add(543, "y").add(-12, 'month');
        this.condForm.get('compareYearStart').patchValue(compareYearStart.format("MM/YYYY"));

        this.dateStart = date;
        // call compareYearEnd
        let calendarAnalysisEnd = moment(date).add(543, 'y').add(compMonthNum-1, "month");
        let compareYearEnd = moment(date).add(543, "y").add(-12, 'month').add(compMonthNum-1, 'month');
        this.condForm.get('calendarAnalysisEnd').patchValue(calendarAnalysisEnd.format('MM/YYYY'));
        this.condForm.get('compareYearEnd').patchValue(compareYearEnd.format('MM/YYYY'));
      }
    });
    $("#calendarAnalysisEnd").calendar({
      // startCalendar: $('#calendarAnalysisStart'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.condForm.get('calendarAnalysisEnd').patchValue(text);
        //compare before 1 year
        let compMonthNum = this.condForm.get('compMonthNum').value;
        let compareYearEnd = moment(date).add(543, "y").add(-12, 'month');
        this.condForm.get('compareYearEnd').patchValue(compareYearEnd.format("MM/YYYY"));

        this.dateEnd = date;
        // call compareYearStart
        let calendarAnalysisStart = moment(date).add(543, 'y').add(-compMonthNum+1, 'month');
        let compareYearStart = moment(date).add(543, "y").add(-12, 'month').add(-compMonthNum+1, 'month');
        this.condForm.get('calendarAnalysisStart').patchValue(calendarAnalysisStart.format('MM/YYYY'));
        this.condForm.get('compareYearStart').patchValue(compareYearStart.format('MM/YYYY'));
      }
    });

  }

  callDropDown = () => {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  setCondForm() {
    this.condForm = this.fb.group({
      budgetYear: [""],
      condNumber: [""],
      noTaxAuditYearNum: ["", Validators.required],
      taxFreqType: ["2"],
      compMonthNum: [null, Validators.required],
      rangeTypeStart: ["undefined", Validators.required],
      rangeStart: ["", Validators.required],
      riskLevel: ["4"],
      condType: ["T"],
      regDateStart: ["", Validators.required],
      regDateEnd: ["", Validators.required],
      calendarAnalysisStart: [""],
      calendarAnalysisEnd: [""],
      compareYearStart: [""],
      compareYearEnd: [""],
    })
  }

  // ===================== Action ===========================
  clear() {
    this.setCondForm();
    this.callDropDown();
  }

  save() {
    const URL = "ta/master-condition-main/ta010101-create/";
    this.submitted = true;
    if (this.condForm.invalid) {
      this.msg.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      return;
    }
    this.rangeTypeUndef = false;
    if ("undefined" == this.condForm.get('rangeTypeStart').value) {
      this.msg.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      this.rangeTypeUndef = true;
      return;
    }
    this.msg.comfirm(confirm => {
      if (confirm) {
        this.loading = true;
        this.ajax.doPost(URL, this.condForm.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.condForm.get('condNumber').patchValue(res.data);
            this.msg.successModal(res.message);
            this.getCondForm();
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
          this.submitted = false;
        })
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  goTo() {
    const URL = "ta/tax-operator/save-draft/";
    let data = {
      start: 0,
      length: 0,
      dateRange: this.condForm.get('compMonthNum').value * 2,
      dateStart: this.condForm.get('calendarAnalysisStart').value,
      dateEnd: this.condForm.get('calendarAnalysisEnd').value,
      budgetYear: this.condForm.get('budgetYear').value,
      condNumber: this.condForm.get('condNumber').value
    }
    this.loading = true;
    this.ajax.doPost(URL, data).subscribe((resp: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == resp.status) {
        this.msg.successModal(resp.message);
        this.router.navigate(["/tax-audit-new/ta01/03"], {
          queryParams: {
            monthNum: this.condForm.get('compMonthNum').value * 2,
            yearMonthStart: this.condForm.get('calendarAnalysisStart').value,
            yearMonthEnd: this.condForm.get('calendarAnalysisEnd').value,
            yearMonthStartCompare: this.condForm.get('compareYearStart').value,
            yearMonthEndCompare: this.condForm.get('compareYearEnd').value,
            condNumber: this.condForm.get('condNumber').value,
            budgetYear: this.condForm.get('budgetYear').value
          }
        })
      } else {
        this.msg.errorModal(resp.message);
      }
      this.loading = false;
    })

  }

  isValidator(formControlName: string) {
    return this.submitted && this.condForm.get(formControlName).errors;
  }

  // ======================= call back-end ====================
  getMainCondRange() {
    const URL = "ta/master-condition-main/get-main-cond-range/";
    this.loading = true;
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.numMonthLevel = [];
        res.data.forEach(element => {
          if ("Y" == element.value2) {
            this.numMonthLevel.push({
              value: element.paramCode,
              text: element.value1
            })
          }
        });
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  getCondForm() {
    const URL = "ta/master-condition-main/ta010101-get/";
    this.loading = true;
    this.ajax.doPost(URL, this.condForm.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.setCondForm();
        this.hasCondForm = false;
        if (Utils.isNotNull(res.data.condNumber)) {
          this.hasCondForm = true;
        }
        this.condForm.get('condNumber').patchValue(res.data.condNumber);
        this.condForm.get('noTaxAuditYearNum').patchValue(res.data.noTaxAuditYearNum);
        this.condForm.get('compMonthNum').patchValue(res.data.compMonthNum);
        this.condForm.get('rangeTypeStart').patchValue(res.data.rangeTypeStart);
        this.condForm.get('rangeStart').patchValue(res.data.rangeStart);
        this.condForm.get('regDateStart').patchValue(res.data.regDateStart);
        this.condForm.get('regDateEnd').patchValue(res.data.regDateEnd);
        if (Utils.isNull(res.data.regDateEnd)) {
          let currDate = moment().add(543, 'y')
          this.condForm.get('regDateEnd').patchValue(currDate.format("DD/MM/YYYY"));
        }
        if (Utils.isNull(res.data.rangeTypeStart)) {
          this.condForm.get('rangeTypeStart').patchValue("undefined");
          $(".selectRangeType option[value='undefined']").attr('selected', 'selected');
        }
        this.callDropDown();
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  getLastCondForm() {
    const URL = "ta/master-condition-main/ta010101-get-last-budget-year/";
    this.loading = true;
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.setCondForm();
        this.hasCondForm = false;
        if (Utils.isNotNull(res.data.condNumber)) {
          this.hasCondForm = true;
        }
        this.condForm.get('budgetYear').patchValue(res.data.budgetYear);
        if (Utils.isNull(res.data.budgetYear)) {
          this.condForm.get('budgetYear').patchValue(moment().add(543, 'y').format('YYYY'));
        }
        this.condForm.get('condNumber').patchValue(res.data.condNumber);
        this.condForm.get('noTaxAuditYearNum').patchValue(res.data.noTaxAuditYearNum);
        this.condForm.get('compMonthNum').patchValue(res.data.compMonthNum);
        this.condForm.get('rangeTypeStart').patchValue(res.data.rangeTypeStart);
        this.condForm.get('rangeStart').patchValue(res.data.rangeStart);
        this.condForm.get('regDateStart').patchValue(res.data.regDateStart);
        this.condForm.get('regDateEnd').patchValue(res.data.regDateEnd);
        if (Utils.isNull(res.data.regDateEnd)) {
          let currDate = moment().add(543, 'y')
          this.condForm.get('regDateEnd').patchValue(currDate.format("DD/MM/YYYY"));
        }
        if (Utils.isNull(res.data.rangeTypeStart)) {
          this.condForm.get('rangeTypeStart').patchValue("undefined");
          $(".selectRangeType option[value='undefined']").attr('selected', 'selected');
        }
        this.callDropDown();
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })
  }
}
