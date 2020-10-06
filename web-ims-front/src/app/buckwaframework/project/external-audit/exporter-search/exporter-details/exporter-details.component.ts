import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-exporter-details',
  templateUrl: './exporter-details.component.html',
  styleUrls: ['./exporter-details.component.css']
})
export class ExporterDetailsComponent implements OnInit {
  breadcrumb: BreadCrumb[];
  table: any[] = ["", "", ""];

  constructor() { }

  ngOnInit() {
    this.breadcrumb = [
      { label: "ตรวจส่งออก", route: "#" },
      { label: "ค้นหาผู้ส่งออก", route: "#" },
    ];
  }

}
