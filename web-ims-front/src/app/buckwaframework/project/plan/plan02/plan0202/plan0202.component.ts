import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-plan0202',
  templateUrl: './plan0202.component.html',
  styleUrls: ['./plan0202.component.css']
})
export class Plan0202Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "แผนการออกตรวจ", route: "#" },
    { label: "แผนประจำปี", route: "/plan02/" },
    { label: "กลุ่มการตรวจสอบภายใน", route: "#" }
  ];
  constructor() { }

  ngOnInit() {
  }

}
