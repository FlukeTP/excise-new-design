import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-se01',
  templateUrl: './se01.component.html',
  styleUrls: ['./se01.component.css']
})
export class Se01Component implements OnInit {
  breadcrumb: BreadCrumb[] = [   
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'ขออนุมัติการออกตรวจ', route: '#' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
