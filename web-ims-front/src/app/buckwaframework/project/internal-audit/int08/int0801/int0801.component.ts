import { Component, OnInit } from "@angular/core";
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter, Utils } from 'helpers/index';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';

const URL = {
  GET_DROPDOWN: "preferences/org-gfmis/find/disburseunit-and-name",
  SEARCH: "ia/int08/01/search",
  SAVE: "ia/int08/01/save",
  AUDIT_GFTB_NO: "ia/int08/01/find/dropdown/audit-gftb-no",
  FIND_ALL: "ia/int08/01/find-all",
  EXPORT: "ia/int08/01/export/excel",
}

declare var $: any;
@Component({
  selector: "int0801",
  templateUrl: "./int0801.component.html",
  styleUrls: ["./int0801.component.css"]
})
export class Int0801Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];

  /* form */
  submitted: boolean = false;
  formSearch: FormGroup = new FormGroup({});
  formConclude: FormGroup = new FormGroup({});

  /* loading */
  loading: boolean = false;

  /* tab */
  tabs: any[] = [];
  flagTab: number = 1;
  flagBtn: string = '';
  table: any[] = [];

  /* dropdown */
  deptDisbList: any[] = [];
  auditGftbNoList: any[] = [];

  job: any;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    /* ________ variable ________ */
    this.initialVariable();

    /* ________ dropdown ________ */
    this.getGfDisburseUnitDropdown();
    this.getAuditGftbNoDropdown();
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
  }

  getGfDisburseUnitDropdown() {
    this.ajax.doPost(URL.GET_DROPDOWN, {}).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.deptDisbList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  search() {
    this.submitted = true;
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    this.loading = true;
    this.flagBtn = 'S';
    this.flagTab = 1;
    this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.tabs = response.data;
        if (this.tabs.length > 0) {
          this.table = this.tabs[0].table;
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

  changeFlagTab = (index: number) => {
    this.flagTab = index;
    if (this.tabs.length > 0) {
      this.table = this.tabs[index - 1].table;
      // this.loading = false;
    }
  }

  onBlurTestResult(e, idx: number, jdx: number) {
    this.tabs[idx].table[jdx].gftbTestResult = e.target.value;
  }

  save(e) {
    e.preventDefault();
    this.loading = true;

    this.ajax.doPost(URL.SAVE, {
      deptDisb: this.formSearch.get('deptDisb').value,
      period: this.formSearch.get('period').value,
      periodYear: this.formSearch.get('periodYear').value,
      gftbFlag: this.formConclude.get('gftbFlag').value,
      gftbConditionText: this.formConclude.get('gftbConditionText').value,
      gftbCreteriaText: this.formConclude.get('gftbCreteriaText').value,
      tabs: this.tabs
    }
    ).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.formSearch.get('auditGftbNo').patchValue(response.data);
        this.getAuditGftbNoDropdown();
        this.changeFlagTab(1);
        this.flagBtn = 'E';
        this.msg.successModal(response.message);
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    }, () => {
      setTimeout(() => {
        $(".ui.dropdown").dropdown();
      }, 100)
    });
  }

  getAuditGftbNoDropdown() {
    this.loading = true;
    this.ajax.doGet(URL.FIND_ALL).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.auditGftbNoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  auditGftbNoDropdownChange() {
    this.flagTab = 1; /* first tab */
    if (Utils.isNotNull(this.formSearch.get('auditGftbNo').value)) {
      this.flagBtn = 'E';   /* flag export */
      this.loading = true;   /* start loading */
      this.ajax.doPost(URL.AUDIT_GFTB_NO, this.formSearch.get('auditGftbNo').value).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          /* _______________ set header _______________ */
          this.formSearch.get('deptDisb').patchValue(response.data.deptDisb.concat(' - ').concat(response.data.gfExciseName));
          this.formSearch.get('period').patchValue(response.data.period);
          this.formSearch.get('periodYear').patchValue(response.data.periodYear);
          this.formConclude.get('gftbFlag').patchValue(response.data.gftbFlag);
          this.formConclude.get('gftbConditionText').patchValue(response.data.gftbConditionText);
          this.formConclude.get('gftbCreteriaText').patchValue(response.data.gftbCreteriaText);

          /* _______________ set details _______________ */
          this.tabs = response.data.tabs;
          if (this.tabs.length > 0) {
            this.table = this.tabs[0].table;
          }
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;   /* stop loading */
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;   /* stop loading */
      }, () => {
        setTimeout(() => {
          $(".ui.dropdown").dropdown();
        }, 100);
      });
    }
  }

  export() {
    console.log(this.formSearch.get('auditGftbNo').value.replace("/", ","));
    this.ajax.download(`${URL.EXPORT}/${this.formSearch.get('auditGftbNo').value.replace("/", ",")}`);
  }

  clearData() {
    this.flagBtn = '';
    this.flagTab = 1;
    this.submitted = false;
    this.tabs = [];
    this.table = [];
    this.initialVariable();
    $('.header-dropdown').dropdown('restore defaults');
    this.getGfDisburseUnitDropdown();
    this.getAuditGftbNoDropdown();
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
    }, 150);
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#periodYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('periodYear').patchValue(text);
      }
    }).css("width", "100%");
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      deptDisb: ['', Validators.required],
      period: ['', Validators.required],
      periodYear: ['', Validators.required],
      auditGftbNo: [''],
    });

    this.formConclude = this.fb.group({
      gftbFlag: [''],
      gftbConditionText: [''],
      gftbCreteriaText: [''],
    })
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }


}
