import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-plan02',
  templateUrl: './plan02.component.html',
  styleUrls: ['./plan02.component.css']
})
export class Plan02Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "แผนการออกตรวจ", route: "#" },
    { label: "แผนประจำปี", route: "#" },
  ];

  constructor(private router: Router, ) { }

  ngOnInit() {
  }

  route(month: number, year: number) {
    this.router.navigate(["/plan02/01"], {
      queryParams: {
        month: month,
        year: year
      }
    });
  }

}
