import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { Location } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-select12',
  templateUrl: './select12.component.html',
  styleUrls: ['./select12.component.css']
})
export class Select12Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'ผลการคัดเลือกราย', route: '#' },
    { label: 'กำหนดเงื่อนไขเพื่อวิเคราะห์ความเสี่ยง', route: '#' }
  ];
  datas: any

  constructor(
    private _location: Location
  ) {
    this.datas = [
      {
        data0: "1",
        data1: "0105546059141-3-001",
        data2: "บริษัท นิสสัน มอเตอร์ เอเชีย แปซิฟิค จำกัด",
        data3: "บริษัท นิสสัน มอเตอร์ เอเชีย แปซิฟิค จำกัด",
        data4: "ภาคที่ 1",
        data5: "ชัยนาท",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "0%",
        data10: "0",
      },
      {
        data0: "2",
        data1: "0107548000650-3-001",
        data2: "บริษัท สยามแก๊ส แอนด์ ปิโตรเคมีคัลส์ จำกัด (มหาชน)",
        data3: "บริษัท สยามแก๊ส แอนด์ ปิโตรเคมีคัลส์ จำกัด (มหาชน)",
        data4: "ภาคที่ 1",
        data5: "ชัยนาท",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "0%",
        data10: "0",
      },
      {
        data0: "3",
        data1: "0105544074771-3-001",
        data2: "บริษัท ยูชิน พรีซิชั่น อีควิปเม้นท์ (ประเทศไทย) จำกัด",
        data3: "บริษัท ยูชิน พรีซิชั่น อีควิปเม้นท์ (ประเทศไทย) จำกัด",
        data4: "ภาคที่ 1",
        data5: "นนทบุรี",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "0%",
        data10: "0",
      },
      {
        data0: "4",
        data1: "0100515042462-3-002",
        data2: "บริษัท เชลล์แห่งประเทศไทย จำกัด",
        data3: "บริษัท เชลล์แห่งประเทศไทย จำกัด",
        data4: "ภาคที่ 1",
        data5: "ปทุมธานี 1",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "100%",
        data10: "4",
      },
      {
        data0: "5",
        data1: "0115557008780-1-001",
        data2: "บริษัท เอเค เมคานิคอล แอนด์ รีไซคลิง จำกัด",
        data3: "บริษัท เอเค เมคานิคอล แอนด์ รีไซคลิง จำกัด",
        data4: "ภาคที่ 2",
        data5: "นครนายก",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "50%",
        data10: "5",
      },
      {
        data0: "6",
        data1: "0125553011034-1-001",
        data2: "บริษัท เจ เอส ซี โกลบอล (ไทยแลนด์) จำกัด",
        data3: "บริษัท เจ เอส ซี โกลบอล (ไทยแลนด์) จำกัด",
        data4: "ภาคที่ 2",
        data5: "ปราจีนบุรี",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "60%",
        data10: "4",
      },
      {
        data0: "7",
        data1: "0107544000108-1-004",
        data2: "บริษัท ปตท. จำกัด (มหาชน)",
        data3: "บริษัท ปตท. จำกัด (มหาชน)",
        data4: "ภาคที่ 2",
        data5: "ชลบุรี 1",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "0%",
        data10: "0",
      },
      {
        data0: "8",
        data1: "0105548015451-3-001",
        data2: "บริษัท สยามมิชลิน จำกัด",
        data3: "บริษัท สยามมิชลิน จำกัด",
        data4: "ภาคที่ 2",
        data5: "สมุทรปราการ 1",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "75%",
        data10: "7",
      },
      {
        data0: "9",
        data1: "0135546001045-3-001",
        data2: "บริษัท ริกค์ เทคโนโลยี (ประเทศไทย) จำกัด",
        data3: "บริษัท ริกค์ เทคโนโลยี (ประเทศไทย) จำกัด",
        data4: "ภาคที่ 2",
        data5: "ฉะเชิงเทรา",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "35%",
        data10: "2",
      },
      {
        data0: "10",
        data1: "0107537000416-3-001",
        data2: "บริษัท ฝาจีบ จำกัด (มหาชน)",
        data3: "บริษัท ฝาจีบ จำกัด (มหาชน)",
        data4: "ภาคที่ 2",
        data5: "ปราจีนบุรี",
        data6: "0",
        data7: "0",
        data8: "0",
        data9: "100%",
        data10: "6",
      },
    ]
  }

  ngOnInit() {

  }

  goBack() {
    this._location.back();
  }

  callModal() {
    $('#send').modal('show');
  }
}
