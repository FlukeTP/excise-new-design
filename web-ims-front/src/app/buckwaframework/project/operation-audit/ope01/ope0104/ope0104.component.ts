import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0104',
  templateUrl: './ope0104.component.html',
  styleUrls: ['./ope0104.component.css']
})
export class Ope0104Component implements OnInit {
  [x: string]: any;
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
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
