import { Component, OnInit } from '@angular/core';
import { CondGroup, WorksheetHdr } from '../ta01/ta0104/ta0104.model';
import { ObjMonth, checkboxList, RequestStartLength } from '../table-custom/table-custom.model';
import { BreadcrumbContant } from '../../BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { FormVo } from './select20.model';
declare var $: any;
@Component({
  selector: 'app-select20',
  templateUrl: './select20.component.html',
  styleUrls: ['./select20.component.css']
})
export class Select20Component implements OnInit {

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
  formSearch: FormGroup;

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
  //==> value datatable custom

  start: number = 0;
  length: number = 10;
  analysisNumber: string;
  cond: string;
  resultSelect: checkboxList;

  explainCondText: any;
  condTextUsed: any = { month: [], tax: [] };

  recordTotal: number;
  pageLenght: number = 10;
  paginationTotal: number;
  listCondGroup: string[];
  condLinkActive: boolean[] = [true, false];
  condMain2: string;

  worksheetHdr: WorksheetHdr[] = []
  budgetYearNumber: number;
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private auth: AuthService
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
    this.formVo = {
      start: this.start,
      length: this.length,
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      dateRange: this.objMonth.monthTotal,
      seeDataSelect: "N"
    }
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
    this.formSearch = this.formBuilder.group({
      analysisNumber: [''],
      sector: [''],
      area: ['']
    })
    this.loading = true;

    this.dropdownListAnalysis().subscribe(res => {
      this.getCondGroupDtl(res);
      this.getMonthStart(res).subscribe(form => {
        this.getOperator(form);
      });
    });
    this.getCondMessage();
    this.getCondMain2();
    // this.getBudgetYearAndAnalysisNumber().then(res => {
    //   if (res != null) {
    //     let analysisNumber = res.analysisNumber;
    //     let planNumber = res.planNumber;
    //     this.checkSubmitDatePlanWorksheetSend(planNumber);

    //     this.getMonthStart(analysisNumber).then(res => {
    //       this.getPlantWorkSheetDtl(analysisNumber, planNumber).subscribe(next => {
    //         this.getOperator(res);
    //       });

    //     });
    //     //this.getCondGroupDtl(analysisNumber);
    //   }
    // });
    $("#pageLenght").dropdown().css('min-width', '3em');
  }
  ngAfterViewInit() {
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
    this.formVo = {
      analysisNumber: this.analysisNumber,
      cond: this.cond,
      start: this.start,
      length: this.length,
      dateRange: this.objMonth.monthTotal,
      seeDataSelect: "N"
    }
    this.getOperator(this.formVo);
  }
  onSave() {
    if (!this.disabledButton) {
      this.loading = true;
      let formSave = {
        "budgetYear": this.budgetYear,
        "analysisNumber": this.analysisNumber,
        "typeCheckedAll": this.resultSelect.typeCheckedAll,
        "planNumber": this.planNumber,
        "ids": this.resultSelect.ids
      }
      this.savePlanDetail(formSave);
    }
  }
  analysisChange(e) {
    this.loading = true;
    console.log("call analysisChange : ", e.target.value);
    this.getMonthStart(e.target.value).subscribe(form => {
      this.getOperator(form);
    });
    this.getCondGroupDtl(e.target.value);

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
  getCondGroupDtl = (analysisNumber: string): any => {
    this.condLinkActive = [true, false];
    this.ajax.doPost("ta/tax-operator/find-cond-group-dtl", { analysisNumber: analysisNumber, seeDataSelect: "N" }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === res.status) {
        console.log("res getCondGroupDtl", res)
        this.condGroupDtl = res.data;
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

    this.ajax.doPost("ta/tax-operator/", formSearch).subscribe((res: any) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("res getOperator : ", res);
        res.data.datas.forEach(element => {
          element.sumTaxAmtG1 = Utils.moneyFormatDecimal(element.sumTaxAmtG1);
          element.sumTaxAmtG2 = Utils.moneyFormatDecimal(element.sumTaxAmtG2);
          element.taxAmtChnPnt = Utils.moneyFormatDecimal(element.taxAmtChnPnt);
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
  getMonthStart = (analysisNumber: string): Observable<any> => {
    return new Observable((obs) => {
      this.ajax.doPost("ta/tax-operator/get-month-start", { analysisNumber }).subscribe((res: ResponseData<any>) => {

        if (MessageService.MSG.SUCCESS === res.status) {
          console.log("res getMonthStart : ", res);
          this.objMonth = res.data;

          this.formVo = {
            cond: '',
            analysisNumber: analysisNumber,
            start: this.start,
            length: this.length,
            dateRange: this.objMonth.monthTotal,
            seeDataSelect: "N"
          }
          obs.next(this.formVo);
        } else {
          this.formVo = {
            cond: '',
            analysisNumber: analysisNumber,
            start: this.start,
            length: this.length,
            dateRange: this.objMonth.monthTotal,
            seeDataSelect: "N"
          }
          console.log("error getMonthStart  ");
          this.messageBar.errorModal(res.message);
        }
        this.loading = false;
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
          this.budgetYear = res.data;
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
      this.ajax.doPost("ta/tax-operator/find-plan-worksheet-dtl", { "analysisNumber": analysisNumber, "planNumber": planNumber ,sendAllFlag :"N"}).subscribe((res: ResponseData<any>) => {
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
        console.log("checkSubmitDatePlanWorksheetSend :", res.data)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error checkSubmitDatePlanWorksheetSend !");
      }
    });
  }

  dropdownListAnalysis(): Observable<any> {
    return new Observable(obs => {
      this.ajax.doPost("ta/tax-operator/find-all-analysis-number", { budgetYear: this.budgetYear }).subscribe((res: ResponseData<WorksheetHdr[]>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log("res dropdownListAnalysis", res)

          this.analysisList = [];
          this.worksheetHdr.forEach(element => {
            this.analysisList.push(element.analysisNumber);
          });
          this.formSearch.get("analysisNumber").patchValue(this.analysisList[0]);
          $('#analysisNumber').dropdown('set selected');
          this.analysisNumber = this.formSearch.get("analysisNumber").value
          obs.next(this.analysisNumber);
        } else {
          this.messageBar.errorModal(res.message);
        }
      })
    });
  }
  // ==> call Backend end



}

interface Sector {
  deptShortName: string;
  officeCode: string;
}


