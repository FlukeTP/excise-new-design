import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-se02',
  templateUrl: './se02.component.html',
  styleUrls: ['./se02.component.css']
})
export class Se02Component implements OnInit {
  breadcrumb: BreadCrumb[] = [   
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'ขออนุมัติการออกตรวจ', route: '#' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
