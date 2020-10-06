import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { MessageService } from 'services/message.service';
import { DecimalFormat } from 'helpers/decimalformat';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import thaibath from 'helpers/thaibath';

declare var $: any;

const URL = {
  SAVE: "ia/int05/01/save",
  EST_EXP_NO_ALL: "ia/int05/01/get-dropdown-estimateno",
  TAB1_SHEARCH_BY_EST: "ia/int05/01/find-tab1-by-estimateno",
  GET_HEARDER: "ia/int05/01/find-header-by-estimateno"
}

const URLS = {
  GET_EXPORT: "ia/int05/02/estexpno2/export"
}

@Component({
  selector: 'app-int0502',
  templateUrl: './int0502.component.html',
  styleUrls: ['./int0502.component.css'],
  providers: [DepartmentDropdownService]
})
export class Int0502Component implements OnInit {
  loading: boolean = false;
  breadcrumb: BreadCrumb[] = [];
  flagBtn: string = "1";
  formSearch: FormGroup;
  formSearchHeader: FormGroup;
  iaEstimateD1List: FormArray = new FormArray([]);
  datas: any[] = [];
  sDate: any;
  eDate: any;
  tDate: any;
  fDate: any;
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  formSave: any;
  sumAllMoney: any[] = [];
  tranCostNum: any;
  estimateNo: any[] = [];
  allowancesDay: any;
  allowancesHalfDay: any;
  accomFeePackages: any;
  accomFeePackagesDat: any;
  tranCost: any;
  otherExpenses: any;

  datasum: any[] = [];
  datasumlikeY: any[] = [];
  allSumTranCost: any = 0;
  allSumOtherExpenses: any = 0;
  allSumAmt: any = 0;
  allSumAllowances: any = 0;
  allSumAccom: any = 0;

  allallSumTranCost: any = 0;
  allallSumOtherExpenses: any = 0;
  allallSumAmt: any = 0;
  allallSumAllowances: any = 0;
  allallSumAccom: any = 0;
  thaiBathCon: any;
  operatorName: any;
  title: any;

