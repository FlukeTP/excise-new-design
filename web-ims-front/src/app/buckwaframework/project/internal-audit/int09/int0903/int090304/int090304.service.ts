import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";

import { Utils } from "helpers/utils";

import { MessageBarService } from 'services/message-bar.service';


declare var $: any;
const URL = {
  export:"ia/int066/exportFile"
}
@Injectable()
export class Int090304Service {
  // form: FormSearch = new FormSearch();
  table: any;
  constructor(
    private ajax: AjaxService,
    private message: MessageBarService
  ) {
    // TODO
    $.fn.DataTableTh2 = function (options) {
      var opt = {
        ordering: false,
        searching: false,
        scrollX: true,
        language: {
          info: "แสดงจาก  _START_  ถึง  _END_  จากทั้งหมด  _TOTAL_  รายการ",
          paginate: {
            first: "หน้าแรก",
            last: "หน้าสุดท้าย",
            next: "ถัดไป",
            previous: "ก่อนหน้า"
          },
          lengthMenu: "แสดง _MENU_ รายการ",
          loadingRecords: "กำลังโหลด...",
          processing: "กำลังประมวลผล...",
          search: "ค้นหาทั้งหมด",
          infoEmpty: "แสดงจาก 0  ถึง  0  จากทั้งหมด  0  รายการ",
          emptyTable: "ไม่พบข้อมูล",
          zeroRecords: "ไม่พบข้อมูล",
          infoFiltered: "(ค้นหาจากทั้งหมด  _MAX_  รายการ)",
        },
        "dom": "<'stackable'" +
          "<'row'" +
          "<'clear'>" +
          ">" +
          "<'row dt-table'" +
          "<'sixteen wide column'tr>" +
          ">" +
          "<'row'" +
          "<'left aligned five wide column'l>" +
          "<'center aligned six wide column'i>" +
          "<'right aligned five wide column'p>" +

          ">" +
          ">"
      };
      var settings = $.extend(opt, options);

      return $(this).DataTable(settings);
    };

  }

  sector = (): Promise<any> => {
    let url = "ia/int066/sector";

    return new Promise((resolve, reject) => {
      this.ajax.get(url, res => {
        resolve(res.json())
      })
    });
  }
  area = (e) => {
    let url = "ia/int066/area";
    return new Promise((resolve, reject) => {
      this.ajax.post(url, JSON.stringify(e), res => {
        resolve(res.json())
      })
    });
  }
  branch = (e) => {
    let url = "ia/int066/branch";
    return new Promise((resolve, reject) => {
      this.ajax.post(url, JSON.stringify(e), res => {
        resolve(res.json())
      })
    });
  }

  budgetType = () => {
    let url = "ia/int066/budgetType";
    return new Promise((resolve, reject) => {
      this.ajax.get(url, res => {
        resolve(res.json())
      });
    });
  }

  
  exportFile=()=>{
    
    let param = "";

    // param +="?sector=" +  this.form.sector;
    // param +="&area=" +  this.form.area;
    // param +="&branch=" + this.form.branch;
    // param +="&dateFrom=" + this.form.dateFrom;
    // param +="&dateTo=" + this.form.dateTo;
    param +="&budgetType=" +$("#budgetType").val();
    console.log(URL.export+param);
    this.ajax.download(URL.export+param);

    

  }

  search = () => {
    // this.form.searchFlag = "TRUE";
    $("#dataTable").DataTable().ajax.reload();
  }
  clear = () => {
    // this.form.searchFlag = "FALSE";
    $(".office").dropdown('restore defaults');
    $("#dateFrom").val("");
    $("#dateTo").val("");
    $("#dataTable").DataTable().ajax.reload();

  }
  dataTable = () => {

    this.table = $("#dataTable").DataTableTh2({
      "serverSide": true,
      "searching": false,
      "processing": true,
      "ordering": false,
      "ajax": {
        "url": '/ims-webapp/api/ia/int066/findAll',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
            "sector": $("#sector").val(),
            "area": $("#area").val(),
            "branch": $("#branch").val(),
            "dateFrom": $("#dateFrom").val(),
            "dateTo": $("#dateTo").val(),
            // "searchFlag": this.form.searchFlag,
            "budgetType": $("#budgetType").val(),
          }));
        },
      },

      "columns": [
        {
          "data": "dateOfPay",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          "className": "ui center aligned"
        }, {
          "data": "payee",
          "className": "ui left aligned"
        }, {
          "data": "refPayment",
          "className": "ui center aligned"
        }, {
          "data": "budgetType",
          "className": "ui left aligned"
        },  {
          "data": "itemDesc",
          "className": "ui center aligned"
        },{
          "data": "amount",
          "render": (data)=>{
            return Utils.moneyFormatDecimal(data);
          },
          "className": "ui right aligned"
        },{
          "data": "paymentDate",
          "className": "ui center aligned"
        }
      ]
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