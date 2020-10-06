import { Component, OnInit } from '@angular/core';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { ResponseData } from 'app/buckwaframework/common/models/response-data.model';
import { FormVo, FormSave, CondGroup, WorksheetHdr } from '../ta0104.model';
import { RequestStartLength, ObjMonth } from '../../../table-custom/table-custom.model';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';

declare var $: any;
@Component({
  selector: 'app-ta010401',
  templateUrl: './ta010401.component.html',
  styleUrls: ['./ta010401.component.css']
})
export class Ta010401Component implements OnInit {

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
  condGroupDtl: CondGroup[];
  showBody: boolean = false;
  toggleButtonTxt: string = 'แสดงเงื่อนไข'
  menuhide: boolean = false;
  txt: string = ``;
  txtHead: string = ``;
  formVo: FormVo;
  formSearch: FormGroup;
  analysisList: string[] = [];
  objMonth: ObjMonth = new ObjMonth();
  sectorList: Sector[];
  formSave: FormSave;
  budgetYear: string = '';
  showButton: boolean = true;
  condDtls: any[] = [];
  //==> value datatable custom

  start: number = 0;
  length: number = 10;
  analysisNumber: string = '';
  cond: string[];

  capital: string = '';
  risk: string = '';

  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  listCondGroup: string[];
  condLinkActive: boolean[] = [true, false];
  condMain2: string;

  sendAllFlag: boolean = false;
  conSubCapitalList: ConSubCapitalList[] = [];
  conSubRiskList: ConSubRiskList[] = [];
  subCondNoatList: any[] = [];

