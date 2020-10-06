import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { BreadCrumb } from 'models/index';
import { AjaxService } from 'services/ajax.service';

declare var $: any;
@Component({
  selector: 'app-cpe0101',
  templateUrl: './cpe0101.component.html',
  styleUrls: ['./cpe0101.component.css']
})
export class Cpe0101Component implements OnInit {
  breadcrumb: BreadCrumb[];
  searchForm: FormGroup;
  submitted: boolean = false;
  comboBox1: any;
  comboBox2: any;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown ai").css("width", "100%");
    this.breadcrumb = [
      { label: "ตรวจส่งออก", route: "#" },
      { label: "ความเชื่อมโยงระหว่างสินค้าและผู้ส่งออก", route: "#" },
    ];

    this.setVariable();
  }


  setVariable() {
    this.searchForm = this.fb.group({
      combo1: [{ value: "สำนักงานสรรพสามิตภาคที่ 5", disabled: true }],
      combo2: [{ value: "สำนักงานสรรพสามิตพื้นที่เชียงราย", disabled: true }],
      combo3: [{ value: "สำนักงานสรรพสามิตพื้นที่สาขาเมืองเชียงราย", disabled: true }],
      passExport: [{ value: "000", disabled: true }],
      exportName: [{ value: "บริษัท เป๊ปซี่-โคล่า (ไทย) เทรดดิ้ง จำกัด", disabled: true }]
    });
  }

  //func check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  handleSearch(event) {

  }

}
