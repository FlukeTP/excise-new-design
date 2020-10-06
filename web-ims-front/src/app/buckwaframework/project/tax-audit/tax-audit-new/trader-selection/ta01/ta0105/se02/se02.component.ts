import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'app/buckwaframework/common/models/index';
import { TextDateTH } from 'app/buckwaframework/common/helper/datepicker';

declare var $: any;

@Component({
  selector: 'app-se02',
  templateUrl: './se02.component.html',
  styleUrls: ['./se02.component.css']
})
export class Se02Component implements OnInit {

  toggle: boolean = false;
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การคัดเลือกราย', route: '#' },
    { label: 'รายชื่อผู้ประกอบการที่คัดเลือก', route: '#' },
    { label: 'คัดเลือกรายนอกรายการ', route: '#' }
  ]

  datas: any = [

    {
      data1: "0105514003654-1-001",
      data2: "บริษัท แลคตาซอย จำกัด",
      data3: "บริษัท แลคตาซอย จำกัด ",
      data4: "ภาค 2",
      data5: "ปราจีนบุรี",
      data6: "12,000.00",
      data7: "8,000.00",
      data8: "-33.33",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "38/6 หมู่ 5 ถ.สุขุมวิท ต.ทุ่งสุขลา อ.ศรีราชา จ.ชลบุรี 20230",
      data12: "4,000.00",
      data13: "4,000.00",
      data14: "4,000.00",
      data15: "4,000.00",
      data16: "4,000.00",
      data17: "-",
      data18: "5",
    },
    {
      data1: "0105531025482-1-001",
      data2: "บริษัท ชินตร์ ชินตร์ จำกัด",
      data3: "บริษัท ชินตร์ ชินตร์ จำกัด",
      data4: "ภาค 1",
      data5: "นนทบุรี",
      data6: "167,620.32",
      data7: "109,620.00",
      data8: "-34.60",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "168 หมู่ที่ 7 ต.ลำโพ อ.บางบัวทอง จ.นนทบุรี 11110",
      data12: "56,462.40",
      data13: "40,252.32",
      data14: "70,905.60",
      data15: "-",
      data16: "53,532.00",
      data17: "56,088.00",
      data18: "5",
    },
    {
      data1: "0105532076862-1-001",
      data2: "บริษัท ทรอปิคอล ฟู้ด อินดัสตรีส์ จำกัด",
      data3: "บริษัท ทรอปิคอล ฟู้ด อินดัสตรีส์ จำกัด",
      data4: "ภาค 10",
      data5: "พท.3",
      data6: "4,320.34",
      data7: "2,974.24",
      data8: "-31.16",
      data9: "5",
      data10: "เครื่องดื่ม",
      data11: "221 ซ.พัฒนาการ 53 ต.สวนหลวง อ.สวนหลวง จ.กรุงเทพมหานคร 10250",
      data12: "1,461.48",
      data13: "1,410.20",
      data14: "1,448.66",
      data15: "-",
      data16: "1,499.94",
      data17: "1,474.30",
      data18: "5",
    },

  ]

  month: any;
  formatter1: any;
  formatter2: any;
  selectedStartMonth: any;
  selectedSEndMonth: any;
  selectStartDateObj: any;
  selectEndDateObj: any;
  txtHead: string;
  txt: string;
  constructor() { }

  ngOnInit() {
    $("#calendar").calendar({
      endCalendar: $("#calendar1"),
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter1,
      onChange: (date) => {
        this.selectedStartMonth = date.getMonth();
        this.selectStartDateObj = date;
      }
    });
    $("#calendar1").calendar({
      startCalendar: $("#calendar"),
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: this.formatter2,
      onChange: (date) => {
        this.selectedSEndMonth = date.getMonth();
        this.selectEndDateObj = date;
      }
    });
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 1 : months + 1;
  }
  search() { }

  changeHandler(e) {
    console.log("Call function deleteForm()")
    if (Number(e.target.value) > 100) {
      e.target.value = 100
    }
  }

  showDetail = (risk) => {
    console.log("risk : ", risk)
    $("#riskModal").modal({
      onShow: () => {
        if ('4' === risk) {
          this.txtHead = 'ผู้เสียภาษีที่มีแนวโน้มการชำระภาษีผิดปกติ มีรายละเอียดดังนี้'
          this.txt = `4) ผู้ประกอบการที่ชำระภาษีไม่สม่ำเสมอในช่วงเวลาที่กำหนด และมีอัตราการชำระภาษีครึ่งหลังเพิ่มขึ้นมากกว่าร้อยละ
20 เทียบกับครึ่งแรก`
        } else if ('5' === risk) {
          this.txtHead = 'ผู้เสียภาษีที่มีแนวโน้มการชำระภาษีผิดปกติ มีรายละเอียดดังนี้'
          this.txt = `5) ผู้ประกอบการที่ชำระภาษีไม่สม่ำเสมอในช่วงเวลาที่กำหนด และมีอัตราการชำระภาษีครึ่งหลังเพิ่มขึ้นไม่เกินร้อยละ 5 
หรือชำระภาษีลดลง เทียบกับครึ่งแรก`

        }

        $("#txt").html(this.txt);
      }, onDeny: () => {
        // this.txt='';
      }
    }).modal('show')
  }
}
