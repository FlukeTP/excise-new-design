import { Component, OnInit } from '@angular/core';
import { MessageService } from 'services/message.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';
import { checkboxList } from 'projects/admin-management/user-management/userVo';
import { FormVo } from './ta0109.model';
import { CondGroup, WorksheetHdr } from '../ta0104/ta0104.model';
import { ObjMonth, RequestStartLength, TableShowDetail } from '../../table-custom/table-custom.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { Router } from '@angular/router';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DecimalFormat } from 'helpers/decimalformat';
declare var $: any;
@Component({
  selector: 'app-ta0109',
  templateUrl: './ta0109.component.html',
  styleUrls: ['./ta0109.component.css']
})
export class Ta0109Component implements OnInit {

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
  objMonth: ObjMonth = new ObjMonth();
  sectorList: Sector[];
  datasChecked: any = [];
  condDtlText: any[] = [];
  tableDetail: TableShowDetail = new TableShowDetail();
  //==> value datatable custom
  newRegFlag: string = 'N';
  start: number = 0;
  length: number = 10;
  analysisNumber: string;
  // cond: string;
  cond: string[] = [];
  resultSelect: checkboxList;

  explainCondText: any;
  condTextUsed: any = { month: [], tax: [] };

  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  listCondGroup: string[];
  condLinkActive: boolean[] = [true, false];
  // condMain2: string;
  condMain2: any[] = [];

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
  worksheetHdr: WorksheetHdr[] = [];
  taxDepartment: any = [];
  assignType: string;

  dataTabel: any;
  isShowPlan: boolean = false;
  dateStart: string;
  dateEnd: string;
  uploadForm: FormGroup;
  file: any;

