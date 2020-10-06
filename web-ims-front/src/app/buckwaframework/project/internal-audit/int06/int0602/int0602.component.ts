import { Component, OnInit } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
declare var $: any;

const URL = {
  AUDIT_LIC_NO_ALL: "ia/int06/02/find-all-head",
  SEVE: "ia/int06/02/save-lic-data",
  EXPORT: "ia/int06/02/export",

  SEARCH_T1: "ia/int06/02/find-tab1",
  SEARCH_T2: "ia/int06/02/find-tab2",

  SEARCH_H_BY_AUDIT_NO: "ia/int06/02/find-header-by-audit-no",
  SEARCH_T1_BY_AUDIT_LIC_NO: "ia/int06/02/find-tab1-bylicno",
  SEARCH_T2_BY_AUDIT_LIC_NO: "ia/int06/02/find-tab2-bylicno",

}

@Component({
  selector: 'app-int0602',
  templateUrl: './int0602.component.html',
  styleUrls: ['./int0602.component.css']
})
export class Int0602Component implements OnInit {

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditLicNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagButton: boolean = true;
  tabActivate: string = '';

  //formSearch
  formSearch: FormGroup;
  //formT1
  formDataT1: FormGroup;
  auditLicD1List: FormArray = new FormArray([]);
  //formT2
  formDataT2: FormGroup;
  auditLicD2List: FormArray = new FormArray([]);
  //formSave
  formSave: any;


  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService
  ) { }

  ngOnInit() {
    this.formDataSearch();
    this.getSector();
    this.getAuditLicNoList();
    this.formDataSave();
    this.formDataTab1();
    this.listDataTab1();
    this.formDataTab2();
    this.listDataTab2();
    this.tabActivate = '1';
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
      licDateFrom: ['', Validators.required],
      licDateTo: ['', Validators.required],
      auditLicNo: ['']
    })
  }
  //============== DATA FROM  TAB1============================
  formDataTab1() {
    this.formDataT1 = this.fb.group({
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      auditLicD1List: this.fb.array([])
    })
    this.auditLicD1List = this.formDataT1.get('auditLicD1List') as FormArray;
  }

  listDataTab1(): FormGroup {
    return this.fb.group({
      auditLicD1Seq: [''],
      seqNo: [''],
      licType: [''],
      auditLicNo: [''],
      licNo: [''],
      runCheck: [''],
      licDate: [''],
      sendDate: [''],
      licName: [''],
      incCode: [''],
      licPrice: [''],
      licFee: [''],
      licInterior: [''],
      licRemark: [''],
      actionFlag: ['Y']
    });
  }

  //============== DATA FROM  TAB2============================
  formDataTab2() {
    this.formDataT2 = this.fb.group({
      d2AuditFlag: [''],
      d2ConditionText: [''],
      d2CriteriaText: [''],
      auditLicD2List: this.fb.array([])
    })
    this.auditLicD2List = this.formDataT2.get('auditLicD2List') as FormArray;
  }

  listDataTab2(): FormGroup {
    return this.fb.group({
      auditLicD2Seq: [''],
      taxCode: [''],
      licName: [''],
      auditLicNo: [''],
      licPrice: [''],
      licCount: [''],
      auditCheck: [''],
      licT2Remark: ['']
    });
  }
  //==================== DATA FROM  SAVE ===============================
  formDataSave() {
    this.formSave = {
      auditLicH: {
        auditLicSeq: '',
        officeCode: '',
        licDateFrom: '',
        licDateTo: '',
        auditLicNo: '',
        d1AuditFlag: '',
        d1ConditionText: '',
        d1CriteriaText: '',
        d2AuditFlag: '',
        d2ConditionText: '',
        d2CriteriaText: '',
      },
      auditLicD1List: [],
      auditLicD2List: [],
    }
  }
  //======================================== calendar ================================================
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
  //======================================== getSector , getArea , getBranch , findAllDataHeader ================================================
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

  getAuditLicNoList() {
    this.ajax.doPost(URL.AUDIT_LIC_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicNoList = res.data;
      } else {
        console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }

  //======================================== Action ================================================

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
  onChangeAuditLicNo(e) {
    if (Utils.isNotNull(this.formSearch.get('auditLicNo').value)) {
      this.searchByAuditLicNo(this.formSearch.get('auditLicNo').value);
    }
  }


  reEditRunCheck(i, val) {
    this.auditLicD1List = this.formDataT1.get("auditLicD1List") as FormArray;
    if (Utils.isNotNull(val)) {
      for (let index = i; index < this.auditLicD1List.length; index++) {
        this.auditLicD1List.at(index).get('runCheck').patchValue(val);
        val++;
      }
    } else {
      for (let index = i; index < this.auditLicD1List.length; index++) {
        this.auditLicD1List.at(index).get('runCheck').patchValue('');
      }
    }

  }

  onInsertList(idx) {
    let index = idx;
    this.auditLicD1List = this.formDataT1.get("auditLicD1List") as FormArray;
    this.auditLicD1List.insert(index, this.listDataTab1());
    this.auditLicD1List.at(index).get('actionFlag').patchValue('');
  }

  onRemoveList(idx) {
    this.auditLicD1List = this.formDataT1.get("auditLicD1List") as FormArray;
    this.auditLicD1List.removeAt(idx);
  }

  
  onInsertListNext() {
    this.auditLicD1List = this.formDataT1.get("auditLicD1List") as FormArray;
    let index = this.auditLicD1List.length
    this.auditLicD1List.insert(index, this.listDataTab1());
    this.auditLicD1List.at(index).get('actionFlag').patchValue('');
  }

  // ====================  check-box Tab2 ========================
  chk1AuditAll = (event) => {
    $("#chk2Audit").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.auditLicD2List.length; index++) {
        this.auditLicD2List.at(index).get('auditCheck').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.auditLicD2List.length; index++) {
        this.auditLicD2List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  chk2AuditAll = (event) => {
    $("#chk1Audit").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.auditLicD2List.length; index++) {
        this.auditLicD2List.at(index).get('auditCheck').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.auditLicD2List.length; index++) {
        this.auditLicD2List.at(index).get('auditCheck').patchValue('');
      }
    }
  }
  //====================== clear check -box =======================
  clearCheckBox() {
    //tab2
    $("#chk1Audit").prop("checked", false);
    $("#chk2Audit").prop("checked", false);
  }

  //================ activate =======================
  activate(tab: string) {
    return this.tabActivate == tab;
  }

  showTab(tab: string) {
    this.tabActivate = tab;
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
        this.formSearch.patchValue({ auditLicNo: "" });
        $("#auditLicNo").dropdown('restore defaults');
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
    $("#auditLicNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.clearCheckBox();
    this.formSearch.reset();
    //tab1
    this.formDataT1.reset();
    this.auditLicD1List = this.formDataT1.get('auditLicD1List') as FormArray;
    this.auditLicD1List.controls.splice(0, this.auditLicD1List.controls.length);
    this.auditLicD1List.patchValue([]);
    //tab2
    this.formDataT2.reset();
    this.auditLicD2List = this.formDataT2.get('auditLicD2List') as FormArray;
    this.auditLicD2List.controls.splice(0, this.auditLicD2List.controls.length);
    this.auditLicD2List.patchValue([]);

    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 1000);
  }
  //============ export ===========================
  export() {
    this.checkSearchFlag = false;
    if (Utils.isNotNull(this.formSearch.get('auditLicNo').value)) {
      var auditLicNo = this.formSearch.get('auditLicNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT}/${auditLicNo}`);
    }
  }
  //=================== save ===========================
  save() {
    if (this.flagButton === false) {
      this.messageBar.comfirm(async confirm => {
        if (confirm) {

          this.formSave.auditLicH.officeCode = this.formSearch.get('officeCode').value;
          this.formSave.auditLicH.licDateFrom = this.formSearch.get('licDateFrom').value;
          this.formSave.auditLicH.licDateTo = this.formSearch.get('licDateTo').value;
          this.formSave.auditLicH.auditLicNo = this.formSearch.get('auditLicNo').value;
          this.formSave.auditLicH.d1AuditFlag = this.formDataT1.get('d1AuditFlag').value;
          this.formSave.auditLicH.d1ConditionText = this.formDataT1.get('d1ConditionText').value;
          this.formSave.auditLicH.d1CriteriaText = this.formDataT1.get('d1CriteriaText').value;
          this.formSave.auditLicH.d2AuditFlag = this.formDataT2.get('d2AuditFlag').value;
          this.formSave.auditLicH.d2ConditionText = this.formDataT2.get('d2ConditionText').value;
          this.formSave.auditLicH.d2CriteriaText = this.formDataT2.get('d2CriteriaText').value;

          this.addSeqNoTab1();

          this.formSave.auditLicD1List = this.formDataT1.get('auditLicD1List').value;
          this.formSave.auditLicD2List = this.formDataT2.get('auditLicD2List').value;

          //call save data
          this.saveData(this.formSave);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }

  addSeqNoTab1() {
    for (let index = 0; index < this.formDataT1.get('auditLicD1List').value.length; index++) {
      this.formDataT1.get('auditLicD1List').get(index.toString()).get('seqNo').patchValue(index + 1);
    }
  }
  //=================================== call Back End ==================================
  async searchCriteria(formSearch: any) {
    this.loading = true;

    await this.clearCheckBox();

    //tab1
    await this.ajax.doPost(URL.SEARCH_T1, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicD1List = this.formDataT1.get('auditLicD1List') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.auditLicD1List.controls.splice(0, this.auditLicD1List.controls.length);
          this.auditLicD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicD1List.push(this.listDataTab1());
            // this.auditLicD1List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.auditLicD1List.at(index).get('licType').patchValue(e.licType);
            this.auditLicD1List.at(index).get('licNo').patchValue(e.licNo);
            // this.auditLicD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.auditLicD1List.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicD1List.at(index).get('sendDate').patchValue(e.sendDate);
            this.auditLicD1List.at(index).get('licName').patchValue(e.licName);
            this.auditLicD1List.at(index).get('incCode').patchValue(e.incCode);
            this.auditLicD1List.at(index).get('licPrice').patchValue(e.licPrice);
            this.auditLicD1List.at(index).get('licFee').patchValue(e.licFee);
            this.auditLicD1List.at(index).get('licInterior').patchValue(e.licInterior);
            // this.auditLicD1List.at(index).get('licRemark').patchValue(e.licRemark);
          });
        } else {
          this.auditLicD1List.controls.splice(0, this.auditLicD1List.controls.length);
          this.auditLicD1List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formDataT1.patchValue({
          d1AuditFlag: '',
          d1ConditionText: '',
          d1CriteriaText: ''
        });

      } else {
        console.log("error searchCriteria_Tab1 :", res.message);
      }
      this.loading = false;
    });
    //tab2
    await this.ajax.doPost(URL.SEARCH_T2, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicD2List = this.formDataT2.get('auditLicD2List') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.auditLicD2List.controls.splice(0, this.auditLicD2List.controls.length);
          this.auditLicD2List.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicD2List.push(this.listDataTab2());
            this.auditLicD2List.at(index).get('taxCode').patchValue(e.taxCode);
            this.auditLicD2List.at(index).get('licName').patchValue(e.licName);
            // this.auditLicD2List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.auditLicD2List.at(index).get('licPrice').patchValue(e.licPrice);
            this.auditLicD2List.at(index).get('licCount').patchValue(e.licCount);
            // this.auditLicD2List.at(index).get('auditCheck').patchValue(e.auditCheck);
            // this.auditLicD2List.at(index).get('licT2Remark').patchValue(e.licT2Remark);
          });
        } else {
          this.auditLicD2List.controls.splice(0, this.auditLicD2List.controls.length);
          this.auditLicD2List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formDataT2.patchValue({
          d2AuditFlag: '',
          d2ConditionText: '',
          d2CriteriaText: ''
        });

      } else {
        console.log("error searchCriteria_Tab2 :", res.message);
      }
    });
  }

  saveData = (data: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEVE, data).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {

        //call getauditNoList
        this.getAuditLicNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditLicNo: res.data.auditLicNo
        });
        this.searchByAuditLicNo(this.formSearch.get('auditLicNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
      this.loading = false;
    });
  }

  async searchByAuditLicNo(auditLicNo: any) {
    this.loading = true;
    this.flagHeader = false;
    //call show button save , export
    this.flagButton = false;

    await this.clearCheckBox();

    //tab1
    await this.ajax.doPost(`${URL.SEARCH_T1_BY_AUDIT_LIC_NO}`, auditLicNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicD1List = this.formDataT1.get('auditLicD1List') as FormArray;
        if (res.data.length > 0) {
          this.auditLicD1List.controls.splice(0, this.auditLicD1List.controls.length);
          this.auditLicD1List.patchValue([]);

          res.data.forEach((e, index) => {
            //tab1
            this.auditLicD1List.push(this.listDataTab1());
            this.auditLicD1List.at(index).get('auditLicD1Seq').patchValue(e.auditLicD1Seq);
            this.auditLicD1List.at(index).get('seqNo').patchValue(e.seqNo);
            this.auditLicD1List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.auditLicD1List.at(index).get('licType').patchValue(e.licType);
            this.auditLicD1List.at(index).get('licNo').patchValue(e.licNo);
            this.auditLicD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.auditLicD1List.at(index).get('licDate').patchValue(e.licDate);
            this.auditLicD1List.at(index).get('sendDate').patchValue(e.sendDate);
            this.auditLicD1List.at(index).get('licName').patchValue(e.licName);
            this.auditLicD1List.at(index).get('incCode').patchValue(e.incCode);
            this.auditLicD1List.at(index).get('licPrice').patchValue(e.licPrice);
            this.auditLicD1List.at(index).get('licFee').patchValue(e.licFee);
            this.auditLicD1List.at(index).get('licInterior').patchValue(e.licInterior);
            this.auditLicD1List.at(index).get('licRemark').patchValue(e.licRemark);
            this.auditLicD1List.at(index).get('actionFlag').patchValue(e.actionFlag);
          });
        } else {
          this.auditLicD1List.controls.splice(0, this.auditLicD1List.controls.length);
          this.auditLicD1List.patchValue([]);
        }


      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditLicNo_Tab1 :", res.message);
      }
    });

    //tab2
    await this.ajax.doPost(`${URL.SEARCH_T2_BY_AUDIT_LIC_NO}`, auditLicNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditLicD2List = this.formDataT2.get('auditLicD2List') as FormArray;
        if (res.data.length > 0) {
          this.auditLicD2List.controls.splice(0, this.auditLicD2List.controls.length);
          this.auditLicD2List.patchValue([]);
          res.data.forEach((e, index) => {
            this.auditLicD2List.push(this.listDataTab2());
            this.auditLicD2List.at(index).get('auditLicD2Seq').patchValue(e.auditLicD2Seq);
            this.auditLicD2List.at(index).get('taxCode').patchValue(e.taxCode);
            this.auditLicD2List.at(index).get('licName').patchValue(e.licName);
            this.auditLicD2List.at(index).get('auditLicNo').patchValue(e.auditLicNo);
            this.auditLicD2List.at(index).get('licPrice').patchValue(e.licPrice);
            this.auditLicD2List.at(index).get('licCount').patchValue(e.licCount);
            this.auditLicD2List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.auditLicD2List.at(index).get('licT2Remark').patchValue(e.licT2Remark);
          });
        } else {
          this.auditLicD2List.controls.splice(0, this.auditLicD2List.controls.length);
          this.auditLicD2List.patchValue([]);
        }


      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditLicNo_Tab2 :", res.message);
      }
    });


    //call set header
    await this.searchHeaderByAuditLicNo(auditLicNo);
    await setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  searchHeaderByAuditLicNo(auditLicNo: any) {
    this.ajax.doPost(`${URL.SEARCH_H_BY_AUDIT_NO}`, auditLicNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {

        this.formSearch.patchValue({
          sector: new IsEmptyPipe().transform(res.data.sector),
          area: new IsEmptyPipe().transform(res.data.area),
          branch: new IsEmptyPipe().transform(res.data.branch),
          officeCode: res.data.officeCode,
          licDateFrom: res.data.licDateFrom,
          licDateTo: res.data.licDateTo
        });
        this.formDataT1.patchValue({
          d1AuditFlag: res.data.d1AuditFlag,
          d1ConditionText: res.data.d1ConditionText,
          d1CriteriaText: res.data.d1CriteriaText,
        });
        this.formDataT2.patchValue({
          d2AuditFlag: res.data.d2AuditFlag,
          d2ConditionText: res.data.d2ConditionText,
          d2CriteriaText: res.data.d2CriteriaText
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchHeaderByAuditLicNo :", res.message);
      }
    });
  }






  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
