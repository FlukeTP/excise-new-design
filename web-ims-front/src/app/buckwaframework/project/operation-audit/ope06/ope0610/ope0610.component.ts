import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-ope0610',
  templateUrl: './ope0610.component.html',
  styleUrls: ['./ope0610.component.css']
})
export class Ope0610Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "แผนงานการออกตรวจ", route: "#"  },
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
