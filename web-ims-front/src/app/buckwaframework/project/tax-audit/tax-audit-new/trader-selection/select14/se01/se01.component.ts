import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-se01',
  templateUrl: './se01.component.html',
  styleUrls: ['./se01.component.css']
})
export class Se01Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'ตรวจสอบการเลือกรายผู้ประกอบการ', route: '#' },    
    { label: 'รายที่เลือกของภาคที่ 1', route: '#' }
  ]
  dataSelect: any[] = [];
  datas: any = [
    {
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
    }
  ]
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initDatatable();
  }

  initDatatable(): void {
    //this.authService.reRenderVersionProgram('TAX-04000');
  }

}
