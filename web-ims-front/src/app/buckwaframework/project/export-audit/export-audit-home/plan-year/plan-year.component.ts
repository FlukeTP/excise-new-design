import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from "models/index";
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan-year',
  templateUrl: './plan-year.component.html',
  styleUrls: ['./plan-year.component.css']
})
export class PlanYearComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจส่งออก", route: "#" },
    { label: "กลุ่มเสี่ยง", route: "#" }
  ];
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onClick(param: any) {
    // console.log(param);
    this.router.navigate(['/export-audit-home/operator-details'], {
      queryParams: {
        excise_id: param.excise_id,
        company_name: param.company_name,
        building_name: param.building_name,
        room_number: param.room_number,
        floor: param.floor,
        village: param.village,
        number: param.number,
        village_number: param.village_number,
        by_way: param.by_way,
        street: param.street,
        tambol: param.tambol,
        district: param.district,
        province: param.province,
        zip_code: param.zip_code,
        tel: param.tel,
        email: param.email
      }
    });
  }

}
