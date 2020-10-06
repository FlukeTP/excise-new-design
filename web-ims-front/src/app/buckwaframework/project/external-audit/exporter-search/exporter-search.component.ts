import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-exporter-search',
  templateUrl: './exporter-search.component.html',
  styleUrls: ['./exporter-search.component.css']
})
export class ExporterSearchComponent implements OnInit {
  table: any;
  dataTables: any = [];
  breadcrumb: BreadCrumb[] = [];
  constructor() {
    this.breadcrumb = [
      { label: "ตรวจส่งออก", route: "#" },
      { label: "ประวัติการตรวจปล่อยสินค้า", route: "#" },
    ];
  }

  ngOnInit() {
    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $('#date2').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
  }

}
