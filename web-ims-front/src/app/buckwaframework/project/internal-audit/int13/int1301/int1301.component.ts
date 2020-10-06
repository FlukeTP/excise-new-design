import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService, MessageService } from 'services/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

const URL = {
  SAVE_WS_PM_ASSESS: "ia/int13/01/save-ws-pm-assess",
  GET_WS_PM_ASSESS: "ia/int13/01/get-ws-pm-assess",
  GET_IA_PM_ASSESS: "ia/int13/01/get-ia-pm-assess",
  UPDATE_IA_PM_ASSESS: "ia/int13/01/update-ia-pm-assess",
  GET_AUDIT_PM_ASSESS_NO: "ia/int13/01/get-dropdown-auditpmassessno"
}

declare var $: any;
@Component({
  selector: 'app-int1301',
  templateUrl: './int1301.component.html',
  styleUrls: ['./int1301.component.css']
})
export class Int1301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบแบบประเมินระบบควบคุมภายใน", route: "#" },
    { label: "แบบประเมินองค์ประกอบการควบคุมภายใน (แบบ ปย.1) 5 ด้าน", route: "#" }
  ];

  formSearch: FormGroup = new FormGroup({});
  formHeader: FormGroup = new FormGroup({});
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  AuditPmAssessNoList: any[] = [];
  pmAssessData: any[] = [];
  flagHdr: number;
  datatable: any;
  detailView: any[] = [];
  loading: boolean = false;
  updateDetails: any[] = [];
  flagSearch: boolean = true;
  submitted: boolean = false;

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
    this.getAuditPmAssessNo();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown();
    // .css("width", "100%")
    this.calendar();
  }

  initialVariable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: [''],
      branch: [''],
      officeCode: [''],
      auditPmassessNo: [''],
      budgetYear: [MessageService.budgetYear()]
    });
    /* __________________ formHeader _____________________ */
    this.formHeader = this.fb.group({
      summary: [''],
      pmaAuditResult: [''],
      pmaAuditEvident: [''],
      pmaAuditSuggestion: [''],
    });
  }

  search() {
    this.submitted = true;
    /* validator field */
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    this.loading = true;
    this.pmAssessData = [];
    this.detailView = [];
    this.formHeader.get('summary').reset();
    this.ajax.doPost(URL.GET_WS_PM_ASSESS, {
      budgetYear: this.formSearch.get('budgetYear').value,
      officeCode: this.formSearch.get('officeCode').value,
      auditPmassessNo: this.formSearch.get('auditPmassessNo').value
    }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.pmAssessData = response.data.pmAssessData;
        if (response.data.pmAssessData.length > 0) {
          this.changeFlagBtn(0);
        } else {
          this.loading = false;
        }
      } else {
        this.loading = false;
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.loading = false;
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
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

    /* ______ auditPmassessNo dropdown _____ */
    if (flagDropdown === 'No.') {
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.formSearch.get('officeCode').reset();
      this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
      this.formSearch.get('auditPmassessNo').patchValue(e.target.value);
      this.getIaPmAssess();
    } else {
      if ("0" !== e.target.value && "" !== e.target.value) {
        /* ____________ set office code ____________ */
        if (flagDropdown === 'SECTOR') {
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
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);

          /* ____________ set default value ____________ */
          this.formSearch.patchValue({ branch: "0" });

          /* ____________ get branch list ____________  */
          this.department.getBranch(this.formSearch.get('officeCode').value).subscribe(response => { this.branch = response.data });
        } else if (flagDropdown === 'BRANCH') {
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('branch').value);
        }
      }
      // else {
      //   /* ____________ select all of type ____________ */
      //   if (flagDropdown === 'AREA') {
      //     this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);
      //   } else if (flagDropdown === 'BRANCH') {
      //     this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);
      //   }
      // }
    }
  }

  changeFlagBtn = (index: number) => {
    this.flagHdr = index;
    this.detailView = this.pmAssessData[index].detail;

    /* ____________ show header on dis play ____________ */
    this.formHeader.get('summary').patchValue(
      this.pmAssessData[index]["summary"] + "\n" +
      "ชื่อผู้ประเมิน :   " + new IsEmptyPipe().transform(this.pmAssessData[index].processBy) + "\n" +
      "ตำแหน่ง :   " + new IsEmptyPipe().transform(this.pmAssessData[index].processPosition) + "\n" +
      "วันที่ :   " + new IsEmptyPipe().transform(this.pmAssessData[index].processDateStr)
    );
    /* ____________ loaing ____________ */
    this.loading = false;
  }

  save(e) {
    e.preventDefault();
    this.loading = true;
    let dataFormHeader = {
      pmaAuditEvident: this.formHeader.get('pmaAuditEvident').value,
      pmaAuditSuggestion: this.formHeader.get('pmaAuditSuggestion').value,
      pmaAuditResult: this.formHeader.get('pmaAuditResult').value,
      auditPmassessNo: this.formSearch.get('auditPmassessNo').value
    }
    if (this.flagSearch) {
      this.ajax.doPost(URL.SAVE_WS_PM_ASSESS, { pmAssessData: this.pmAssessData, formHeader: dataFormHeader }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
          this.getAuditPmAssessNo();

          /* ____________ restore data update ____________ */
          this.updateDetails = [];
          this.loading = false;

          /* ____________ filter data by auditPmassessNo ____________ */
          this.formSearch.get('auditPmassessNo').patchValue(response.data);
          this.getIaPmAssess();
        } else {
          this.msg.errorModal(response.message);
          this.loading = false;
        }
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;
      });
    } else {
      this.ajax.doPost(URL.UPDATE_IA_PM_ASSESS, { header: dataFormHeader, detail: this.updateDetails }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
          this.updateDetails = [];
          this.loading = false;
          this.getIaPmAssess();
        } else {
          this.msg.errorModal(response.message);
          this.loading = false;
        }
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;
      });
    }
  }

  clickRadios(pmAssessDSeq: number, auditResult: string, indexHdr: number, indexDtl: number, auditPmDId?: number) {
    let params = { pmAssessDSeq, auditResult, indexHdr, indexDtl, auditPmDId };
    // console.log("pmAssessDSeq: ", pmAssessDSeq);
    // console.log("auditResult: ", auditResult);
    // console.log("indexHdr: ", indexHdr);
    // console.log("indexDtl: ", indexDtl);
    if (this.updateDetails.length > 0) {
      let index = this.updateDetails.findIndex(obj => obj.pmAssessDSeq == pmAssessDSeq);
      if (index == -1) {
        this.pushData(params);
      } else {
        /* ____________ change flag in updateDetails ____________ */
        this.updateDetails[index].auditResult = auditResult;

        /* ____________ change flag in pmAssessData to show display ____________ */
        this.pmAssessData[indexHdr].detail[indexDtl].auditResult = auditResult;
      }
    } else {
      this.pushData(params);
    }
  }

  pushData(params: any) {
    let { pmAssessDSeq, auditResult, indexHdr, indexDtl, auditPmDId } = params;
    this.pmAssessData[indexHdr].detail[indexDtl].auditResult = auditResult;
    this.updateDetails.push({
      auditPmDId: auditPmDId, auditResult: auditResult
    });
  }

  /* ______________ get Dropdown ________________ */
  getAuditPmAssessNo() {
    this.ajax.doGet(`${URL.GET_AUDIT_PM_ASSESS_NO}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.AuditPmAssessNoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  /* __________ on auditPmAssessNo change ___________ */
  getIaPmAssess() {
    this.loading = true;
    this.flagSearch = false;
    this.ajax.doPost(URL.GET_IA_PM_ASSESS, this.formSearch.get('auditPmassessNo').value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        /* ______________ set data exciseDepartmentVo ______________*/
        this.formSearch.get('sector').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.sector));
        this.formSearch.get('area').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.area));
        this.formSearch.get('branch').patchValue(new IsEmptyPipe().transform(response.data.exciseDepartmentVo.branch));
        this.formSearch.get('budgetYear').patchValue(new IsEmptyPipe().transform(response.data.budgetYear));
        setTimeout(() => {
          $(".ui.dropdown").dropdown();
        }, 100);

        /* ____________ set data on table ____________ */
        this.pmAssessData = response.data.header;
        if (response.data.header.length > 0) {
          /* ____________ set data form header ____________ */
          this.formHeader.get('pmaAuditEvident').patchValue(this.pmAssessData[0].pmaAuditEvident);
          this.formHeader.get('pmaAuditSuggestion').patchValue(this.pmAssessData[0].pmaAuditSuggestion);
          this.formHeader.get('pmaAuditResult').patchValue(this.pmAssessData[0].pmaAuditResult);

          this.changeFlagBtn(0);
        }
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

  // stackDataHeader(control: string, index: number) {
  //   if (control === 'pmaAuditEvident') {
  //     this.pmAssessData[index]["pmaAuditEvident"] = this.formHeader.get('pmaAuditEvident').value;
  //   } else if (control === 'pmaAuditSuggestion') {
  //     this.pmAssessData[index]["pmaAuditSuggestion"] = this.formHeader.get('pmaAuditSuggestion').value;
  //   } else if (control === 'pmaAuditResult') {
  //     this.pmAssessData[index]["pmaAuditResult"] = this.formHeader.get('pmaAuditResult').value;
  //   }
  // }

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
      $(".ui.dropdown").dropdown();
      this.calendar();
    }, 100);
    this.pmAssessData = [];
    this.detailView = [];
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}
