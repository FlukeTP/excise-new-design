import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/index';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConnectionProductExporterService } from './cpe01.service';

declare var $: any;
@Component({
  selector: 'app-connection-product-exporter',
  templateUrl: './cpe01.component.html',
  styleUrls: ['./cpe01.component.css'],
  providers: [ConnectionProductExporterService]
})
export class ConnectionProductExporterComponent implements OnInit {
  breadcrumb: BreadCrumb[];
  searchForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  comboBox1: any;
  comboBox2: any;
  comboBox3: any;
  formDisabled: boolean = true;
  formDisabled2: boolean = true;
  table: any[] = [];

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private selfService: ConnectionProductExporterService
  ) { }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown ai").css("width", "100%");
    this.breadcrumb = [
      { label: "ตรวจส่งออก", route: "#" },
      { label: "ความเชื่อมโยงระหว่างสินค้าและผู้ส่งออก", route: "#" },
    ];
    this.tableMock();
    this.setVariable();
  }

  dropdown(e, combo: string) {
    e.preventDefault();
    console.log("combo : ", combo);
    console.log("value: ", e.target.value);
    if (e.target.value == 0) {
      // this.searchForm.get("combo2").disable();
      if (combo === 'comboBox2') {
        this.formDisabled = true;
        this.formDisabled2 = true;
        this.searchForm.get("combo2").clearValidators();
        this.searchForm.get("combo2").updateValueAndValidity();
        $('#combo2').dropdown('restore defaults');
        $('#combo3').dropdown('restore defaults');
      }
    } else {
      if (combo === 'comboBox2') {
        this.formDisabled = false;
      }
      else if (combo === 'comboBox3') {
        this.formDisabled2 = false;
      }

      this[combo] = this.selfService
        .pullComboBox("SECTOR_VALUE", combo, e.target.value);
    }
  }

  tableMock() {
    this.table = [
      {
        id: "1",
        sector: "สำนักงานสรรพสามิตภาคที่ 5",
        area: "สำนักงานสรรพสามิตพื้นที่เชียงราย",
        branch: "สำนักงานสรรพสามิตพื้นที่สาขาเมืองเชียงราย",
        product: "น้ำมัน1",
      },
      {
        id: "2",
        sector: "สำนักงานสรรพสามิตภาคที่ 5",
        area: "สำนักงานสรรพสามิตพื้นที่เชียงราย",
        branch: "สำนักงานสรรพสามิตพื้นที่สาขาเมืองเชียงราย",
        product: "น้ำมัน2",
      },
      {
        id: "3",
        sector: "สำนักงานสรรพสามิตภาคที่ 5",
        area: "สำนักงานสรรพสามิตพื้นที่เชียงราย",
        branch: "สำนักงานสรรพสามิตพื้นที่สาขาเมืองเชียงราย",
        product: "น้ำมัน3",
      },
      {
        id: "4",
        sector: "สำนักงานสรรพสามิตภาคที่ 5",
        area: "สำนักงานสรรพสามิตพื้นที่เชียงราย",
        branch: "สำนักงานสรรพสามิตพื้นที่สาขาเมืองเชียงราย",
        product: "น้ำมัน4",
      }
    ];
  }

  handleSearch(e) {
    e.preventDefault();
  }

  onReset() {
    $("#combo1").dropdown("restore defaults");
    $("#combo2").dropdown("restore defaults");
    $("#combo3").dropdown("restore defaults");
    $("#exportName").dropdown("restore defaults");
  }

  setVariable() {
    this.searchForm = this.fb.group({
      combo1: ["", Validators.required],
      combo2: ["", Validators.required],
      combo3: ["", Validators.required],
      exportName: ["", Validators.required]
    });
  }

  //func check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

}
