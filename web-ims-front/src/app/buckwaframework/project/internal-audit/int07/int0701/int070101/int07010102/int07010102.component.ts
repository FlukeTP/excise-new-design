import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { Utils } from 'helpers/utils';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-int07010102',
  templateUrl: './int07010102.component.html',
  styleUrls: ['./int07010102.component.css']
})
export class Int07010102Component implements OnInit {

  table: any;
  data: FormModal[];
  breadcrumb: BreadCrumb[];

  constructor(
    private authService: AuthService,
    private message: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบพัสดุ", route: "#" },
      { label: "ตรวจสอบแสตมป์", route: "#" },
      { label: "สรุปแสตมป์รายปีงบประมาณ", route: "#" },
    ];
    this.data = []
  }

  ngOnInit() {
    ////this.authService.reRenderVersionProgram('INT-05112');
    $(".ui.dropdown").dropdown();
  }

  ngAfterViewInit() {
    this.dataTable();
  }

  spilt = (req) => {
    return req.split(".");
  }

  dataTable = () => {
    this.table = $("#dataTable").DataTableTh({
      "pageLength": 25,
      "serverSide": false,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "scrollCollapse": true,
      "fixedColumns": {
        "leftColumns": 2
      },
      "ajax": {
        "url": '/ims-webapp/api/ia/int05112/findAll',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, {
          }));
        },
      },
      "drawCallback": () => {
        $('.mark-th').closest('tr').addClass('active');
      },
      "columns": [
        {
          "data": "order",
          "render": function (data, type, row, meta) {
            if (data.split(".").length == 1) {
              $(row).addClass('active');
              return '<span class="mark-th">' + data + '</span>';
            }
            return data;
          },
          "className": "ui center aligned"
        },
        { "data": "stampType" },

        { "data": "branchLastYeatNumberOfStamp", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        {
          "data": "branchLastYeatMoneyOfStamp",
          "render": function (data, type, row, meta) {
            if (row.order.split(".").length == 1) return '';
            return Utils.moneyFormat(data);
          },
          "className": "ui right aligned"
        },

        { "data": "octoberRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "octoberPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "octoberBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.octoberRecieve) - parseInt(row.octoberPay); }, },

        { "data": "novemberRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "novemberPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "novemberBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.novemberRecieve) - parseInt(row.novemberPay); }, },

        { "data": "decemberRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "decemberPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "decemberBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.decemberRecieve) - parseInt(row.decemberPay); }, },

        { "data": "januaryRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "januaryPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "januaryBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.januaryRecieve) - parseInt(row.januaryPay); }, },

        { "data": "februaryRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "februaryPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "februaryBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.februaryRecieve) - parseInt(row.februaryPay); }, },

        { "data": "marchRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "marchPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "marchBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.marchRecieve) - parseInt(row.marchPay); }, },

        { "data": "aprilRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "aprilPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "aprilBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.aprilRecieve) - parseInt(row.aprilPay); }, },

        { "data": "mayRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "mayPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "mayBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.mayRecieve) - parseInt(row.mayPay); }, },

        { "data": "juneRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "junePay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "juneBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.juneRecieve) - parseInt(row.junePay); }, },

        { "data": "julyRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "julyPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "julyBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.julyRecieve) - parseInt(row.julyPay); }, },

        { "data": "augustRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "augustPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "augustBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.augustRecieve) - parseInt(row.augustPay); }, },

        { "data": "septemberRecieve", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "septemberPay", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, },
        { "data": "septemberBalance", "className": "ui right aligned", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return parseInt(row.septemberRecieve) - parseInt(row.septemberPay); }, },

        { "data": "summaryYearRecieve", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        { "data": "summaryYearMoneyRecieve", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return Utils.moneyFormat(data); }, "className": "ui right aligned" },
        { "data": "summaryYearPay", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        { "data": "summaryYearMoneyPay", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return Utils.moneyFormat(data); }, "className": "ui right aligned" },

        { "data": "summaryTotalRecieve", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        { "data": "summaryTotalMoneyRecieve", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return Utils.moneyFormat(data); }, "className": "ui right aligned" },
        { "data": "summaryTotalPay", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        { "data": "summaryTotalMoneyPay", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return Utils.moneyFormat(data); }, "className": "ui right aligned" },

        { "data": "branchUpToDateNumberOfStamp", "render": function (data, type, row, meta) { if (row.order.split(".").length == 1) return ''; return data; }, "className": "ui right aligned" },
        {
          "data": "branchUpToDateMoneyOfStamp",
          "render": function (data, type, row, meta) {
            if (row.order.split(".").length == 1) return '';
            return Utils.moneyFormat(data);
          },
          "className": "ui right aligned"
        },


      ]
    });
  }


}

class FormModal {
  workSheetDetailId: string = null;
  exciseDepartment: string = null;
  exciseRegion: string = null;
  exciseDistrict: string = null;
  dateOfPay: string = null;
  status: string = null;
  departmentName: string = null;
  bookNumberWithdrawStamp: string = null;
  dateWithdrawStamp: string = null;
  bookNumberDeliverStamp: string = null;
  dateDeliverStamp: string = null;
  fivePartNumber: string = null;
  fivePartDate: string = null;
  stampCheckDate: string = null;
  stampChecker: string = null;
  stampType: string = null;
  stampBrand: string = null;
  numberOfBook: string = null;
  numberOfStamp: string = null;
  valueOfStampPrinted: string = null;
  sumOfValue: string = null;
  serialNumber: string = null;
  taxStamp: string = null;
  stampCodeStart: string = null;
  stampCodeEnd: string = null;
  note: string = null;
  createdDate: string = null;
  fileName: [any];
  idRandom: number = 0;
  file: File[];
}
