import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { TextDateTH, formatter } from 'helpers/index';
import { ResponseData } from 'models/response-data.model';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

const URL = {
  GET_WS_PM_PY2: "ia/int13/03/get-ws-pm-py2",
  GET_IA_PM_PY2: "ia/int13/03/get-ia-pm-py2",
  SAVE_IA_PM_PY2: "ia/int13/03/save-pm-py2",
  GET_AUDIT_PY2_NO: "ia/int13/03/get-dropdown-auditpy2no",
  UPDATE_IA_PM_PY2: "ia/int13/03/update-ia-pm-py2"
}

declare var $: any;
@Component({
  selector: 'app-int1303',
  templateUrl: './int1303.component.html',
  styleUrls: ['./int1303.component.css']
})
export class Int1303Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบแบบประเมินระบบควบคุมภายใน", route: "#" },
    { label: "แบบสอบถาม", route: "#" }
  ];

  /* form */
  formSearch: FormGroup = new FormGroup({});
  formHeader: FormGroup = new FormGroup({});
  submitted: boolean = false;

  /* flag seacrh */
  flagSearch: boolean = true;

  /* loading */
  loading: boolean = false;

  /* dropdown */
  details: any[] = [];
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  AuditPy2NoList: any[] = [];

  /* request update */
  updateDetails: any[] = [];

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
    this.department.getSector().subscribe(response => { this.sectors = response.data });    //get sector list
    this.getAuditPy2NoDropdown();   //get AuditPy2NoList
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown();
    // .css("width", "100%");
    this.calendar();
  }

  initialVariable() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators],
      branch: [''],
      officeCode: [''],
      auditPy2No: [''],

      budgetYear: [MessageService.budgetYear()]
    });

    /* __________________ formHeader _____________________ */
    this.formHeader = this.fb.group({
      pmPy2HSeq: [''],
      py2AuditResult: [''],
      py2AuditEvident: [''],
      py2AuditSuggestion: [''],
      py2ActivityResult: ['']
    });
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#budgetYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('budgetYear').patchValue(text);
      }
    }).css("width", "100%");
  }

  dropdownChange(e, flagDropdown: string) {
    // console.log("value: ", e.target.value);
    // console.log("flagDropdown: ", flagDropdown);

    /* ______ auditPy2No dropdown _____ */
    if (flagDropdown === 'No.') {
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.formSearch.get('officeCode').reset();
      this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
      this.formSearch.get('auditPy2No').patchValue(e.target.value);
      this.getIaPmPy2();
    } else {
      if ("0" != e.target.value && "" != e.target.value) {
        /* ____________ set office code ____________ */
        if (flagDropdown === 'SECTOR') {
          console.log("SECTOR: ", e.target.value);
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);

          /* ____________ clear dropdown ____________ */
          this.areas = [];
          this.branch = [];
          $("#area").dropdown('restore defaults');
          $("#branch").dropdown('restore defaults');

          /* ____________ set default value ____________ */
          this.formSearch.patchValue({ area: "0" });

          /* ____________ get area list ____________  */
          this.department.getArea(this.formSearch.get('officeCode').value).subscribe(response => { this.areas = response.data });
        } else if (flagDropdown === 'AREA') {
          console.log("AREA: ", e.target.value);
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);

          /* ____________ set default value ____________ */
          this.formSearch.patchValue({ branch: "0" });

          /* ____________ get branch list ____________  */
          this.department.getBranch(this.formSearch.get('officeCode').value).subscribe(response => { this.branch = response.data });
        } else if (flagDropdown === 'BRANCH') {
          console.log("BRANCH: ", e.target.value);
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('branch').value);
        }
      }
    }
  }

  search() {
    this.submitted = true;
    /* validator field */
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    /* loading */
    this.loading = true;

    this.ajax.doPost(URL.GET_WS_PM_PY2, {
      budgetYear: this.formSearch.get('budgetYear').value,
      officeCode: this.formSearch.get('officeCode').value,
      auditPy2No: this.formSearch.get('auditPy2No').value
    }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        if (response.data.headers != null) {
          this.formHeader.get('pmPy2HSeq').patchValue(this.details = response.data.headers.pmPy2HSeq);
        }
        if (response.data.details != null) {
          this.details = response.data.details;
        }
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  save(e) {
    e.preventDefault();
    this.loading = true;
    let dataFormHeader = {
      auditPy2No: this.formSearch.get('auditPy2No').value,
      offCode: this.formSearch.get('officeCode').value,
      formYear: this.formSearch.get('budgetYear').value,
      pmPy2HSeq: this.formHeader.get('pmPy2HSeq').value,
      py2AuditEvident: this.formHeader.get('py2AuditEvident').value,
      py2AuditSuggestion: this.formHeader.get('py2AuditSuggestion').value,
      py2AuditResult: this.formHeader.get('py2AuditResult').value,
      py2ActivityResult: this.formHeader.get('py2ActivityResult').value
    };

    if (this.flagSearch) {
      this.ajax.doPost(URL.SAVE_IA_PM_PY2, { headers: dataFormHeader, details: this.details }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
          /* ____________ get new AuditPy2NoList ____________ */
          this.getAuditPy2NoDropdown();

          /* ____________ restore data update ____________ */
          this.updateDetails = [];

          /* ____________ filter data by auditPy2No ____________ */
          this.formSearch.get('auditPy2No').patchValue(response.data);
          this.getIaPmPy2();
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;
      });
    } else {
      this.ajax.doPost(URL.UPDATE_IA_PM_PY2, { headers: dataFormHeader, details: this.updateDetails }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
          this.updateDetails = [];
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;
      });
    }
  }

  /* __________ on auditPy2No change ___________ */
  getIaPmPy2() {
    this.loading = true;
    this.flagSearch = false;
    this.ajax.doPost(URL.GET_IA_PM_PY2, this.formSearch.get('auditPy2No').value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        /* ______________ set data exciseDepartmentVo ______________*/
        this.formSearch.get('sector').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.sector));
        this.formSearch.get('area').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.area));
        this.formSearch.get('branch').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.branch));
        this.formSearch.get('budgetYear').patchValue(new IsEmptyPipe().transform(response.data.budgetYear));
        setTimeout(() => {
          $(".ui.dropdown").dropdown();
        }, 100);

        if (response.data.headers != null) {
          /* ____________ set data form header ____________ */
          this.formHeader.get('py2AuditResult').patchValue(response.data.headers.py2AuditResult);
          this.formHeader.get('py2AuditEvident').patchValue(response.data.headers.py2AuditEvident);
          this.formHeader.get('py2AuditSuggestion').patchValue(response.data.headers.py2AuditSuggestion);
          this.formHeader.get('py2ActivityResult').patchValue(response.data.headers.py2ActivityResult);
        }
        /* ____________ set data on table ____________ */
        this.details = response.data.details;
        this.loading = false;
      } else {
        this.msg.errorModal(response.message);
        this.loading = false;
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.loading = false;
    });
  }

  changeRadiosDtl(pmPy2DSeq: number, py2AuditResult: string, indexDtl: number, auditPy2DId?: number) {
    let params = { pmPy2DSeq, py2AuditResult, indexDtl, auditPy2DId };
    // console.log("pmPy2DSeq: ", pmPy2DSeq);
    // console.log("py2AuditResult: ", py2AuditResult);
    // console.log("indexDtl: ", indexDtl);
    // console.log("auditPy2DId: ", auditPy2DId);
    if (this.updateDetails.length > 0) {
      let index = this.updateDetails.findIndex(obj => obj.pmPy2DSeq == pmPy2DSeq);
      if (index == -1) {
        this.pushData(params);
      } else {
        /* ____________ change flag in updateDetails ____________ */
        this.updateDetails[index].py2AuditResult = py2AuditResult;

        /* ____________ change flag in details to show display ____________ */
        this.details[indexDtl].py2AuditResult = py2AuditResult;
      }
    } else {
      this.pushData(params);
    }
  }

  pushData(params: any) {
    let { pmPy2DSeq, py2AuditResult, indexDtl, auditPy2DId } = params;
    /* ____________ change flag in details to show display ____________ */
    this.details[indexDtl].py2AuditResult = py2AuditResult;

    /* ____________ push data to request update ____________ */
    this.updateDetails.push({
      auditPy2DId: auditPy2DId, py2AuditResult: py2AuditResult
    });
  }

  /* ______________ get AuditPy2No Dropdown ________________ */
  getAuditPy2NoDropdown() {
    this.ajax.doGet(`${URL.GET_AUDIT_PY2_NO}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.AuditPy2NoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  clearFormSearch() {
    this.submitted = false;
    this.flagSearch = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    this.areas = [];
    this.branch = [];
    this.formSearch.reset();
    this.formHeader.reset();
    this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
    this.initialVariable();
    setTimeout(() => {
      $(".ui.dropdown").dropdown().css("width", "100%");
      this.calendar();
    }, 100);
    this.details = [];
  }

}
