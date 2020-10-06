import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';
import { Router, ActivatedRoute } from '@angular/router';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/index';
import { Store } from '@ngrx/store';
import { Ta020202 } from '../ta020202.model';
import * as TA020202ACTION from "../ta020202.action";

declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-analysis/inquiry-income-compare-last-year-data",
}

@Component({
  selector: 'app-ta02020208',
  templateUrl: './ta02020208.component.html',
  styleUrls: ['./ta02020208.component.css']
})
export class Ta02020208Component implements OnInit {

  dataStore: any;
  formVo: FormVo;
  table: any;
  yearNum: any = 1;
  yearNumList: any[] = [1, 2, 3];
  yearIncType: any;
  yearIncTypeList: any[];
  note: any;
  newRegId: string;
  dutyGroupId: string;
  auditPlanCode: string;
  paperBaNumber: string;
  incomeDisabled: boolean = false;

  constructor(
    private router: Router,
    private detailService: IaService,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) { }

  ngOnInit() {
    this.formVo = {
      newRegId: '',
      startDate: '',
      endDate: '',
      dutyGroupId: ''
    }
    this.newRegId = this.route.snapshot.queryParams['newRegId'] || "";
    this.dutyGroupId = this.route.snapshot.queryParams['dutyGroupId'] || "";
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.paperBaNumber = this.route.snapshot.queryParams['paperBaNumber'] || "";
    if (this.paperBaNumber != '') {
      this.incomeDisabled = true
    }
    this.getIncomeType();
    this.setDataService();
    this.getDataFromStore();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   this.dataTable();
    // }, 200);
    this.callDropdown();
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  callDropdown() {
    setTimeout(() => {
      $(".dropdown").dropdown();
    }, 100);
  }

  getDataFromStore() {
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(data => {
      this.note = data['anaResultText8'];
      this.yearNum = data['yearNum'];
      this.yearIncType = data['yearIncType'];
    });
  }

  setDataService() {
    let model = this.detailService.getData();
    if (model == null) {
      this.router.navigate(['/tax-audit-new/ta02/02/02']);
      return false;
    }
    this.formVo = model
    console.log("model service : ", this.formVo);
  }

  onChangeNote() {
    let data;
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(note => {
      data = note
    });
    data['anaResultText8'] = this.note;
    this.store.dispatch(new TA020202ACTION.AddTa020202(data));
  }

  onChangeIncTypeAndNum(type: string) {
    let data;
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(datas => {
      data = datas
    });
    switch (type) {
      case 'yearIncType':
        data[type] = this.yearIncType;
        this.store.dispatch(new TA020202ACTION.AddTa020202(data));
        break;
      case 'yearNum':
        data[type] = this.yearNum;
        this.store.dispatch(new TA020202ACTION.AddTa020202(data));
        break;
      default:
        break;
    }
    this.dataTable();
  }

  visibleDataTableControl() {
    this.table.columns([6, 7, 8, 9, 10, 11]).visible(false);
    switch (this.yearNum) {
      case "2":
        this.table.columns([6, 7, 8]).visible(true);
        break;
      case "3":
        this.table.columns([6, 7, 8, 9, 10, 11]).visible(true);
        break;
      default:
        break;
    }
  }

  dataTable() {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      // lengthChange: true,x
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "newRegId": this.newRegId,
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate,
            "paperBaNumber": this.paperBaNumber,
            "dutyGroupId": this.dutyGroupId,
            "yearIncomeType": this.yearIncType,
            "yearNum": this.yearNum
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "taxMonth", className: "text-left"
        }, {
          data: "incomeCurrentYearAmt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "incomeLastYear1Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear1Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear1Pnt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "incomeLastYear2Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear2Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear2Pnt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "incomeLastYear3Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear3Amt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeLastYear3Pnt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });
    // visible colomn control by yearNum
    this.visibleDataTableControl();

  }

  getIncomeType() {
    const URL = "preferences/parameter/TA_INCOME_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 < res.data.length) {
          this.yearIncTypeList = res.data;
        }
      } else {
        this.msg.errorModal(res.message);
      }
    })
  }

}

interface FormVo {
  newRegId: string;
  startDate: string;
  endDate: string;
  dutyGroupId: string;
}

class AppState {
  Ta020202: {
    Ta020202: Ta020202,
  }
}
