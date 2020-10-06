import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-result-select-form',
  templateUrl: './result-select-form.component.html',
  styleUrls: ['./result-select-form.component.css']
})
export class ResultSelectFormComponent implements OnInit {

  breadcrumb: BreadCrumb[] = [    
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การตรวจสอบภาษี', route: '#' },
    { label: 'ผลการสร้างกระดาษทำการตรวจสอบภาษี', route: '#' },
  ]
  
  constructor() { }

  ngOnInit() {
  }

}
