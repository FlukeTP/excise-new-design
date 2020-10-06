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
  SAVE_WS_QT: "ia/int13/04/save-ws-qt",
  GET_WS_QT: "ia/int13/04/get-ws-qt",
  GET_IA_PM_QT: "ia/int13/04/get-ia-pm-qt",
  UPDATE_IA_PM_QT: "ia/int13/04/update-ia-pm-qt",
  GET_AUDIT_PM_QT_NO: "ia/int13/04/get-dropdown-auditpmqtno"
}

declare var $: any;
@Component({
  selector: 'app-int1304',
  templateUrl: './int1304.component.html',
  styleUrls: ['./int1304.component.css'],
  providers: [DepartmentDropdownService]
})
export class Int1304Component implements OnInit {
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
  auditPmQtNoList: any[] = [];
  pmQtData: any[] = [];
  flagHdr: number;
  datatable: any;
  detailView: any[] = [];
  loading: boolean = false;
  updateDetails: any[] = [];
  flagSearch: boolean = true;
  submitted: boolean = false;
  namebutton: any[] = [];

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
    this.getauditPmQtNo();
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
      auditPmqtNo: [''],
      budgetYear: [MessageService.budgetYear()]
    });
    /* __________________ formHeader _____________________ */
    this.formHeader = this.fb.group({
      summary: [''],
      qtAuditEvident: [''],
      qtAuditResult: [''],
      qtAuditSuggestion: [''],
    });
  }

  search() {
    this.submitted = true;
    /* validator field */
    if (this.formSearch.invalid) {
      this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
      return;
    }
    this.loading = true;
    this.pmQtData = [];
    this.detailView = [];
    this.formHeader.get('summary').reset();
    this.ajax.doPost(URL.GET_WS_QT, {
      budgetYear: this.formSearch.get('budgetYear').value,
      officeCode: this.formSearch.get('officeCode').value,
      auditPmqtNo: this.formSearch.get('auditPmqtNo').value
    }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.pmQtData = response["data"]["pmQtData"];
        console.log(this.pmQtData);
        // this.namebutton = [];
        // for(let i = 0 ; i < this.pmQtData.length ; i++ ){
        //   this.namebutton.push(this.pmQtData[i].formName.slice(34 , this.pmQtData[i].formName.length));
        // }

        if (response["data"]["pmQtData"].length > 0) {
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

  dropdownChange(e, flagDropdown) {
    console.log("value: ", e.target.value);
    console.log("flagDropdown: ", flagDropdown);

    /* ______ auditPmQtNo dropdown _____ */
    if (flagDropdown === 'No.') {
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.formSearch.get('officeCode').reset();
      this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
      this.formSearch.get('auditPmqtNo').patchValue(e.target.value);
      this.getIaPmQt();
    } else {
      if ("0" != e.target.value && "" != e.target.value) {
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
    }
  }

  changeFlagBtn = (index: number) => {
    this.flagHdr = index;
    this.detailView = this.pmQtData[index]["detail"];

    /* ____________ show header on dis play ____________ */
    this.formHeader.get('summary').patchValue(
      this.pmQtData[index]["summary"] + "\n" +
      "ชื่อผู้ประเมิน :   " + new IsEmptyPipe().transform(this.pmQtData[index]["processBy"]) + "\n" +
      "ตำแหน่ง :   " + new IsEmptyPipe().transform(this.pmQtData[index]["processPosition"]) + "\n" +
      "วันที่ :   " + new IsEmptyPipe().transform(this.pmQtData[index]["processDateStr"])
    );
    /* ____________ loaing ____________ */
    this.loading = false;
  }

  save(e) {
    e.preventDefault();
    this.loading = true;
    let dataFormHeader = {
      qtAuditEvident: this.formHeader.get('qtAuditEvident').value,
      qtAuditSuggestion: this.formHeader.get('qtAuditSuggestion').value,
      qtAuditResult: this.formHeader.get('qtAuditResult').value,
      auditPmqtNo: this.formSearch.get('auditPmqtNo').value
    }
    if (this.flagSearch) {
      this.ajax.doPost(URL.SAVE_WS_QT, { pmQtData: this.pmQtData, formHeader: dataFormHeader }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
          this.getauditPmQtNo();

          /* ____________ restore data update ____________ */
          this.updateDetails = [];
          this.loading = false;

          /* ____________ filter data by auditPmQtNo ____________ */
          this.formSearch.get('auditPmqtNo').patchValue(response.data);
          this.getIaPmQt();
        } else {
          this.msg.errorModal(response.message);
          this.loading = false;
        }
      }, err => {
        this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        this.loading = false;
      });
    } else {
      this.ajax.doPost(URL.UPDATE_IA_PM_QT, { header: dataFormHeader, detail: this.updateDetails }).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === response.status) {
          this.msg.successModal(response.message);
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
  }

  clickRadios(pmQtDSeq: number, auditResult: string, indexHdr: number, indexDtl: number, auditPmDId?: number) {
    let params = { pmQtDSeq, auditResult, indexHdr, indexDtl, auditPmDId };
    // console.log("pmQtDSeq: ", pmQtDSeq);
    // console.log("auditResult: ", auditResult);
    // console.log("indexHdr: ", indexHdr);
    // console.log("indexDtl: ", indexDtl);
    if (this.updateDetails.length > 0) {
      let index = this.updateDetails.findIndex(obj => obj.pmQtDSeq == pmQtDSeq);
      if (index == -1) {
        this.pushData(params);
      } else {
        /* ____________ change flag in updateDetails ____________ */
        this.updateDetails[index].auditResult = auditResult;

        /* ____________ change flag in pmQtData to show display ____________ */
        this.pmQtData[indexHdr]["detail"][indexDtl]["auditResult"] = auditResult;
      }
    } else {
      this.pushData(params);
    }
  }

  pushData(params: any) {
    let { pmQtDSeq, auditResult, indexHdr, indexDtl, auditPmDId } = params;
    this.pmQtData[indexHdr]["detail"][indexDtl]["auditResult"] = auditResult;
    this.updateDetails.push({
      auditPmDId: auditPmDId, auditResult: auditResult
    });
  }

  /* ______________ get Dropdown ________________ */
  getauditPmQtNo() {
    this.ajax.doGet(`${URL.GET_AUDIT_PM_QT_NO}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.auditPmQtNoList = response.data;

      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  /* __________ on auditPmQtNo change ___________ */
  getIaPmQt() {
    this.loading = true;
    this.flagSearch = false;
    this.ajax.doPost(URL.GET_IA_PM_QT, this.formSearch.get('auditPmqtNo').value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        /* ______________ set data exciseDepartmentVo ______________*/
        this.formSearch.get('sector').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["sector"]));
        this.formSearch.get('area').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["area"]));
        this.formSearch.get('branch').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["branch"]));
        this.formSearch.get('budgetYear').patchValue(new IsEmptyPipe().transform(response["data"]["budgetYear"]));
        setTimeout(() => {
          $(".ui.dropdown").dropdown().css("width", "100%");
        }, 100);

        /* ____________ set data on table ____________ */
        this.pmQtData = response["data"]["header"];
        if (response["data"]["header"].length > 0) {
          /* ____________ set data form header ____________ */
          this.formHeader.get('qtAuditEvident').patchValue(this.pmQtData[0]["qtAuditEvident"]);
          this.formHeader.get('qtAuditSuggestion').patchValue(this.pmQtData[0]["qtAuditSuggestion"]);
          this.formHeader.get('qtAuditResult').patchValue(this.pmQtData[0]["qtAuditResult"]);

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
  //     this.pmQtData[index]["pmaAuditEvident"] = this.formHeader.get('pmaAuditEvident').value;
  //   } else if (control === 'pmaAuditSuggestion') {
  //     this.pmQtData[index]["pmaAuditSuggestion"] = this.formHeader.get('pmaAuditSuggestion').value;
  //   } else if (control === 'pmaAuditResult') {
  //     this.pmQtData[index]["pmaAuditResult"] = this.formHeader.get('pmaAuditResult').value;
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
    this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
    this.formHeader.reset();
    setTimeout(() => {
      $(".ui.dropdown").dropdown().css("width", "100%");
      this.calendar();
    }, 100);
    this.pmQtData = [];
    this.detailView = [];
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}


