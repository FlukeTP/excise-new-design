import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-ope0409',
  templateUrl: './ope0409.component.html',
  styleUrls: ['./ope0409.component.css']
})
export class Ope0409Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "รายการออกตรวจควบคุม", route: "#" },
  ];
  constructor() { }

  ngOnInit() {
  }

}
