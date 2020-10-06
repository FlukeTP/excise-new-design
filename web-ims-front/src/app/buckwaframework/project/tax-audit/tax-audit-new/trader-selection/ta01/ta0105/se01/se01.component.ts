import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'app/buckwaframework/common/models/index';
declare var $: any;
@Component({
  selector: 'app-se01',
  templateUrl: './se01.component.html',
  styleUrls: ['./se01.component.css']
})
export class Se01Component implements OnInit {

  toggle: boolean = false;
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'รายชื่อผู้ประกอบการที่คัดเลือก', route: '#' },
    { label: 'คัดเลือกรายจากรายการ', route: '#' }
  ]
  txtHead: string;
  txt: string;

  datas: any = [
    {
      data1: "0105546080051-1-001",
      data2: "บริษัท แบรนด์ ซันโทรี่ (ประเทศไทย) จำกัด",
      data3: "บริษัท แบรนด์ ซันโทรี่ (ประเทศไทย) จำกัด ",
      data4: "ภาค 2",
      data5: "ชลบุรี 2",
      data6: "1,989.06",
      data7: "2,068.60",
      data8: "4.00",
      data9: "3",
      data10: "เครื่องดื่ม",
      data11: "38/6 หมู่ 5 ถ.สุขุมวิท ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230",
      data12: "1,989.06",
      data13: "-",
      data14: "-",
      data15: "-",
      data16: "670.90",
      data17: "1,397.70",
      data18: "2",
    },

  ]

  constructor() { }

  ngOnInit() {
  }

  showDetail = (risk) => {
    $("#riskModal").modal({
      onShow: () => {
        this.txtHead = 'ผู้เสียภาษีที่มีแนวโน้มการชำระภาษีผิดปกติ มีรายละเอียดดังนี้'
        this.txt = `4) ผู้ประกอบการที่ชำระภาษีไม่สม่ำเสมอในช่วงเวลาที่กำหนด และมีอัตราการชำระภาษีครึ่งหลังเพิ่มขึ้นมากกว่าร้อยละ
20 เทียบกับครึ่งแรก`

        $("#txt").html(this.txt);
      }, onDeny: () => {
        // this.txt='';
      }
    }).modal('show')
  }
}
