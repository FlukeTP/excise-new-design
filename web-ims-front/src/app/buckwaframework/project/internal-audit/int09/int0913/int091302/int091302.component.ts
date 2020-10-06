import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { IA_CONSTANTS } from 'projects/internal-audit/constants/params-group.model';
import { ParameterInfo } from 'models/parameter-info.model';
import * as moment from 'moment';
import { PhoneFormatPipe } from 'app/buckwaframework/common/pipes/phone-format.pipe';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

const URL = {
  SAVE: "ia/int091301/find-091302-save",
  DROPDOWN: "preferences/parameter",
  GET_DATA: "ia/int091301/find-091301-search",
  GET_DEPARTMENT: "ia/int091301/get-091301-department",
}

declare var $: any;
@Component({
  selector: 'app-int091302',
  templateUrl: './int091302.component.html',
  styleUrls: ['./int091302.component.css']
})
export class Int091302Component implements OnInit {
  [x: string]: any;
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];

  formPublicUtility: FormGroup = new FormGroup({});
  formHeader: FormGroup = new FormGroup({});
  submitted: boolean = false;
  dropdownPublicUtility: ParameterInfo[];
  dropdownReason: ParameterInfo[];

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initVariable()
    this.dropdown();
    this.formPublicUtility.get('utilityBillSeq').setValue(this.route.snapshot.queryParams["id"] || null);
    this.formPublicUtility.get('exciseCode').setValue(this.route.snapshot.queryParams["param2"] || null);
    if (this.formPublicUtility.get('utilityBillSeq').value != null) {
      this.getData();
    }
    if (this.formPublicUtility.get('exciseCode').value != null) {
      this.getDepartmentLogin();
    }
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.calendar();
  }

  dropdown() {
    this.ajax.doPost(`${URL.DROPDOWN}/${IA_CONSTANTS.PARAMS_GROUP.IA_UTILITY_BILL_TYPE}`, { groupCode: IA_CONSTANTS.PARAMS_GROUP.IA_UTILITY_BILL_TYPE }).subscribe((response: ResponseData<ParameterInfo[]>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.dropdownPublicUtility = response.data;
      }
      else {
        this.msg.errorModal(response.message);
      }
    });

    this.ajax.doPost(`${URL.DROPDOWN}/${IA_CONSTANTS.PARAMS_GROUP.IA_UTILITY_BILL_REASON}`, { groupCode: IA_CONSTANTS.PARAMS_GROUP.IA_UTILITY_BILL_REASON }).subscribe((response: ResponseData<ParameterInfo[]>) => {
      if (response.status === MessageService.MSG.SUCCESS) {
        this.dropdownReason = response.data;
      }
      else {
        this.msg.errorModal(response.message);
      }
    });
  }

  getDepartmentLogin() {
    this.ajax.doGet(`${URL.GET_DEPARTMENT}/${this.formPublicUtility.get('exciseCode').value}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.formHeader.get('officeCode').patchValue(response.data.officeCode);
        this.formHeader.get('sector').patchValue(new IsEmptyPipe().transform(response.data.sector));
        this.formHeader.get('area').patchValue(new IsEmptyPipe().transform(response.data.area));
        this.formHeader.get('branch').patchValue(new IsEmptyPipe().transform(response.data.branch));
        this.formHeader.get('offShortName').patchValue(new IsEmptyPipe().transform(response.data.offShortName));
        console.log(this.formHeader.value);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  routeTo(path: string, value?: any) {
    this.router.navigate([path]);
  }

  getData() {
    this.ajax.doPost(URL.GET_DATA, { utilityBillSeq: this.formPublicUtility.get('utilityBillSeq').value, flagSearch: "Y" }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        if (response.data.length > 0) {
          /* update values */
          this.formPublicUtility.patchValue({
            utilityBillSeq: response.data[0].utilityBillSeq,
            ubillType: response.data[0].ubillType,
            monthWdPay: response.data[0].monthWdPay,
            invoiceMonth: response.data[0].invoiceMonth,
            invoiceNo: response.data[0].invoiceNo,
            telInvNumber: response.data[0].telInvNumber,
            invoiceDate: response.data[0].invoiceDate,
            receiveInvDate: response.data[0].receiveInvDate,
            invoiceAmt: response.data[0].invoiceAmt,
            reqWdDate: response.data[0].reqWdDate,
            reqWdNo: response.data[0].reqWdNo,
            reqWdAmt: response.data[0].reqWdAmt,
            reqTaxAmt: response.data[0].reqTaxAmt,
            reqPayNo: response.data[0].reqPayNo,
            reqNetAmt: response.data[0].reqNetAmt,
            reqReceiptDate: response.data[0].reqReceiptDate,
            // dayAmount: response.data[0].dayAmount,
            latePayCause: response.data[0].latePayCause,
            ubillRemark: response.data[0].ubillRemark,
            exciseCode: response.data[0].exciseCode
          });
          /* _______ calculate difference day  _______ */
          this.calculateDay(response.data[0].reqWdDate, response.data[0].receiveInvDate);

          /*  _______ set default dropdown  _______ */
          $('#ubillType').dropdown('set selected', response.data[0].ubillType);
          $('#latePayCause').dropdown('set selected', response.data[0].latePayCause);

          /*  _______ get departmentVo  _______ */
          this.getDepartmentLogin();
        }
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  save(e) {
    e.preventDefault();
    this.submitted = true;

    if (this.formPublicUtility.get('dayAmount').value >= 15) {
      this.formPublicUtility.get('latePayCause').clearValidators();
      this.formPublicUtility.get('latePayCause').updateValueAndValidity();
    } else {
      this.formPublicUtility.get('latePayCause').setValidators([Validators.required]);
      this.formPublicUtility.get('latePayCause').updateValueAndValidity();
    }

    if (this.formPublicUtility.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    console.log("formPublicUtility: ", this.formPublicUtility.value);
    this.ajax.doPost(URL.SAVE, this.formPublicUtility.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.msg.successModal(response.message)
        this.routeTo('/int09/13/01');
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  formatPhoneNumber(e, control) {
    return this.formPublicUtility.get(control).patchValue(new PhoneFormatPipe().transform(e.target.value));
  }

  /* _________________ calculate difference day _________________ */
  calculateDay(startDate: string, endDate: string) {
    console.log(startDate);
    console.log(endDate);
    let _endDate = moment(endDate, "DD/MM/YYYY");
    let _start = moment(startDate, "DD/MM/YYYY")

    if (!isNaN(_endDate.diff(_start, 'days'))) {
      return this.formPublicUtility.get('dayAmount').patchValue(_start.diff(_endDate, 'days'))
    } else {
      return this.formPublicUtility.get('dayAmount').patchValue("");
    }
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#monthWdPayCld').calendar({
      type: "month",
      text: TextDateTH,
      maxDate: new Date(),
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formPublicUtility.get('monthWdPay').patchValue(text);
      }
    }).css("width", "100%");

    $('#invoiceMonthCld').calendar({
      type: "month",
      text: TextDateTH,
      maxDate: new Date(),
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formPublicUtility.get('invoiceMonth').patchValue(text);
      }
    }).css("width", "100%");

    $('#reqWdDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formPublicUtility.get('reqWdDate').patchValue(text);
        this.calculateDay(this.formPublicUtility.get('reqWdDate').value, this.formPublicUtility.get('receiveInvDate').value);
      }
    }).css("width", "100%");

    $('#invoiceDateCld').calendar({
      type: "date",
      text: TextDateTH,
      maxDate: new Date(),
      formatter: formatter(),
      onChange: (date, text) => {
        this.formPublicUtility.get('invoiceDate').patchValue(text);
      }
    }).css("width", "100%");

    $('#reqReceiptDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formPublicUtility.get('reqReceiptDate').patchValue(text);
      }
    }).css("width", "100%");

    $('#receiveInvDateCld').calendar({
      type: "date",
      text: TextDateTH,
      maxDate: new Date(),
      formatter: formatter(),
      onChange: (date, text) => {
        this.formPublicUtility.get('receiveInvDate').patchValue(text);
        this.calculateDay(this.formPublicUtility.get('reqWdDate').value, this.formPublicUtility.get('receiveInvDate').value);
      }
    }).css("width", "100%");
  }

  /* _________________ initVariable _________________ */
  initVariable() {
    this.formPublicUtility = this.fb.group({
      utilityBillSeq: [null], // primary key
      ubillType: ["", Validators.required],
      monthWdPay: ["", Validators.required],
      invoiceMonth: [""],
      invoiceNo: [""],
      telInvNumber: ["", Validators.maxLength(10)],
      invoiceDate: [""],
      receiveInvDate: [""],
      invoiceAmt: [""],
      reqWdDate: [""],
      reqWdNo: [""],
      reqWdAmt: ["", Validators.required],
      reqTaxAmt: [""],
      reqPayNo: [""],
      reqNetAmt: [""],
      reqReceiptDate: [""],
      dayAmount: [{ value: "", disabled: true }],
      latePayCause: ["", Validators.required],
      ubillRemark: [""],
      exciseCode: [""],
    });

    this.formHeader = this.fb.group({
      /* departmentVo */
      sector: [""],
      area: [""],
      branch: [""],
      officeCode: [""],
      offShortName: [""],
    });
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formPublicUtility.get(control).invalid;
  }

}
