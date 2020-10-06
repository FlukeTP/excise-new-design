import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-ope0405',
  templateUrl: './ope0405.component.html',
  styleUrls: ['./ope0405.component.css']
})
export class Ope0405Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "รายงานผู้รับอนุญาตตามภาค/พื้นที่", route: "#" },

  ];
  constructor() { }

  ngOnInit() { }

}
