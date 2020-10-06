import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-int090305',
  templateUrl: './int090305.component.html',
  styleUrls: ['./int090305.component.css']
})
export class Int090305Component implements OnInit {

  sectorList: any[] = [];
  areaList: any[] = [];
  branchList: any[] = [];

  constructor() { }

  ngOnInit() {
  }
  search() { }
  clear() { }
  export() { }
  branch(event) { }
  area(event) { }
}
