import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { ExciseService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-ope041104',
  templateUrl: './ope041104.component.html',
  styleUrls: ['./ope041104.component.css']
})
export class Ope041104Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "เลือกผู้ออกตรวจ", route: "#" }
  ];
  copLists: BreadCrumb[] = [];
  dateFrom: string = "";
  dateTo: string = "";
  lists: string[] = [];
  employees1: string[] = [];
  employees2: string[] = [];
  constructor(
    private router: Router,
    private exciseService: ExciseService
  ) {
    this.employees1 = [
      "นาย อาทิตย์ แก่นใจ"
    ];
    this.employees2 = [
      "ดร. ธีรวุฒิ กุลธิชัย",
      "รศ.ดร. เอกลักษณ์ อัมพุธ",
      "ว่าที่ร้อยตรี ธนพนธ์ โป่งมณี"
    ];
  }

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
    this.back();
  }

  save() {
    this.router.navigate(['/ope04/11/01']);
  }

  back() {
    this.router.navigate(['/ope04/11/01'],{
      queryParams: {
        to: "DETAIL"
      }
    });
  }

}
