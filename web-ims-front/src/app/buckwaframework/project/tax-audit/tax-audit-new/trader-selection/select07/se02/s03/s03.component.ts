import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';

declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/product-paper/list-product-paper-balance-material",
  EXPORT:"ta/product-paper/export-product-paper-balance-material"
}

@Component({
  selector: 'app-s03',
  templateUrl: './s03.component.html',
  styleUrls: ['./s03.component.css']
})
export class S03Component implements OnInit {

  hideResult: boolean = false;
  hideUpload: boolean = false;
  formGroup: FormGroup;
  table: any;
  formVo: FormVo;

  constructor( private formBuilder: FormBuilder, private ajax: AjaxService) {
    this.formVo = {
      startDate: '',
      endDate: ''
    }
  }
  exportFile=()=>{
    this.ajax.download(URL.EXPORT);
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
          data: "materialDesc", className: "text-left"
        }, {
          data: "balanceByAccountQty", className: "text-right"
        }, {
          data: "balanceByCountQty", className: "text-right"
        }, {
          data: "maxDiffQty", className: "text-right"
        }
      ],
    });

  }

}

interface FormVo {
  startDate: string;
  endDate: string;
}
