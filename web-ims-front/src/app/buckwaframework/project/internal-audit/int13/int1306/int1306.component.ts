import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
declare var $: any;

const URL = {
  AUDIT_LIC_EXP_NO_ALL: "ia/int13/06/find-all-audit-pmresult-no",
  SEVE: "ia/int13/06/save",
  EXPORT_EXCEL: "ia/int13/06/export",
  EXPORT_PDF: "ia/int13/06/pdf",
  SEARCH: "ia/int13/06/find-by-criteria",
  SEARCH_BY_AUDIT_NO: "ia/int13/06/find-by-audit-pmresult-no"
}
@Component({
  selector: 'app-int1306',
  templateUrl: './int1306.component.html',
  styleUrls: ['./int1306.component.css']
})
export class Int1306Component implements OnInit {

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditPmresultNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagButton: boolean = true;
  //formSearch
  formSearch: FormGroup;
  formDataShow: FormGroup;
  dataList: FormArray = new FormArray([]);
  //formSave
  formSave: any

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService
  ) { }

  ngOnInit() {
    this.formDataSearch();
    this.formSaveData();
    this.getSector();
    this.getauditPmresultNoList();
    this.formData();
    this.formListData();
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
      auditDateFrom: [''],
      auditDateTo: [''],
      auditPmresultNo: [''],

      auditPmassessNo: [''],
      auditPmqtNo: [''],
      auditPy1No: [''],
      auditPy2No: [''],
      auditPmcommitNo: ['']
    })
  }
  //============== DATA FROM ============================
  formData() {
    this.formDataShow = this.fb.group({
      depAuditingSuggestion: [''],
      auditSummary: [''],
      auditSuggestion: [''],
      personAudity: [''],
      personAudityPosition: [''],
      auditer1: [''],
      auditer1AudityPosition: [''],
      auditer2: [''],
      auditer2AudityPosition: [''],

      dataList: this.fb.array([])
    })
    this.dataList = this.formDataShow.get('dataList') as FormArray;
  }

  formListData(): FormGroup {
    return this.fb.group({
      topic: [''],
      auditNo: [''],
      evident: [''],
      suggestion: [''],
      result: [{ value: '', disabled: true }],
      result2: [{ value: '', disabled: true }],
      type: ['']
    });
  }

  formSaveData() {
    this.formSave = {
      officeCode: '',
      auditDateFrom: '',
      auditDateTo: '',
      auditPmresultNo: '',
      budgetYear: '',
      auditPmassessNo: '',
      auditPmqtNo: '',
      auditPy1No: '',
      auditPy2No: '',
      auditPmcommitNo: '',
      depAuditingSuggestion: '',
      auditSummary: '',
      auditSuggestion: '',
      personAudity: '',
      personAudityPosition: '',
      auditer1: '',
      auditer1AudityPosition: '',
      auditer2: '',
      auditer2AudityPosition: ''
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
    })
  }
  //=========== getSector , getArea , getBranch , getauditLicexpNo =======
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

  getauditPmresultNoList() {
    this.ajax.doPost(URL.AUDIT_LIC_EXP_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditPmresultNoList = res.data;
      } else {
        console.log("getAuditPmresultNoList Error !!");
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

  onChangeauditPmresultNo(e) {
    if (Utils.isNotNull(this.formSearch.get('auditPmresultNo').value)) {
      this.searchDataByAuditNo(this.formSearch.get('auditPmresultNo').value);
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
        //clear auditLicexpNo
        this.formSearch.patchValue({ auditPmresultNo: "" });
        $("#auditPmresultNo").dropdown('restore defaults');
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
    $("#auditPmresultNo").dropdown('restore defaults');
    $("#inputYear").val('');
    this.formSearch.reset();
    this.formDataShow.reset();
    this.dataList = this.formDataShow.get('dataList') as FormArray;
    this.dataList.controls.splice(0, this.dataList.controls.length);
    this.dataList.patchValue([]);
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
          this.formSave.auditDateFrom = this.formSearch.get('auditDateFrom').value;
          this.formSave.auditDateTo = this.formSearch.get('auditDateTo').value;
          this.formSave.budgetYear = this.formSearch.get('budgetYear').value;
          this.formSave.auditPmresultNo = this.formSearch.get('auditPmresultNo').value;

          this.formSave.auditPmassessNo = this.formSearch.get('auditPmassessNo').value;
          this.formSave.auditPmqtNo = this.formSearch.get('auditPmqtNo').value;
          this.formSave.auditPy1No = this.formSearch.get('auditPy1No').value;
          this.formSave.auditPy2No = this.formSearch.get('auditPy2No').value;
          this.formSave.auditPmcommitNo = this.formSearch.get('auditPmcommitNo').value;

          this.formSave.depAuditingSuggestion = this.formDataShow.get('depAuditingSuggestion').value;
          this.formSave.auditSummary = this.formDataShow.get('auditSummary').value;
          this.formSave.auditSuggestion = this.formDataShow.get('auditSuggestion').value;
          this.formSave.personAudity = this.formDataShow.get('personAudity').value;
          this.formSave.personAudityPosition = this.formDataShow.get('personAudityPosition').value;
          this.formSave.auditer1 = this.formDataShow.get('auditer1').value;
          this.formSave.auditer1AudityPosition = this.formDataShow.get('auditer1AudityPosition').value;
          this.formSave.auditer2 = this.formDataShow.get('auditer2').value;
          this.formSave.auditer2AudityPosition = this.formDataShow.get('auditer2AudityPosition').value;

          console.log('this.formSave', this.formSave);
          //call save data
          this.saveData(this.formSave);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }
  //============ export ===========================
  export() {
    this.checkSearchFlag = false;
    if (Utils.isNotNull(this.formSearch.get('auditPmresultNo').value)) {
      var auditPmresultNo = this.formSearch.get('auditPmresultNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT_PDF}/${auditPmresultNo}`);
    }
  }
  //=================================== call Back End ==================================
  searchCriteria = (formSearch: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEARCH, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = this.formDataShow.get('dataList') as FormArray;
        if (res.data.dataList.length > 0) {
          //set show button save
          this.flagButton = false;
          this.dataList.controls.splice(0, this.dataList.controls.length);
          this.dataList.patchValue([]);
          res.data.dataList.forEach((e, index) => {
            this.dataList.push(this.formListData());
            this.dataList.at(index).get('topic').patchValue(e.topic);
            this.dataList.at(index).get('evident').patchValue(e.evident);
            this.dataList.at(index).get('suggestion').patchValue(e.suggestion);
            this.dataList.at(index).get('result').patchValue(e.result);
            this.dataList.at(index).get('result2').patchValue(e.result2);
            this.dataList.at(index).get('type').patchValue(e.type);
          });
        } else {
          this.dataList.controls.splice(0, this.dataList.controls.length);
          this.dataList.patchValue([]);
        }

        if (Utils.isNull(this.formSearch.get('auditPmresultNo').value)) {

          this.formSearch.patchValue({
            auditPmassessNo: res.data.auditPmassessNo,
            auditPmqtNo: res.data.auditPmqtNo,
            auditPy1No: res.data.auditPy1No,
            auditPy2No: res.data.auditPy2No,
            auditPmcommitNo: res.data.auditPmcommitNo,
          });

          //clear data textAraBox 
          this.formDataShow.patchValue({
            depAuditingSuggestion: '',
            auditSummary: '',
            auditSuggestion: '',
            personAudity: '',
            personAudityPosition: '',
            auditer1: '',
            auditer1AudityPosition: '',
            auditer2: '',
            auditer2AudityPosition: ''
          });
        }


      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchCriteria :", res.message);
      }
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
        this.getauditPmresultNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditPmresultNo: res.data.auditPmresultNo
        });
        this.searchDataByAuditNo(this.formSearch.get('auditPmresultNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  async  searchDataByAuditNo(auditPmresultNo: any) {
    try {
      const data = await this.searchByAuditNo(auditPmresultNo);
      await this.searchCriteria(data);
    } catch (error) {
      console.error(error.message)
    }
  }

  searchByAuditNo(auditPmresultNo: any) {
    return new Promise((resolve) => {
      this.loading = true;
      this.flagButton = false;
      this.flagHeader = false;

      this.ajax.doPost(`${URL.SEARCH_BY_AUDIT_NO}`, auditPmresultNo).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {

          this.formSearch.patchValue({
            sector: new IsEmptyPipe().transform(res.data.sector),
            area: new IsEmptyPipe().transform(res.data.area),
            branch: new IsEmptyPipe().transform(res.data.branch),
            officeCode: res.data.officeCode,
            budgetYear: res.data.budgetYear,
            auditPmassessNo: res.data.auditPmassessNo,
            auditPmqtNo: res.data.auditPmqtNo,
            auditPy1No: res.data.auditPy1No,
            auditPy2No: res.data.auditPy2No,
            auditPmcommitNo: res.data.auditPmcommitNo
          });

          this.formDataShow.patchValue({

            depAuditingSuggestion: res.data.depAuditingSuggestion,
            auditSummary: res.data.auditSummary,
            auditSuggestion: res.data.auditSuggestion,

            personAudity: res.data.personAudity,
            personAudityPosition: res.data.personAudityPosition,
            auditer1: res.data.auditer1,
            auditer1AudityPosition: res.data.auditer1AudityPosition,
            auditer2: res.data.auditer2,
            auditer2AudityPosition: res.data.auditer2AudityPosition
          });
          resolve(this.formSearch.value);
        } else {
          this.messageBar.errorModal(res.message);
          console.log("error searchByAuditNo :", res.message);
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });

  }
  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}


