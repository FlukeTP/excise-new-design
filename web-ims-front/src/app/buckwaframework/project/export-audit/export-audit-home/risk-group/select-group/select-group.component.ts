import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-group',
  templateUrl: './select-group.component.html',
  styleUrls: ['./select-group.component.css']
})
export class SelectGroupComponent implements OnInit {

  btnText11 : string = 'เลือก';
  btnClass11 : string = '';
  btnText12 : string = 'เลือก';
  btnClass12 : string = '';
  btnText21 : string = 'เลือก';
  btnClass21 : string = '';
  btnText22 : string = 'เลือก';
  btnClass22 : string = '';

  constructor() { }

  ngOnInit() {

  }

  toggleBtn11() {

    if (this.btnText11 === 'เลือก') {
      this.btnText11 = 'ยกเลิก';
      this.btnClass11 = 'active';
    } else {
      this.btnText11 = 'เลือก';
      this.btnClass11 = '';
    }
  }

  toggleBtn12() {

    if (this.btnText12 === 'เลือก') {
      this.btnText12 = 'ยกเลิก';
      this.btnClass12 = 'active';
    } else {
      this.btnText12 = 'เลือก';
      this.btnClass12 = '';
    }

  }

  toggleBtn21() {

    if (this.btnText21 === 'เลือก') {
      this.btnText21 = 'ยกเลิก';
      this.btnClass21 = 'active';
    } else {
      this.btnText21 = 'เลือก';
      this.btnClass21 = '';
    }
  }

  toggleBtn22() {

    if (this.btnText22 === 'เลือก') {
      this.btnText22 = 'ยกเลิก';
      this.btnClass22 = 'active';
    } else {
      this.btnText22 = 'เลือก';
      this.btnClass22 = '';
    }
  }

}
