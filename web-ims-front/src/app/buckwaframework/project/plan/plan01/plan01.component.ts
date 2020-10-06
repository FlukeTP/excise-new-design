import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan01',
  templateUrl: './plan01.component.html',
  styleUrls: ['./plan01.component.css']
})
export class Plan01Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "แผนการออกตรวจ", route: "#" },
    { label: "ปฏิทิน", route: "#" }
  ];
  
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  route(month: number, year: number) {
    console.log("month: ", month);
    console.log("year: ", year);
    this.router.navigate(["/plan02/01"], {
      queryParams: {
        month: month,
        year: year
      }
    });
  }

}
