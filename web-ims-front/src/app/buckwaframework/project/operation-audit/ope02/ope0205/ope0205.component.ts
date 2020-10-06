import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-ope0205',
  templateUrl: './ope0205.component.html',
  styleUrls: ['./ope0205.component.css']
})
export class Ope0205Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
    { label: "รายงานผู้รับอนุญาตตามภาค/พื้นที่", route: "#" },

  ];
  constructor() { }

  ngOnInit() { }

}
