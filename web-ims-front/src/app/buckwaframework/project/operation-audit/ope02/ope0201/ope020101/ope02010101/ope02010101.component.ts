import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormControl } from '@angular/forms';

declare var $: any;

@Component({
     selector: 'app-ope02010101',
     templateUrl: './ope02010101.component.html'
})
export class Ope02010101Component {

     breadcrumb: BreadCrumb[] = [
          { label: "ตรวจปฏิบัติการ", route: "#" },
          { label: "น้ำมันหล่อลื่น", route: "#" },
          { label: "ผลการคัดกรอง", route: '#' }
     ]
     dataTables1: any = [];
     dataTables2: any = [];
    //  criteriaForm: FormGroup;
     criteriaForm: FormGroup = new FormGroup({
        number: new FormControl('3'),
        year: new FormControl('3')
      });

     constructor(private router: Router) { }

     ngOnInit() {
          $('.dropdown').dropdown();
          $("#selection").show();
          this.dataTables1 = [
               { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 2", progress: 45, dateCk: "01 มกราคม 2562", lengthCk: 1 },
               { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่นนทบุรี", progress: 28, dateCk: "02 มกราคม 2561", lengthCk: 2 },
               { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่สิงห์บุรี", progress: 85, dateCk: "01 มกราคม 2560", lengthCk: 3 },
               { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 1", progress: 15, dateCk: "03 มกราคม 2559", lengthCk: 4 },
               { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ปราจีนบุรี", progress: 50, dateCk: "04 มกราคม 2559", lengthCk: 4 },
          ];
          this.dataTables2 = [
               { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 1", progress: 15 },
               { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ปราจีนบุรี", progress: 50 },
               { name: "บริษัท เลาทัน ลูอัส (ประเทศไทย) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ฉะเชิงเทรา", progress: 25 },
               { name: "บริษัท ซี.เอ.พาร์ท จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่ร้อยเอ็ด", progress: 100 },
               { name: "บริษัท เกอร์ริ่ง(ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่ชัยภูมิ", progress: 10 },
               { name: "บริษัท อีมาส เอ็นเนอร์ยี่ เซอร์วิสเซส (ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่อุบลราชธานี", progress: 75 },
          ];
     }

     goBack() {
          this.router.navigate(['/ope02/01/01']);
     }

     goEdit() {
          this.router.navigate(['ope02/01/01/']);
     }

     validateField(something) {
          return false;
     }

     save(event) {

     }

}