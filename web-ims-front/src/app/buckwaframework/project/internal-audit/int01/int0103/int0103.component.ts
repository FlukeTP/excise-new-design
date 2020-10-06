import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-int0103',
  templateUrl: './int0103.component.html',
  styleUrls: ['./int0103.component.css']
})
export class Int0103Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "แผนการตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจสอบภายในประจำปี" ,route:"#"}
  ];

  constructor() { }

  ngOnInit() {
  }

}
