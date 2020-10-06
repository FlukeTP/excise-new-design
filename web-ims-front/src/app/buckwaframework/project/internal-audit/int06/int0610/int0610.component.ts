import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/index';
import { MessageService } from 'services/message.service';

const URL = {
  SEARCH: "ia/int06/10/find-tabs",
  SAVE: "ia/int06/10/save",
  GET_AUDIT_INC_GF_NO: "ia/int06/10/get-dropdown/audit-inc-gf-no",
  FIND_BY_AUDIT_INC_GF_NO: "ia/int06/10/find-by/audit-inc-gf-no",
  EXPORT: "ia/int06/10/export",
}
declare var $: any;
@Component({
  selector: 'app-int0610',
  templateUrl: './int0610.component.html',
  styleUrls: ['./int0610.component.css']
})
export class Int0610Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];

  /* departments */
  sectors: any[] = [];
  areas: any[] = [];

  /* form */
  submitted: boolean = false;
  formSearch: FormGroup = new FormGroup({});
  formConclude: FormGroup = new FormGroup({});

  /* loading */
  loading: boolean = false;

  /* tab */
  tabs: any[] = [];
  flagTab: number;
  flagExport: string = "N";
  table: any[] = [];

  auditIncGfNoList: any[] = [];

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) { }

  ngOnInit() {
    this.initialVariable();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    this.getAuditIncGfNo();
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
  }

  changeFlagTab = (index: number) => {
    this.flagTab = index;
    this.table = this.tabs[index].tab;
    // this.loading = false;
  }

  dropdownChange(e, flagDropdown: string) {
    if ("0" !== e.target.value && "" !== e.target.value) {
      /* ____________ set office code ____________ */
      if (flagDropdown === 'SECTOR') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);

        /* ____________ clear dropdown ____________ */
        this.areas = [];
        $("#area").dropdown('restore defaults');

        /* ____________ get area list ____________  */
        this.department.getArea(this.formSearch.get('officeCode').value).subscribe(response => { this.areas = response.data });
      } else if (flagDropdown === 'AREA') {
        this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);
      }
    }
  }

  search() {
    this.submitted = true;
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }

    /* ________ loading ________ */
    this.loading = true;

    /* ________ clear data ________ */
    this.tabs = [];
    this.table = [];

    this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        if (response.data.length > 0) {
          this.flagTab = 0;
          this.tabs = response.data;
          this.table = response.data[0].tab;
        }
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  save(e) {
    e.preventDefault();
    /* ________ loading ________ */
    this.loading = true;

    let request = {
      header: {
        officeCode: "",
        incMonthFrom: "",
        incMonthTo: "",
        incYearFrom: "",
        incYearTo: "",
        auditFlag: "",
        incgfConditionText: "",
        incgfCreteriaText: ""
      },
      details: []
    }

    /* _______ set heder _______ */
    request.header = {
      officeCode: this.tabs[0].officeCode,
      incMonthFrom: this.tabs[0].incMonthFrom,
      incMonthTo: this.tabs[0].incMonthTo,
      incYearFrom: this.tabs[0].incYearFrom,
      incYearTo: this.tabs[0].incYearTo,
      auditFlag: this.formConclude.get('auditFlag').value,
      incgfConditionText: this.formConclude.get('incgfConditionText').value,
      incgfCreteriaText: this.formConclude.get('incgfCreteriaText').value
    }

    /* _______ set details _______ */
    let seq: number = 1;
    this.tabs.forEach(data => {
      data.tab.forEach(t => {
        t.summary.forEach(s => {
          request.details.push({
            incGfdSeq: seq,
            disbDept: data.exciseOrgDisb.officeCode,
            disburseUnit: data.exciseOrgDisb.disburseUnit,
            incomeCode: s.incomeCode,
            incNetTaxAmt: s.netTaxAmt,
            glAccNo: t.accNo,
            glNetTaxAmt: t.carryForward
          });
        });
      });
      seq++;
    });

    this.ajax.doPost(URL.SAVE, request).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.msg.successModal(response.message);
        this.getAuditIncGfNo();
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    }, () => {
      this.formConclude.get('auditIncGfNo').patchValue(this.auditIncGfNoList[this.auditIncGfNoList.length - 1].auditIncGfNo);
    });
  }

  getAuditIncGfNo() {
    this.ajax.doGet(URL.GET_AUDIT_INC_GF_NO).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.auditIncGfNoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  clearData() {
    this.flagExport = 'N';
    this.submitted = false;
    this.areas = [];
    this.tabs = [];
    this.table = [];
    $('#sector').dropdown('restore defaults');
    $('#area').dropdown('restore defaults');
    this.initialVariable();
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
    }, 100);
  }

  auditIncGfNoChange(e) {
    this.loading = true;
    this.ajax.doPost(URL.FIND_BY_AUDIT_INC_GF_NO, e.target.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.flagExport = "Y";
        this.flagTab = 0;
        this.tabs = response.data.dataList;
        this.table = response.data.dataList[0].tab;

        /* ______ set header ______ */
        this.formSearch.get('officeCode').patchValue(response.data.exciseDepartmentVo.officeCode);
        this.formSearch.get('sector').patchValue(response.data.exciseDepartmentVo.sector);
        this.formSearch.get('area').patchValue(response.data.exciseDepartmentVo.area);
        this.formSearch.get('periodFrom').patchValue(response.data.monthPeriodFrom);
        this.formSearch.get('periodTo').patchValue(response.data.monthPeriodTo);
        this.formConclude.get('auditFlag').patchValue(response.data.auditFlag);
        this.formConclude.get('incgfConditionText').patchValue(response.data.incgfConditionText);
        this.formConclude.get('incgfCreteriaText').patchValue(response.data.incgfConditionText);

        setTimeout(() => {
          $(".ui.dropdown").dropdown();
        }, 100);
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  export() {
    this.ajax.download(`${URL.EXPORT}/${this.formSearch.value.auditIncGfNo.replace("/", "_")}}`);
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#periodFromCld').calendar({
      endCalendar: $('#periodToCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('periodFrom').patchValue(text);
      }
    }).css("width", "100%");

    $('#periodToCld').calendar({
      startCalendar: $('#periodFromCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSearch.get('periodTo').patchValue(text);
      }
    }).css("width", "100%");
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      officeCode: [''],
      periodFrom: ['', [Validators.required, Validators.minLength(3)]],
      periodTo: ['', [Validators.required, Validators.minLength(3)]],
      auditIncGfNo: [''],
    });
    this.formConclude = this.fb.group({
      auditFlag: [''],
      incgfConditionText: [''],
      incgfCreteriaText: [''],
    })
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}
