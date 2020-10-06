import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-select04',
  templateUrl: './select04.component.html',
  styleUrls: ['./select04.component.css']
})
export class Select04Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'รับกระดาษทำการคัดเลือกราย (ภาค/พื้นที่)', route: '#' }
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
    },
    {
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

  selectCheckbox(event, data, id) {
    var data_push = {
      data: data,
      id: id
    }

    if (event.currentTarget.checked) {
      this.dataSelect.push(data_push);
    } else {
      this.dataSelect.splice(this.dataSelect.map((e) => { return e.id }).indexOf(id), 1);
    }
  }

  get toggle() { return true; }
  
}
