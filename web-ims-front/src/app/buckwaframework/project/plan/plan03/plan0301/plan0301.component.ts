import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-plan0301',
  templateUrl: './plan0301.component.html',
  styleUrls: ['./plan0301.component.css']
})
export class Plan0301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "แผนการออกตรวจ", route: "#" },
    { label: "ผู้ประกอบการประจำเดือน", route: "#" },
  ];
  month: any = "";
  year: any = "";

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.year = this.route.snapshot.queryParams['year'] || '2561';
    this.month = TextDateTH.months[(this.route.snapshot.queryParams['month'] || '10') - 1];
    console.log((this.route.snapshot.queryParams['month'] || '10'));
    console.log(this.month);
  }

  ngAfterViewInit(): void {
  }

  routeTo() {
    this.router.navigate(["/plan02/01"], {
      queryParams: {
        month: this.route.snapshot.queryParams['month'] || '10',
        year: this.year
      }
    });
  }

}
