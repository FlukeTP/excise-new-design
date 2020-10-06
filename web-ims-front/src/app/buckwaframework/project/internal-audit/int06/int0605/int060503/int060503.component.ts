import { Component, OnInit } from "@angular/core";
import { BreadCrumb, TaxReceipt } from "models/index";
import { AjaxService } from "services/ajax.service";
import { DecimalFormat, Utils } from "helpers/index";
import { MessageBarService } from "services/message-bar.service";
import { Lov } from "../int0605-2.service";
import { AuthService } from "services/auth.service";
import { Int06051Service } from '../int0605-1.services';
declare var $: any;
@Component({
  selector: 'app-int060503',
  templateUrl: './int060503.component.html',
  styleUrls: ['./int060503.component.css']
})
export class Int060503Component implements OnInit {
  receipt: TaxReceipt[];
  tableTax: any[];
  tableMaintain: any[];
  datatableTax: any;
  datatableMaintain: any;
  receiptTax: any[];
  sumTax: TaxReceipt;
  receiptMaintain: any[];
  sumMaintain: TaxReceipt;
  
  breadcrumb: BreadCrumb[]; // Breadcrump navs

  constructor(
    private ajax: AjaxService, 
    private main: Int06051Service, 
    private msg: MessageBarService,
    private authService: AuthService) {
    this.getlov();
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบรายได้", route: "#" },
      { label: "ตรวจสอบใบเสร็จรับเงินภาษีสรรพสามิต", route: "#" },
      { label: "รายงานการใช้ใบเสร็จรับเงินภาษีสรรพสามิต", route: "#" }
    ];
  }

  async ngOnInit() {
    
    this.authService.reRenderVersionProgram('INT-01130');
    this.getListAndFiterdData();


  }

  async getlov() {
    this.tableTax = [];
    this.tableMaintain = [];
    this.receiptTax = [];
    console.log("getlov");
    await this.ajax.post("ia/int0111/lov", { type: 'INC_CODE', subType: 'TAX' }, res => {
      let lov = res.json();
      lov.forEach(element => {
        this.tableTax.push(element.value1);
      });
      // console.log(this.tableTax);
    });
    await this.ajax.post("ia/int0111/lov", { type: 'INC_CODE', subType: 'MAINTAIN' }, res => {

      let lov = res.json();
      lov.forEach(element => {
        this.tableMaintain.push(element.value1);
      });
      //console.log(this.tableMaintain);
    });
    await this.getListAndFiterdData();

  }


  getListAndFiterdData() {
    let _data = this.main.getData() ? this.main.getData() : { travelTo1: '00', travelTo2: '00', travelTo3: '00', startDate: '01/09/2561', endDate: '21/09/2561' };
    const { travelTo1, travelTo2, travelTo3, startDate, endDate } = _data;
    const _start = startDate.split("/");
    const _end = endDate.split("/");
    const data = {
      "OfficeCode": travelTo1 + travelTo2 + travelTo3,
      "YearMonthFrom": `${parseInt(_start[2]) - 543}${_start[1]}${_start[0]}`,
      "YearMonthTo": `${parseInt(_end[2]) - 543}${_end[1]}${_end[0]}`,
      "DateType": "Income",
      "PageNo": "0",
      "DataPerPage": "0"
    };

    this.ajax.post("ia/int0111/searchSummaryTaxReceipt", data, res => {
      this.receipt = res.json();
      console.log(this.receipt);
      this.sumTax = new TaxReceipt();
      this.sumTax.count = 0;
      this.sumTax.netTaxAmount = 0;
      this.sumTax.netLocAmount = 0;
      this.sumTax.locOthAmount = 0;
      this.sumTax.locExpAmount = 0;
      this.sumTax.customAmount = 0;
      this.sumTax.stampAmount = 0;
      this.sumTax.olderFundAmount = 0;
      this.sumTax.sendAmount = 0;
      this.sumMaintain = new TaxReceipt();
      this.sumMaintain.count = 0;
      this.sumMaintain.netTaxAmount = 0;
      this.sumMaintain.netLocAmount = 0;
      this.sumMaintain.locOthAmount = 0;
      this.sumMaintain.locExpAmount = 0;
      this.sumMaintain.customAmount = 0;
      this.sumMaintain.stampAmount = 0;
      this.sumMaintain.olderFundAmount = 0;
      this.sumMaintain.sendAmount = 0;
      this.receiptTax = [];
      this.receiptMaintain = [];
      this.receipt.forEach(element => {
        if (this.tableTax.indexOf(element.incomeCode) > 0) {
          this.receiptTax.push(element);
          this.sumTax.count += element.count;
          this.sumTax.netTaxAmount += element.netTaxAmount;
          this.sumTax.netLocAmount += element.netLocAmount;
          this.sumTax.locOthAmount += element.locOthAmount;
          this.sumTax.locExpAmount += element.locExpAmount;
          this.sumTax.customAmount += element.customAmount;
          this.sumTax.stampAmount += element.stampAmount;
          this.sumTax.olderFundAmount += element.olderFundAmount;
          this.sumTax.sendAmount += element.sendAmount;
          console.log("sumTax coount", this.sumTax.count);
        }

        if (this.tableMaintain.indexOf(element.incomeCode) > 0) {
          this.receiptMaintain.push(element);
          this.sumMaintain.count += element.count;
          this.sumMaintain.netTaxAmount += element.netTaxAmount;
          this.sumMaintain.netLocAmount += element.netLocAmount;
          this.sumMaintain.locOthAmount += element.locOthAmount;
          this.sumMaintain.locExpAmount += element.locExpAmount;
          this.sumMaintain.customAmount += element.customAmount;
          this.sumMaintain.stampAmount += element.stampAmount;
          this.sumMaintain.olderFundAmount += element.olderFundAmount;
          this.sumMaintain.sendAmount += element.sendAmount;
          console.log("sumMaintain count", this.sumMaintain.count);
        }
      });
      this.initTableTax();
      this.initTableMonth();
    });
  }

  initTableTax() {
    if (this.datatableTax != null && this.datatableTax != undefined) {
      this.datatableTax.destroy();
    }

    this.datatableTax = $("#datatableTax").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.receiptTax,
      columns: [

        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        },
        //  { data: "incomeCode" },
        { data: "incomeName" },
        { data: "count" },
        { data: "netTaxAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "netLocAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "locOthAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "locExpAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "customAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "stampAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "olderFundAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
       },
        { data: "sendAmount",
        "render": function (data) {
          return Utils.moneyFormat(data);
        }
      }



      ], columnDefs: [

        { targets: [2, 3, 4, 5, 6, 7, 8, 9, 10], className: "right aligned" }

      ]

    });
  }
  df(what): string {
    const df = new DecimalFormat("###,###.00");
    return df.format(what);
  }

  initTableMonth() {
    if (this.datatableMaintain != null && this.datatableMaintain != undefined) {
      this.datatableMaintain.destroy();
    }

    this.datatableMaintain = $("#datatableMaintain").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.receiptMaintain,
      columns: [

        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        },
        //  { data: "incomeCode" },
        { data: "incomeName" },
        { data: "count" },
        { data: "netTaxAmount" },
        { data: "netLocAmount" },
        { data: "locOthAmount" },
        { data: "locExpAmount" },
        { data: "customAmount" },
        { data: "stampAmount" },
        { data: "olderFundAmount" },
        { data: "sendAmount" }



      ], columnDefs: [

        { targets: [2, 3, 4, 5, 6, 7, 8, 9, 10], className: "right aligned" }

      ]

    });
  }

}
