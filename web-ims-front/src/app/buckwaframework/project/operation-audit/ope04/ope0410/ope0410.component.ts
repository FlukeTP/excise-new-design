import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0410',
  templateUrl: './ope0410.component.html',
  styleUrls: ['./ope0410.component.css']
})
export class Ope0410Component implements OnInit {
  [x: string]: any;
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
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
