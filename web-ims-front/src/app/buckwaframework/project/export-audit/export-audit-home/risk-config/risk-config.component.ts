import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from "models/index";
import { Utils } from 'helpers/utils';
@Component({
  selector: 'app-risk-config',
  templateUrl: './risk-config.component.html',
  styleUrls: ['./risk-config.component.css']
})
export class RiskConfigComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจส่งออก", route: "#" },
    { label: "ความเสี่ยง", route: "#" },
  ];

  loading: boolean = false;
  num1: Number ;
  num2: Number ;
  num3: Number ;

  constructor() { }

  ngOnInit() {
    this.num1=15;
    this.num2=60;
    this.num3=15;
  }

  typeNumber(e) {
    return Utils.onlyNumber(e);
  }

  onSubmit = e => {
    e.preventDefault();
    this.loading = true;
    console.log("num1 :"+this.num1+" num2 :"+this.num2+" num3 :"+this.num3)
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

}
