import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';

declare var $: any;
@Component({
  selector: 'app-int120601',
  templateUrl: './int120601.component.html',
  styleUrls: ['./int120601.component.css']
})
export class Int120601Component implements OnInit {
  activityList: any;
  budgetList: any;
  breadcrumb: BreadCrumb[];

  _dataTable: any;
  dateForm: any;
  dateTo: any;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private message: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลเบิกจ่าย", route: "#" }
    ];
  }

  ngOnInit() {
    $(".ui.dropdown.ai")
      .dropdown()
      .css("width", "100%");
    this.calenda();
    this.activity();
    this.budge();
    this.dataTable();
  }

  ngAfterViewInit() {
    // Edited or Added ???
    $("#dataTable tbody").on("click", "button", e => {
      const { id } = e.currentTarget;
      this._dataTable.row($(e).parents("tr")).data();
      if ("edit" == id.split("-")[0]) {
        // Editing
        this.router.navigate(["/int12/06/01/01"], {
          queryParams: { id: id.split("-")[1] }
        });
      } else if ("show" == id.split("-")[0]) {
        // Showing
        this.message.errorModal();
      } else if ("delete" == id.split("-")[0]) {
        // Deleting
        this.message.comfirm(e => {
          if (e) {
            this.ajax.delete(
              `ia/int06101/delete/${id.split("-")[1]}`,
              response => {
                const msg = response.json();
                if (msg.messageType == "C") {
                  this.message.successModal(msg.messageTh);
                  this.onSearch();
                } else {
                  this.message.errorModal(msg.messageTh);
                }
              }
            );
          }
        }, `ท่านต้องการลบข้อมูลขอเบิกรหัส ${id.split("-")[1]} หรือไม่ ?`);
      }
    });
  }

  onSearch = () => {
    $("#searchFlag").val("TRUE");
    this._dataTable.ajax.reload();
  };

  onClear = () => {
    $("#budget").dropdown("restore defaults");
    $("#activity").dropdown("restore defaults");
    this.dateForm = "";
    this.dateTo = "";
    $("#searchFlag").val("FALSE");
    this._dataTable.ajax.reload();
  };

  activity = () => {
    let url = "ia/int0610/activity";
    this.ajax.get(url, res => {
      this.activityList = res.json();
    });
  };

  budge = () => {
    let url = "ia/int0610/budge";
    this.ajax.get(url, res => {
      this.budgetList = res.json();
    });
  };

  calenda = () => {
    $("#dateForm").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (a, b) => {
        this.dateForm = b;
      }
    });
    $("#dateTo").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (a, b) => {
        this.dateTo = b;
      }
    });
  };

  dataTable = () => {
    this._dataTable = $("#dataTable").DataTableTh({
      serverSide: true,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      ajax: {
        url: "/ims-webapp/api/ia/int0610/findAll",
        contentType: "application/json",
        type: "POST",
        data: d => {
          return JSON.stringify(
            $.extend({}, d, {
              budget: $("#budget").val(),
              activity: $("#activity").val(),
              dateForm: this.dateForm,
              dateTo: this.dateTo,
              searchFlag: $("#searchFlag").val()
            })
          );
        }
      },

      columns: [
        {
          // Column 1
          data: "dateOfPay",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "ui center aligned"
        },
        {
          // Column 2
          data: "refnum",
          className: "ui center aligned"
        },
        {
          // Column 3
          data: "withdrawaldate",
          className: "ui center aligned"
        },
        {
          // Column 4
          data: "budgettype",
          className: "ui center aligned"
        },
        {
          // Column 5
          data: "activities",
          className: "ui center aligned"
        },
        {
          // Column 6
          data: "budgetname",
          className: "ui center aligned"
        },
        {
          // Column 7
          data: "categoryname",
          className: "ui center aligned"
        },
        {
          // Column 8
          data: "listname",
          className: "ui center aligned"
        },
        {
          // Column 9
          data: "itemdesc",
          className: "ui center aligned"
        },
        {
          // Column 10
          data: "withdrawalamount",
          className: "ui right aligned",
          render: data => {
            return Utils.moneyFormat(data);
          }
        },
        {
          // Column 11
          data: "withholdingtax",
          className: "ui right aligned",
          render: data => {
            return Utils.moneyFormat(data);
          }
        },
        {
          // Column 12
          data: "socialsecurity",
          className: "ui right aligned",
          render: data => {
            return Utils.moneyFormat(data);
          }
        },
        {
          // Column 13
          data: "anotheramount",
          className: "ui right aligned",
          render: data => {
            return Utils.moneyFormat(data);
          }
        },
        {
          // Column 14
          data: "receivedamount",
          className: "ui right aligned",
          render: data => {
            return Utils.moneyFormat(data);
          }
        },
        {
          // Column 15
          data: "withdrawaldocnum",
          className: "ui center aligned"
        },
        {
          // Column 16
          data: "paymentdocnum",
          className: "ui center aligned"
        },
        {
          // Column 17
          data: "note",
          className: "ui center aligned"
        },
        {
          // Column 18
          data: "withdrawalid",
          className: "ui center aligned",
          render: (data, type, full, meta) => {
            return `
            <button class="ui mini primary button" id="show-${
              full.withdrawalid
              }" value="show-${
              full.withdrawalid
              }"><i class="search icon"></i>ดู</button>
            <button class="ui mini yellow button" id="edit-${
              full.withdrawalid
              }" value="edit-${
              full.withdrawalid
              }"><i class="edit icon"></i>แก้ไข</button>
            <button class="ui mini red button" id="delete-${
              full.withdrawalid
              }" value="delete-${
              full.withdrawalid
              }"><i class="trash icon"></i>ลบ</button>
            `;
          }
        }
      ],
      rowCallback: (row, data, index) => {
        console.log(data);
      }
    });
  }


  // getDataExcel
  getDataExcel() {
    let dataList = this._dataTable.data();
    let dataArray = [];
    for (let i = 0; i < dataList.length; i++) {
      dataArray.push(dataList[i]);
    }
    return dataArray
  }

  // export
  export = () => {
    let data = this.getDataExcel();
    let formExcel = $("#form-data-excel").get(0);
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int0610/export";
    formExcel.dataJson.value = JSON.stringify({ int0610ExcelList: data });
    formExcel.submit();
  }


}
