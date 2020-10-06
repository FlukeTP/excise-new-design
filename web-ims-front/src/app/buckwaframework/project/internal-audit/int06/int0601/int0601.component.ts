import { Component, OnInit } from '@angular/core';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { FormArray, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

declare var $: any;

const URL = {
  AUDIT_NO_ALL: "ia/int06/01/find-all-audit-no",
  SEVE: "ia/int06/01/save",
  EXPORT: "ia/int06/01/export",

  SEARCH_T1: "ia/int06/01/find-tab1",
  SEARCH_T2: "ia/int06/01/find-tab2",
  SEARCH_T3: "ia/int06/01/find-tab3",

  SEARCH_H_BY_AUDIT_NO: "ia/int06/01/find-header-by-audit-no",
  SEARCH_T1_BY_AUDIT_NO: "ia/int06/01/find-tab1-by-auditnumber",
  SEARCH_T2_BY_AUDIT_NO: "ia/int06/01/find-tab2-by-auditnumber",
  SEARCH_T3_BY_AUDIT_NO: "ia/int06/01/find-tab3-by-auditnumber",

  SEARCH_T1_DTL: AjaxService.CONTEXT_PATH + "ia/int06/01/find-waste-receipt",
  SEARCH_T3_DTL: "ia/int06/01/find-tab3-dtl"

}
@Component({
  selector: 'app-int0601',
  templateUrl: './int0601.component.html',
  styleUrls: ['./int0601.component.css']
})
export class Int0601Component implements OnInit {
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditIncNoList: any[] = [];

  loading: boolean = false;
  checkSearchFlag: boolean = false;
  flagHeader: boolean = true;
  flagButton: boolean = true;
  flagTab4: boolean = false;
  loadingModal: boolean = false;
  isShowTb: boolean = true;

  tabActivate: string = '';
  //formSearch
  formSearch: FormGroup;
  //formT1
  formT1: FormGroup;
  iaAuditIncD1List: FormArray = new FormArray([]);
  dtlTab1Table: any;
  idxDtlTab1: number;
  //formT2
  formT2: FormGroup;
  iaAuditIncD2List: FormArray = new FormArray([]);
  //formT3
  formT3: FormGroup;
  iaAuditIncD3List: FormArray = new FormArray([]);
  sumAmount: any;
  sumCountReceipt: any;

  dataTable1: any = [];
  sumAmountTable1: any;

  dataTable2: any = [];
  sumAmountTable2: any;

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
    this.getAuditIncNoList();
    this.formDataSave();
    this.formDataTab1();
    this.listDataTab1();
    this.formDataTab2();
    this.listDataTab2();

    this.formDataTab3();
    this.listDataTab3();
    this.sumAmount = '';
    this.sumCountReceipt = '';

    this.dataTable1 = [];
    this.dataTable2 = [];

    this.tabActivate = '1';
  }
  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    this.calendar();

    $('.table-cont').scroll(function (e) {
      var test = e.target.scrollTop;
      // console.log("scoll e ", test);
      // $('.pane-vScroll').width($('.pane-hScroll').width() + $('.pane-hScroll').scrollLeft());
      this.querySelector('thead').style.transform = 'translateY(' + (test-1) + 'px)';
    });

  }
  //======================= Form =============================
  formDataSearch() {
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      officeReceive: [''],
      receiptDateFrom: ['', Validators.required],
      receiptDateTo: ['', Validators.required],
      auditIncNo: [''],
    })
  }


  //============== DATA FROM  TAB1============================
  formDataTab1() {
    this.formT1 = this.fb.group({
      d1AuditFlag: [''],
      d1ConditionText: [''],
      d1CriteriaText: [''],
      d4ConditionText: [''],
      d4CriteriaText: [''],
      iaAuditIncD1List: this.fb.array([])
    })
    this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
  }

  listDataTab1(): FormGroup {
    return this.fb.group({
      iaAuditIncDId: [''],
      seqNo: [''],
      officeCode: [''],
      docCtlNo: [''],
      receiptNo: [''],
      runCheck: [''],
      receiptDate: [''],
      taxName: [''],
      taxCode: [''],
      amount: [''],
      remark: [''],
      checkTax0307: [''],
      checkStamp: [''],
      checkTax0704: [''],
      remarkTax: [''],
      wasteReceiptFlag: [''],
      // Y = + , '' = -
      actionFlag: ['Y']
    });
  }
  //============== DATA FROM  TAB2============================
  formDataTab2() {
    this.formT2 = this.fb.group({
      d2ConditionText: [''],
      d2CriteriaText: [''],
      iaAuditIncD2List: this.fb.array([])
    })
    this.iaAuditIncD2List = this.formT2.get('iaAuditIncD2List') as FormArray;
  }

  listDataTab2(): FormGroup {
    return this.fb.group({
      iaAuditIncD2Id: [''],
      receiptDate: [''],
      amount: [''],
      printPerDay: [''],
      auditCheck: [''],
      remark: ['']
    });
  }
  //============== DATA FROM  TAB3============================
  formDataTab3() {
    this.formT3 = this.fb.group({
      d3ConditionText: [''],
      d3CriteriaText: [''],
      iaAuditIncD3List: this.fb.array([])
    })
    this.iaAuditIncD3List = this.formT3.get('iaAuditIncD3List') as FormArray;
  }

  listDataTab3(): FormGroup {
    return this.fb.group({
      iaAuditIncD3Id: [''],
      taxCode: [''],
      taxName: [''],
      amount: [''],
      countReceipt: [''],
      auditCheck: [''],
      remark: ['']
    });
  }

  //==================== DATA FROM  SAVE ===============================
  formDataSave() {
    this.formSave = {
      iaAuditIncH: {
        officeCode: '',
        receiptDateFrom: '',
        receiptDateTo: '',
        auditIncNo: '',
        d1AuditFlag: '',
        d1ConditionText: '',
        d1CriteriaText: '',
        d2ConditionText: '',
        d2CriteriaText: '',
        d3ConditionText: '',
        d3CriteriaText: '',
        d4ConditionText: '',
        d4CriteriaText: ''
      },
      iaAuditIncD1List: [],
      iaAuditIncD2List: [],
      iaAuditIncD3List: []
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
        this.formSearch.get('receiptDateFrom').patchValue(text);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('receiptDateTo').patchValue(text);
      }
    });
  }
  //=========== getSector , getArea , getBranch , getAuditIncNo =======
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
  getAuditIncNoList() {
    this.ajax.doPost(URL.AUDIT_NO_ALL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditIncNoList = res.data;
      } else {
        console.log("getauditIncNo findAllDataHeader Error !!");
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
  onChangeAuditIncNo(e) {
    if (Utils.isNotNull(this.formSearch.get('auditIncNo').value)) {
      this.searchByAuditNo(this.formSearch.get('auditIncNo').value);
    }
  }

  reEditRunCheck(i, val) {
    console.log('reEditRunCheck', i);
    this.iaAuditIncD1List = this.formT1.get("iaAuditIncD1List") as FormArray;
    if (Utils.isNotNull(val)) {
      for (let index = i; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('runCheck').patchValue(val);
        val++;
      }
    } else {
      for (let index = i; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('runCheck').patchValue('');
      }
    }
  }

  onInsertList(idx) {
    let index = idx;
    this.iaAuditIncD1List = this.formT1.get("iaAuditIncD1List") as FormArray;
    this.iaAuditIncD1List.insert(index, this.listDataTab1());
    this.iaAuditIncD1List.at(index).get('actionFlag').patchValue('');
  }

  onInsertListNext() {
    this.iaAuditIncD1List = this.formT1.get("iaAuditIncD1List") as FormArray;
    let index = this.iaAuditIncD1List.length
    this.iaAuditIncD1List.insert(index, this.listDataTab1());
    this.iaAuditIncD1List.at(index).get('actionFlag').patchValue('');
  }


  onRemoveList(idx) {
    this.iaAuditIncD1List = this.formT1.get("iaAuditIncD1List") as FormArray;
    this.iaAuditIncD1List.removeAt(idx);
  }

  tab1Dtl(idx) {
    this.idxDtlTab1 = idx;

    $("#tab1Dtl").modal({
      onShow: () => {
        this.tableTab1Dtl();
      },
      onDeny: () => {

      }
    }).modal('show');
  }

  taxCodeDtlTab3(taxCode: string) {
    $("#taxCodeDtl").modal({
      onShow: () => {
        this.getTaxCodeDtlTableTab3(taxCode);
      },
      onDeny: () => {
        // this.table1.destroy();
        this.dataTable1 = [];
        this.sumAmountTable1 = '';
      }
    }).modal('show');
  }

  showAllDtlTab3() {
    this.loading = true;
    setTimeout(() => {
      this.isShowTb = false;
      this.getDataAll();
      this.loading = false;
    }, 1000);
  }

  showMaster() {
    this.loading = true;
    setTimeout(() => {
      this.isShowTb = true;
      this.loading = false;
    }, 1000);
  }

  // ====================  check-box Tab2 ========================
  chk1AuditAll = (event) => {
    $("#chk2Audit").prop("checked", false);
    $("#chk3Audit").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  chk2AuditAll = (event) => {
    $("#chk1Audit").prop("checked", false);
    $("#chk3Audit").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  chk3AuditAll = (event) => {
    $("#chk2Audit").prop("checked", false);
    $("#chk1Audit").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('3');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD2List.length; index++) {
        this.iaAuditIncD2List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  // ====================  check-box Tab3 ========================
  chk1Audit3All = (event) => {
    $("#chk2Audit3").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD3List.length; index++) {
        this.iaAuditIncD3List.at(index).get('auditCheck').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD3List.length; index++) {
        this.iaAuditIncD3List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  chk2Audit3All = (event) => {
    $("#chk1Audit3").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD3List.length; index++) {
        this.iaAuditIncD3List.at(index).get('auditCheck').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD3List.length; index++) {
        this.iaAuditIncD3List.at(index).get('auditCheck').patchValue('');
      }
    }
  }

  // ====================  check-box Tab4 ========================
  chk1Tax0307All = (event) => {
    $("#chk2Tax0307").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0307').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0307').patchValue('');
      }
    }
  }

  chk2Tax0307All = (event) => {
    $("#chk1Tax0307").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0307').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0307').patchValue('');
      }
    }
  }

  chk1StampAll = (event) => {
    $("#chk2Stamp").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkStamp').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkStamp').patchValue('');
      }
    }
  }

  chk2StampAll = (event) => {
    $("#chk1Stamp").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkStamp').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkStamp').patchValue('');
      }
    }
  }

  chk1Tax0704All = (event) => {
    $("#chk2Tax0704").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0704').patchValue('1');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0704').patchValue('');
      }
    }
  }

  chk2Tax0704All = (event) => {
    $("#chk1Tax0704").prop("checked", false);
    if (event.target.checked) {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0704').patchValue('2');
      }
    } else {
      for (let index = 0; index < this.iaAuditIncD1List.length; index++) {
        this.iaAuditIncD1List.at(index).get('checkTax0704').patchValue('');
      }
    }
  }
  //====================== clear check -box =======================
  clearCheckBox() {
    //tab1
    $("#chk1Audit3").prop("checked", false);
    $("#chk2Audit3").prop("checked", false);
    //tab2
    $("#chk1Audit").prop("checked", false);
    $("#chk2Audit").prop("checked", false);
    $("#chk3Audit").prop("checked", false);
    //tab4
    $("#chk1Tax0307").prop("checked", false);
    $("#chk2Tax0307").prop("checked", false);
    $("#chk1Stamp").prop("checked", false);
    $("#chk2Stamp").prop("checked", false);
    $("#chk1Tax0704").prop("checked", false);
    $("#chk2Tax0704").prop("checked", false);
  }
  //================ activate =======================
  activate(tab: string) {
    return this.tabActivate == tab;
  }

  showTab(tab: string) {
    if (tab === '4') {
      if (Utils.isNull(this.formSearch.get('auditIncNo').value) && this.flagTab4 !== true) {
        this.messageBar.errorModal('กรุณาเลือก! เลขที่กระดาษทำการ <br> เพื่อตรวจสอบการใช้ใบเสร็จรับเงินกับแบบรายการภาษี', 'แจ้งเตือน');
      } else if (Utils.isNotNull(this.formSearch.get('auditIncNo').value) && this.flagTab4 !== true) {
        this.messageBar.errorModal('เลขที่กระดาษทำการ ฉบับนี้ <br> ไม่พบรายการใช้ใบเสร็จรับเงิน', 'แจ้งเตือน');
      }
    }

    this.tabActivate = tab;
  }
  //============ serach ===========================
  serach() {

    this.checkSearchFlag = true;
    this.isShowTb = true;
    if (this.flagButton === true) {
      if (this.formSearch.valid) {
        console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
        if (this.formSearch.get('branch').value != "0") {
          this.formSearch.get('officeReceive').patchValue(this.formSearch.get('branch').value);
        } else {
          if (this.formSearch.get('area').value != "0") {
            this.formSearch.get('officeReceive').patchValue(this.formSearch.get('area').value);
          } else {
            if (this.formSearch.get('sector').value != "") {
              this.formSearch.get('officeReceive').patchValue(this.formSearch.get('sector').value);
            } else {
              this.formSearch.patchValue({ officeReceive: "" });
            }
          }
        }
        //clear auditLicdupNo
        this.formSearch.patchValue({ auditIncNo: "" });
        $("#auditIncNo").dropdown('restore defaults');
        //clear sum tab3
        this.sumAmount = '';
        this.sumCountReceipt = '';
        this.dataTable1 = [];
        this.dataTable2 = [];
        this.sumAmountTable1 = '';
        this.sumAmountTable2 = '';

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
    this.flagTab4 = false;
    this.loading = true;
    this.isShowTb = true;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    $("#auditIncNo").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.clearCheckBox();
    this.formSearch.reset();
    //tab1
    this.formT1.reset();
    this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
    this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
    this.iaAuditIncD1List.patchValue([]);
    //tab2
    this.formT2.reset();
    this.iaAuditIncD2List = this.formT2.get('iaAuditIncD2List') as FormArray;
    this.iaAuditIncD2List.controls.splice(0, this.iaAuditIncD2List.controls.length);
    this.iaAuditIncD2List.patchValue([]);
    //tab3
    this.formT3.reset();
    this.iaAuditIncD3List = this.formT3.get('iaAuditIncD3List') as FormArray;
    this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
    this.iaAuditIncD3List.patchValue([]);
    this.sumAmount = '';
    this.sumCountReceipt = '';
    this.dataTable1 = [];
    this.dataTable2 = [];
    this.sumAmountTable1 = '';
    this.sumAmountTable2 = '';
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 1000);
  }
  //============ export ===========================
  export() {
    this.checkSearchFlag = false;
    if (Utils.isNotNull(this.formSearch.get('auditIncNo').value)) {
      var auditIncNo = this.formSearch.get('auditIncNo').value.replace("/", "_");
      this.ajax.download(`${URL.EXPORT}/${auditIncNo}`);
    }
  }
  //=================== save ===========================
  save() {
    if (this.flagButton === false) {
      this.messageBar.comfirm(async confirm => {
        if (confirm) {
          this.formSave.iaAuditIncH.officeCode = this.formSearch.get('officeReceive').value;
          this.formSave.iaAuditIncH.receiptDateFrom = this.formSearch.get('receiptDateFrom').value;
          this.formSave.iaAuditIncH.receiptDateTo = this.formSearch.get('receiptDateTo').value;
          this.formSave.iaAuditIncH.auditIncNo = this.formSearch.get('auditIncNo').value;
          this.formSave.iaAuditIncH.d1AuditFlag = this.formT1.get('d1AuditFlag').value;
          this.formSave.iaAuditIncH.d1ConditionText = this.formT1.get('d1ConditionText').value;
          this.formSave.iaAuditIncH.d1CriteriaText = this.formT1.get('d1CriteriaText').value;
          this.formSave.iaAuditIncH.d2ConditionText = this.formT2.get('d2ConditionText').value;
          this.formSave.iaAuditIncH.d2CriteriaText = this.formT2.get('d2CriteriaText').value;
          this.formSave.iaAuditIncH.d3ConditionText = this.formT3.get('d3ConditionText').value;
          this.formSave.iaAuditIncH.d3CriteriaText = this.formT3.get('d3CriteriaText').value;
          this.formSave.iaAuditIncH.d4ConditionText = this.formT1.get('d4ConditionText').value;
          this.formSave.iaAuditIncH.d4CriteriaText = this.formT1.get('d4CriteriaText').value;

          this.addSeqNoTab1();

          this.formSave.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List').value;
          this.formSave.iaAuditIncD2List = this.formT2.get('iaAuditIncD2List').value;
          this.formSave.iaAuditIncD3List = this.formT3.get('iaAuditIncD3List').value;
          //call save data
          this.saveData(this.formSave);
        }
      }, MessageService.MSG_CONFIRM.SAVE)
    }
  }

  addSeqNoTab1() {
    for (let index = 0; index < this.formT1.get('iaAuditIncD1List').value.length; index++) {
      this.formT1.get('iaAuditIncD1List').get(index.toString()).get('seqNo').patchValue(index + 1);
    }
  }
  //=================================== call Back End ==================================
  async searchCriteria(formSearch: any) {
    this.loading = true;

    await this.clearCheckBox();

    //tab1
    await this.ajax.doPost(URL.SEARCH_T1, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD1List.push(this.listDataTab1());
            this.iaAuditIncD1List.at(index).get('officeCode').patchValue(e.officeCode);
            this.iaAuditIncD1List.at(index).get('docCtlNo').patchValue(e.docCtlNo);
            this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(e.receiptNo);
            this.iaAuditIncD1List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD1List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD1List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD1List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD1List.at(index).get('wasteReceiptFlag').patchValue(e.wasteReceiptFlag);
          });
        } else {
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formT1.patchValue({
          d1AuditFlag: '',
          d1ConditionText: '',
          d1CriteriaText: '',
          d4ConditionText: '',
          d4CriteriaText: ''
        });

      } else {
        console.log("error searchCriteria_Tab1 :", res.message);
      }
    });
    //tab2
    await this.ajax.doPost(URL.SEARCH_T2, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.iaAuditIncD2List = this.formT2.get('iaAuditIncD2List') as FormArray;
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.iaAuditIncD2List.controls.splice(0, this.iaAuditIncD2List.controls.length);
          this.iaAuditIncD2List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD2List.push(this.listDataTab2());
            this.iaAuditIncD2List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD2List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD2List.at(index).get('printPerDay').patchValue(e.printPerDay);
          });
        } else {
          this.iaAuditIncD2List.controls.splice(0, this.iaAuditIncD2List.controls.length);
          this.iaAuditIncD2List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formT2.patchValue({
          d2ConditionText: '',
          d2CriteriaText: ''
        });

      } else {
        console.log("error searchCriteria_Tab2 :", res.message);
      }
    });
    //tab3
    await this.ajax.doPost(URL.SEARCH_T3, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let sumAmount1 = 0;
        let sumCountReceipt1 = 0;
        console.log("res data_Tab3", res);
        if (res.data.length > 0) {
          //set show button save
          this.flagButton = false;
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD3List.push(this.listDataTab3());
            this.iaAuditIncD3List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD3List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD3List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD3List.at(index).get('countReceipt').patchValue(e.countReceipt);
            sumAmount1 += parseInt(e.amount);
            sumCountReceipt1 += parseInt(e.countReceipt);
          });
          //resule sum sumAmount,sumCountReceipt
          this.sumAmount = sumAmount1;
          this.sumCountReceipt = sumCountReceipt1;

        } else {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
        }
        //clear data textAraBox and radio
        this.formT3.patchValue({
          d3ConditionText: '',
          d3CriteriaText: ''
        });

      } else {
        console.log("error searchCriteria_Tab2 :", res.message);
      }
    });

    await setTimeout(() => {
      this.loading = false;
    }, 1000);

  }

  saveData = (data: any): any => {
    this.loading = true;
    this.ajax.doPost(URL.SEVE, data).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {

        //call getauditNoList
        this.getAuditIncNoList();
        this.messageBar.successModal(res.message);
        this.formSearch.patchValue({
          auditIncNo: res.data.auditIncNo
        });
        this.searchByAuditNo(this.formSearch.get('auditIncNo').value);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  async searchByAuditNo(auditIncNo: any) {
    this.loading = true;
    this.flagHeader = false;
    //call show button save , export
    this.flagButton = false;

    await this.clearCheckBox();
    //tab1
    await this.ajax.doPost(`${URL.SEARCH_T1_BY_AUDIT_NO}`, auditIncNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.iaAuditIncD1List = this.formT1.get('iaAuditIncD1List') as FormArray;
        if (res.data.length > 0) {
          this.flagTab4 = true;
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);

          res.data.forEach((e, index) => {
            //tab1
            this.iaAuditIncD1List.push(this.listDataTab1());
            this.iaAuditIncD1List.at(index).get('iaAuditIncDId').patchValue(e.iaAuditIncDId);
            this.iaAuditIncD1List.at(index).get('seqNo').patchValue(e.seqNo);
            this.iaAuditIncD1List.at(index).get('officeCode').patchValue(e.officeReceive);
            this.iaAuditIncD1List.at(index).get('docCtlNo').patchValue(e.docCtlNo);
            this.iaAuditIncD1List.at(index).get('receiptNo').patchValue(e.receiptNo);
            this.iaAuditIncD1List.at(index).get('runCheck').patchValue(e.runCheck);
            this.iaAuditIncD1List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD1List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD1List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD1List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD1List.at(index).get('remark').patchValue(e.remark);

            this.iaAuditIncD1List.at(index).get('checkTax0307').patchValue(e.checkTax0307);
            this.iaAuditIncD1List.at(index).get('checkStamp').patchValue(e.checkStamp);
            this.iaAuditIncD1List.at(index).get('checkTax0704').patchValue(e.checkTax0704);
            this.iaAuditIncD1List.at(index).get('remarkTax').patchValue(e.remarkTax);

            this.iaAuditIncD1List.at(index).get('wasteReceiptFlag').patchValue(e.wasteReceiptFlag);
            this.iaAuditIncD1List.at(index).get('actionFlag').patchValue(e.actionFlag);
          });
        } else {
          this.flagTab4 = false;
          this.iaAuditIncD1List.controls.splice(0, this.iaAuditIncD1List.controls.length);
          this.iaAuditIncD1List.patchValue([]);
        }


      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditNo_Tab1 :", res.message);
      }
    });

    //tab2
    await this.ajax.doPost(`${URL.SEARCH_T2_BY_AUDIT_NO}`, auditIncNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.iaAuditIncD2List = this.formT2.get('iaAuditIncD2List') as FormArray;
        if (res.data.length > 0) {
          this.iaAuditIncD2List.controls.splice(0, this.iaAuditIncD2List.controls.length);
          this.iaAuditIncD2List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD2List.push(this.listDataTab2());
            this.iaAuditIncD2List.at(index).get('iaAuditIncD2Id').patchValue(e.iaAuditIncD2Id);
            this.iaAuditIncD2List.at(index).get('receiptDate').patchValue(e.receiptDate);
            this.iaAuditIncD2List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD2List.at(index).get('printPerDay').patchValue(e.printPerDay);
            this.iaAuditIncD2List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.iaAuditIncD2List.at(index).get('remark').patchValue(e.remark);
          });
        } else {
          this.iaAuditIncD2List.controls.splice(0, this.iaAuditIncD2List.controls.length);
          this.iaAuditIncD2List.patchValue([]);
        }


      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditNo_Tab2 :", res.message);
      }
    });

    //tab3
    await this.ajax.doPost(`${URL.SEARCH_T3_BY_AUDIT_NO}`, auditIncNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let sumAmount1 = 0;
        let sumCountReceipt1 = 0;

        this.iaAuditIncD3List = this.formT3.get('iaAuditIncD3List') as FormArray;
        if (res.data.length > 0) {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
          res.data.forEach((e, index) => {
            this.iaAuditIncD3List.push(this.listDataTab3());
            this.iaAuditIncD3List.at(index).get('iaAuditIncD3Id').patchValue(e.iaAuditIncD3Id);
            this.iaAuditIncD3List.at(index).get('taxCode').patchValue(e.taxCode);
            this.iaAuditIncD3List.at(index).get('taxName').patchValue(e.taxName);
            this.iaAuditIncD3List.at(index).get('amount').patchValue(e.amount);
            this.iaAuditIncD3List.at(index).get('countReceipt').patchValue(e.countReceipt);
            this.iaAuditIncD3List.at(index).get('auditCheck').patchValue(e.auditCheck);
            this.iaAuditIncD3List.at(index).get('remark').patchValue(e.remark);
            sumAmount1 += parseInt(e.amount);
            sumCountReceipt1 += parseInt(e.countReceipt);
          });
          //resule sum sumAmount,sumCountReceipt
          this.sumAmount = sumAmount1;
          this.sumCountReceipt = sumCountReceipt1;
        } else {
          this.iaAuditIncD3List.controls.splice(0, this.iaAuditIncD3List.controls.length);
          this.iaAuditIncD3List.patchValue([]);
        }

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchByAuditNo_Tab3 :", res.message);
      }
    });

    //call set header
    await this.searchHeaderByAuditNo(auditIncNo);
    await setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  searchHeaderByAuditNo(auditIncNo: any) {
    this.ajax.doPost(`${URL.SEARCH_H_BY_AUDIT_NO}`, auditIncNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {

        this.formSearch.patchValue({
          sector: new IsEmptyPipe().transform(res.data.sector),
          area: new IsEmptyPipe().transform(res.data.area),
          branch: new IsEmptyPipe().transform(res.data.branch),
          officeReceive: res.data.officeCode,
          receiptDateFrom: res.data.receiptDateFrom,
          receiptDateTo: res.data.receiptDateTo
        });
        this.formT1.patchValue({
          d1AuditFlag: res.data.d1AuditFlag,
          d1ConditionText: res.data.d1ConditionText,
          d1CriteriaText: res.data.d1CriteriaText,
          d4ConditionText: res.data.d4ConditionText,
          d4CriteriaText: res.data.d4CriteriaText
        });
        this.formT2.patchValue({
          d2ConditionText: res.data.d2ConditionText,
          d2CriteriaText: res.data.d2CriteriaText
        });
        this.formT3.patchValue({
          d3ConditionText: res.data.d3ConditionText,
          d3CriteriaText: res.data.d3CriteriaText
        });

      } else {
        this.messageBar.errorModal(res.message);
        console.log("error searchHeaderByAuditNo :", res.message);
      }
    });
  }

  //detel tab1
  tableTab1Dtl = () => {
    if (this.dtlTab1Table != null) {
      this.dtlTab1Table.destroy();
    }
    this.dtlTab1Table = $("#tab1DtlTable").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      ajax: {
        type: "POST",
        url: URL.SEARCH_T1_DTL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.formSearch.value));
        }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "trnDate",
          className: "text-center"
        }, {
          data: "incctlNo",
          className: "text-center"
        }, {
          data: "receiptNo",
          className: "text-center"
        }, {
          data: "receiptNoNew",
          className: "text-center"
        },
        {
          data: "reasonDesc",
          className: "text-left"
        }

      ]
    });


    this.dtlTab1Table.on("dblclick", "td", (event) => {
      var data = this.dtlTab1Table.row($(event.currentTarget).closest("tr")).data();

      this.iaAuditIncD1List = this.formT1.get("iaAuditIncD1List") as FormArray;
      this.iaAuditIncD1List.at(this.idxDtlTab1).get('docCtlNo').patchValue(data.incctlNo);
      this.iaAuditIncD1List.at(this.idxDtlTab1).get('receiptNo').patchValue(data.receiptNo);
      this.iaAuditIncD1List.at(this.idxDtlTab1).get('receiptDate').patchValue(data.trnDate);
      this.iaAuditIncD1List.at(this.idxDtlTab1).get('remark').patchValue(data.reasonDesc);
      $('#tab1Dtl').modal('hide');
    });


  }

  //detel tab3
  getTaxCodeDtlTableTab3(taxCode: string) {
    console.log('top', this.formSearch.value);

    this.loadingModal = true;
    this.dataTable1 = [];
    this.sumAmountTable1 = '';
    const request = {
      taxCode: taxCode,
      receiptDateFrom: this.formSearch.get('receiptDateFrom').value,
      receiptDateTo: this.formSearch.get('receiptDateTo').value,
      officeReceive: this.formSearch.get('officeReceive').value
    }

    this.ajax.doPost(URL.SEARCH_T3_DTL, request).subscribe((res: any) => {
      console.log("res:", res);
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res.data.wsIncfri8020Inc", res.data.wsIncfri8020Inc);
        if (res.data.wsIncfri8020Inc.length > 0) {
          this.dataTable1 = res.data.wsIncfri8020Inc;
          this.sumAmountTable1 = res.data.sumAmt;
          // setTimeout(() => {
          //   this.tablePlan();
          // }, 1000);
        } else {
          this.dataTable1 = [];
          this.sumAmountTable1 = '';
        }
        setTimeout(() => {
          this.loadingModal = false;
        }, 500);
      } else {
        this.messageBar.errorModal("error getTaxCodeDtlTableTab3")
      }
    });

  }

  getDataAll() {
    this.loading = true;
    this.dataTable2 = [];
    this.sumAmountTable2 = '';
    let request = {
      receiptDateFrom: this.formSearch.get('receiptDateFrom').value,
      receiptDateTo: this.formSearch.get('receiptDateTo').value,
      officeReceive: this.formSearch.get('officeReceive').value
    }
    this.ajax.doPost(URL.SEARCH_T3_DTL, request).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data.wsIncfri8020Inc.length > 0) {
          this.dataTable2 = res.data.wsIncfri8020Inc;
          this.sumAmountTable2 = res.data.sumAmt;
        } else {
          this.dataTable2 = [];
          this.sumAmountTable2 = '';
        }

      } else {
        this.messageBar.errorModal("error getDataAll")
      }
      this.loading = false;
    });
  }
  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
