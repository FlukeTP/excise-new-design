import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-se01',
  templateUrl: './se01.component.html',
  styleUrls: ['./se01.component.css']
})
export class Se01Component implements OnInit {

  b : BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b05.label, route: this.b.b05.route },
    { label: this.b.b06.label, route: this.b.b06.route },
  ];
  constructor() { }

  ngOnInit() {
  }

}
