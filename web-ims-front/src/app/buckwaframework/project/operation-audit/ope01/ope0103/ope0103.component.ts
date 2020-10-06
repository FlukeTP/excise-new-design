import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0103',
  templateUrl: './ope0103.component.html',
  styleUrls: ['./ope0103.component.css']
})
export class Ope0103Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "รายงานพบการกระทำความผิดแยกตามประเภทความผิด", route: "#" },
  ];
  constructor() { }

  ngOnInit() {
    this.calendar();
  }

  calendar() {
    $('#startDate').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
    $('#stopDate').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
  }
  
}
