import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';

@Component({
  selector: 'app-ope040602',
  templateUrl: './ope040602.component.html',
  styleUrls: ['./ope040602.component.css']
})
export class Ope040602Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "กำหนดการแจ้งเตือน", route: "#" },
  ];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  typeNumber(e) {
    return Utils.onlyNumber(e);
  }
  
  goPage1() {
    this.router.navigate(['/ope04/06/01']);
  }

  goPage2() {
    this.router.navigate(['/ope04/06/02']);
  }
}
