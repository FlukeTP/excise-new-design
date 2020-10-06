import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-ope061202',
  templateUrl: './ope061202.component.html',
  styleUrls: ['./ope061202.component.css']
})
export class Ope061202Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "/ope01/" },
    { label: "แผนประจำปี สารละลายประเภทไฮโดรคาร์บอน", route: "/ope01/01/" },
    { label: "เลือกจากรายชื่อ", route: "#" }
  ];
  dataTables1: any = [];
  tableData1: any;
  constructor(
    private _location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    $('.dropdown').dropdown();
  }

  ngAfterViewInit() {
    this.table1()
  }

  goBack() {
    this.router.navigate(['/ope06/12']);
  }

  table1() {
    if (this.tableData1 != null) {
      this.tableData1.destroy();
    }
    this.dataTables1 = [
      { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 2", progress: 45 },
      { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่นนทบุรี", progress: 28 },
      { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่สิงห์บุรี", progress: 85 },
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 1", progress: 15 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ปราจีนบุรี", progress: 50 },
    ];
    this.tableData1 = $('#dataTable1').DataTable({
      searching: false,
      lengthChange: false,
      data: this.dataTables1,
      columns: [
        {
          render: function (data, type, full, meta) {
            return `<input class="ui checkbox" type="checkbox" name="chk${meta.row}" id="chk${
              meta.row
              }" value="${$("<div/>")
                .text(data)
                .html()}">`;
          },
          className: "center"
        },
        { data: 'area' },
        { data: 'subArea' },
        { data: 'name' },
        {
          render: function (data, type, full, meta) {
            return `<div style="text-align: center !important"><button class='ui primary button'>เลือก</button></div>`;
          }
        }
      ],
      rowCallback: (row, data, index) => {

      }
    });
  }

  checkAll1 = (e) => {
    var rows = this.tableData1.rows({ search: "applied" }).nodes();
    $('input[type="checkbox"]', rows).prop("checked", e.target.checked);
  }

}
