import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { CondGroup, FormVo, FormSave, WorksheetHdr } from './ta0104.model';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { ObjMonth, RequestStartLength, TableShowDetail } from '../../table-custom/table-custom.model';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DecimalFormat } from 'helpers/decimalformat';
declare var $: any;
@Component({
  selector: 'app-ta0104',
  templateUrl: './ta0104.component.html',
  styleUrls: ['./ta0104.component.css']
})
export class Ta0104Component implements OnInit, AfterViewInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b09.label, route: this.b.b09.route }
  ];
  showTable: boolean = false;
  loading: boolean = false;
  // ==> datas query
  datas: any = []

  showBody: boolean = false;
  toggleButtonTxt: string = 'แสดงเงื่อนไข'
  menuhide: boolean = false;
  txt: string = ``;
  txtHead: string = ``;
  explainCondText: any;
  condTextUsed: any = { month: [], tax: [] };
  formVo: FormVo;
  formSearch: FormGroup;
  analysisList: string[] = [];
  condGroupDtl: CondGroup[];
  objMonth: ObjMonth = new ObjMonth();
  sectorList: Sector[];
  formSave: FormSave;
  budgetYear: string = '';
  showButton: boolean = true;
  condDtls: any[] = [];
  condDtlText: any = [];
  budgetYearNumber: number;
  budgetYearList: any[] = [];
  //==> value datatable custom

  worksheetHdr: WorksheetHdr[] = []

  start: number = 0;
  length: number = 10;
  analysisNumber: string = '';
  cond: string;

  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  listCondGroup: string[];
  condLinkActive: boolean[] = [true, false];
  condMain2: string;

  sendAllFlag: boolean = false;
  activeCondBtn: string = 'all';
  conSubCapitalList: ParamGroup[] = [];
  conSubRiskList: ParamGroup[] = [];
  subCondNoatList: ParamGroup[] = [];
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  sectors: any[] = [];
  areas: any[] = [];
  newRegFlag: string = 'N';
  tableDetail: TableShowDetail = new TableShowDetail();
  worksheetLast: any;

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  // =>static funttion
  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
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
  // =>static funttion end
  //==> Datatable Custome start

  pageChangeOutput(req: RequestStartLength) {
    if (this.cond)
      this.cond = this.formSearch.value.cond
    if (this.cond == undefined || this.cond == '')
      this.cond = this.formSearch.value.cond
    if (this.cond == 'all')
      this.cond = ''
    this.loading = true;
    this.pageLenght = req.length;
    this.start = req.start;
    this.length = req.length;
    this.formVo = this.setForm();
    // {
    //   start: this.start,
    //   length: this.length,
    //   analysisNumber: this.analysisNumber,
    //   // cond: this.cond,
    //   cond: this.formSearch.value.cond == 'all' ? this.formSearch.get('cond').patchValue('') : this.formSearch.value.cond,
    //   dateRange: this.objMonth.monthTotal,
    //   capital: '',
    //   risk: '',
    //   condSubNoAuditFlag: '',
    //   newRegId: this.formSearch.get('newRegId').value,
    //   newRegFlag: this.newRegFlag,
    //   taxAuditLast: this.formSearch.get('taxAuditLast').value,
    //   dutyCode: this.formSearch.get("dutyCode").value,
    //   facType: this.formSearch.get("facType").value,
    //   sector: this.formSearch.get("sector").value,
    //   area: this.formSearch.get("area").value,
    // }
    this.getOperator(this.formVo);
  }
  //==> Datatable Custome end

  createForm() {
    this.formSearch = this.formBuilder.group({
      analysisNumber: [''],
      budgetYear: [''],
      sector: [''],
      area: [''],
      cond: [''],
      conSubCapital: [''],
      condSubRisk: [''],
      condSubNoAuditFlag: [''],
      checkTax: [''],
      newRegId: [''],
      taxAuditLast: [''],
      facType: [''],
      dutyCode: [''],
      sumTaxAmStart: [null],
      sumTaxAmEnd: [null],
      cuscatId: ['']
    })
  }
  // ==> app function start
  ngOnInit() {


    this.findLastWorksheetStatusC();




  }
  async initPage() {
    this.checkSendAllFlag();
    this.loading = true;
    this.clear();
    // this.loading = true;
    this.getCondMessage();
    this.getCondMain2();

    this.budgetYearNumber = this.worksheetLast.budgetYear;
    // this.dropdownListAnalysis(this.worksheetLast.budgetYear);


    await this.clear();
    await this.getFacTypeList();
    await this.getSector();
    await this.getBudgetYearList();
  }
  ngAfterViewInit() {
    $("#pageLenght").dropdown().css('min-width', '3em');
    //$("#cond").dropdown('set selected', 'all');
    $("#taxAuditLast").dropdown('set selected', '0');
  }


  search() {
    // this.condclick(this.formSearch.get('cond').value)
    this.formVo = this.setForm();
    this.getOperator(this.formVo);
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

  detailClick() {
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
  clear() {
    this.newRegFlag = 'N';
    this.formSearch.patchValue({
      analysisNumber: this.analysisNumber,
      area: "",
      budgetYear: this.budgetYear,
      checkTax: "",
      conSubCapital: "",
      cond: [],
      condSubNoAuditFlag: "",
      condSubRisk: "",
      dutyCode: "",
      facType: "",
      newRegId: "",
      sector: "",
      taxAuditLast: "0",
      sumTaxAmStart: null,
      sumTaxAmEnd: null,
      cuscatId: ""
    });

    $("#cond").dropdown('restore defaults');
    $("#taxAuditLast").dropdown('set selected', '0');
    $("#cuscatId").dropdown('set selected', '0');

    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#facType").dropdown('restore defaults');
    $("#dutyCode").dropdown('restore defaults');
    $("#cuscatId").dropdown('restore defaults');
    this.search();
  }


  onChangeCond(cond) {
    this.activeCondBtn = cond;
    this.formSearch.get('cond').value

  }

  onChangeCheckTax(taxAuditList) {
    console.log('onChangeCheckTax: ', taxAuditList)
  }

  condclick = (cond) => {
    this.loading = true;
    $("#pageLenght").dropdown('set selected', 10).css('min-width', '3em');
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
    this.analysisNumber = this.formSearch.get('analysisNumber').value;


  }


  analysisChange(e) {
    this.loading = true;
    this.getMonthStart(e.target.value);
    this.getCondGroupDtl(e.target.value);

    this.analysisNumber = e.target.value;
    this.formVo = this.setForm();

    this.getOperator(this.formVo);
    this.getWorksheetCondDtl(e.tartget.value);
  }

  sentSave(flag) {
    if (this.showButton) {
      this.messageBar.comfirm(res => {
        if (res) {
          this.loading = true;
          this.formSave = {
            analysisNumber: this.analysisNumber,
            budgetYear: this.budgetYear,
            sendAllFlag: flag
          }
          this.savePlantWorkSheet(this.formSave);
        }
      }, "ยืนยันการทำรายการ");
    }
  }
  // ==> app function end

  // ==> call Backend

  export() {
    this.formVo = this.setForm();
    let url = "ta/report/ta-rpt0003";
    let param = '';
    param += "?budgetYear=" + this.formVo.budgetYear;
    param += "&analysisNumber=" + this.formVo.analysisNumber;
    param += "&cond=" + this.formVo.cond;
    param += "&newRegId=" + this.formVo.newRegId;
    param += "&taxAuditLast=" + this.formVo.taxAuditLast;
    param += "&dutyCode=" + this.formVo.dutyCode;
    param += "&facType=" + this.formVo.facType;
    param += "&sector=" + this.formVo.sector;
    param += "&area=" + this.formVo.area;
    param += "&sumTaxAmStart=" + (this.formVo.sumTaxAmStart != null ? this.formVo.sumTaxAmStart : '');
    param += "&sumTaxAmEnd=" + (this.formVo.sumTaxAmEnd != null ? this.formVo.sumTaxAmEnd : '');
    param += "&cuscatId=" + this.formVo.cuscatId;
    console.log(param);
    this.ajax.download(url + param);
  }

  dropdownListAnalysis(budgetYear) {
    this.ajax.doPost("ta/tax-operator/find-all-analysis-number-head", { budgetYear: budgetYear }).subscribe((res: ResponseData<WorksheetHdr[]>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.worksheetHdr = res.data;
        this.analysisList = [];
        this.worksheetHdr.forEach(element => {
          this.analysisList.push(element.analysisNumber);
        });
        this.formSearch.get("analysisNumber").patchValue(this.analysisList[0]);
        $('#analysisNumber').dropdown('set selected');
        this.analysisNumber = this.formSearch.get("analysisNumber").value
        this.getMonthStart(this.formSearch.get("analysisNumber").value);
        this.getCondGroupDtl(this.formSearch.get("analysisNumber").value);
        this.getWorksheetCondDtl(this.formSearch.get("analysisNumber").value);
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }
  savePlantWorkSheet(formSave: FormSave) {
    this.ajax.doPost("ta/tax-operator/save-plan-work-sheet-hdr", formSave).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.messageBar.successModal(res.message);
        this.checkShowButton(this.budgetYear);
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.loading = false;
    });
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

  findLastWorksheetStatusC() {
    this.ajax.doPost("ta/tax-operator/find-last-worksheet-status", { 'worksheetStatus': 'C' }).subscribe((res: ResponseData<any>) => {
      console.log("Data : ", res);

      this.worksheetLast = res.data;
      this.initPage();
    });
  }

  getCondGroupDtl = (analysisNumber: string): any => {
    this.condLinkActive = [true, false];
    this.ajax.doPost("ta/tax-operator/find-cond-group-dtl", { analysisNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
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

        let val = [];
        this.condGroupDtl.forEach(element => {
          val.push(element.condGroup);
        });

        setTimeout(() => {

          $("#cond").dropdown('set selected', val);
        }, 100);

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
        this.messageBar.errorModal(res.message);
      }
    });
  }
  getOperator = (formSearch: FormVo): any => {
    this.loading = true;
    this.ajax.doPost("ta/tax-operator/", formSearch).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
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
          if (element.condTaxGrp == "0") {
            element.condTaxGrp = "ไม่อยู่ในเงื่อนไข"
          } else {
            //element.condTaxGrp = "เงื่อนไขที่ " + element.condTaxGrp
          }
        });
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
      } else {
        this.messageBar.errorModal(res.message);
      }

      this.loading = false;
    })
  }
  budgerYearChange(event) {
    this.budgetYear = event.target.value;
    this.dropdownListAnalysis(event.target.value);
    this.checkShowButton(event.target.value);
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.formSearch.get('budgetYear').patchValue(this.budgetYearList[0]);
          this.budgetYear = this.budgetYearList[0];
          this.budgetYearNumber = Number(this.budgetYear);
          this.checkShowButton(this.budgetYear);
          this.dropdownListAnalysis( this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.formSearch.get('budgetYear').value)
        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
        }
      } else {
      }
    });

  }
  calculateDateCompare() {


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

  }

  getMonthStart = (analysisNumber: string): any => {
    this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

      if (MessageService.MSG.SUCCESS === res.status) {
        this.objMonth = res.data;

        this.formVo = {
          cond: [],
          analysisNumber: this.formSearch.get('analysisNumber').value,
          start: this.start,
          length: this.length,
          dateRange: this.objMonth.monthTotal,
          capital: '',
          risk: '',
          condSubNoAuditFlag: '',
          newRegId: this.formSearch.get('newRegId').value,
          newRegFlag: this.newRegFlag,
          taxAuditLast: this.formSearch.get('taxAuditLast').value,
          dutyCode: this.formSearch.get("dutyCode").value,
          facType: this.formSearch.get("facType").value,
          sector: this.formSearch.get("sector").value,
          area: this.formSearch.get("area").value,
          sumTaxAmStart: this.formSearch.get('sumTaxAmStart').value,
          sumTaxAmEnd: this.formSearch.get('sumTaxAmEnd').value,
          cuscatId: this.formSearch.get('cuscatId').value,
          budgetYear:this.formSearch.get('budgetYear').value,
        }

        this.getOperator(this.formVo);

        this.calculateDateCompare();
      } else {
        this.messageBar.errorModal(res.message);
      }

    })
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

  getBudgetYear(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.budgetYear = res.data
          obs.next(res.data);
          this.checkShowButton(this.budgetYear)
        } else {
          this.messageBar.errorModal("Budget year Error !!");
        }
      })
    })

  }
  checkShowButton(budgetYear: string) {
    this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { budgetYear }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data != null) {
          this.showButton = false;
        }else{
          this.showButton = true;
        }
      } else {
        this.messageBar.errorModal("function checkShowButton error!");
      }
    });
  }

  checkSendAllFlag() {
    const TA_CONFIG = "TA_CONFIG";
    const SEND_ALL_FLAG = "SEND_ALL_FLAG";
    this.ajax.doPost(`preferences/parameter/${TA_CONFIG}/${SEND_ALL_FLAG}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if ("Y" === res.data.value1) {
          this.sendAllFlag = true
        }
      } else {
        this.messageBar.errorModal("Error checkSendAllFlag !");
      }
    });
  }

  getWorksheetCondDtl(analysisNumber: string) {
    if (!analysisNumber){
      return;
    }
    this.ajax.doPost("ta/tax-operator/get-worksheet-cond-dtl", { analysisNumber: analysisNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condDtls = res.data;
        this.condDtlText = this.condDtls;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }
  getFacTypeList() {
    this.ajax.doPost("preferences/parameter/ED_DUTY_GROUP_TYPE", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.facTypeList = res.data;
      } else {
      }
    });
  }


  getDutyCodeList(paramGroupCode) {
    this.ajax.doPost(`preferences/duty-group/list/${paramGroupCode}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dutyCodeList = res.data;
      } else {
        // this.messageBar.errorModal(res.message);
      }
    });
  }

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
      }
    })
  }


  onChangeFacType(e) {
    this.dutyCodeList = [];
    $("#dutyCode").dropdown('restore defaults');
    this.formSearch.get("facType").value;
    this.formSearch.get("dutyCode").value;
    //if (this.formSearch.get("facType").value !== '0') {
    // if (this.formSearch.get("facType").value === '2') {
    //   paramGroupCode = 'EXCISE_SERVICE_TYPE';
    // } else {
    //   paramGroupCode = 'EXCISE_PRODUCT_TYPE'
    // }
    this.getDutyCodeList(this.formSearch.get("facType").value);
    //}
  }

  onChangeSector(e) {
    $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }

  setForm() {
    return {
      analysisNumber: this.analysisNumber,
      // cond: this.formSearch.get('cond').value == 'all' ? this.formSearch.get('cond').patchValue('') : this.formSearch.get('cond').value,
      cond: this.formSearch.get('cond').value == "" || this.formSearch.get('cond').value == undefined || this.formSearch.get('cond').value == null ? this.formSearch.get('cond').patchValue([]) : this.formSearch.get('cond').value,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: '',
      risk: '',
      condSubNoAuditFlag: '',
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag: this.newRegFlag,
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode: this.formSearch.get("dutyCode").value == '0' ? this.formSearch.get("dutyCode").patchValue('') : this.formSearch.get("dutyCode").value,
      facType: this.formSearch.get("facType").value == '0' ? this.formSearch.get("facType").patchValue('') : this.formSearch.get("facType").value,
      sector: this.formSearch.get("sector").value == '0' ? this.formSearch.get("sector").patchValue('') : this.formSearch.get("sector").value,
      area: this.formSearch.get("area").value == '0' ? this.formSearch.get("area").patchValue('') : this.formSearch.get("area").value,
      sumTaxAmStart: this.formSearch.get('sumTaxAmStart').value != null && this.formSearch.get('sumTaxAmStart').value != '' ? Number(this.formSearch.get('sumTaxAmStart').value.replace(/\,/g, '')) : null,
      sumTaxAmEnd: this.formSearch.get('sumTaxAmEnd').value != null && this.formSearch.get('sumTaxAmEnd').value != '' ? Number(this.formSearch.get('sumTaxAmEnd').value.replace(/\,/g, '')) : null,
      cuscatId: this.formSearch.get('cuscatId').value,
      budgetYear:this.formSearch.get('budgetYear').value,
    }
  }
  // ==> call Backend end
}
interface Sector {
  deptShortName: string;
  officeCode: string;
}
interface ParamGroup {
  paramCode: string;
  value1: string;
}
