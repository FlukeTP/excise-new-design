import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-int090307',
  templateUrl: './int090307.component.html',
  styleUrls: ['./int090307.component.css']
})
export class Int090307Component implements OnInit {


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
