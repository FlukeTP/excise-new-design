import { Component, OnInit } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { BreadCrumb } from 'models/breadcrumb.model';

declare var $: any;
@Component({
  selector: 'app-int061001',
  templateUrl: './int061001.component.html',
  styleUrls: ['./int061001.component.css']
})

export class Int061001Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ออกตรวจ", route: "#" },
    { label: "ตรวจสอบรายได้ ", route: "#" },
    { label: "ตรวจสอบงบสรุปยอดเงินค่าภาษีกับงบทดลอง ", route: "#" },
    { label: "ตั้งค่าจับคู่รหัสภาษี", route: "#" },
  ];

  listConfig: ConfigMapping[] = [
    {
      accountDes: "รายได้ภาษีสุรา",
      accountNo: "4102020103",
      configId: 0,
      taxCode: "203010",
      taxDes: "ภาษีสุรา"
    }
  ];

  constructor(private messageBarService: MessageBarService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {


  }


}

interface ConfigMapping {
  accountNo: string,
  accountDes: string,
  taxCode: string,
  taxDes: string,
  configId: number
}
