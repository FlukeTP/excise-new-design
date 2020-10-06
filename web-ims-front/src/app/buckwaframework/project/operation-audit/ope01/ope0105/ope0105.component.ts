import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-ope0105',
  templateUrl: './ope0105.component.html',
  styleUrls: ['./ope0105.component.css']
})
export class Ope0105Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "รายงาน", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "รายงานผู้รับอนุญาตตามภาค/พื้นที่", route: "#" },

  ];
  constructor() { }

  ngOnInit() { }

}
