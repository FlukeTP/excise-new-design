import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { IaService } from 'services/ia.service';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';
declare var $: any;
const URL = {
  // SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/analysis-income-compareLast-year-data",
  SEARCH: AjaxService.CONTEXT_PATH + "ta/tax-operator/find-by-analyze-compare-year",
}
@Component({
  selector: 'app-s08',
  templateUrl: './s08.component.html',
  styleUrls: ['./s08.component.css']
})
export class S08Component implements OnInit {

  formVo: FormVo;
  table: any;

  constructor(
    private router: Router,
    private detailService: IaService
  ) { }

  ngOnInit() {
    this.formVo = {
      newRegId: '',
      startDate: '',
      endDate: ''
    }

    this.setDataService();
  }
  ngAfterViewInit(): void {
    this.dataTable();
    // setTimeout(() => {
    //   this.dataTable();
    // }, 200);
  }

  setDataService() {
    let model = this.detailService.getData();
    if (model == null) {
      this.router.navigate(['/tax-audit-new/select07/se01/s01']);
      return false;
    }
    this.formVo = model
    console.log("model service : ", this.formVo);
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
            "newRegId": this.formVo.newRegId,
            "taxMonth": this.formVo.startDate,
            "taxYear": this.formVo.endDate
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: "monthDesc", className: "text-left"
        }, {
          data: "taxAmountOld", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "taxAmount", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diff", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "diffPercent", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
      ],
    });

  }
}

interface FormVo {
  newRegId: string;
  startDate: string;
  endDate: string;
}
