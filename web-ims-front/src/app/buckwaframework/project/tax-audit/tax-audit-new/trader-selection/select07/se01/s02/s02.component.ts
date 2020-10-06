import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';

declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/basic-anlysis/analysis-taxQuRetail-price-data",
}
@Component({
  selector: 'app-s02',
  templateUrl: './s02.component.html',
  styleUrls: ['./s02.component.css']
})
export class S02Component implements OnInit {

  
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
          data: "taxInformPrice", className: "text-right"
        }, {
          data: "informPrice", className: "text-right"
        }, {
          data: "diffTaxInformPrice", className: "text-right"
        }
      ],
    });

  }
}

interface FormVo {
  startDate: string;
  endDate: string;
}
