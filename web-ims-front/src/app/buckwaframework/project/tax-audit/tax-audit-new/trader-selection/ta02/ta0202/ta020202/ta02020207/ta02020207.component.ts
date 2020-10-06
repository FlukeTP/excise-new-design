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
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-analysis/inquiry-income-compare-last-month-data",
}
@Component({
  selector: 'app-ta02020207',
  templateUrl: './ta02020207.component.html',
  styleUrls: ['./ta02020207.component.css']
})
export class Ta02020207Component implements OnInit {

  formVo: FormVo;
  table: any;
  monthIncType: any;
  monthIncTypeList: any[];
  dataStore: any;
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
    this.setDataService();
    this.getIncomeType();
    this.getDataFromStore();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   this.dataTable();
    // }, 200);
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  getDataFromStore() {
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(data => {
      this.note = data['anaResultText7'];
      this.monthIncType = data['monthIncType'];
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
    data['anaResultText7'] = this.note;
    this.store.dispatch(new TA020202ACTION.AddTa020202(data));
  }

  onChangeYearIncomeType() {
    let data;
    this.dataStore = this.store.select(state => state.Ta020202.Ta020202).subscribe(datas => {
      data = datas
    });
    data['monthIncType'] = this.monthIncType;
    this.store.dispatch(new TA020202ACTION.AddTa020202(data));
    this.dataTable();
  }

  dataTable() {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      //lengthChange: true,
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
            "monthIncomeType": this.monthIncType
          }));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        },
        {
          data: "taxMonth", className: "text-left"
        }, {
          data: "incomeAmt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomeAmt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffIncomePnt", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });

  }

  getIncomeType() {
    const URL = "preferences/parameter/TA_INCOME_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 < res.data.length) {
          this.monthIncTypeList = res.data;
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