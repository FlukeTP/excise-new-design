import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

@Component({
  selector: 'app-plan03',
  templateUrl: './plan03.component.html',
  styleUrls: ['./plan03.component.css']
})
export class Plan03Component implements OnInit {
  breadcrumb: BreadCrumb[] =[
    { label: "แผนออกตรวจ", route: "#" },
    { label: "ผู้ประกอบการประจำปี", route: "#" },
    { label: "รายการโรงอุตสาหกรรมที่ถูกคัดเลือกทั้งหมด", route: "#" }
  ];
  // data: any = [];

  constructor() { }

  ngOnInit() {
    // this.data = [
    //   { nums: "2555-02487-0", name: "บริษัท สุโขทัย เอ็นเนอร์ยี่ จำกัด", area: "อยุธยา 1", centerCheck: "สูง",center:"",sab:"",subarea:"",mark:"" },
    //   { nums: "2551-01028-8", name: 3, area: 3, centerCheck: "สูง",center:"",sab:"",subarea:"",mark:"" },
    // ];
  }

}
