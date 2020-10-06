import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import * as moment from 'moment';
declare var $: any;

const URL = {
  AUDIT_LIC_EXP_NO_ALL: "ia/int06/04/find-all-audit-lic-exp-no",
  SEVE: "ia/int06/04/save",
  EXPORT: "ia/int06/04/export",
  SEARCH: "ia/int06/04/find-by-criteria",
  SEARCH_D_BY_AUDIT_LIC_EXP_NO: "ia/int06/04/find-data-by-audit-lic-exp-no",
  SEARCH_H_BY_AUDIT_LIC_EXP_NO: "ia/int06/04/find-header-by-audit-lic-exp-no"
}
@Component({
  selector: 'app-int0604',
  templateUrl: './int0604.component.html',
  styleUrls: ['./int0604.component.css']
})
export class Int0604Component implements OnInit {
  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagButton: boolean = true;

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditLicexpNoList: any[] = [];
  //formSearch
  formSearch: FormGroup;
  //formT1
  formT1: FormGroup;
  auditLicexpDList: FormArray = new FormArray([]);
  //formSave
  formSave: any;

  stDate:any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService
  ) { }

  ngOnInit() {
    this.formDataSearch();
    this.formSaveData();
    this.getSector();
    this.getauditLicexpNoList();
    this.formData();
    this.formListData();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    this.calendar();


    $('.table-cont').scroll(function (e) {
      var test = e.target.scrollTop;
      // console.log("scoll e ", test);
      // $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
      this.querySelector('thead').style.transform = 'translateY(' + (test - 1) + 'px)';
    });
  }

  //======================= Form =============================
  formDataSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeCode: [''],
      licexpDateFrom: ['', Validators.required],
      licexpDateTo: ['', Validators.required],
      auditLicexpNo: ['']
    })
  }

  //============== DATA FROM  TAB1============================
  formData() {
    this.formT1 = this.fb.group({
      auditFlag: [''],
      conditionText: [''],
      criteriaText: [''],
      auditLicexpDList: this.fb.array([])
    })
    this.auditLicexpDList = this.formT1.get('auditLicexpDList') as FormArray;
  }

  formListData(): FormGroup {
    return this.fb.group({
      auditLicexpSeq: [''],
      newRegId: [''],
      cusFullName: [''],
      facFullName: [''],
      licType: [''],
      licNo: [''],
      licDate: [''],
      expDate: [''],
      licNoNew: [''],
      licDateNew: ['']
    });
  }
  //==================== form save ===============================
  formSaveData() {
    this.formSave = {
      auditLicexpH: {
        officeCode: '',
        licexpDateFrom: '',
        licexpDateTo: '',
        auditLicexpNo: '',
        auditFlag: '',
        conditionText: '',
        criteriaText: ''
      },
      auditLicexpDList: []
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
        this.formSearch.get('licexpDateFrom').patchValue(text);
        // this.stDate=date;
        // console.log(this.stDate);
      }
    });

    

    $('#date2').calendar({
      startCalendar: $("#date1"),
      // maxDate: new Date(currentDate.getFullYear(),currentDate.getMonth(), 3),
      // maxDate: moment().subtract(29, 'days'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('licexpDateTo').patchValue(text);
      }
    });
  }

  // test() {
  //   var nowdate = new Date();
  //   console.log(nowdate);

  //   // moment(endDate, "DD/MM/YYYY");
  //   // maxDate: moment().add(2, 'days').toDate(),
  // }
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

  getauditLicexpNoList() {
    this.ajax.doPost(URL.AUDIT_LIC_EXP_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicexpNoList = res.data;
      } else {
        console.log("getauditLicexpNoList findAllDataHeader Error !!");
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

  onChangeauditLicexpNo(e) {
    if (Utils.isNotNull(this.formSearch.get('auditLicexpNo').value)) {
      this.searchByAuditLicexpNo(this.formSearch.get('auditLicexpNo').value);
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
        this.formSearch.patchValue({ auditLicexpNo: "" });
        $("#auditLicexpNo").dropdown('restore defaults');
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
    $("#auditLicexpNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.formSearch.reset();
    this.formT1.reset();
    this.auditLicexpDList = this.formT1.get('auditLicexpDList') as FormArray;
    this.auditLicexpDList.controls.splice(0, this.auditLicexpDList.controls.length);
    this.auditLicexpDList.patchValue([]);
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
          this.formSave.auditLicexpH.officeCode = this.formSearch.get('officeCode').value;
          this.formSave.auditLicexpH.licexpDateFrom = this.formSearch.get('licexpDateFrom').value;
          this.formSave.auditLicexpH.licexpDateTo = this.formSearch.get('licexpDateTo').value;
          this.formSave.auditLicexpH.auditLicexpNo = this.formSearch.get('auditLicexpNo').value;
          this.formSave.auditLicexpH.auditFlag = this.formT1.get('auditFlag').value;
          this.formSave.auditLicexpH.conditionText = this.formT1.get('conditionText').value;
          this.formSave.auditLicexpH.criteriaText = this.formT1.get('criteriaText').value;
          this.formSave.auditLicexpDList = this.formT1.get('auditLicexpDList').value;
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
    if (Utils.isNotNull(this.formSearch.get('auditLicexpNo').value)) {
      var auditLicexpNo = this.formSearch.get('auditLicexpNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT}/${auditLicexpNo}`);
    }
  }
  //=================================== call Back End ==================================
  searchCriteria = (formSearch: any): any => {
    this.loading = true;
    let data = {
      officeCode: formSearch.officeCode,
      licDateFrom: formSearch.licexpDateFrom,
      licDateTo: formSearch.licexpDateTo
    }
    this.ajax.doPost(URL.SEARCH, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicexpDList = this.formT1.get('auditLicexpDList') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.auditLicexpDList.controls.splice(0, this.auditLicexpDList.controls.length);
          this.auditLicexpDList.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicexpDList.push(this.formListData());
            this.auditLicexpDList.at(index).get('newRegId').patchValue(e.newRegId);
            this.auditLicexpDList.at(index).get('cusFullName').patchValue(e.cusFullName);
            this.auditLicexpDList.at(index).get('facFullName').patchValue(e.facFullName);
            // this.auditLicexpDList.at(index).get('licType').patchValue(e.licName + '(' + e.licType + ')');
            this.auditLicexpDList.at(index).get('licType').patchValue(e.licName);
            this.auditLicexpDList.at(index).get('licNo').patchValue(e.licNo);
            this.auditLicexpDList.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicexpDList.at(index).get('expDate').patchValue(e.expDate);
            this.auditLicexpDList.at(index).get('licNoNew').patchValue(e.licNoNew);
            this.auditLicexpDList.at(index).get('licDateNew').patchValue(e.licDateNew);
          });
        } else {
          this.auditLicexpDList.controls.splice(0, this.auditLicexpDList.controls.length);
          this.auditLicexpDList.patchValue([]);
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
        console.log(res.data);

        //call getauditLicexpNoList
        this.getauditLicexpNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditLicexpNo: res.data.auditLicexpNo
        });
        this.searchByAuditLicexpNo(this.formSearch.get('auditLicexpNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  searchByAuditLicexpNo(auditLicexpNo: any) {
    this.loading = true;
    this.flagHeader = false;
    //call show button save , export
    this.flagButton = false;
    this.ajax.doPost(`${URL.SEARCH_D_BY_AUDIT_LIC_EXP_NO}`, auditLicexpNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicexpDList = this.formT1.get('auditLicexpDList') as FormArray;
        if (res.data.length > 0) {
          this.auditLicexpDList.controls.splice(0, this.auditLicexpDList.controls.length);
          this.auditLicexpDList.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicexpDList.push(this.formListData());
            this.auditLicexpDList.at(index).get('auditLicexpSeq').patchValue(e.auditLicexpSeq);
            this.auditLicexpDList.at(index).get('newRegId').patchValue(e.newRegId);
            this.auditLicexpDList.at(index).get('cusFullName').patchValue(e.cusFullName);
            this.auditLicexpDList.at(index).get('facFullName').patchValue(e.facFullName);
            this.auditLicexpDList.at(index).get('licType').patchValue(e.licType);
            this.auditLicexpDList.at(index).get('licNo').patchValue(e.licNo);
            this.auditLicexpDList.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicexpDList.at(index).get('expDate').patchValue(e.expDate);
            this.auditLicexpDList.at(index).get('licNoNew').patchValue(e.licNoNew);
            this.auditLicexpDList.at(index).get('licDateNew').patchValue(e.licDateNew);
          });
        } else {
          this.auditLicexpDList.controls.splice(0, this.auditLicexpDList.controls.length);
          this.auditLicexpDList.patchValue([]);
        }
        this.searchHeaderByAuditLicexpNo(auditLicexpNo);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditLicexpNo :", res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    });

  }

  searchHeaderByAuditLicexpNo(auditLicexpNo: any) {
    this.ajax.doPost(`${URL.SEARCH_H_BY_AUDIT_LIC_EXP_NO}`, auditLicexpNo).subscribe((res: ResponseData<any>) => {

      if (MessageService.MSG.SUCCESS == res.status) {
        this.formSearch.patchValue({
          sector: new IsEmptyPipe().transform(res.data.sector),
          area: new IsEmptyPipe().transform(res.data.area),
          branch: new IsEmptyPipe().transform(res.data.branch),
          officeCode: res.data.officeCode,
          licexpDateFrom: res.data.licexpDateFrom,
          licexpDateTo: res.data.licexpDateTo
        });
        this.formT1.patchValue({
          auditFlag: res.data.auditFlag,
          conditionText: res.data.conditionText,
          criteriaText: res.data.criteriaText
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchHeaderByAuditLicexpNo :", res.message);
      }
    });
  }
  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}