  uploadList: any = [];
  budgetYearList: any[];
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
      cental: [''],
      file: [''],
      budgetYear: ['']
    });
    this.uploadForm = this.formBuilder.group({
      uploadForm: new FormControl(null, Validators.required)
    })

    this.getCondSubCapitalAndRisk()
    this.loading = true;
    this.assignType = '0';


    this.isCentral = TaUtils.isCentral(this.auth.getUserDetails().officeCode);
    console.log("isCentral : ", this.isCentral)

    this.getCondMessage();
    this.getCondMain2();
    this.dropdownListAnalysis(this.budgetYear);

    // this.getBudgetYearAndAnalysisNumber().then(res => {
    //   console.log('getBudgetYearAndAnalysisNumber', res)
    //   if (res != null) {
    //     let analysisNumber = res.analysisNumber;
    //     let planNumber = res.planNumber;
    //     this.getWorksheetCondDtl(analysisNumber);
    //     this.checkSubmitDatePlanWorksheetSend(planNumber);


    //     // this.getPlantWorkSheetDtl(analysisNumber, planNumber).subscribe(next => {
    //     //   this.getOperator(res);
    //     // });
    //     this.getMonthStart(analysisNumber).then(res => {
    //       this.calculateDateCompare()
    //       this.formVo = this.setForm();
    //       console.log("xxxxxx=>", this.formVo)

    // this.getPlantWorkSheetDtl(analysisNumber, planNumber).subscribe(next => {
    //   this.getOperator(res);
    //         // this.search();
    // });

    //     });
    //     this.getCondGroupDtl(analysisNumber);

    //   }

    // });

    this.getBudgetYearList();
    $("#pageLenght").dropdown().css('min-width', '3em');

    this.getFacTypeList();
    this.getSector();
    this.getTaxDepartment();
  }
  ngAfterViewInit() {

    $("#cond").dropdown('set selected', 'all');
    $("#conSubCapital").dropdown('set selected', '0');
    $("#condSubRisk").dropdown('set selected', '0');
    $("#condSubNoAuditFlag").dropdown('set selected', '0');

    $("#taxAuditLast").dropdown('set selected', '0');
    $('.ui.dropdown').dropdown().css('min-width', '3em');
  }

  search() {
    this.isShowPlan = false;
    this.resultSelect = {
      typeCheckedAll: false,
      ids: []
    }
    this.onCondclick(this.formGroup.get('cond').value);
  }
  onCondclick = (cond) => {
    this.loading = true;
    $("#pageLenght").dropdown('set selected', 10).css('min-width', '3em');
    console.log("call function => condclick : ", cond);
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
    console.log("formVo : ", this.formVo)
    console.log("assing type ", this.formGroup.get("cental").value);
    if (this.assignType == '0') {
      this.formVo.sector = this.formGroup.get("cental").value;
      this.formVo.area = null;
    } else {
      this.formVo.sector = this.formGroup.get("sector").value;
      this.formVo.area = this.formGroup.get("area").value;
      // this.formVo.sector = this.formGroup
    }
    this.getOperator(this.formVo);
  }
  onSave() {

    if (this.assignType == undefined || this.assignType == null) {
      this.messageBar.errorModal("กรุณาเลือกหน่วยงาน");
    } else {
      // if (!this.disabledButton) {
      this.loading = true;
      if (this.assignType == '0') {
        this.formVo.sector = this.formGroup.get("cental").value;
        this.formVo.area = null;
      } else {
        this.formVo.sector = this.formGroup.get("sector").value;
        this.formVo.area = this.formGroup.get("area").value;
      }
      console.log("office code ", this.formVo.sector)

      if (this.formVo.sector == null || this.formVo.sector == "0" || this.formVo.sector == "") {
        this.messageBar.errorModal("กรุณาเลือกหน่วยงาน");
        this.loading = false;
        return
      }
      let formSave = {
        "budgetYear": this.budgetYear,
        "analysisNumber": this.analysisNumber,
        "typeCheckedAll": this.resultSelect.typeCheckedAll,
        "planNumber": this.planNumber,
        "ids": this.resultSelect.ids,
        "sector": this.formVo.sector,
        "area": this.formVo.area
      }

      // this.loading = false;
      // console.log("save forom " ,this.formVo);
      this.savePlanDetail(formSave);
      // }
    }
    // console.log("validate select assing" ,this.resultSelect.ids)
  }
  analysisChange(e) {
    this.loading = true;
    console.log("call analysisChange : ", e.target.value);
    this.getMonthStart(e.target.value);
    this.getCondGroupDtl(e.target.value);
    this.getOperator(e.target.value);
  }

  detailClick() {
    console.log("detailClick")
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

  blur(e) {
    console.log('e==>', e)
    let format = new DecimalFormat('###,###.00');
    e.target.value = format.format(e.target.value)
    return e.target

  }
  clickSum(e) {
    e.target.value = e.target.value.replace(/\,/g, '');
    return e.target;
  }

  onChangeCond(cond) {
    console.log("onChangeCond :", cond);
    this.activeCondBtn = cond;
    // if (cond == 'all') {
    //   this.condDtlText = this.condDtls
    // } else {
    //   this.condDtlText = this.condDtls.filter(element => element.condGroup == cond);
    // }
    //this.formGroup.get('cond').patchValue(cond);
    //this.search();
    console.log("condDtlText ", this.condDtlText)
  }

  onChangeCheckTax(e) {

  }

  onChangeAssignType(e) {
    this.assignType = e.target.value;

    if (this.assignType == '0') {
      $("#sectorAssing").dropdown('set selected', '0');
      $("#areaAssing").dropdown('set selected', '0');
    } else {
      $("#cental").dropdown('set selected', '0');
    }
  }

  export() {
    console.log("export : ", this.formVo)
    let url = "ta/report/export-worksheet";
    let param = '';
    param += "?budgetYear=" + this.budgetYear;
    param += "&analysisNumber=" + this.analysisNumber;
    this.ajax.download(url + param);

  }
  // ==> app function end

  // ==> call Backend

  savePlanDetail(formSave: any) {

    console.log("savePlanDetail form :", formSave);
    if (formSave.ids.length == 0) {
      this.messageBar.errorModal("กรุณาเลือกผู้ประกอบการ");
      this.loading = false;
    } else {
      this.messageBar.comfirm(res => {
        if (res) {
          this.ajax.doPost("ta/tax-operator/save-plan-work-sheet-dtl-assing", formSave).subscribe((res: ResponseData<any>) => {
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
  dropdownListAnalysis(budgetYear) {
    this.ajax.doPost("ta/tax-operator/find-all-analysis-number-head", { budgetYear: budgetYear }).subscribe((res: ResponseData<WorksheetHdr[]>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res dropdownListAnalysis", res)
        this.worksheetHdr = res.data;
        this.analysisList = [];
        this.worksheetHdr.forEach(element => {
          this.analysisList.push(element.analysisNumber);
        });
        this.formGroup.get("analysisNumber").patchValue(this.analysisList[0]);
        $('#analysisNumber').dropdown('set selected');

        this.getMonthStart(this.formGroup.get('analysisNumber').value).then(res => {
          this.calculateDateCompare();
        });

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
        let index = this.sectors.findIndex(obj => obj.officeCode == "001400");
        if (index >= 0) {
          this.sectors.splice(index, 1);
        }

      } else {
        this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }


  getCondGroupDtl = (analysisNumber: string): any => {
    this.condLinkActive = [true, false];
    this.ajax.doPost("ta/tax-operator/find-cond-group-dtl", { analysisNumber: analysisNumber, seeDataSelect: "N" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res getCondGroupDtl", res)
        // this.condGroupDtl = res.data;
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
        this.messageBar.errorModal(res.message);
      }
    });
  }
  getOperator = (formSearch: FormVo): any => {
    console.log("formsearch ", formSearch)
    this.ajax.doPost("ta/tax-operator/worksheet-for-assing", formSearch).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res getOperator : ", res);
        res.data.datas.forEach(element => {
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

    console.log('calculateDateCompare this.objMonth', this.objMonth)

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

      this.dateStart = s[1] + "/" + (Number(s[0]) + 543).toString();
      this.dateEnd = e[1] + "/" + (Number(e[0]) + 543).toString();

    }

    console.log('calculateDateCompare', this.objMonth)
  }
  getMonthStart = (analysisNumber: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

        if (MessageService.MSG.SUCCESS === res.status) {
          this.objMonth = res.data;
          this.objMonth.isDisabled = false;
          console.log("res getMonthStart : ", res);
          console.log("res getMonthStart objMonth: ", this.objMonth);
          this.formVo = this.setForm();
          resolve(this.formVo);
        } else {
          this.formVo = this.setForm();
          reject(this.formVo)
          console.log("error getMonthStart  ");
          this.messageBar.errorModal(res.message);
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
        this.messageBar.errorModal(res.message);
      }
    })
  }
  getBudgetYearAndAnalysisNumber(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.budgetYear = res.data
          this.budgetYearNumber = Number(this.budgetYear);
          console.log("budgetYear :", res.data)
          this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": this.budgetYear }).subscribe((res: ResponseData<any>) => {
            this.loading = false;
            if (MessageService.MSG.SUCCESS == res.status) {
              console.log("getBudgetYearAndAnalysisNumber :", res)
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
          this.messageBar.errorModal("Budget year Error !!");
        }
      });

    });
  }
  getPlantWorkSheetDtl(analysisNumber: string, planNumber: string): Observable<any> {
    return new Observable(obs => {
      console.log("analysisNumber : ", analysisNumber);
      console.log("planNumber : ", planNumber);
      this.ajax.doPost("ta/tax-operator/find-plan-worksheet-dtl", { "analysisNumber": analysisNumber, "planNumber": planNumber, sendAllFlag: "Y" }).subscribe((res: ResponseData<any>) => {
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
          console.log("PlantWorkSheetDtl : ", this.datasChecked);
        } else {
          obs.error(res.message);
          this.messageBar.errorModal(res.message);
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
        this.disabledButton = false;
        console.log("checkSubmitDatePlanWorksheetSend :", res.data)
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
        console.log("getWorksheetCondDtl : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getWorksheetCondDtl !!");
      }
    })
  }

  getTaxDepartment() {
    const URL = "preferences/department/dept/central-ta";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.auditType = res.data;
        // this.formEdit.get('secDesc').patchValue(res.data);
        console.log("tax department ", res.data);
        this.taxDepartment = res.data;
      }
    })
  }

  //set form
  setForm() {
    return {
      analysisNumber: this.analysisNumber,
      // cond: this.cond,
      cond: this.formGroup.get('cond').value == "" ? this.formGroup.get('cond').patchValue([]) : this.formGroup.get('cond').value,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      seeDataSelect: "N",
      capital: this.formGroup.get('conSubCapital').value == '0' ? this.formGroup.get('conSubCapital').patchValue('') : this.formGroup.get('conSubCapital').value,
      risk: this.formGroup.get('condSubRisk').value == '0' ? this.formGroup.get('condSubRisk').patchValue('') : this.formGroup.get('condSubRisk').value,
      condSubNoAuditFlag: this.formGroup.get('condSubNoAuditFlag').value == '0' ? this.formGroup.get('condSubNoAuditFlag').patchValue('') : this.formGroup.get('condSubNoAuditFlag').value,
      newRegId: this.formGroup.get('newRegId').value,
      taxAuditLast: this.formGroup.get('taxAuditLast').value,
      dutyCode: this.formGroup.get("dutyCode").value,
      facType: this.formGroup.get("facType").value,
      sector: this.formGroup.get("sector").value,
      area: this.formGroup.get("area").value,
      yearMonthStartCompare: Utils.isNotNull(this.dateStart) ? this.dateStart : '',
      yearMonthEndCompare: Utils.isNotNull(this.dateEnd) ? this.dateEnd : '',
      newRegFlag: this.newRegFlag,
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
        console.log("cond sub capital : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub capital !!");
      }
    });
    //this.ajax.doPost("ta/tax-operator/group-cond-sub-risk", { analysisNumber }).subscribe((res: ResponseData<any>) => {
    this.ajax.doPost("preferences/parameter/TA_RISK_LEVEL", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.conSubRiskList = res.data;
        console.log("cond sub risk : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub risk !!");
      }
    });

    this.ajax.doPost("preferences/parameter/TA_SUB_COND_NOAT", {}).subscribe((res: ResponseData<ParamGroup[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log('getSubCondNoatList', res.data)
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
    $("#areaAssign").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  onChangeCental(e) {
    this.formVo.sector = e.target.value;
  }

  gotoDetail() {
    this.router.navigate(["/tax-audit-new/ta01/09/01"], {
      queryParams: {
        analysisNumber: this.analysisNumber,
        budgetYear: this.budgetYear
      }
    });
    // this.isShowPlan = true;
    // this.tablePlan();
  }


  tablePlan = () => {

    if (this.dataTabel != null) {
      this.dataTabel.destroy();
    }
    console.log("datatable call");
    // const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-by-offcode-assign";
    this.dataTabel = $("#tablePlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            planNumber: this.planNumber,
            sendAllFlag: "Y"
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: (data, type, full, meta) => {
            let disBtn = this.disabledButton ? 'disabled' : '';
            return `<button class="ui mini red button delete icon" type="button" ${disBtn}>
                    <i class="trash icon"></i>
                  </button>`;
          }
        }, {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "newRegId", className: "text-left"
        },
        {
          data: "facFullname", className: "text-left"
        }, {
          data: "dutyDesc", className: "text-left"
        },
        {
          data: "secDesc", className: "text-left"
        }, {
          data: "areaDesc", className: "text-left"
        }, {
          data: "deptShortName", className: "text-left"
        }
      ]
    });

    this.dataTabel.on("click", "td > button.delete", (event) => {
      let data = this.dataTabel.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.messageBar.comfirm(res => {
        if (res) {
          this.onDelete(data.newRegId, data.secCode);
        }
      }, "ยืนยันการทำรายการ");
    });
  }
  onDelete(id: string, officeCode: string) {
    console.log("onDelete id : ", id);
    this.ajax.doDelete(`ta/tax-operator/delete-plan-worksheet-assign-dtl/${id}/${officeCode}`).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.dataTabel.ajax.reload();
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }
  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  showUpload() {
    this.file = null;
    this.uploadForm.reset();
    $('#file').val('');

    $('#uploadModal').modal('show');
  }
  closeUpload() {
    this.uploadForm.reset()
    $('#uploadModal').modal('hide');
  }

  onUpload() {
    console.log("file")
    if (this.file == null) {
      this.messageBar.errorModal("กรุณาเลือกไฟล์")
      return
    } else {
      let formData = new FormData();
      // formData.append('listRole', null);
      formData.append('file', this.file);
      formData.append('budgetYear', this.budgetYear);
      formData.append('planNumber', this.planNumber);
      formData.append('analysisNumber', this.analysisNumber);
      // console.log("file upload ", fileUpload);
      // this.ajax.upload(
      //   "ta/tax-operator/upload-assing-plan", formData, res => {
      //     // this.messageBar.successModal(res.json().message)
      //     this.messageBar.successModal(res.message);
      //   }, err => {
      //     this.messageBar.errorModal(err)
      //   }

      // );

      this.ajax.upload(
        "ta/tax-operator/upload-assing-plan-read", formData, null).then(res => {
          let body: any = res.json();
          if (body.data) {
            this.uploadList = body.data;
            $('#loadData').modal('show');
          }
          console.log("upload read ", body.data);
        });
    }
  }

  onSaveUpload() {
    let formData = new FormData();
    formData.append('file', this.file);
    formData.append('budgetYear', this.budgetYear);
    formData.append('planNumber', this.planNumber);
    formData.append('analysisNumber', this.analysisNumber);
    this.ajax.upload(
      "ta/tax-operator/upload-assing-plan", formData, res => {
        // this.messageBar.successModal(res.json().message)
        this.messageBar.successModal(res.message);
      }, err => {
        this.messageBar.errorModal(err)
      }
    );

  }


  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.formGroup.get('budgetYear').patchValue(this.budgetYearList[0]);
          this.budgetYear = this.budgetYearList[0];
          this.budgetYearNumber = Number(this.budgetYear);
          console.log("get budget year", this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.formGroup.get('budgetYear').value);
          this.getAnalysisNumberByBudgetyear(this.budgetYear);
          // this.getAnalysisNumberByBudgetyear();
          this.dropdownListAnalysis(this.budgetYear);

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

  getAnalysisNumberByBudgetyear(budgetYear: string) {

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
        console.log("analysisNumber serch ", this.analysisNumber, " : ", this.planNumber)
        this.getWorksheetCondDtl(this.analysisNumber);
        this.checkSubmitDatePlanWorksheetSend(this.planNumber);

        this.getMonthStart(this.analysisNumber).then(res => {
          this.getPlantWorkSheetDtl(this.analysisNumber, this.planNumber).subscribe(next => {
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
  infoUpload() {
    // $('#uploadModal').modal('hide');
    $('#uploadInfo').modal('show');

  }

  backUpload() {
    // $('#uploadInfo').modal('hide');
    $('#uploadModal').modal('show');

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


