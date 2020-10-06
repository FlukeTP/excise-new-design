import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { Location } from '@angular/common';

@Component({
  selector: 'app-select14',
  templateUrl: './select14.component.html',
  styleUrls: ['./select14.component.css']
})
export class Select14Component implements OnInit {
  
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'ตรวจสอบการเลือกรายผู้ประกอบการ (ภาค)', route: '#' }
  ]
  constructor(
    private _location: Location
  ) { }

  ngOnInit() {
  }

  goBack() {
    this._location.back();
  }

}
