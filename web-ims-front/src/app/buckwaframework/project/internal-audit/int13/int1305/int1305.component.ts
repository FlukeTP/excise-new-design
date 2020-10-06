import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';

import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
declare var $: any;
const URL = {
  AUDIT_NO_ALL: "ia/int13/05/find-all-audit-pmcommit-no",
  SEVE: "ia/int13/05/save",
  SEARCH_BY_AUDIT_NO: "ia/int13/05/find-by-audit-pmcommit-no"
}
@Component({
  selector: 'app-int1305',
  templateUrl: './int1305.component.html',
  styleUrls: ['./int1305.component.css']
})
export class Int1305Component implements OnInit {
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditPmcommitNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagData: boolean = true;
  flagButton: boolean = true;
  //formSearch
  formSearch: FormGroup;
  //formData
  formDataR: FormGroup;
  //formSave
  formSave: any;
  safeSrc: SafeResourceUrl;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    this.formDataSearch();
    this.formSaveData();
    this.getSector();
    this.getauditPmcommitNoList();
    this.formData();
    this.getUrlPageLink();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    this.calendar();
  }

  //======================= Form =============================
  formDataSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeCode: [''],
      budgetYear: ['', Validators.required],
      auditPmcommitNo: ['']
    })
  }
  formData() {
    this.formDataR = this.fb.group({
      urlLink: [''],
      auditFlag: [''],
      conditionText: [''],
      criteriaText: ['']
    })
  }

  formSaveData() {
    this.formSave = {
      officeCode: '',
      budgetYear: '',
      auditPmcommitNo: '',
      urlLink: '',
      auditFlag: '',
      conditionText: '',
      criteriaText: ''
    }
  }
  //=======================  calendar ==================================
  calendar = () => {
    $('#year').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('budgetYear').patchValue(text);
      }
    }).css("width", "100%");
  }
  //=========== getSector , getArea , getBranch , getauditPmcommitNo =======
  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        console.log("getSector no Data !!");
      }
    })
  }
  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        console.log("getArea no Data !!");
      }
    })
  }
  getBranch(officeCode) {
    this.ajax.doPost("preferences/department/branch-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.branch = res.data;
      } else {
        console.log("getBranch no Data !!");
      }
    })
  }
  getauditPmcommitNoList() {
    this.ajax.doPost(URL.AUDIT_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditPmcommitNoList = res.data;
      } else {
        console.log("getauditPmcommitNo Error !!");
      }
    })
  }

  getUrlPageLink() {
    this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl("http://192.168.48.36:8080/excise-pm/rest/getAttach?year=" + this.formSearch.get('budgetYear').value + "&oCode=" + this.formSearch.get('officeCode').value);
  }

  //================================= action ==============================
  onChangeSector(e) {
    $("#area").val("0");
    $("#branch").val("0");
    this.formSearch.patchValue({
      area: '0',
      branch: '0'
    });
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  onChangeArea(e) {
    $("#branch").val("0");
    this.formSearch.patchValue({ branch: '0' });
    this.branch = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getBranch(e.target.value);
  }
  onChangeauditPmcommitNo(e) {

    if (Utils.isNotNull(this.formSearch.get('auditPmcommitNo').value)) {
      this.searchByAuditNo(this.formSearch.get('auditPmcommitNo').value);
    }
  }
  //============ serach ===========================
  serach() {
    this.checkSearchFlag = true;
    if (this.flagButton === true) {
      if (this.formSearch.valid) {
        console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
        if (this.formSearch.get('branch').value != "0") {
          this.formSearch.get('officeCode').patchValue(this.formSearch.get('branch').value);
        } else {
          if (this.formSearch.get('area').value != "0") {
            this.formSearch.get('officeCode').patchValue(this.formSearch.get('area').value);
          } else {
            if (this.formSearch.get('sector').value != "") {
              this.formSearch.get('officeCode').patchValue(this.formSearch.get('sector').value);
            } else {
              this.formSearch.patchValue({ officeCode: "" });
            }
          }
        }
        //clear auditLicdupNo
        this.formSearch.patchValue({ auditPmcommitNo: "" });
        $("#auditPmcommitNo").dropdown('restore defaults');

        //call searchCriteria
        this.searchCriteria(this.formSearch.value);

      } else {
        console.log("ฟอร์มกรอกไม่ครบ :", this.formSearch.valid);
      }
    }

  }

  //============ clear ===========================
  clear() {
    this.checkSearchFlag = false;
    this.flagHeader = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    this.areas = [];
    this.branch = [];
    this.flagData = true;
    this.flagButton = true;
    this.loading = true;
    this.formSearch.reset();
    this.formDataR.reset();

    $("#auditPmcommitNo").dropdown('restore defaults');
    $("#inputYear").val('');

    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 100);
  }


  //=================== save ===========================
  save() {
    if (this.flagButton === false) {
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.formSave.officeCode = this.formSearch.get('officeCode').value;
          this.formSave.budgetYear = this.formSearch.get('budgetYear').value;
          this.formSave.auditPmcommitNo = this.formSearch.get('auditPmcommitNo').value;
          this.formSave.auditFlag = this.formDataR.get('auditFlag').value;
          this.formSave.conditionText = this.formDataR.get('conditionText').value;
          this.formSave.criteriaText = this.formDataR.get('criteriaText').value;
          this.formSave.urlLink = this.formDataR.get('urlLink').value;

          console.log('this.formSave', this.formSave);
          //call save data
          this.saveData(this.formSave);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }

  }
  //=================================== call Back End ==================================
  searchCriteria = (formSearch: any): any => {
    this.loading = true;
    this.flagData = false;
    this.flagButton = false;
    //call url
    this.getUrlPageLink();
    this.formDataR.patchValue({
      urlLink: "http://192.168.48.36:8080/excise-pm/rest/getAttach?year=" + formSearch.budgetYear + "&oCode=" + formSearch.officeCode,
      auditFlag: '',
      conditionText: '',
      criteriaText: ''
    });

    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  saveData = (data: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEVE, data).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        //call getauditLicexpNoList
        this.getauditPmcommitNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditPmcommitNo: res.data.auditPmcommitNo
        });
        this.searchByAuditNo(this.formSearch.get('auditPmcommitNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  searchByAuditNo(auditPmcommitNo: any) {

    this.loading = true;
    this.flagData = false;
    this.flagButton = false;
    this.flagHeader = false;

    this.ajax.doPost(`${URL.SEARCH_BY_AUDIT_NO}`, auditPmcommitNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formSearch.patchValue({
          sector: new IsEmptyPipe().transform(res.data.sector),
          area: new IsEmptyPipe().transform(res.data.area),
          branch: new IsEmptyPipe().transform(res.data.branch),
          officeCode: res.data.officeCode,
          budgetYear: res.data.budgetYear,
        });
        //call url
        this.getUrlPageLink();
        this.formDataR.patchValue({
          urlLink: res.data.urlLink,
          auditFlag: res.data.auditFlag,
          conditionText: res.data.conditionText,
          criteriaText: res.data.criteriaText
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error auditPmcommitNo :", res.message);
      }
    });
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
