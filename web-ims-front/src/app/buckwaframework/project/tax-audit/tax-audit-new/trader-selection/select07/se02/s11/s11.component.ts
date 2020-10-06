import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';

declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/product-paper/list-product-paper-tax-amt-additional",
  EXPORT:"ta/product-paper/export-product-paper-tax-amt-additional"
}

@Component({
  selector: 'app-s11',
  templateUrl: './s11.component.html',
  styleUrls: ['./s11.component.css']
})
export class S11Component implements OnInit {

  hideResult: boolean = false;
  hideUpload: boolean = false;
  formGroup: FormGroup;
  table: any;
  formVo: FormVo;

  constructor(private formBuilder: FormBuilder,private ajax: AjaxService) { 
    this.formVo = {
      startDate: '',
      endDate: ''
    }
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      exciseId: [''],
      userTaxNuber: [''],
      operator: [''],
      analysisNumber: [''],
      type: [''],
      coordinates: [''],
      startDate: [''],
      endDate: ['']
    })
  }
  exportFile=()=>{
    this.ajax.download(URL.EXPORT);
  }
  search = (e) => {
    if (e.startDate || e.stopDate) {
      this.hideResult = true;
      console.log("serach : ", e)
      this.formVo = e;
      console.log("formVo : ", this.formVo);
      setTimeout(() => {
        this.dataTable();
      }, 100);
    } else {
      this.hideResult = false;
    }
  }

  uploadTemplate = (e) => {
    console.log(e)
    this.hideUpload = true;
  }
  clear = (e) => {
    console.log(e)
    this.hideResult = false;
  }

  upload() { }

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
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "goodsDesc", className: "text-left"
        }, {
          data: "taxQty", className: "text-center"
        }, {
          data: "informPrice", className: "text-center"
        }, {
          data: "taxValue", className: "text-center"
        }, {
          data: "taxRateByValue", className: "text-right"
        }, {
          data: "taxRateByQty", className: "text-right"
        }, {
          data: "penaltyAmt", className: "text-center"
        }, {
          data: "surchargeAmt", className: "text-right"
        }, {
          data: "moiTaxAmt", className: "text-right"
        }, {
          data: "netTaxAmt", className: "text-right"
        }
      ],
    });

  }

}

interface FormVo {
  startDate: string;
  endDate: string;
}
