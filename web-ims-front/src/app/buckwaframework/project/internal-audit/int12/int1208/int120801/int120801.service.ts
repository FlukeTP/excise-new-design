import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { IaService } from "services/ia.service";
import { Router } from "@angular/router";
import { Utils } from "helpers/utils";
import { CONTEXT } from '@angular/core/src/render3/interfaces/view';
import * as moment from 'moment';
const URLS = {
  GET_DATA: "ia/int12/08/01/search",
  DELETE_BY_ID: "ia/int12/08/01/deleteById",
  GET_CHART_OF_ACC: "ia/int02/08/01/01/getChartOfAcc",
}
declare var $: any;
@Injectable()
export class Int120801Service {

  table: any;
  data: [{ any }];
  model: FormSearch;
  formEdit: FormEdit;
  constructor(
    private ajax: AjaxService,
    private message: MessageBarService,
    private iaService: IaService,
    private route: Router
  ) {
    this.model = new FormSearch();
    this.formEdit = new FormEdit();

  }

  getData(data) {
    let promise = new Promise((resolve) => {
      this.ajax.post(URLS.GET_DATA, JSON.stringify(data),
        success => {
          resolve(success.json())
        }, error => {
          this.message.errorModal(error.json().message);
        })
    })
    return promise
  }

  getChartOfAcc = () => {
    let promise = new Promise((resolve) => {
      this.ajax.get(URLS.GET_CHART_OF_ACC,
        success => {
          resolve(success.json())
        }, error => {
          this.message.errorModal(error.json());
        })
    })
    return promise
  }

  // year = (yearCb: Function) => {
  //   let url = "ia/int06121/year";
  //   this.ajax.get(url, res => {
  //     yearCb(res.json());
  //   });
  // }

  setSearchFlag(searchFlag: string) {
    this.model.searchFlag = searchFlag;
  }

  search(model: FormSearch) {
    this.model = model;
    this.model.searchFlag = "TRUE";
    if (this.table != null) {
      this.table.destroy();
    }
    this.dataTable();
    //$("#dataTable").DataTableTh().ajax.reload();
  }
  clear = () => {
    $("#year").dropdown('restore defaults');
    this.model.utilityType = "";
    this.model.invoiceNum = "";
    this.model.searchFlag = "FALSE";
    if (this.table != null) {
      this.table.destroy();
    }
    this.dataTable();
    //$("#dataTable").DataTableTh().ajax.reload();
  }

  dataTable = () => {
    this.table = $("#dataTable").DataTableTh({
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "fixedColumns": {
        "leftColumns": 3
      },
      "ajax": {
        "url": AjaxService.CONTEXT_PATH + URLS.GET_DATA,
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "utilityType": this.model.utilityType,
            "invoiceNum": this.model.invoiceNum,
            "searchFlag": this.model.searchFlag,
            "startDate": this.model.startDate,
            "endDate": this.model.endDate,
          }));
        },
      },
      "columns": [
        {
          "data": "utilityId",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "utilityType",
          "className": "ui left aligned",
        }, {
          "data": "invoiceMonth",
          "className": "ui right aligned",
        }, {
          "data": "invoiceNum",
          "className": "ui left aligned",
        },  {
          "data": "invoiceDate",
          "className": "ui right aligned",
          "render": function (data, type, row, meta) {
            return moment(data).format("DD/MM/YYYY");
          },
        }, {
          "data": "requestNum",
          "className": "ui right aligned",
        }, {
          "data": "requestDate",
          "className": "ui right aligned",
          "render": function (data, type, row, meta) {
            return moment(data).format("DD/MM/YYYY");
          },
        }, {
          "data": "amount",
          "className": "ui right aligned",
          "render": (data, row) => {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "note",
          "render": function (data, type, row) {
            var btn = '';
            btn += '<button class="ui mini yellow button btn-edit"><i class="edit icon"></i>แก้ไข</button>';
            btn += '<button class="ui mini red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
            return btn;
          },
          "className": "ui center aligned"
        }
      ]
    });
    // edit
    this.table.on('click', 'tbody tr button.btn-edit', (e) => {
      let closestRow = $(e.target).closest('tr');
      let data = this.table.row(closestRow).data();
      this.formEdit = data;

      this.formEdit.utilityType = data.utilityType;
      this.formEdit.invoiceNum = data.invoiceNum;

      this.formEdit.serviceReceive = parseInt(data.serviceReceive);
      this.formEdit.suppressReceive = parseInt(data.suppressReceive);
      this.formEdit.budgetReceive = parseInt(data.budgetReceive);
      this.formEdit.sumReceive = parseInt(data.sumReceive);

      this.formEdit.serviceWithdraw = parseInt(data.serviceWithdraw);
      this.formEdit.suppressWithdraw = parseInt(data.suppressWithdraw);
      this.formEdit.budgetWithdraw = parseInt(data.budgetWithdraw);
      this.formEdit.sumWithdraw = parseInt(data.sumWithdraw);

      this.formEdit.serviceBalance = parseInt(data.serviceBalance);
      this.formEdit.suppressBalance = parseInt(data.suppressBalance);
      this.formEdit.budgetBalance = parseInt(data.budgetBalance);
      this.formEdit.sumBalance = parseInt(data.sumBalance);

      this.formEdit.moneyBudget = parseInt(data.moneyBudget);
      this.formEdit.moneyOut = parseInt(data.moneyOut);

      this.formEdit.averageCost = parseInt(data.averageCost);
      this.formEdit.averageGive = data.averageGive;
      this.formEdit.averageFrom = parseInt(data.averageFrom);
      this.formEdit.averageComeCost = data.averageComeCost;

      this.formEdit.note = data.note;
      this.formEdit.editStatus = "edit";
      this.iaService.setData(this.formEdit);

      this.route.navigate(['/int12/08/01/01'], {
        queryParams: {
          id: data.id
        }
      })
    })
    // delete
    this.table.on('click', 'tbody tr button.btn-delete', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();

      this.message.comfirm((res) => {
        if (res) {
          this.ajax.delete(`${URLS.DELETE_BY_ID}/${data.id}`, res => {
            console.log(res.json());
            this.message.successModal(res.json().message);
            // this.dataTable()
            // $("#dataTable").DataTableTh().ajax.reload();
            this.table.destroy();
            this.dataTable();
          }, error => {
            console.log(error.json());
            this.message.errorModal(error.json().message);
          });
        }
      }, "ยืนยันการลบข้อมูล");
    });
  }
}
class FormSearch {
  utilityType: string = "";
  invoiceNum: string = "";
  searchFlag: string = "";
  startDate: string = "";
  endDate: string = "";
}

class FormEdit {
  utilityType: string = "";
  invoiceNum: string = "";

  serviceReceive: number = 0;
  suppressReceive: number = 0;
  budgetReceive: number = 0;
  sumReceive: number = 0;

  serviceWithdraw: number = 0;
  suppressWithdraw: number = 0;
  budgetWithdraw: number = 0;
  sumWithdraw: number = 0;

  serviceBalance: number = 0;
  suppressBalance: number = 0;
  budgetBalance: number = 0;
  sumBalance: number = 0;

  moneyBudget: number = 0;
  moneyOut: number = 0;

  averageCost: number = 0;
  averageGive: string = "";
  averageFrom: number = 0;
  averageComeCost: string = "";

  note: string = "";
  editStatus: string = "";
}

