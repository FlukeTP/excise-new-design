import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope040101',
  templateUrl: './ope040101.component.html',
  styleUrls: ['./ope040101.component.css']
})
export class Ope040101Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "คัดเลือกรายจากการคัดกรอง", route: "#" },
  ];
  dataTables1: any = [];
  dataTables2: any = [];
  constructor(private router: Router) { }

  ngOnInit() {
    $('.dropdown').dropdown();
    $("#selection").show();
    this.dataTables1 = [
      { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงราย", progress: 45, dateCk: "01 มกราคม 2562", lengthCk: 1 },
      { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่พะเยา", progress: 28, dateCk: "02 มกราคม 2561", lengthCk: 2 },
      { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่ลำปาง", progress: 85, dateCk: "01 มกราคม 2560", lengthCk: 3 },
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่แพร่", progress: 15, dateCk: "03 มกราคม 2559", lengthCk: 4 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงใหม่", progress: 50, dateCk: "04 มกราคม 2559", lengthCk: 4 },
    ];
    this.dataTables2 = [
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงราย", progress: 15 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่พะเยา", progress: 50 },
      { name: "บริษัท เลาทัน ลูอัส (ประเทศไทย) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่ลำปาง", progress: 25 },
      { name: "บริษัท ซี.เอ.พาร์ท จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่แพร่", progress: 100 },
      { name: "บริษัท เกอร์ริ่ง(ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงใหม่", progress: 10 },
      { name: "บริษัท อีมาส เอ็นเนอร์ยี่ เซอร์วิสเซส (ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 5", subArea: "สำนักงานสรรพสามิตพื้นที่เชียงใหม่", progress: 75 },
    ];
  }

  goBack() {
    this.router.navigate(['/ope04/01/'],{
      queryParams: {
        to: "DETAIL"
      }
    });
  }

  goEdit() {
    this.router.navigate(['/ope04/01/01/01']);
  }

  goPlan() {
    this.router.navigate(['/ope04/01/']);
  }


}
