import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0204',
  templateUrl: './ope0204.component.html',
  styleUrls: ['./ope0204.component.css']
})
export class Ope0204Component implements OnInit {
  [x: string]: any;
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
    { label: "รายงานเปรียบเทียบภาษีประมาณการและการเสียภาษีจริง", route: "#" },

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
