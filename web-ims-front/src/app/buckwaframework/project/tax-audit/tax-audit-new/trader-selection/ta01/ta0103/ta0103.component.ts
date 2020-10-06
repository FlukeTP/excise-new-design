import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseData } from 'app/buckwaframework/common/models/response-data.model';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { Form } from './form.model';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { ObjMonth, RequestStartLength, TableShowDetail } from '../../table-custom/table-custom.model';
import * as moment from 'moment';
import { TaxOperatorFormVo } from '../ta0102/ta010201/ta010201.model';
import { Observable } from 'rxjs';
import { DecimalFormat } from 'helpers/decimalformat';
import { formatNumber } from '@angular/common';
declare var $: any
@Component({
  selector: 'app-ta0103',
  templateUrl: './ta0103.component.html',
  styleUrls: ['./ta0103.component.css']
})
export class Ta0103Component implements OnInit, AfterViewInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b07.label, route: this.b.b07.route }
  ];
  loading: boolean = false;
  menuhide: boolean = false;
  showButton: boolean = false;
  formSearch: FormGroup;

  /// ==> data table
  // ==> datas query
  datas: any = [];
  analysisNumber: string = '';
  analysisList: string[] = [];
  draftNumber: string;
  form: Form = new Form();
  sectors: any[] = [];
  areas: any[] = [];
  paramGroup: any = {
    dutyCode: "",
    facType: ""
  }
  condDtls: any[] = [];
  facTypeList: any[] = [];
  dutyCodeList: any[] = [];
  formVo: TaxOperatorFormVo;
  officeCode: string = "";
  start: number = 0;
  length: number = 10;
  products: any = [];
  services: any = [];
  condTextUsed: any = { month: [], tax: [] };
  explainCondText: any;
  condMain2: string;
  //==> value datatable custom
  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  objMonth: ObjMonth = new ObjMonth();
  listCondGroup: string[];
  budgetYear: any = "";
  yearMonthStart: string;
  yearMonthEnd: string;
  activeLinkProduct: boolean[] = [false];
  activeLinkProduct2: boolean[] = [false];
  activeLinkService: boolean[] = [false];
  activeLinkAll: boolean = true;
  budgetYearNumber: number;
  budgetYearList: any[] = [];
  tableDetail: TableShowDetail = new TableShowDetail();
  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private messageBar: MessageBarService,
    private router: Router,
    private route: ActivatedRoute
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
    //console.log("pageChangeOutput : ", req);
    this.loading = true;
    this.pageLenght = req.length;
    this.start = req.start;
    this.length = req.length;
    this.formVo = this.setForm();
    this.getOperatorDraft(this.formVo);
  }
  //==> Datatable Custome end


  ngOnInit() {

    this.formSearch = this.formBuilder.group({
      analysisNumber: [''],
      budgetYear: [''],
      sector: [''],
      area: [''],
      facType: [''],
      dutyCode: [''],
      sumTaxAmStart: [null],
      sumTaxAmEnd: [null],
      newRegId: [''],
      cuscatId: ['']
    })
    this.loading = true;
    this.budgetYear = this.route.snapshot.queryParams['budgetYear'];
    this.analysisNumber = this.route.snapshot.queryParams['condNumber']; 
    // this.budgetYearNumber = Number(this.budgetYear);
    
    // await this.getBudgetYearList();
    // this.formVo = this.setForm();
    // //console.log("formsearch : ", this.formSearch.value);
    // this.loading = true;
    // console.log("budgetYear : ",this.budgetYear);
    // this.dropdownListAnalysis(this.budgetYear);
   

    // this.getSector()
    // this.getParameterGroup();
    // this.getCondText();

    // this.getFacTypeList();
    this.initCondition()

  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown().css('min-width', '3em');
    $('.ui.accordion').accordion();
  }

  async initCondition(){
    this.getBudgetYearList();
    this.formVo = this.setForm();
    //console.log("formsearch : ", this.formSearch.value);
    this.loading = true;
    console.log("budgetYear : ",this.budgetYear);
    // this.dropdownListAnalysis(this.budgetYear);
   

    this.getSector()
    this.getParameterGroup();
    await this.getCondText();

    this.getFacTypeList();
  }

  async budgerYearChange(event) {
    console.log(event.target.value);
    this.budgetYear = event.target.value;
    await this.dropdownListAnalysis(this.budgetYear);
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
    // this.serach();

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

    }

    console.log('calculateDateCompare', this.objMonth)
  }

  showModal() {
    if (this.showButton) {

      // $("#condition").modal('show');

      this.messageBar.comfirm(res => {
        if (res) {
          this.submit();
        }
      }, MessageService.MSG_CONFIRM.CONTINUE)
    }
  }
  // ==> app function
  analysisChange(e) {
    this.draftNumber = e.target.value;
    this.loading = true;
    //console.log("call analysisChange : ", e.target.value);
    this.getMonthStart(e.target.value);
    this.getWorksheetCondDtl(e.target.value);
  }

  serach() {
    //this.loading = true;
    if (this.formSearch.get('sector').value == "0") this.formSearch.patchValue({ sector: "" });
    if (this.formSearch.get('area').value == "0") this.formSearch.patchValue({ area: "" });
    if (this.formSearch.get('facType').value == "0") this.formSearch.patchValue({ facType: "" });
    if (this.formSearch.get('dutyCode').value == "0") this.formSearch.patchValue({ dutyCode: "" });
    //console.log("formSearch : ", this.formSearch.value);

    console.log('area', this.formSearch.get('area').value)
    console.log('sector', this.formSearch.get('sector').value)
    if (Utils.isNotNull(this.formSearch.get('area').value)) {
      this.officeCode = this.formSearch.get('area').value;
    } else {
      if (Utils.isNotNull(this.formSearch.get('sector').value)) {
        this.officeCode = this.formSearch.get('sector').value;
      } else {
        this.officeCode = "";
      }
    }

    this.paramGroup = {
      dutyCode: this.formSearch.get('dutyCode').value,
      facType: this.formSearch.get('facType').value
    }

    this.formVo = this.setForm();
    console.log('formVo', this.formVo)
    this.getOperatorDraft(this.formVo);
  }

  clear() {
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#facType").dropdown('restore defaults');
    $("#dutyCode").dropdown('restore defaults');
    $("#cuscatId").dropdown('restore defaults');
    this.formSearch.patchValue({
      sector: '',
      area: '',
      facType: '',
      dutyCode: '',
      sumTaxAmStart: '',
      sumTaxAmEnd: '',
      newRegId: '',
    })
    console.log("clear");

    this.serach()
  }

  goToCriteria() {
    this.router.navigate(["/tax-audit-new/ta01/02"]);
  }

  onChangeSector(e) {
    $("#area").dropdown('restore defaults');
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  onClickProductType(paramCode, facType) {
    this.onActiveLink(paramCode, facType);
    this.loading = true;
    // console.log("onClickProductType paramCode : ", paramCode, facType)
    this.paramGroup = {
      dutyCode: paramCode,
      facType: facType
    }

    this.formVo = this.setForm();
    this.getOperatorDraft(this.formVo);
  }

  onActiveLink(paramCode, facType) {
    let index;
    if ('' == facType) {
      this.activeLinkAll = true;
      this.activeLinkProduct = [];
      this.activeLinkProduct2 = [];
      this.activeLinkService = [];
    } else if ('1' == facType) {
      this.activeLinkAll = false;
      this.activeLinkProduct = [];
      this.activeLinkProduct2 = [];
      this.activeLinkService = [];
      index = this.products.findIndex(x => x.paramCode == paramCode);
      this.activeLinkProduct[index] = true;
    } else if ('2' == facType) {
      this.activeLinkAll = false;
      this.activeLinkProduct = [];
      this.activeLinkProduct2 = [];
      this.activeLinkService = [];
      index = this.services.findIndex(x => x.paramCode == paramCode);
      this.activeLinkService[index] = true;
    } else {
      this.activeLinkAll = false;
      this.activeLinkProduct = [];
      this.activeLinkProduct2 = [];
      this.activeLinkService = [];
      index = this.products.findIndex(x => x.paramCode == paramCode);
      this.activeLinkProduct2[index] = true;
    }
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


  // ==> app function end


  //==> call backend
  dropdownListAnalysis(budgetYear) {
    this.ajax.doPost("ta/tax-operator/find-all-analysis-number-draft", { budgetYear: budgetYear }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("dropdownListAnalysis : ", res.data)
        this.analysisList = res.data;
        this.draftNumber = this.formSearch.get("analysisNumber").value;
        this.formSearch.get("analysisNumber").patchValue(this.analysisList[0]);
        this.getMonthStart(this.formSearch.get("analysisNumber").value);
        this.getWorksheetCondDtl(this.formSearch.get("analysisNumber").value);
        $('#analysisNumber').dropdown('set selected');
      } else {
        console.log("error !! dropdownListAnalysis", res)
        this.messageBar.errorModal(res.message);
      }
    });
  }

  getOperatorDraft = (formvo: TaxOperatorFormVo): any => {
    this.loading = true;
    this.ajax.doPost("ta/tax-operator/draft", formvo).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {


        res.data.datas.forEach(element => {
          element.sumTaxAmtG1 = Utils.moneyFormatDecimal(element.sumTaxAmtG1);
          element.sumTaxAmtG2 = Utils.moneyFormatDecimal(element.sumTaxAmtG2);
          element.taxAmtChnPnt = Utils.moneyFormatDecimal(element.taxAmtChnPnt);
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
        //console.log("res getOperator : ", res.data.datas);
        this.datas = res.data.datas;
        this.recordTotal = res.data.count;
        this.loading = false;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("error getOperator  :", res.message);
      }
      this.loading = false;
    });
  }

  getCondText() {
    const pathHdr = "ta/master-condition-main/find-hdr/";
    const pathDtl = "ta/master-condition-main/find-dtl/";
    const PATH = "ta/master-condition-main/condition-message/"
    const URL = "preferences/parameter/TA_MAS_COND_MAIN_DESC/NEW_COMP";

    // let newYear = new Date();
    let newYear = this.budgetYear;
    let body = {
      budgetYear: newYear
    }
    this.condTextUsed = { month: [], tax: [] };
    this.loading = true;

    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condMain2 = res.data.value1;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getCondText : URL = preferences/parameter/TA_MAS_COND_MAIN_DESC/NEW_COMP ")
      }
    })
    this.ajax.doGet(PATH).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (null != res.data) {
          this.condTextUsed = { month: [], tax: [] };
          this.explainCondText = res.data;
        }
      }
    });
    this.ajax.doPost(pathHdr, body).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data != null) {
          let month_num = res.data.monthNum;
          this.ajax.doPost(pathDtl, body).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              let data = res.data;
              data.sort((a, b) => {
                return a.condGroup - b.condGroup;
              })

              for (let i = 0; i < data.length; i++) {
                const element = data[i];
                this.condTextUsed.month.push("");
                this.condTextUsed.tax.push("");
                if (-100 == Number(element.rangeStart) && 100 == Number(element.rangeEnd) || -100 < Number(element.rangeStart) && 100 > Number(element.rangeEnd)) {
                  let mapObj = { "#Tax1#": Number(element.rangeStart), "#Tax2#": Number(element.rangeEnd) };
                  let re = new RegExp(Object.keys(mapObj).join("|"), "gi");
                  this.condTextUsed.tax[i] = this.explainCondText.msgTax2;
                  this.condTextUsed.tax[i] = this.condTextUsed.tax[i].replace(re, function (matched) {
                    return mapObj[matched];
                  });
                } else if (100 == Number(element.rangeEnd)) {
                  this.condTextUsed.tax[i] = this.explainCondText.msgTax1;
                  this.condTextUsed.tax[i] = this.condTextUsed.tax[i].replace("#Tax#", Number(element.rangeStart));
                } else if (-100 == Number(element.rangeStart)) {
                  this.condTextUsed.tax[i] = this.explainCondText.msgTax3;
                  this.condTextUsed.tax[i] = this.condTextUsed.tax[i].replace("#Tax#", Number(element.rangeEnd));
                }

                if (Number(month_num) == Number(element.taxMonthStart) && Number(month_num) == Number(element.taxMonthEnd)) {
                  this.condTextUsed.month[i] = this.explainCondText.msgMonth1;
                  this.condTextUsed.month[i] = this.condTextUsed.month[i].replace("#MONTH#", month_num);
                } else {
                  this.condTextUsed.month[i] = this.explainCondText.msgMonth2;
                  this.condTextUsed.month[i] = this.condTextUsed.month[i].replace("#MONTH#", month_num);
                }
              }
              console.log("condTextUsed", this.condTextUsed);

            }
          })
        } else {
          this.loading = false;
        }

      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !!getCondText pathHdr = ta/master-condition-main/find-hdr/");
      }
    });
  }

  getMonthStart = (draftNumber: string): any => {
    this.ajax.doPost("ta/tax-operator/get-month-start-draft", { "draftNumber": draftNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        this.objMonth = res.data;
        this.draftNumber = draftNumber;
        this.showButton = "D" == res.data.worksheetStatus;
        this.formVo = this.setForm();
        this.calculateDateCompare();
        console.log("getMonthStart  this.objMonth : ", this.objMonth);
        this.getOperatorDraft(this.formVo);
      } else {
        console.log("error getMonthStart")
        this.messageBar.errorModal(res.message);
      }
    });
  }



  submit() {
    this.loading = true;
    $("#condition").modal('hide');
    this.formVo = this.setForm();
    this.ajax.doPost("ta/tax-operator/prepare-tax-grouping", this.formVo).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.router.navigate(["/tax-audit-new/ta01/04"]);
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.loading = false;
    })
  }

  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        // this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        // this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
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
      // this.loading  = false;
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

  getParameterGroup = () => {
    this.ajax.doPost("preferences/parameter/EXCISE_PRODUCT_TYPE", { groupCode: "EXCISE_PRODUCT_TYPE" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.services = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getParameterGroup EXCISE_PRODUCT_TYPE Error !!");
      }
      this.products = res.data;
    });
    this.ajax.doPost("preferences/parameter/EXCISE_SERVICE_TYPE", { groupCode: "EXCISE_SERVICE_TYPE" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.services = res.data;
      } else {
        this.messageBar.errorModal(res.message);
        console.log("getParameterGroup Error !!");
      }
    });
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log('getBudgetYearList res.data', res.data)
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          if (this.budgetYear != null && this.budgetYear != "" && this.budgetYear != undefined) {
            this.formSearch.get('budgetYear').patchValue(this.budgetYear);
            this.budgetYearNumber = Number(this.budgetYear);
            this.dropdownListAnalysis(this.budgetYear);
            this.getCondText();
          } else {
            this.formSearch.get('budgetYear').patchValue(this.budgetYearList[0]);
            // cal budgetyear at datatable 
            this.budgetYearNumber = Number(this.budgetYearList[0]);
            this.budgetYear = this.budgetYearList[0];
            this.dropdownListAnalysis(this.budgetYear);
            this.getCondText();

          }
          $("#budgetYear").dropdown('set selected', this.formSearch.get('budgetYear').value)
        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
          this.loading = false;
        }
      } else {
        console.log("Error getBudgetYearList !!");
      }
      // this.loading = false;
    });
  }

  getBudgetYear(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("preferences/budget-year", {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.budgetYear = res.data
          // console.log("Budget year Number >>>>> ",this.budgetYear);
          this.budgetYearNumber = Number(this.budgetYear);
          obs.next(res.data)
        } else {
          this.messageBar.errorModal("Budget year Error !!");
          console.log("Budget year Error !!");
        }
      })
    })

  }

  getWorksheetCondDtl(analysisNumber: string) {
    this.ajax.doPost("ta/tax-operator/get-worksheet-cond-dtl", { analysisNumber: analysisNumber }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.condDtls = res.data;
        //console.log("getWorksheetCondDtl : ", res.data);
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getWorksheetCondDtl !!");
      }
    })
  }

  setForm() {
    return {
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      dateStart: this.objMonth.yearMonthStart,
      dateEnd: this.objMonth.yearMonthEnd,
      draftNumber: this.draftNumber,
      budgetYear: this.budgetYear,
      dutyCode: this.formSearch.get("dutyCode").value == '0' ? this.formSearch.get("dutyCode").patchValue('') : this.formSearch.get("dutyCode").value,
      facType: this.formSearch.get("facType").value == '0' ? this.formSearch.get("facType").patchValue('') : this.formSearch.get("facType").value,
      sector: this.formSearch.get("sector").value == '0' ? this.formSearch.get("sector").patchValue('') : this.formSearch.get("sector").value,
      area: this.formSearch.get("area").value == '0' ? this.formSearch.get("area").patchValue('') : this.formSearch.get("area").value,
      officeCode: this.officeCode,
      condNumber: "",
      newRegId: this.formSearch.get('newRegId').value,
      sumTaxAmStart: this.formSearch.get('sumTaxAmStart').value != null && this.formSearch.get('sumTaxAmStart').value != '' ? Number(this.formSearch.get('sumTaxAmStart').value.replace(/\,/g, '')) : null,
      sumTaxAmEnd: this.formSearch.get('sumTaxAmEnd').value != null && this.formSearch.get('sumTaxAmEnd').value != '' ? Number(this.formSearch.get('sumTaxAmEnd').value.replace(/\,/g, '')) : null,
      cuscatId: this.formSearch.get('cuscatId').value
    }
  }

  export() {
    console.log("export : ", this.formVo)
    let url = "ta/report/ta-rpt0002";
    let param = '';
    param += "?budgetYear=" + this.formVo.budgetYear;
    param += "&draftNumber=" + this.formVo.draftNumber;
    param += "&dutyCode=" + (this.formSearch.get("dutyCode").value == '0' ? this.formSearch.get("dutyCode").patchValue('') : this.formSearch.get("dutyCode").value);
    param += "&facType=" + (this.formSearch.get("facType").value == '0' ? this.formSearch.get("facType").patchValue('') : this.formSearch.get("facType").value);
    param += "&sector=" + (this.formSearch.get("sector").value == '0' ? this.formSearch.get("sector").patchValue('') : this.formSearch.get("sector").value);
    param += "&area=" + (this.formSearch.get("area").value == '0' ? this.formSearch.get("area").patchValue('') : this.formSearch.get("area").value);
    if (Utils.isNotNull(this.formSearch.get('area').value)) {
      param += "&officeCode=" + this.formSearch.get('area').value;
    } else {
      if (Utils.isNotNull(this.formSearch.get('sector').value)) {
        param += "&officeCode=" + this.formSearch.get('sector').value;
      } else {
        param += "&officeCode=" + "";
      }
    }
    param += "&newRegId=" + this.formSearch.get('newRegId').value;
    param += "&cuscatId=" + this.formSearch.get('cuscatId').value;
    console.log(param);
    this.ajax.download(url + param);
  }
}
