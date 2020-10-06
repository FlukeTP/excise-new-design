import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

declare var $: any;

const URL = {
  AUDIT_LIC_DUP_NO_ALL: "ia/int06/03/find-all-audit-lic-dup-no",
  SEVE: "ia/int06/03/save",
  EXPORT: "ia/int06/03/export",
  SEARCH: "ia/int06/03/find-by-criteria",
  SEARCH_D_BY_AUDIT_NO: "ia/int06/03/find-data-by-audit-lic-dup-no",
  SEARCH_H_BY_AUDIT_NO: "ia/int06/03/find-header-by-audit-lic-dup-no"
}

@Component({
  selector: 'app-int0603',
  templateUrl: './int0603.component.html',
  styleUrls: ['./int0603.component.css']
})
export class Int0603Component implements OnInit {
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditLicdupNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagButton: boolean = true;

  //formSearch
  formSearch: FormGroup;
  //formT1
  formT1: FormGroup;
  auditLicdupDList: FormArray = new FormArray([]);
  //formSave
  formSave: any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formSaveData();
    this.formSearchData();
    this.getSector();
    this.getauditLicdupNoList();
    this.formData();
    this.formListData();

  }
  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    this.calendar();
  }
  //======================= Form =============================
  formSearchData() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeCode: [''],
      licDateFrom: ['', Validators.required],
      licDateTo: ['', Validators.required],
      auditLicdupNo: ['']
    })
  }


  //============== DATA FROM  TAB1============================
  formData() {
    this.formT1 = this.fb.group({
      auditFlag: [''],
      conditionText: [''],
      criteriaText: [''],
      auditLicdupDList: this.fb.array([])
    })
    this.auditLicdupDList = this.formT1.get('auditLicdupDList') as FormArray;
  }

  formListData(): FormGroup {
    return this.fb.group({
      newRegId: [''],
      cusFullname: [''],
      licType: [''],
      runCheck: [''],
      licNo: [''],
      licDate: [''],
      printCount: [''],
      auditLicdupDSeq: ['']
    });
  }
  //==================== form save ===============================
  formSaveData() {
    this.formSave = {
      auditLicdupH: {
        officeCode: '',
        licDateFrom: '',
        licDateTo: '',
        auditLicdupNo: '',
        auditFlag: '',
        conditionText: '',
        criteriaText: ''
      },
      auditLicdupDList: []
    }
  }

  //=======================  calendar ==================================
  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('licDateFrom').patchValue(text);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('licDateTo').patchValue(text);
      }
    });
  }
  //=========== getSector , getArea , getBranch , getauditLicdupNo =======
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

  getauditLicdupNoList() {
    this.ajax.doPost(URL.AUDIT_LIC_DUP_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicdupNoList = res.data;
      } else {
        console.log("getauditLicdupNo findAllDataHeader Error !!");
      }
    })
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

  onChangeauditLicdupNo(e) {
    if (Utils.isNotNull(this.formSearch.get('auditLicdupNo').value)) {
      this.searchByAuditLicdupNo(this.formSearch.get('auditLicdupNo').value);
    }
  }

  reEditRunCheck(i, val) {
    if (Utils.isNotNull(val)) {
      for (let index = i; index < this.formT1.value.auditLicdupDList.length; index++) {
        this.auditLicdupDList.at(index).get('runCheck').patchValue(val);
        val++;
      }
    } else {
      for (let index = i; index < this.formT1.value.auditLicdupDList.length; index++) {
        this.auditLicdupDList.at(index).get('runCheck').patchValue('');
        val++;
      }
    }


  }

  //============ serach ===========================
  serach() {
    this.checkSearchFlag = true;
    if (this.flagButton === true) {
      if (this.formSearch.valid) {
        console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
        //check for  add officeCode
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
        this.formSearch.patchValue({ auditLicdupNo: "" });
        $("#auditLicdupNo").dropdown('restore defaults');
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
    this.flagButton = true;
    this.loading = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    $("#auditLicdupNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.formSearch.reset();
    this.formT1.reset();
    this.auditLicdupDList = this.formT1.get('auditLicdupDList') as FormArray;
    this.auditLicdupDList.controls.splice(0, this.auditLicdupDList.controls.length);
    this.auditLicdupDList.patchValue([]);
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 100);
  }
  //============ export ===========================
  export() {
    this.checkSearchFlag = false;
    if (Utils.isNotNull(this.formSearch.get('auditLicdupNo').value)) {
      var auditLicdupNo = this.formSearch.get('auditLicdupNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT}/${auditLicdupNo}`);
    }
  }
  //=================== save ===========================
  save() {
    if (this.flagButton === false) {
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.formSave.auditLicdupH.officeCode = this.formSearch.get('officeCode').value;
          this.formSave.auditLicdupH.licDateFrom = this.formSearch.get('licDateFrom').value;
          this.formSave.auditLicdupH.licDateTo = this.formSearch.get('licDateTo').value;
          this.formSave.auditLicdupH.auditLicdupNo = this.formSearch.get('auditLicdupNo').value;
          this.formSave.auditLicdupH.auditFlag = this.formT1.get('auditFlag').value;
          this.formSave.auditLicdupH.conditionText = this.formT1.get('conditionText').value;
          this.formSave.auditLicdupH.criteriaText = this.formT1.get('criteriaText').value;
          this.formSave.auditLicdupDList = this.formT1.get('auditLicdupDList').value;
          //call save data
          this.saveData(this.formSave);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }
  //=================================== call Back End ==================================
  searchCriteria(formSearch: any) {
    this.loading = true;

    this.ajax.doPost(URL.SEARCH, formSearch).subscribe((res: ResponseData<any>) => {

      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicdupDList = this.formT1.get('auditLicdupDList') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.auditLicdupDList.controls.splice(0, this.auditLicdupDList.controls.length);
          this.auditLicdupDList.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicdupDList.push(this.formListData());
            this.auditLicdupDList.at(index).get('newRegId').patchValue(e.newRegId);
            this.auditLicdupDList.at(index).get('cusFullname').patchValue(e.cusFullname);
            // this.auditLicdupDList.at(index).get('licType').patchValue(e.licName + '(' + e.licType + ')');
            this.auditLicdupDList.at(index).get('licType').patchValue(e.licName );
            this.auditLicdupDList.at(index).get('licNo').patchValue(e.licNo);
            this.auditLicdupDList.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicdupDList.at(index).get('printCount').patchValue(e.printCount);
          });
        } else {
          this.auditLicdupDList.controls.splice(0, this.auditLicdupDList.controls.length);
          this.auditLicdupDList.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formT1.patchValue({
          auditFlag: '',
          conditionText: '',
          criteriaText: ''
        });
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchCriteria :", res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });
  }

  saveData = (data: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEVE, data).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        //call getauditLicdupNoList
        this.getauditLicdupNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditLicdupNo: res.data.auditLicdupNo
        });
        this.searchByAuditLicdupNo(this.formSearch.get('auditLicdupNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  searchByAuditLicdupNo(auditLicdupNo: any) {
    this.loading = true;
    this.flagHeader = false;
    //call show button save , export
    this.flagButton = false;
    this.ajax.doPost(`${URL.SEARCH_D_BY_AUDIT_NO}`, auditLicdupNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicdupDList = this.formT1.get('auditLicdupDList') as FormArray;
        if (res.data.length > 0) {
          this.auditLicdupDList.controls.splice(0, this.auditLicdupDList.controls.length);
          this.auditLicdupDList.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicdupDList.push(this.formListData());
            this.auditLicdupDList.at(index).get('auditLicdupDSeq').patchValue(e.auditLicdupDSeq);
            this.auditLicdupDList.at(index).get('newRegId').patchValue(e.newRegId);
            this.auditLicdupDList.at(index).get('cusFullname').patchValue(e.cusFullname);
            this.auditLicdupDList.at(index).get('licType').patchValue(e.licType);
            this.auditLicdupDList.at(index).get('runCheck').patchValue(e.runCheck);
            this.auditLicdupDList.at(index).get('licNo').patchValue(e.licNo);
            this.auditLicdupDList.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicdupDList.at(index).get('printCount').patchValue(e.printCount);
          });
        } else {
          this.auditLicdupDList.controls.splice(0, this.auditLicdupDList.controls.length);
          this.auditLicdupDList.patchValue([]);
        }
        this.searchHeaderByAuditLicdupNo(auditLicdupNo);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditLicdupNo :", res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });

  }

  searchHeaderByAuditLicdupNo(auditLicdupNo: any) {
    this.ajax.doPost(`${URL.SEARCH_H_BY_AUDIT_NO}`, auditLicdupNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formSearch.patchValue({
          sector: new IsEmptyPipe().transform(res.data.sector),
          area: new IsEmptyPipe().transform(res.data.area),
          branch: new IsEmptyPipe().transform(res.data.branch),
          officeCode: res.data.officeCode,
          licDateFrom: res.data.licDateFrom,
          licDateTo: res.data.licDateTo
        });
        this.formT1.patchValue({
          auditFlag: res.data.auditFlag,
          conditionText: res.data.conditionText,
          criteriaText: res.data.criteriaText
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchHeaderByAuditLicdupNo :", res.message);
      }
    });
  }
  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
