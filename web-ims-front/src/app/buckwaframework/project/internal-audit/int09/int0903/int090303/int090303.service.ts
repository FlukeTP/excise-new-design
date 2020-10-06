import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { Utils } from "helpers/utils";
const URL = {
  export: "ia/int065/exportFile"
}
declare var $: any;

@Injectable()
export class Int090303Service {

  table: any;
  constructor(

    private ajax: AjaxService,
    private message: MessageBarService
  ) {
    // TODO
  }

  getTable() {
    return this.table;
  }

  sector = (): Promise<any> => {
    let url = "ia/int065/sector";
    return new Promise((resolve, reject) => {
      this.ajax.get(url, res => {
        resolve(res.json())
      })
    });
  }

  area = (e) => {
    let url = "ia/int065/area";
    return new Promise((resolve, reject) => {
      this.ajax.post(url, JSON.stringify(e), res => {
        resolve(res.json())
      })
    });
  }

  branch = (e) => {
    let url = "ia/int065/branch";
    return new Promise((resolve, reject) => {
      this.ajax.post(url, JSON.stringify(e), res => {
        resolve(res.json())
      })
    });
  }

  budgetType = () => {
    let url = "ia/int065/budgetType";
    return new Promise((resolve, reject) => {
      this.ajax.get(url, res => {
        resolve(res.json())
      });
    });
  }

  search = () => {
    this.table.ajax.reload();
  }



  dataTable = () => {
    console.log("My datatable");
    this.table = $("#dataTable").DataTableTh({
      serverSide: true,
      searching: false,
      ordering: false,
      processing: true,
      scrollX: true,
      ajax: {
        url: '/ims-webapp/api/ia/int065/findAll',
        contentType: "application/json",
        type: "POST",
        data: (d) => {
          // console.log("flag :", $("#searchFlag").val());
          // console.log("sector :", $("#sector").val());
          return JSON.stringify($.extend({}, d, {
            "sector": $("#sector").val(),
            "area": $("#area").val(),
            "branch": $("#branch").val(),
            "dateFrom": $("#dateFrom").val(),
            "dateTo": $("#dateTo").val(),
            "searchFlag": $("#searchFlag").val(),
            "budgetType": $("#budgetType").val(),
          }));
        },
      },
      columns: [
        {
          data: "dateOfPay",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "ui center aligned"
        },
        {
          data: "paymentDate",
          className: "ui center aligned"
        },
        {
          data: "refPayment",
          className: "ui center aligned"
        },
        {
          data: "bankName",
          className: "ui left aligned"
        },
        {
          data: "amount",
          className: "ui right aligned",
          render: (data) => {
            return Utils.moneyFormatDecimal(data);
          },
        },
        {
          data: "budgetType",
          className: "ui left aligned"
        },
        {
          data: "itemDesc",
          className: "ui left aligned"
        },
        {
          data: "payee",
          className: "ui left aligned"
        }]
    });
  }

    // getDataExcel
    getDataExcel(){
      let dataList = this.table.data();   
      let dataArray = [];
     for(let i=0;i<dataList.length;i++){
         dataArray.push(dataList[i]);
     }
     return dataArray
  }
  
}
