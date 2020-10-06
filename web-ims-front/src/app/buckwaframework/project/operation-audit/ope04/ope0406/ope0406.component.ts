import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ope0406',
  templateUrl: './ope0406.component.html',
  styleUrls: ['./ope0406.component.css']
})
export class Ope0406Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "พารามิเตอร์คอนฟิก", route: "#" },
  ];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  goPage1() {
    this.router.navigate(['/ope04/06/01']);
  }

  goPage2() {
    this.router.navigate(['/ope04/06/02']);
  }
}