  worksheetHdr: WorksheetHdr[] = []
  budgetYearNumber: number;
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  sectors: any[] = [];
  areas: any[] = [];
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
    console.log("pageChangeOutput : ", req);
    this.loading = true;
    this.pageLenght = req.length;
    this.start = req.start;
    this.length = req.length;
    this.formVo = {
      start: this.start,
      length: this.length,
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      dateRange: this.objMonth.monthTotal,
      capital: this.capital,
      risk: this.risk,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);
  }
  //==> Datatable Custome end

  // ==> app function start
  createForm(): void {
    this.formSearch = this.formBuilder.group({
      analysisNumber: [''],
      sector: [''],
      area: [''],
      conSubCapital: [''],
      condSubRisk: [''],
      condSubNoAuditFlag: [''],
      newRegId: [''],
      taxAuditLast: [''],
      facType: [''],
      dutyCode: ['']
    })
  }
  ngOnInit() {

    this.checkSendAllFlag();
    this.loading = true;



    console.log("formsearch : ", this.formSearch.value);
    this.loading = true;
    this.getCondMain2();
    this.dropdownListAnalysis();
    this.getBudgetYear();
    this.getSubCondNoatList();

    this.getFacTypeList();
    this.getSector();
  }
  ngAfterViewInit() {
    $('.ui.accordion').accordion();
    $("#pageLenght").dropdown().css('min-width', '3em');
    $("#conSubCapital").dropdown('set selected', '0');
    $("#condSubRisk").dropdown('set selected', '0');
    $("#condSubNoAuditFlag").dropdown('set selected', '0');
    $('.ui.dropdown').dropdown().css('min-width', '3em');
  }
  condclick = (cond) => {
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
    this.cond = [];
    this.analysisNumber = this.formSearch.get('analysisNumber').value;
    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: this.capital,
      risk: this.risk,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);
  }

  analysisChange(e) {
    this.loading = true;
    console.log("call analysisChange : ", e.target.value);
    this.getMonthStart(e.target.value);
    this.getOperator(e.target.value);
    this.getCondSubCapitalAndRisk(e.target.value);
    this.getWorksheetCondDtl(e.target.value);
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

  onCapitalClick(capitalId) {
    this.capital = capitalId;
    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: this.capital,
      risk: this.risk,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);
  }

  onRiskClick(riskId) {
    this.risk = riskId;
    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: this.capital,
      risk: this.risk,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);
  }

  onClickCriteriaAll() {
    this.capital = '';
    this.risk = '';
    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: this.capital,
      risk: this.risk,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);
  }

  export() {
    console.log("export : ", this.formVo)
    let url = "ta/report/ta-rpt0003-1";
    let param = '';
    param += "?analysisNumber=" + this.analysisNumber;
    this.ajax.download(url + param);

  }

  search() {
    this.formSearch.get('conSubCapital').value === "0" ? this.formSearch.get('conSubCapital').patchValue('') : this.formSearch.get('conSubCapital').value;
    this.formSearch.get('condSubRisk').value === "0" ? this.formSearch.get('condSubRisk').patchValue('') : this.formSearch.get('condSubRisk').value;
    this.formSearch.get('condSubNoAuditFlag').value === "0" ? this.formSearch.get('condSubNoAuditFlag').patchValue('') : this.formSearch.get('condSubNoAuditFlag').value;
    console.log("search formSearch : ", this.formSearch.value)
    this.onCapitalClick(this.formSearch.get('conSubCapital').value);
    this.onRiskClick(this.formSearch.get('condSubRisk').value);

    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      capital: this.formSearch.get('conSubCapital').value,
      risk: this.formSearch.get('condSubRisk').value,
      condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
      newRegId: this.formSearch.get('newRegId').value,
      newRegFlag:'',
      taxAuditLast: this.formSearch.get('taxAuditLast').value,
      dutyCode:this.formSearch.get("dutyCode").value,
      facType:this.formSearch.get("facType").value,
      sector:this.formSearch.get("sector").value,
      area:this.formSearch.get("area").value,
      sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
    }
    this.getOperator(this.formVo);

  }
  // ==> app function end

  // ==> call Backend
  dropdownListAnalysis() {
    this.ajax.doPost("ta/tax-operator/find-all-analysis-number", { budgetYear: this.budgetYear }).subscribe((res: ResponseData<WorksheetHdr[]>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res dropdownListAnalysis", res)
        this.worksheetHdr = res.data;
        this.analysisList = [];
        this.worksheetHdr.forEach(element => {
          this.analysisList.push(element.analysisNumber);
        });
        this.formSearch.get("analysisNumber").patchValue(this.analysisList[0]);
        $('#analysisNumber').dropdown('set selected');
        this.analysisNumber = this.formSearch.get("analysisNumber").value
        this.getMonthStart(this.formSearch.get("analysisNumber").value);
        this.getWorksheetCondDtl(this.formSearch.get("analysisNumber").value);
        this.getCondSubCapitalAndRisk(this.formSearch.get("analysisNumber").value);
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

  getOperator = (formSearch: FormVo): any => {
    this.loading = true;
    this.ajax.doPost("ta/tax-operator/", formSearch).subscribe((res: any) => {
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
          if (element.condTaxGrp == "0") {
            element.condTaxGrp = "ไม่อยู่ในเงื่อนไข"
          } else {
            //element.condTaxGrp = element.condTaxGrp
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
  getMonthStart = (analysisNumber: string): any => {
    this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res getMonthStart : ", res);
        this.objMonth = res.data;

        this.formVo = {
          cond: [],
          analysisNumber: this.formSearch.get('analysisNumber').value,
          start: this.start,
          length: this.length,
          dateRange: this.objMonth.monthTotal,
          capital: this.capital,
          risk: this.risk,
          condSubNoAuditFlag: this.formSearch.get('condSubNoAuditFlag').value,
          newRegId: this.formSearch.get('newRegId').value,
          newRegFlag:'',
          taxAuditLast: this.formSearch.get('taxAuditLast').value,
          dutyCode:this.formSearch.get("dutyCode").value,
          facType:this.formSearch.get("facType").value,
          sector:this.formSearch.get("sector").value,
          area:this.formSearch.get("area").value,
          sumTaxAmEnd:0,
      sumTaxAmStart:0,
      cuscatId:'',
      budgetYear:this.budgetYear
        }

        this.getOperator(this.formVo);
      } else {
        console.log("error getMonthStart  ");
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
  getBudgetYear() {
    this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYear = res.data
        console.log("Budget year : ", res.data)
        this.budgetYearNumber = Number(this.budgetYear);
        this.checkShowButton(this.budgetYear)
      } else {
        this.messageBar.errorModal("Budget year Error !!");
      }
    })
  }
  checkShowButton(budgetYear: string) {
    this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { budgetYear }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data != null) {
          this.showButton = false;
        }
        console.log("showButton : ", this.showButton);
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

  getCondSubCapitalAndRisk(analysisNumber: string) {
    //this.ajax.doPost("ta/tax-operator/group-cond-sub-capital", { analysisNumber }).subscribe((res: ResponseData<any>) => {
    this.ajax.doPost("preferences/parameter/TA_SUB_COND_CAPITAL", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.conSubCapitalList = res.data;
        console.log("cond sub capital : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub capital !!");
      }
    });
    //this.ajax.doPost("ta/tax-operator/group-cond-sub-risk", { analysisNumber }).subscribe((res: ResponseData<any>) => {
    this.ajax.doPost("preferences/parameter/TA_RISK_LEVEL", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.conSubRiskList = res.data;
        console.log("cond sub risk : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error cond sub risk !!");
      }
    });
  }

  getSubCondNoatList() {
    const URL = "preferences/parameter/TA_SUB_COND_NOAT";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log('getSubCondNoatList', res.data)
        this.subCondNoatList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getWorksheetCondDtl(analysisNumber: string) {
    this.ajax.doPost("ta/tax-operator/get-worksheet-cond-dtl", { analysisNumber: analysisNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condDtls = res.data;
        this.condGroupDtl = res.data;
        console.log("getWorksheetCondDtl : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getWorksheetCondDtl !!");
      }
    })
  }

  /// change
  conSubCapitalChange(e) {

  }
  condSubRiskChange(e) {

  }
  condSubNoAuditFlag(e) {

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
  // ==> call Backend end
}
interface Sector {
  deptShortName: string;
  officeCode: string;
}

interface ConSubCapitalList {
  paramCode: string;
  value1: string;

}

interface ConSubRiskList {
  paramCode: string
  value1: string
}
