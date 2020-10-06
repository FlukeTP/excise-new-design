import { Component, OnInit } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';


declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/analysis-tax-qty-data",
}
@Component({
  selector: 'app-s01',
  templateUrl: './s01.component.html',
  styleUrls: ['./s01.component.css'],

})
export class S01Component implements OnInit {

  formVo: FormVo;
  table:any;

  constructor(
    private router: Router,
    private detailService: IaService
    ) { }

  ngOnInit() {
    this.formVo = {
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
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate
          }));
        }
      },
      columns: [
        {
          data: "goodsDesc", className: "text-left"
        }, {
          data: "taxQty", className: "text-right"
        }, {
          data: "monthStatementTaxQty", className: "text-right"
        }, {
          data: "diffTaxQty", className: "text-right"
        }
      ],
    });

  }
}

interface FormVo {
  startDate: string;
  endDate: string;
}
