import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { CondGroup, WorksheetHdr } from '../ta0104/ta0104.model';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { ObjMonth, RequestStartLength, checkboxList, TableShowDetail } from '../../table-custom/table-custom.model';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { FormVo } from './ta0105.model';
import { Observable } from 'rxjs';
import { TaUtils } from '../../../TaAuthorized';
import { AuthService } from 'app/buckwaframework/common/services/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DecimalFormat } from 'helpers/decimalformat';

declare var $: any;
@Component({
  selector: 'app-ta0105',
  templateUrl: './ta0105.component.html',
  styleUrls: ['./ta0105.component.css']
})
export class Ta0105Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b01.label, route: this.b.b01.route },
  ];
  showTable: boolean = false;
  loading: boolean = false;
  disabledButton: boolean = false;
  // ==> datas query
  datas: any = []

  formGroup: FormGroup
  condDtls: any[] = [];
  showBody: boolean = false;
  toggleButtonTxt: string = 'แสดงเงื่อนไข'
  menuhide: boolean = false;
  txt: string = ``;
  txtHead: string = ``;
  budgetYear: string;
  planNumber: string;
  formVo: FormVo;
  analysisList: string[] = [];
  condGroupDtl: CondGroup[];
  condGroupDtlOne: CondGroup;
  objMonth: ObjMonth = new ObjMonth();
  sectorList: Sector[];
  datasChecked: any = [];
  condDtlText: any[] = [];
  //==> value datatable custom

  start: number = 0;
  length: number = 10;
  analysisNumber: string;
  cond: string[];
  resultSelect: checkboxList;

  explainCondText: any;
  condTextUsed: any = { month: [], tax: [] };

  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  listCondGroup: string[];
  condLinkActive: boolean[] = [true, false];
  condMain2: string;

  isCentral: boolean = true;
  activeCondBtn: string = 'all';

  conSubCapitalList: ParamGroup[] = [];
  conSubRiskList: ParamGroup[] = [];
  subCondNoatList: ParamGroup[] = [];
  budgetYearNumber: number;
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  sectors: any[] = [];
  areas: any[] = [];
  newRegFlag: string = 'N';
  worksheetHdr: WorksheetHdr[] = []
  tableDetail: TableShowDetail = new TableShowDetail();
  officeCode: string = '';
  budgetYearList:any[];
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.resultSelect = {
      typeCheckedAll: false,
      ids: []
    }
  }
  toggleBody() {
    if (this.showBody) {
      this.showBody = false;
      this.toggleButtonTxt = 'แสดงเงื่อนไข'
    } else {
      this.showBody = true;
      this.toggleButtonTxt = 'ซ่อนเงื่อนไข'
    }
  }
  // =>static funttion
  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
    }
  }
  // ==>static funttion end

  // ==> Datatable Custome start
  pageChangeOutput(req: RequestStartLength) {
    console.log("pageChangeOutput : ", req);
    this.loading = true;
    this.pageLenght = req.length;
    this.start = req.start;
    this.length = req.length;
    this.formVo = this.setForm();
    this.getOperator(this.formVo);
  }

  checkboxOutput(e) {
    this.resultSelect = {
      typeCheckedAll: e.typeCheckedAll,
      ids: e.ids
    }
    console.log("checkboxOutput : ", e);
  }
  //==> Datatable Custome end

  // ==> app function start
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      cond: [''],
      conSubCapital: [''],
      condSubRisk: [''],
      condSubNoAuditFlag: [''],
      newRegId: [''],
      taxAuditLast: [''],
      facType: [''],
      dutyCode: [''],
      analysisNumber: [''],
      sector: [''],
      area: [''],
      sumTaxAmStart: [null],
      sumTaxAmEnd: [null],
      cuscatId:[''],
      budgetYear:['']

    })
    this.getCondSubCapitalAndRisk()
    this.loading = true;
    this.clear();
    this.isCentral = TaUtils.isCentral(this.auth.getUserDetails().officeCode);
    this.officeCode = this.auth.getUserDetails().officeCode;
    console.log("isCentral : ", this.isCentral)

    this.getCondMessage();
    this.getCondMain2();
    // this.getBudgetYearAndAnalysisNumber().then(res => {
    //   if (res != null) {
    //     let analysisNumber = res.analysisNumber;
    //     let planNumber = res.planNumber;
    //     this.getWorksheetCondDtl(analysisNumber);
    //     this.checkSubmitDatePlanWorksheetSend(planNumber);

    //     this.getMonthStart(analysisNumber).then(res => {
    //       this.getPlantWorkSheetDtl(analysisNumber, planNumber).subscribe(next => {
    //         this.getOperator(res);
    //       });

    //     });
    //     this.getCondGroupDtl(analysisNumber);
    //     this.dropdownListAnalysis(this.budgetYear);
    //   }
    // });

    // this.dropdownListAnalysis(this.budgetYear);



    $("#pageLenght").dropdown().css('min-width', '3em');

    this.getFacTypeList();
    this.getSector();
  }

  async initSerch(){
    await this.getBudgetYearList();
    // await this.getAnalysisNumberByBudgetyear();
  }
  ngAfterViewInit() {


    $("#conSubCapital").dropdown('set selected', '0');
    $("#condSubRisk").dropdown('set selected', '0');
    $("#condSubNoAuditFlag").dropdown('set selected', '0');

    $("#taxAuditLast").dropdown('set selected', '0');
    //$('.ui.dropdown').dropdown().css('min-width', '3em');

    // console.log('After formGroup :', this.formGroup.value)
    this.initSerch();
  }

  chnageNewRegIdFlag(flag) {
    if (flag == 'N') {

      this.objMonth.showCondFlag = 'N'
    } else {
      this.objMonth.showCondFlag = 'Y'
    }
    this.newRegFlag = flag
    this.formVo = this.setForm();
    this.search()
  }

  search() {
    this.onCondclick(this.formGroup.get('cond').value);
  }
  clear() {
    $("#cond").dropdown('restore defaults');
    $("#conSubCapital").dropdown('set selected', '0');
    $("#condSubRisk").dropdown('set selected', '0');
    $("#condSubNoAuditFlag").dropdown('set selected', '0');
    $("#taxAuditLast").dropdown('set selected', '0');
    $("#cuscatId").dropdown('set selected', '0');

    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#facType").dropdown('restore defaults');
    $("#dutyCode").dropdown('restore defaults');
    $("#cuscatId").dropdown('restore defaults');

    this.newRegFlag = 'N'
    this.formGroup.get('cond').patchValue([]);
    // console.log('clear formGroup :', this.formGroup.value)
    this.formGroup.patchValue({
      sumTaxAmStart: null,
      newRegId: '',
      sumTaxAmEnd: null,
      cuscatId:""
    })
    // this.search();
  }
  onCondclick = (cond) => {
    this.loading = true;
    $("#pageLenght").dropdown('set selected', 10).css('min-width', '3em');
    // console.log("call function => condclick : ", cond);
    for (let index = 0; index < this.condLinkActive.length; index++) {
      this.condLinkActive[index] = false;
    }
    if ('all' == cond) {
      cond = '';
      this.condLinkActive[0] = true;
    } else if (0 == cond) {
      this.condLinkActive[this.condLinkActive.length - 1] = true;
    } else {
      this.condLinkActive[Number(cond)] = true;
    }
    this.cond = cond;
    this.formVo = this.setForm();
    this.getOperator(this.formVo);
  }

  mychecked(newRegId) {
    let rs = this.datasChecked.filter(e => e.newRegId == newRegId);
    // console.log('rs', rs)
    if (rs.length != 0) {
      return rs[0].officeCode == this.officeCode
    } else {
      return rs.length == 0
    }
  }
  onSave() {
    if (!this.disabledButton) {
      this.loading = true;
      let idList = this.resultSelect.ids;
      this.resultSelect.ids = []

      idList.forEach(e => {
        if (this.mychecked(e)) {
          this.resultSelect.ids.push(e);
        }
      })


      let formSave = {
        "budgetYear": this.budgetYear,
        "analysisNumber": this.analysisNumber,
        "typeCheckedAll": this.resultSelect.typeCheckedAll,
        "planNumber": this.planNumber,
        "ids": this.resultSelect.ids
      }
      // console.log('formSave', formSave)
      this.savePlanDetail(formSave);
    }
  }
  analysisChange(e) {
    this.loading = true;
    // console.log("call analysisChange : ", e.target.value);
    this.getMonthStart(e.target.value);
    this.getCondGroupDtl(e.target.value);

    this.analysisNumber = e.target.value;
    this.formVo = this.setForm();
    this.getOperator(e.target.value);
  }


  onChangeCond(cond) {
    // console.log("onChangeCond :", cond);
    // console.log("onChangeCond :", this.formGroup.get('cond').value);
    this.activeCondBtn = cond;
    // if (cond == 'all') {
    //   this.condDtlText = this.condDtls
    // } else {
    //   this.condDtlText = this.condDtls.filter(element => element.condGroup == cond);
    // }
    // this.formGroup.get('cond').patchValue(cond);
    //this.search();
    // console.log("condDtlText ", this.condDtlText)
  }

  onChangeCheckTax(e) {

  }

  export() {
    this.formVo = this.setForm();
    let url = "ta/report/ta-rpt0003";
    let param = '';
    param += "?budgetYear=" + this.formVo.budgetYear;
    param += "&analysisNumber=" + this.formVo.analysisNumber;
    param += "&cond=" + this.formVo.cond;
    param += "&newRegId=" + this.formVo.newRegId;
    param += "&taxAuditLast=" + this.formVo.taxAuditLast;
    param += "&dutyCode=" + (this.formGroup.get("dutyCode").value == '0' ? this.formGroup.get("dutyCode").patchValue('') : this.formGroup.get("dutyCode").value);
    param += "&facType=" + (this.formGroup.get("facType").value == '0' ? this.formGroup.get("facType").patchValue('') : this.formGroup.get("facType").value);
    param += "&sector=" + (this.formGroup.get("sector").value == '0' ? this.formGroup.get("sector").patchValue('') : this.formGroup.get("sector").value);
    param += "&area=" + (this.formGroup.get("area").value == '0' ? this.formGroup.get("area").patchValue('') : this.formGroup.get("area").value);
    param += "&sumTaxAmStart=" + (this.formVo.sumTaxAmStart != null ? this.formVo.sumTaxAmStart : '');
    param += "&sumTaxAmEnd=" + (this.formVo.sumTaxAmEnd != null ? this.formVo.sumTaxAmEnd : '');
    param += "&cuscatId=" + this.formVo.cuscatId;
    console.log(param);
    this.ajax.download(url + param);
  }
  // ==> app function end

  // ==> call Backend

  savePlanDetail(formSave: any) {

    // console.log("savePlanDetail form :", formSave);
    if (formSave.ids.length == 0) {
      this.messageBar.errorModal("กรุณาเลือกผู้ประกอบการ");
      this.loading = false;
    } else {
      this.messageBar.comfirm(res => {
        if (res) {
          this.ajax.doPost("ta/tax-operator/save-plan-work-sheet-dtl", formSave).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS === res.status) {
              this.getPlantWorkSheetDtl(formSave.analysisNumber, formSave.planNumber).subscribe(next => {
                this.getOperator(this.formVo);
              });
              this.messageBar.successModal(res.message);
            } else {

              console.log("error savePlanDetail");
              this.messageBar.errorModal(res.message);
            }
          });
        } else {
          this.loading = false;
        }
      }, "ยืนยันการทำรายการ");
    }
  }
  // getCondGroupDtl = (analysisNumber: string): any => {
  //   this.condLinkActive = [true, false];
  //   this.ajax.doPost("ta/tax-operator/find-cond-group-dtl", { analysisNumber }).subscribe((res: ResponseData<any>) => {
  //     if (MessageService.MSG.SUCCESS === res.status) {
  //       console.log("res getCondGroupDtl", res)
  //       this.condGroupDtl = res.data;
  //       for (let index = 0; index < this.condGroupDtl.length; index++) {
  //         this.condLinkActive.splice(index + 1, 0, false);
  //       }
  //     } else {
  //       console.log("error getCondGroupDtl")
  //       this.messageBar.errorModal(res.message);
  //     }
  //   });
  // }

  detailClick() {
    // console.log("detailClick")
    if (this.tableDetail.show == false) {
      setTimeout(() => {
        let pos = $('#parent').scrollLeft() + 1570;
        $('#parent').scrollLeft(pos);
      }, 100);

      this.tableDetail = {
        color: 'grey',
        show: true
      }
    } else {
      setTimeout(() => {
        let pos = $('#parent').scrollLeft() - 2000;
        $('#parent').scrollLeft(pos);
      }, 100);
      this.tableDetail = {
        color: 'gray',
        show: false
      }
    }

    this.objMonth.showDetail = this.tableDetail.show;
    // this.search();

  }

  dropdownListAnalysis(budgetYear) {
    this.ajax.doPost("ta/tax-operator/find-all-analysis-number-head", { budgetYear: budgetYear }).subscribe((res: ResponseData<WorksheetHdr[]>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        // console.log("res dropdownListAnalysis", res)
        this.worksheetHdr = res.data;
        this.analysisList = [];
        this.worksheetHdr.forEach(element => {
          this.analysisList.push(element.analysisNumber);
        });
        this.analysisNumber = this.analysisList[0];
        console.log("analysisNumber ", this.analysisNumber);
        this.formGroup.get("analysisNumber").patchValue(this.analysisList[0]);
        $('#analysisNumber').dropdown('set selected');
        // this.analysisNumber = this.formSearch.get("analysisNumber").value
        // this.getMonthStart(this.formSearch.get("analysisNumber").value);
        // this.getCondGroupDtl(this.formSearch.get("analysisNumber").value);
        // this.getWorksheetCondDtl(this.formSearch.get("analysisNumber").value);
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }

  getFacTypeList() {
    this.ajax.doPost("preferences/parameter/ED_DUTY_GROUP_TYPE", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.facTypeList = res.data;
        //console.log("getFacTypeList : ", res.data)
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

  getDutyCodeList(paramGroupCode) {
    console.log("get duty by duty group ",paramGroupCode)
    this.ajax.doPost(`preferences/duty-group/list/${paramGroupCode}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dutyCodeList = res.data;
      } else {
        // this.messageBar.errorModal(res.message);
        console.log("Error getDutyGroupList  Error !!");
      }
    });
  }

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //   this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }


  getCondGroupDtl = (analysisNumber: string): any => {
    this.condLinkActive = [true, false];
    this.ajax.doPost("ta/tax-operator/find-cond-group-dtl", { analysisNumber: analysisNumber, seeDataSelect: "N" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res getCondGroupDtl", res)

        this.condGroupDtl = [];
        res.data.forEach(e => {

          e.analysisNumber = e.analysisNumber;
          e.budgetYear = e.budgetYear;
          e.condDtlId = e.condDtlId;
          e.condGroup = (Number(e.condGroup) + 1).toString();
          e.productType = e.productType;
          e.rangeEnd = e.rangeEnd;
          e.rangeStart = e.rangeStart;
          e.riskLevel = e.riskLevel;
          e.taxMonthEnd = e.taxMonthEnd;
          e.taxMonthStart = e.taxMonthStart;
          e.riskLevelDesc = e.riskLevelDesc;
          this.condGroupDtl.push(e);
        });

        // console.log('object condGroupDtl list', this.condGroupDtl);
        let val = []
        this.condGroupDtl.forEach(element => {
          val.push(element.condGroup)
        });
        // console.log('val', val)
        setTimeout(() => {
          $("#cond").dropdown('set selected', val);
        }, 100);
        // $('#cond').dropdown('set selected', ['bo', 'ec'])
        for (let index = 0; index < this.condGroupDtl.length; index++) {
          let element = this.condGroupDtl[index];
          this.condTextUsed.month.push("");
          this.condTextUsed.tax.push("");

          if (Number(this.objMonth.monthTotal) == Number(element.taxMonthStart) && Number(this.objMonth.monthTotal) == Number(element.taxMonthEnd)) {
            this.condTextUsed.month[Number(index)] = this.explainCondText.msgMonth1;
            this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#MONTH#", this.objMonth.monthTotal);
          } else {
            this.condTextUsed.month[Number(index)] = this.explainCondText.msgMonth2;
            this.condTextUsed.month[Number(index)] = this.condTextUsed.month[Number(index)].replace("#MONTH#", this.objMonth.monthTotal);
          }

          if (-100 == Number(element.rangeStart) && 100 == Number(element.rangeEnd) || -100 < Number(element.rangeStart) && 100 > Number(element.rangeEnd)) {
            let mapObj = { "#Tax1#": Number(element.rangeStart), "#Tax2#": Number(element.rangeEnd) };
            let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
            this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax2;
            this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace(re, function (matched) {
              return mapObj[matched];
            });
          } else if (100 == Number(element.rangeEnd)) {
            this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax1;
            this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace("#Tax#", Number(element.rangeStart));
          } else if (-100 == Number(element.rangeStart)) {
            this.condTextUsed.tax[Number(index)] = this.explainCondText.msgTax3;
            this.condTextUsed.tax[Number(index)] = this.condTextUsed.tax[Number(index)].replace("#Tax#", Number(element.rangeEnd));
          }

          this.condLinkActive.splice(index + 1, 0, false);
        }
      } else {
        console.log("error getCondGroupDtl")
        // this.messageBar.errorModal(res.message);
      }
    });
  }
  getOperator = (formSearch: FormVo): any => {
    // console.log("formsearch ", formSearch)

    this.ajax.doPost("ta/tax-operator/", formSearch).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // console.log("res getOperator : ", res);
        res.data.datas.forEach(element => {
          // console.log('element.checked', element.checked)
          element.sumTaxAmtG1 = Utils.moneyFormatDecimal(element.sumTaxAmtG1);
          element.sumTaxAmtG2 = Utils.moneyFormatDecimal(element.sumTaxAmtG2);
          element.taxAmtChnPnt = Utils.moneyFormatDecimal(element.taxAmtChnPnt);
          element.taxAmtSd = element.taxAmtSd == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtSd);
          element.taxAmtMaxPnt = element.taxAmtMaxPnt == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMaxPnt);
          element.taxAmtMean = element.taxAmtMean == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMean);
          element.taxAmtMinPnt = element.taxAmtMinPnt == null ? "-" : Utils.moneyFormatDecimal(element.taxAmtMinPnt);
          element.regCapital = element.regCapital == null ? "-" : Utils.moneyFormatDecimal(element.regCapital);
          for (let i = 0; i < element.taxAmtList.length; i++) {
            if ("-" != element.taxAmtList[i]) {
              element.taxAmtList[i] = Utils.moneyFormatDecimal((+element.taxAmtList[i]));
            }
          }
        });
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error getOperator");
      }

      this.loading = false;
    })
  }


  calculateDateCompare() {

    // console.log('calculateDateCompare this.objMonth', this.objMonth)
    let start = this.objMonth.yearMonthStart.split("/");
    let end = this.objMonth.yearMonthEnd.split("/");

    let _dateStart = moment(start[0] + "-01-" + (Number(start[1]) - 543).toString(), "MM-DD-YYYY");
    let _dateEnd = moment(end[0] + "-01-" + (Number(end[1]) - 543).toString(), "MM-DD-YYYY");

    if (this.objMonth.monthTotal < 24) {

      let _addDateStrStart = moment(_dateStart).add(-1, 'year').format("YYYY-MM-DD")
      let _addDateStrEnd = moment(_dateEnd).add(-1, 'year').format("YYYY-MM-DD")

      let s = _addDateStrStart.split("-");
      let e = _addDateStrEnd.split("-");

      this.objMonth.yearMonthStartCompare = s[1] + "/" + (Number(s[0]) + 543).toString();
      this.objMonth.yearMonthEndCompare = e[1] + "/" + (Number(e[0]) + 543).toString();
    } else {

      let _addDateStrStart = moment(_dateStart).add(1, 'month').format("YYYY-MM-DD")
      let _addDateStrEnd = moment(_dateEnd).add(this.objMonth.monthTotal - 1, 'month').format("YYYY-MM-DD")

      let s = _addDateStrStart.split("-");
      let e = _addDateStrEnd.split("-");

      this.objMonth.yearMonthStartCompare = s[1] + "/" + (Number(s[0]) + 543).toString();
      this.objMonth.yearMonthEndCompare = e[1] + "/" + (Number(e[0]) + 543).toString();

    }

    // console.log('calculateDateCompare', this.objMonth)
  }
  getMonthStart = (analysisNumber: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

        if (MessageService.MSG.SUCCESS === res.status) {
          console.log("res getMonthStart : ", res);
          this.objMonth = res.data;
          this.objMonth.isDisabled = true;
          this.formVo = this.formVo = this.setForm();
          this.calculateDateCompare();
          resolve(this.formVo);
        } else {
          this.formVo = this.setForm();
          reject(this.formVo)
          console.log("error getMonthStart  ");
          //  this.messageBar.errorModal(res.message);
        }

      })
    });
  }
  getCondMain2() {
    const URL = "preferences/parameter/TA_MAS_COND_MAIN_DESC/NEW_COMP";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condMain2 = res.data.value1;
      } else {
        //  this.messageBar.errorModal(res.message);
        console.log('Error getCondMain2!! ')
      }
    })
  }
  getBudgetYearAndAnalysisNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.budgetYear = res.data
          this.budgetYearNumber = Number(this.budgetYear);
          // console.log("budgetYear :", res.data)
          this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": this.budgetYear }).subscribe((res: ResponseData<any>) => {
            this.loading = false;
            if (MessageService.MSG.SUCCESS == res.status) {
              // console.log("getBudgetYearAndAnalysisNumber :", res)
              if (res.data == null) {
                this.analysisNumber = '';
                this.planNumber = '';
              } else {
                this.analysisNumber = res.data.analysisNumber;
                this.planNumber = res.data.planNumber;
              }
              resolve(res.data);
            } else {
              this.messageBar.errorModal("function checkShowButton error!");
            }

          });
        } else {
          // this.messageBar.errorModal("Budget year Error !!");
          console.log("Budget year Error !!")
        }
      });

    });
  }


  getPlantWorkSheetDtl(analysisNumber: string, planNumber: string): Observable<any> {
    return new Observable(obs => {
      // console.log("analysisNumber : ", analysisNumber);
      // console.log("planNumber : ", planNumber);
      this.ajax.doPost("ta/tax-operator/find-plan-worksheet-dtl", { "analysisNumber": analysisNumber, "planNumber": planNumber, sendAllFlag: "N" }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.datasChecked = res.data;

          let idsChecked = [];
          res.data.forEach(element => {
            idsChecked.push(element.newRegId);
          });
          this.resultSelect = {
            typeCheckedAll: false,
            ids: idsChecked
          }
          obs.next(this.resultSelect);
          console.log("PlantWorkSheetDtl datachecked: ", this.datasChecked);
        } else {
          obs.error(res.message);
          //    this.messageBar.errorModal(res.message);
          console.log("Error getPlantWorkSheetDtl");
        }
      });
    })
  }
  getCondMessage() {
    const PATH = "ta/master-condition-main/condition-message/"
    this.ajax.doGet(PATH).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.condTextUsed = { month: [], tax: [] };
          this.explainCondText = res.data;
        }
      }
    });
  }

  checkSubmitDatePlanWorksheetSend(planNumber) {
    this.ajax.doPost("ta/tax-operator/check-submit-date-plan-worksheet-send", { planNumber: planNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.disabledButton = res.data;
        // console.log("checkSubmitDatePlanWorksheetSend :", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error checkSubmitDatePlanWorksheetSend !");
      }
    });
  }

  getWorksheetCondDtl(analysisNumber: string) {
    this.ajax.doPost("ta/tax-operator/get-worksheet-cond-dtl", { analysisNumber: analysisNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condDtls = res.data;
        this.condDtlText = this.condDtls
        // console.log("getWorksheetCondDtl : ", res.data);
      } else {
        //  this.messageBar.errorModal(res.message);
        console.log("Error getWorksheetCondDtl !!");
      }
    })
  }

  //set form
  setForm() {
    return {
      analysisNumber: this.analysisNumber,
      // cond: this.cond,
      cond: this.formGroup.get('cond').value == "" || this.formGroup.get('cond').value == undefined || this.formGroup.get('cond').value == null ? this.formGroup.get('cond').patchValue([]) : this.formGroup.get('cond').value,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      seeDataSelect: "N",
      newRegFlag: this.newRegFlag,
      capital: this.formGroup.get('conSubCapital').value == '0' ? this.formGroup.get('conSubCapital').patchValue('') : this.formGroup.get('conSubCapital').value,
      risk: this.formGroup.get('condSubRisk').value == '0' ? this.formGroup.get('condSubRisk').patchValue('') : this.formGroup.get('condSubRisk').value,
      condSubNoAuditFlag: this.formGroup.get('condSubNoAuditFlag').value == '0' ? this.formGroup.get('condSubNoAuditFlag').patchValue('') : this.formGroup.get('condSubNoAuditFlag').value,
      newRegId: this.formGroup.get('newRegId').value,
      taxAuditLast: this.formGroup.get('taxAuditLast').value,
      dutyCode: this.formGroup.get("dutyCode").value,
      facType: this.formGroup.get("facType").value,
      sector: this.formGroup.get("sector").value,
      area: this.formGroup.get("area").value,
      sumTaxAmStart: this.formGroup.get('sumTaxAmStart').value != null && this.formGroup.get('sumTaxAmStart').value != '' ? Number(this.formGroup.get('sumTaxAmStart').value.replace(/\,/g, '')) : null,
      sumTaxAmEnd: this.formGroup.get('sumTaxAmEnd').value != null && this.formGroup.get('sumTaxAmEnd').value != '' ? Number(this.formGroup.get('sumTaxAmEnd').value.replace(/\,/g, '')) : null,
      cuscatId:this.formGroup.get('cuscatId').value,
      budgetYear:this.budgetYear
    }
  }

  /// change
  conSubCapitalChange(e) {

  }
  condSubRiskChange(e) {

  }
  condSubNoAuditFlag(e) {

  }
  // ==> call Backend end


  getCondSubCapitalAndRisk() {
    //this.ajax.doPost("ta/tax-operator/group-cond-sub-capital", { analysisNumber }).subscribe((res: ResponseData<any>) => {
    this.ajax.doPost("preferences/parameter/TA_SUB_COND_CAPITAL", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.conSubCapitalList = res.data;
        // console.log("cond sub capital : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub capital !!");
      }
    });
    //this.ajax.doPost("ta/tax-operator/group-cond-sub-risk", { analysisNumber }).subscribe((res: ResponseData<any>) => {
    this.ajax.doPost("preferences/parameter/TA_RISK_LEVEL", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.conSubRiskList = res.data;
        // console.log("cond sub risk : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub risk !!");
      }
    });

    this.ajax.doPost("preferences/parameter/TA_SUB_COND_NOAT", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // console.log('getSubCondNoatList', res.data)
        this.subCondNoatList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }

  onChangeFacType(e) {
    this.dutyCodeList = [];
    $("#dutyCode").dropdown('restore defaults');
    this.formGroup.get("facType").value;
    this.formGroup.get("dutyCode").value;
    //if (this.formSearch.get("facType").value !== '0') {
    // if (this.formSearch.get("facType").value === '2') {
    //   paramGroupCode = 'EXCISE_SERVICE_TYPE';
    // } else {
    //   paramGroupCode = 'EXCISE_PRODUCT_TYPE'
    // }
    this.getDutyCodeList(this.formGroup.get("facType").value);
    //}
  }

  onChangeSector(e) {
    $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }

  gotoDetail() {
    this.router.navigate(["/tax-audit-new/ta01/06/"], {
      queryParams: {
        analysisNumber: this.analysisNumber,
        budgetYear:this.budgetYear
      }
    });
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.formGroup.get('budgetYear').patchValue(this.budgetYearList[0]);
          this.budgetYear = this.budgetYearList[0];
          this.budgetYearNumber = Number(this.budgetYear);
          console.log("get budget year" ,this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.formGroup.get('budgetYear').value);
          this.getAnalysisNumberByBudgetyear(this.budgetYear);
          // this.getAnalysisNumberByBudgetyear();
          this.dropdownListAnalysis( this.budgetYear);

        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
          this.loading = false;
        }
      } else {
      }
    });

  }

  budgerYearChange(event) {
    this.budgetYear = event.target.value;
    this.budgetYearNumber = Number(this.budgetYear);
    // this.getAnalysisNumberByBudgetyear();
    this.dropdownListAnalysis(event.target.value);
    this.getAnalysisNumberByBudgetyear(event.target.value);
  }

  getAnalysisNumberByBudgetyear(budgetYear:string){

      this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": budgetYear }).subscribe((res: ResponseData<any>) => {
        this.loading = false;
        if (MessageService.MSG.SUCCESS == res.status) {
          // console.log("getBudgetYearAndAnalysisNumber :", res)
          if (res.data == null) {
            this.analysisNumber = '';
            this.planNumber = '';
          } else {
            this.analysisNumber = res.data.analysisNumber;
            this.planNumber = res.data.planNumber;
          }
          console.log("analysisNumber serch ", this.analysisNumber ," : ",this.planNumber )
          this.getWorksheetCondDtl( this.analysisNumber);
          this.checkSubmitDatePlanWorksheetSend( this.planNumber);
  
          this.getMonthStart( this.analysisNumber).then(res => {
            this.getPlantWorkSheetDtl( this.analysisNumber,  this.planNumber).subscribe(next => {
              this.getOperator(res);
            });
  
          });
          this.getCondGroupDtl(this.analysisNumber);
          this.dropdownListAnalysis(this.budgetYear);


        } else {
          this.messageBar.errorModal("function checkShowButton error!");
      }
    });

  }

}

interface Sector {
  deptShortName: string;
  officeCode: string;
}

interface ParamGroup {
  paramCode: string;
  value1: string;
}


