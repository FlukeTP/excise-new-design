import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router } from '@angular/router';
import { Utils } from 'helpers/utils';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ope040601',
  templateUrl: './ope040601.component.html',
  styleUrls: ['./ope040601.component.css']
})
export class Ope040601Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "สูตรคำนวณการผลิตสุรากลั่นชุมชน", route: "#" },
  ];

  dropdown: any[] = [];

  constructor(private router: Router) {
    this.dropdown = [
      { id: "1", description: "ข้าวเหนียว" },
      { id: "2", description: "โมลาส" },
    ];
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  typeNumber(e) {
    return Utils.onlyNumber(e);
  }

  goPage1() {
    this.router.navigate(['/ope04/06/']);
  }

  goPage2() {
    this.router.navigate(['/ope04/06/']);
  }
}
