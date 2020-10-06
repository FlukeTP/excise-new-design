import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';


declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/product-paper/list-product-paper-inform-price",
  EXPORT:"ta/product-paper/export-product-paper-inform-price"
}

@Component({
  selector: 'app-s09',
  templateUrl: './s09.component.html',
  styleUrls: ['./s09.component.css']
})
export class S09Component implements OnInit {


  hideResult: boolean = false;
  hideUpload: boolean = false;
  formGroup: FormGroup;
  table: any;
  formVo: FormVo;

  constructor(private formBuilder: FormBuilder ,private ajax: AjaxService) {
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
          data: "goodsDesc", className: "text-left"
        }, {
          data: "informPrice", className: "text-right"
        }, {
          data: "externalPrice", className: "text-right"
        }, {
          data: "declarePrice", className: "text-right"
        }, {
          data: "retailPrice", className: "text-right"
        }, {
          data: "taxPrice", className: "text-right"
        }, {
          data: "diffPrice", className: "text-right"
        }
      ],
    });

  }

}

interface FormVo {
  startDate: string;
  endDate: string;
}
