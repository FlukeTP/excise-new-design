import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { copHomeOils } from '../ope03.component';

declare var $: any;

@Component({
  selector: 'app-ope0301',
  templateUrl: './ope0301.component.html',
  styleUrls: ['./ope0301.component.css']
})
export class Ope0301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "โรงงานอุตสาหกรรม", route: "/ope03/" },
    { label: "ข้อมูลผู้ประกอบการโรงงานอุตสาหกรรม", route: "#" }
  ];
  lists: BreadCrumb[] = copHomeOils;
  details: DetailOil[] = [
    {
      seq: 1, fullname: 'คุณสุพัตรา ผ่อนจัตุรัส', companyname: 'บริษัท เอนเนอจี อินโนเวชั่น เทคโนโลยี จำกัด',
      address: '191/4-8 ถ.ประสาทวิถี ต.แม่สอด อ.แม่สอด', typename: 'ผู้ใช้งาน', certificateId: 1
    },
    {
      seq: 2, fullname: 'คุณชัยพร จันทร์วิไลนคร', companyname: 'ห้างหุ้นส่วนจำกัด ซี.เอ็ม.อินเตอร์ แพ็ค',
      address: '22/2 ถ.เหมืองทิต ต.ในเวียง อ.เมือง จ.แพร่ 54000', typename: 'ผู้ใช้งาน', certificateId: 0
    },
    {
      seq: 3, fullname: 'คุณเสรี เจนวานิชกุล', companyname: 'บริษัท ไทย เทรดดิ้ง ออยล์ (1990) จำกัด',
      address: '269 ม.2 ต.หนองไผ่ อ.ชุมแพ จ.ขอนแก่น', typename: 'ผู้ประกอบการ', certificateId: 0
    },
  ];
  constructor(
    private router: Router,
    private _location: Location
  ) { }

  ngOnInit() {
    this.hineData();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  showData() {
    $("#data").show();
  }

  hineData() {
    $("#data").hide();
  }

  goBack() {
    this.router.navigate(['/ope03/']);
  }

  linkTo(id) {
    this.router.navigate(
      ['/ope03/01/02']
    )
  }

  async toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }
}

interface DetailOil {
  seq: number;
  fullname: string;
  companyname: string;
  address: string;
  typename: string;
  certificateId?: number;
}
