import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-operator-details',
  templateUrl: './operator-details.component.html',
  styleUrls: ['./operator-details.component.css']
})
export class OperatorDetailsComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจส่งออก", route: "#" },
    { label: "กลุ่มเสี่ยง", route: "#" }
  ];
  excise_id: any;
  company_name: any;
  building_name: any;
  room_number: any;
  floor: any;
  village: any;
  number: any;
  village_number: any;
  by_way: any;
  street: any;
  tambol: any;
  district: any;
  province: any;
  zip_code: any;
  tel: any;
  email: any;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.excise_id = this.route.snapshot.queryParams["excise_id"];
    this.company_name = this.route.snapshot.queryParams["company_name"];
    this.building_name = this.route.snapshot.queryParams["building_name"],
    this.room_number = this.route.snapshot.queryParams["room_number"],
    this.floor = this.route.snapshot.queryParams["floor"],
    this.village = this.route.snapshot.queryParams["village"],
    this.number = this.route.snapshot.queryParams["number"],
    this.village_number = this.route.snapshot.queryParams["village_number"],
    this.by_way = this.route.snapshot.queryParams["by_way"],
    this.street = this.route.snapshot.queryParams["street"],
    this.tambol = this.route.snapshot.queryParams["tambol"],
    this.district = this.route.snapshot.queryParams["district"],
    this.province = this.route.snapshot.queryParams["province"],
    this.zip_code = this.route.snapshot.queryParams["zip_code"],
    this.tel = this.route.snapshot.queryParams["tel"],
    this.email = this.route.snapshot.queryParams["email"]
    
    $('.dropdown').dropdown();
  }

}
