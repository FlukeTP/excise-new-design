import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0203',
  templateUrl: './ope0203.component.html',
  styleUrls: ['./ope0203.component.css']
})
export class Ope0203Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
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
