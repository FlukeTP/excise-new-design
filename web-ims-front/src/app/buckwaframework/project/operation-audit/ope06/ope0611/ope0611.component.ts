import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

declare var $: any;

@Component({
  selector: 'app-ope0611',
  templateUrl: './ope0611.component.html',
  styleUrls: ['./ope0611.component.css']
})
export class Ope0611Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "แผนงานการออกตรวจประจำเดือน", route: "#" }
  ];
  
  yearSelect: any;
  constructor() { }

  ngOnInit() {
    $("#selectYear").dropdown('set selected', "ต.ค. 2561");
  }

}