  constructor(
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private authService: AuthService,
    private fb: FormBuilder,
    private department: DepartmentDropdownService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "ตอบแบบสอบถามระบบการควบคุมภายใน", route: "#" }
    ];
    this.loading = false;
    this.formSearch = this.fb.group({
      sector: ['', Validators.required],
      area: [''],
      branch: [''],
      edPersonSeq: [''],
      officeCode: [''],
      operatorName: [''],
      department: [''],
      edOffcode: [''],
      travelDateForm: [''],
      travelDateTo: [''],
      estExpNo: ['']
    });
  }

  ngOnInit() {
    this.formSaveData();
    this.FormTab1();
    this.ListTab1();
    this.getEstExpNoList();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    this.formSearch.patchValue({
      department: this.authService.getUserDetails().departmentName,
      operatorName: this.authService.getUserDetails().userThaiName + " " + this.authService.getUserDetails().userThaiSurname,
      edOffcode: this.authService.getUserDetails().officeCode
    })
    this.changeFlagBtn("1")
  }

  ngAfterViewInit() {
    $(".ui.dropdown").dropdown();
    this.calendar();
  }

  FormTab1() {
    this.formSearchHeader = this.fb.group({
      personResp: [''],
      respDeptCode: [''],
      expReqDate: [''],
      destinationPlace: [''],
      workStDate: [''],
      workFhDate: [''],
      estExpNo: [''],
      allSumTranCost: [''],
      allSumOtherExpenses: [''],
      allSumAmt: [''],
      allSumAllowances: [''],
      allSumAccom: [''],
      iaEstimateD1List: this.fb.array([])
    })
    this.iaEstimateD1List = this.formSearchHeader.get('iaEstimateD1List') as FormArray;
  }

  ListTab1(): FormGroup {
    return this.fb.group({
      estimateExpD1Id: [''],
      estExpNo: [''],
      seqNo: [''],
      personTeamCode: [''],
      position: [''],
      allowancesDay: [''],
      allowancesHalfDay: [''],
      accomFeePackages: [''],
      accomFeePackagesDat: [''],
      tranCost: [''],
      otherExpenses: [''],
      sumAmt: [''],
      sumAllowances: [''],
      sumAccom: [''],
      remark: [''],
      flagNotWithdrawing: ['']
    });
  }

  formSaveData() {
    this.formSave = {
      iaEstimateExpHVo: {
        personResp: '',
        respDeptCode: '',
        expReqDate: '',
        destinationPlace: '',
        workStDate: '',
        workFhDate: '',
      },
      iaEstimateExpD1Vo: []
    }
  }

  changeFlagBtn(flagBtn: string) {
    this.flagBtn = flagBtn;
    //console.log("buttonflag : ", this.flagBtn);
    if (this.flagBtn == "1") {
      this.loading = true;

    }
  }


  calendar() {
    $("#dateCalendarFrom").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.formSearch.get('travelDateForm').patchValue(text);
      }
    });
    $("#dateCalendarTo").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.formSearch.get('travelDateTo').patchValue(text);
        this.onChangeSetData();
      }
    });
  }

  getEstExpNoList() {
    this.ajax.doGet(URL.EST_EXP_NO_ALL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.estimateNo = res.data;
      } else {
        //console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }

  onChangeEstExpNo(e) {
    if (Utils.isNotNull(this.formSearch.get('estExpNo').value)) {
      this.searchByEstExpNo(this.formSearch.get('estExpNo').value);
    }
  }


  dropdownChange(e, flagDropdown) {
    //console.log("value: ", e.target.value);
    //console.log("flagDropdown: ", flagDropdown);

    /* ______ auditPmQtNo dropdown _____ */
    if (flagDropdown === 'No.') {
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.formSearch.get('officeCode').reset();
      this.formSearch.get('budgetYear').patchValue(MessageService.budgetYear());
      this.formSearch.get('auditPmqtNo').patchValue(e.target.value);
      // this.getIaPmQt();
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

  onChangeSetData() {
    //console.log("fdfdfdfdfdfdfd");
    //console.log("dateform :", this.formSearch.value.travelDateForm);
    //console.log("dateto :", this.formSearch.value.travelDateTo);
    let date1 = this.formSearch.value.travelDateForm.split("/");
    let date2 = this.formSearch.value.travelDateTo.split("/");
    this.sDate = new Date(date1[2], date1[1] - 1, date1[0]);
    this.eDate = new Date(date2[2], date2[1] - 1, date2[0]);
    let dayAllowance = Math.round(((this.eDate - this.sDate) / 86400000) + 1);
    //console.log("dayAllowance : ", dayAllowance);
    this.fDate = new Date(date1[2], date1[1] - 1, date1[0]);
    this.tDate = new Date(date2[2], date2[1] - 1, date2[0]);
    let dayRoom = Math.round((this.tDate - this.fDate) / 86400000);
    //console.log("dayRoom : ", dayRoom);
    for (let i = 0; i < this.iaEstimateD1List.length; i++) {
      this.iaEstimateD1List.at(i).get('seqNo').patchValue(i);
      this.iaEstimateD1List.at(i).get('allowancesHalfDay').patchValue(dayAllowance);
      this.iaEstimateD1List.at(i).get('accomFeePackagesDat').patchValue(dayRoom);
      this.sumMoney(i);
    }
    //console.log("this.formSearchHeader.value : ", this.formSearchHeader.value);
  }

  sumMoney(i) {
    for (let j = 0; j <= i; j++) {
      this.allowancesHalfDay = this.iaEstimateD1List.at(i).get('allowancesHalfDay').value
      this.allowancesDay = this.iaEstimateD1List.at(i).get('allowancesDay').value
      this.accomFeePackagesDat = this.iaEstimateD1List.at(i).get('accomFeePackagesDat').value
      this.accomFeePackages = this.iaEstimateD1List.at(i).get('accomFeePackages').value
      this.tranCost = this.iaEstimateD1List.at(i).get('tranCost').value
      this.otherExpenses = this.iaEstimateD1List.at(i).get('otherExpenses').value
      this.sumAllMoney[i] = (this.allowancesHalfDay * this.allowancesDay) + (this.accomFeePackagesDat * this.accomFeePackages) + this.tranCost + this.otherExpenses;
      this.iaEstimateD1List.at(i).get('sumAmt').patchValue(this.sumAllMoney[i]);
    }
  }
  saveToApi = (data: any): any => {
    this.loading = true;
    //console.log("finalData :", data);
    this.ajax.doPost(URL.SAVE, data).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.getEstExpNoList();
      } else {
        this.messageBar.errorModal(res.message);
        //console.log("error saveData :", res.message);
      }
    });
    this.loading = false;
  }

  //=================== save ===========================
  save() {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        for (let i = 0; i < this.iaEstimateD1List.length; i++) {
          this.iaEstimateD1List.at(i).get('seqNo').patchValue(i);
          this.sumMoney(i);
        }
        this.formSearchHeader.patchValue({
          personResp: this.authService.getUserDetails().username,
          respDeptCode: this.formSearch.value.department,
          expReqDate: this.formSearch.value.travelDateTo,
          destinationPlace: this.formSearch.value.officeCode,
          workStDate: this.formSearch.value.travelDateForm,
          workFhDate: this.formSearch.value.travelDateTo,
          estExpNo: this.formSearch.value.estExpNo
        });
        this.formSave.iaEstimateExpHVo.personResp = this.formSearchHeader.get('personResp').value;
        this.formSave.iaEstimateExpHVo.respDeptCode = this.formSearchHeader.get('respDeptCode').value;
        this.formSave.iaEstimateExpHVo.expReqDate = this.formSearchHeader.get('expReqDate').value;
        this.formSave.iaEstimateExpHVo.destinationPlace = this.formSearchHeader.get('destinationPlace').value;
        this.formSave.iaEstimateExpHVo.workStDate = this.formSearchHeader.get('workStDate').value;
        this.formSave.iaEstimateExpHVo.workFhDate = this.formSearchHeader.get('workFhDate').value;
        this.formSave.iaEstimateExpHVo.estExpNo = this.formSearchHeader.get('estExpNo').value;
        this.formSave.iaEstimateExpD1Vo = this.formSearchHeader.get('iaEstimateD1List').value;
        //call save data
        this.saveToApi(this.formSave);
      }
    }, MessageService.MSG_CONFIRM.SAVE)
  }

  editList(idx, flax: any) {
    let index = idx;
    this.iaEstimateD1List.at(index).get('flagNotWithdrawing').patchValue(flax);
    this.datasumlikeY = this.iaEstimateD1List.value.filter((data) => {
      return data.flagNotWithdrawing === "N"
    }
    );
    //console.log(" this.datasum888FIlTER:", this.datasumlikeY);
    this.allallSumTranCost = 0;
    this.allallSumOtherExpenses = 0;
    this.allallSumAmt = 0;
    this.allallSumAllowances = 0;
    this.allallSumAccom = 0;
    for (var i = 0; i < this.datasumlikeY.length; i++) {
      this.allallSumTranCost += this.datasumlikeY[i].tranCost;
      this.allallSumOtherExpenses += this.datasumlikeY[i].otherExpenses;
      this.allallSumAmt += this.datasumlikeY[i].sumAmt;
      this.allallSumAllowances += this.datasumlikeY[i].sumAllowances;
      this.allallSumAccom += this.datasumlikeY[i].sumAccom;
    }
    //console.log("this.allallSumTranCost :",this.allallSumTranCost);
    this.formSearchHeader.get('allSumTranCost').patchValue(this.allallSumTranCost);
    this.formSearchHeader.get('allSumOtherExpenses').patchValue(this.allallSumOtherExpenses);
    this.formSearchHeader.get('allSumAmt').patchValue(this.allallSumAmt);
    this.formSearchHeader.get('allSumAllowances').patchValue(this.allallSumAllowances);
    this.formSearchHeader.get('allSumAccom').patchValue(this.allallSumAccom);
    //console.log("sssssssssssssssst : ", this.formSearchHeader.value);
    this.allSumTranCost = this.formSearchHeader.value.allSumTranCost;
    this.allSumOtherExpenses = this.formSearchHeader.value.allSumOtherExpenses;
    this.allSumAmt = this.formSearchHeader.value.allSumAmt;
    this.allSumAllowances = this.formSearchHeader.value.allSumAllowances;
    this.allSumAccom = this.formSearchHeader.value.allSumAccom;
    this.thaiBathCon = thaibath.ArabicNumberToText(this.allSumAmt);
  }
  searchByEstExpNo(estExpNo: any) {
    this.loading = true;
    // this.flagHeader = false;
    //call show button save , export
    // this.flagButton = false;
    //tab1
    this.ajax.doPost(`${URL.TAB1_SHEARCH_BY_EST}`, estExpNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.iaEstimateD1List = this.formSearchHeader.get('iaEstimateD1List') as FormArray;
        if (res.data.length > 0) {
          this.datasum = res.data;
          //console.log(" this.datasum888:", this.datasum);
          this.iaEstimateD1List.controls.splice(0, this.iaEstimateD1List.controls.length);
          this.iaEstimateD1List.patchValue([]);
          res.data.forEach((e, index) => {
            //tab1
            this.iaEstimateD1List.push(this.ListTab1());
            this.iaEstimateD1List.at(index).get('estimateExpD1Id').patchValue(e.estimateExpD1Id);
            this.iaEstimateD1List.at(index).get('estExpNo').patchValue(e.estExpNo);
            this.iaEstimateD1List.at(index).get('personTeamCode').patchValue(e.personTeamCode);
            this.iaEstimateD1List.at(index).get('position').patchValue(e.position);
            this.iaEstimateD1List.at(index).get('allowancesDay').patchValue(e.allowancesDay);
            this.iaEstimateD1List.at(index).get('allowancesHalfDay').patchValue(e.allowancesHalfDay);
            this.iaEstimateD1List.at(index).get('accomFeePackages').patchValue(e.accomFeePackages);
            this.iaEstimateD1List.at(index).get('accomFeePackagesDat').patchValue(e.accomFeePackagesDat);
            this.iaEstimateD1List.at(index).get('tranCost').patchValue(e.tranCost);
            this.iaEstimateD1List.at(index).get('otherExpenses').patchValue(e.otherExpenses);
            this.iaEstimateD1List.at(index).get('sumAmt').patchValue(e.sumAmt);
            this.iaEstimateD1List.at(index).get('sumAllowances').patchValue(e.sumAllowances);
            this.iaEstimateD1List.at(index).get('sumAccom').patchValue(e.sumAccom);
            this.iaEstimateD1List.at(index).get('remark').patchValue(e.remark);
            this.iaEstimateD1List.at(index).get('flagNotWithdrawing').patchValue(e.flagNotWithdrawing);
          });
          this.datasumlikeY = this.iaEstimateD1List.value.filter((data) => {
            return data.flagNotWithdrawing === "N"
          }
          );
          for (var i = 0; i < this.datasumlikeY.length; i++) {
            this.allallSumTranCost += this.datasumlikeY[i].tranCost;
            this.allallSumOtherExpenses += this.datasumlikeY[i].otherExpenses;
            this.allallSumAmt += this.datasumlikeY[i].sumAmt;
            this.allallSumAllowances += this.datasumlikeY[i].sumAllowances;
            this.allallSumAccom += this.datasumlikeY[i].sumAccom;
          }
          this.formSearchHeader.get('allSumTranCost').patchValue(this.allallSumTranCost);
          this.formSearchHeader.get('allSumOtherExpenses').patchValue(this.allallSumOtherExpenses);
          this.formSearchHeader.get('allSumAmt').patchValue(this.allallSumAmt);
          this.formSearchHeader.get('allSumAllowances').patchValue(this.allallSumAllowances);
          this.formSearchHeader.get('allSumAccom').patchValue(this.allallSumAccom);
          this.allSumTranCost = this.formSearchHeader.value.allSumTranCost;
          this.allSumOtherExpenses = this.formSearchHeader.value.allSumOtherExpenses;
          this.allSumAmt = this.formSearchHeader.value.allSumAmt;
          this.allSumAllowances = this.formSearchHeader.value.allSumAllowances;
          this.allSumAccom = this.formSearchHeader.value.allSumAccom;
          //console.log("this.formSearchHeader :",this.formSearchHeader.value);
          this.thaiBathCon = thaibath.ArabicNumberToText(this.allSumAmt);
          this.operatorName = this.authService.getUserDetails().userThaiName + " " + this.authService.getUserDetails().userThaiSurname
          this.title = this.authService.getUserDetails().title
        } else {
          this.iaEstimateD1List.controls.splice(0, this.iaEstimateD1List.controls.length);
          this.iaEstimateD1List.patchValue([]);
        }
      } else {
        this.messageBar.errorModal(res.message);
        //console.log("error searchByAuditNo_Tab1 :", res.message);
      }
    });
    //call set header
    this.searchHeader(estExpNo);
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  searchHeader(estExpNo: any) {
    this.ajax.doPost(`${URL.GET_HEARDER}`, estExpNo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.formSearch.patchValue({
          sector: res.data.sector,
          area: res.data.area,
          officeCode: res.data.destinationPlace,
          department: res.data.respDeptCode,
          travelDateForm: res.data.workStDate,
          travelDateTo: res.data.workFhDate,
        });
      } else {
        this.messageBar.errorModal(res.message);
        //console.log("error searchHeaderByAuditNo :", res.message);
      }
    });
  }

  clear() {
    this.loading = true;
    this.allSumTranCost = 0;
    this.allSumOtherExpenses = 0;
    this.allSumAmt = 0;
    this.allSumAllowances = 0;
    this.allSumAccom = 0;
    this.thaiBathCon = '';
    this.operatorName = '';
    this.title = '';
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#estExpNo").dropdown('restore defaults');
    this.formSearch.reset();
    this.formSearch.patchValue({
      operatorName: this.authService.getUserDetails().userThaiName + " " + this.authService.getUserDetails().userThaiSurname,
      department: this.authService.getUserDetails().departmentName,
      edOffcode: this.authService.getUserDetails().officeCode
    })
    //tab1
    this.formSearchHeader.reset();
    this.iaEstimateD1List = this.formSearchHeader.get('iaEstimateD1List') as FormArray;
    this.iaEstimateD1List.controls.splice(0, this.iaEstimateD1List.controls.length);
    this.iaEstimateD1List.patchValue([]);
    this.changeFlagBtn("1")
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      this.calendar();
      this.loading = false;
    }, 1000);
  }

  export() {
    let estExpNo1 = this.formSearch.value.estExpNo
    let test1 = estExpNo1.split("/");
    let estExpNo = test1[0] + "!" + test1[1]
    this.allSumTranCost 
    this.allSumOtherExpenses 
    this.allSumAmt 
    this.allSumAllowances
    this.allSumAccom 
    //console.log("estimateNo :", estExpNo);
    this.ajax.download(`${URLS.GET_EXPORT}/${estExpNo}/${this.allSumTranCost }/${this.allSumOtherExpenses }/${this.allSumAmt}/${this.allSumAllowances}/${this.allSumAccom}`);
  }
}

