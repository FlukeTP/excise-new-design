import { Component, OnInit } from '@angular/core';
import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0403',
  templateUrl: './ope0403.component.html',
  styleUrls: ['./ope0403.component.css']
})
export class Ope0403Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
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
