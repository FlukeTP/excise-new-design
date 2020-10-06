import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-ope041103',
  templateUrl: './ope041103.component.html',
  styleUrls: ['./ope041103.component.css']
})
export class Ope041103Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "คัดเลือกรายจากการค้นหา", route: "#" }
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
    this.router.navigate(['/ope04/11/01'],{
      queryParams: {
        to: "DETAIL"
      }
    });
  }

  table1() {
    if (this.tableData1 != null) {
      this.tableData1.destroy();
    }
    this.dataTables1 = [
      { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงราย", progress: 45, dateCk: "01 มกราคม 2562", lengthCk: 1 },
      { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่พะเยา", progress: 28, dateCk: "02 มกราคม 2561", lengthCk: 2 },
      { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่ลำปาง", progress: 85, dateCk: "01 มกราคม 2560", lengthCk: 3 },
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่แพร่", progress: 15, dateCk: "03 มกราคม 2559", lengthCk: 4 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงใหม่", progress: 50, dateCk: "04 มกราคม 2559", lengthCk: 4 },
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
