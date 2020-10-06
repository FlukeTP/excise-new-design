import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ExciseService } from 'services/excise.service';

declare var $: any;
@Component({
  selector: 'app-ope061203',
  templateUrl: './ope061203.component.html',
  styleUrls: ['./ope061203.component.css']
})
export class Ope061203Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "/ope01/" },
    { label: "แผนประจำปี สารละลายประเภทไฮโดรคาร์บอน", route: "/ope01/01/" },
    { label: "กำหนดรายละเอียดการออกตรวจ", route: "#" }
  ];
  dateFrom: string = "";
  dateTo: string = "";
  lists: string[] = [];

  constructor(
    private router: Router,
    private _location: Location,
    private exciseService: ExciseService
  ) { }

  toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }

  ngOnInit() {
    $('.dropdown').dropdown();
    let data = this.exciseService.getData();
    if (data && data.dataTables) {
      const index = data.dataTables.findIndex(obj => obj.id == data.idSelect);
      // this.lists = data.dataTables[index].lists;
    }
  }

  approve() {
    const data = Object.assign({}, this.exciseService.getData());
    let newData = data;
    const index = data.dataTables.findIndex(obj => obj.id == data.idSelect);
    for (let i = 0; i < newData.dataTables[index].details.length; i++) {
      if (i == data.monthSelect) {
        newData.dataTables[index].dateFrom = this.dateFrom;
        newData.dataTables[index].dateTo = this.dateTo;
        newData.dataTables[index].details[data.monthSelect] = 1;
        newData.dataTables[index].lists = this.lists;
      } else {
        newData.dataTables[index].details[i] = 0;
      }
    }
    this.exciseService.setData({ ...data, newData });
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/ope06/12']);
  }

}
