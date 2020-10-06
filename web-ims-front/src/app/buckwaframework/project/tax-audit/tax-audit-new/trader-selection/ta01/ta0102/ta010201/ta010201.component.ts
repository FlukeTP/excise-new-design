import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { TaxOperatorFormVo } from './ta010201.model';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { ObjMonth, RequestStartLength } from '../../../table-custom/table-custom.model';
declare var $: any
@Component({
  selector: 'app-ta010201',
  templateUrl: './ta010201.component.html',
  styleUrls: ['./ta010201.component.css']
})
export class Ta010201Component implements OnInit, AfterViewInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b07.label, route: this.b.b07.route }
  ];
  loading: boolean = false;
  menuhide: boolean = false;

  formSearch: FormGroup;

  /// ==> data table
  // ==> datas query
  datas: any = [];
  analysisNumber: string = '';
  products: any = [];
  services: any = [];
  paramGroup: any = {
    dutyCode: "",
    facType: ""
  }
  sectors: any[] = [];
  areas: any[] = [];
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  officeCode: string = "";
  start: number = 0;
  length: number = 10;
  //==> value datatable custom
  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  objMonth: ObjMonth = new ObjMonth();
  listCondGroup: string[];
  budgetYear: any;
  yearMonthStart: string;
  yearMonthEnd: string;

  condSub1: string = '';
  condSub2: string = '';
  condSub3: string = '';
  //==> form
  formVo: TaxOperatorFormVo;
  budgetYearNumber: number;
  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  munuHide() {
    if (this.menuhide) {
      this.menuhide = false;
    } else {
      this.menuhide = true;
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
    this.formVo = this.setForm();
    this.getOperatorPreviewData(this.formVo);
  }

  //==> Datatable Custome end
  ngOnInit() {

    this.route.queryParams.subscribe(param => {
      console.log("queryParams  : ", param)
      this.objMonth.yearMonthStart = param.yearMonthStart
      this.objMonth.yearMonthEnd = param.yearMonthEnd
      this.objMonth.yearMonthStartCompare = param.yearMonthStartCompare
      this.objMonth.yearMonthEndCompare = param.yearMonthEndCompare
      this.budgetYear = param.budgetYear
      this.objMonth.monthTotal = param.monthNum
      this.objMonth.condNumber = param.condNumber
      this.condSub1 = param.condSub1
      this.condSub2 = param.condSub2
      this.condSub3 = param.condSub3

      let yms = this.objMonth.yearMonthStart.split("/");
      this.objMonth.monthStart = Number(yms[0]);
    })
    this.budgetYearNumber = Number(this.budgetYear);
    this.formSearch = this.formBuilder.group({
      analysisNumber: [''],
      sector: [''],
      area: [''],
      facType: [''],
      dutyCode: [''],
      sumTaxAmStart: [null],
      sumTaxAmEnd: [null],
      newRegId: [''],
    })
    console.log("formsearch : ", this.formSearch.value);
    this.loading = true;

    this.formVo = this.setForm();
    this.getSector()
    this.getOperatorPreviewData(this.formVo);
    this.getParameterGroup();
    this.getFacTypeList();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown().css('min-width', '3em');
    $('.ui.accordion').accordion();
  }

  // ==> app function

  onClickProductType(paramCode, facType) {
    this.loading = true;
    console.log("onClickProductType paramCode : ", paramCode, facType)
    this.paramGroup = {
      dutyCode: paramCode,
      facType: facType
    }

    this.formVo =  this.setForm();
    this.getOperatorPreviewData(this.formVo);
  }
  onSave() {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.loading = true;
        this.saveDraft();
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }
  onChangeSector(e) {
    $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }

  serach() {
    this.loading = true;
    if (this.formSearch.get('sector').value == "0") this.formSearch.patchValue({ sector: "" });
    if (this.formSearch.get('area').value == "0") this.formSearch.patchValue({ area: "" });
    if (this.formSearch.get('facType').value == "0") this.formSearch.patchValue({ facType: "" });
    if (this.formSearch.get('dutyCode').value == "0") this.formSearch.patchValue({ dutyCode: "" });
    console.log("formSearch : ", this.formSearch.value);

    if (this.formSearch.get('area').value != "") {
      this.officeCode = this.formSearch.get('area').value;
    } else {
      if (this.formSearch.get('sector').value != "") {
        this.officeCode = this.formSearch.get('sector').value;
      } else {
        this.officeCode = "";
      }
    }
    this.formVo =  this.setForm();

    this.getOperatorPreviewData(this.formVo);
  }

  clear() {
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#facType").dropdown('restore defaults');
    $("#dutyCode").dropdown('restore defaults');
    console.log("clear");
  }

  onChangeFacType(e) {
    this.dutyCodeList = [];
    $("#dutyCode").dropdown('restore defaults');
    let paramGroupCode = '';
    this.formSearch.get("facType").value;

    if (this.formSearch.get("facType").value !== '0') {
      if (this.formSearch.get("facType").value === '2') {
        paramGroupCode = 'EXCISE_SERVICE_TYPE';
      } else {
        paramGroupCode = 'EXCISE_PRODUCT_TYPE'
      }

      this.getDutyCodeList(paramGroupCode);
    }

  }

  export() {
    console.log("export : ", this.formVo)
    let url = "ta/report/ta-rpt0001";
    let param = '';
    param += "?budgetYear=" + this.budgetYear;
    param += "&dateStart=" + this.formVo.dateStart;
    param += "&dateEnd=" + this.formVo.dateEnd;
    param += "&dateRange=" + this.formVo.dateRange;
    param += "&draftNumber=" + this.formVo.draftNumber;
    param += "&dutyCode=" + this.formVo.dutyCode;
    param += "&facType=" + this.formVo.facType;
    param += "&officeCode=" + this.formVo.officeCode;
    this.ajax.download(url + param);

  }
  // ==> app function end


  //==> call backend

  saveDraft = () => {

    let obj = {
      "start": 0,
      "length": 0,
      "dateRange": this.objMonth.monthTotal,
      "dateStart": this.objMonth.yearMonthStart,
      "dateEnd": this.objMonth.yearMonthEnd,
      "condNumber": this.objMonth.condNumber,
      "condSub1": this.condSub1,
      "condSub2": this.condSub2,
      "condSub3": this.condSub3,
      "budgetYear": this.budgetYear
    }
    this.ajax.doPost("ta/tax-operator/save-draft", obj).subscribe((res: ResponseData<any>) => {
      if (res.status == "SUCCESS") {
        this.messageBar.successModal(res.message);
        this.router.navigate(['/tax-audit-new/ta01/03']);
      } else {
        console.log("error insertWs");
        this.messageBar.errorModal(res.message);
      }
      this.loading = false;
    });
  }

  getOperatorPreviewData = (formvo: TaxOperatorFormVo): any => {

    this.ajax.doPost("ta/tax-operator/preview-data", formvo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorPreviewData  formvo: ", formvo);
        console.log("getOperatorPreviewData  res: ", res);
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
        this.listCondGroup = res.data.condGroups;
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
      } else {
        console.log("getOperatorPreviewData");
        this.messageBar.errorModal(res.message);
      }

      this.loading = false;
    });
  }

  getParameterGroup = () => {
    this.ajax.doPost("preferences/parameter/EXCISE_PRODUCT_TYPE", { groupCode: "EXCISE_PRODUCT_TYPE" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.services = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.products = res.data;
    });
    this.ajax.doPost("preferences/parameter/EXCISE_SERVICE_TYPE", { groupCode: "EXCISE_SERVICE_TYPE" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.services = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    });
  }

  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getFacTypeList() {
    this.ajax.doPost("preferences/parameter/EXCISE_FACTORY_TYPE", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.facTypeList = res.data;
        console.log("getFacTypeList : ", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }

  getDutyCodeList(paramGroupCode) {
    this.ajax.doPost(`preferences/parameter/${paramGroupCode}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dutyCodeList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getFacTypeList EXCISE_PRODUCT_TYPE Error !!");
      }
    });
  }


  setForm() {
    return {
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      dateStart: this.objMonth.yearMonthStart,
      dateEnd: this.objMonth.yearMonthEnd,
      draftNumber: this.formVo.draftNumber,
      budgetYear: this.budgetYear,
      dutyCode: this.paramGroup.dutyCode,
      facType: this.paramGroup.facType,
      officeCode: this.officeCode,
      condNumber: "",
      sumTaxAmStart: this.formSearch.get('sumTaxAmStart').value,
      sumTaxAmEnd: this.formSearch.get('sumTaxAmEnd').value,
      newRegId: this.formSearch.get('newRegId').value

    }
  }
  //==> call backend end


}

