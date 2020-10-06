import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';

declare var $: any;
@Component({
  selector: 'app-int1102',
  templateUrl: './int1102.component.html',
  styleUrls: ['./int1102.component.css']
})
export class INT1102Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "รายงานผลการตรวจสอบการปฏิบัติงาน", route: "#" }
  ];

  dropdownRisk: any[] = [];
  tableMock: any = [];
  datas: any = [];
  dataheader_type: any;
  yearhead: any;
  headerLineOne: any;
  dateFromhead: any;
  dateTohead: any;
  id: any;
  sendForm: FormGroup;

  constructor(
    private ajaxService: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private router: Router
  ) {
    this.sendForm = this.fb.group({
      notation: ["", Validators.required],
      checkStatus: ["", Validators.required],
      approveDate: ["", Validators.required],
      id: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["idHdr"];
    console.log("id", this.id);
    this.calendar();
    this.dataMock();
    this.getDataListHead();
  }

  ngAfterViewInit() {
    this.getDataList();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    setTimeout(() => {
      $('#risk').dropdown('set selected', '1');
    }, 200);
  }

  getDataList() {
    const url = "ia/int11/02/iaConcludeFollowDetail"
    this.ajaxService.doPost(url, {
      "id": this.id
    }).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
    })
  }

  getDataListHead() {
    const url = "ia/int11/02/iaConFolDetail"
    this.ajaxService.doPost(url, {
      "id": this.id
    }).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList :", res.data);
      this.dataheader_type = res.data[0].checkType;
      this.yearhead = res.data[0].budgetYear;
      if(res.data[0].inspectionWork == 3){
        this.headerLineOne = res.data[0].projectName;
      }else if(res.data[0].inspectionWork == 4){
        this.headerLineOne = res.data[0].systemName;
      }else if(res.data[0].inspectionWork == 5){
        this.headerLineOne = res.data[0].sector;
      }
      
      var dateFromheadto = res.data[0].dateFrom;
      this.dateFromhead = new DateStringPipe().transform(dateFromheadto, false)
      var dateToheadto = res.data[0].dateTo;
      this.dateTohead = new DateStringPipe().transform(dateToheadto, false)
    })
  }

  calendar() {
    $("#budgetyearCld").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        // get value
      }
    }).calendar("set date", '2018')
  }

  sendpass() {
    this.messageBarService.comfirm((comfirm) => {
      if (comfirm) {
        this.sendForm.patchValue({
          checkStatus: "ผ่าน",
          approveDate: new Date(),
          id: this.id
        })
        var URL = "ia/int11/02/updateCheckStatus";
        this.ajaxService.doPost(URL, this.sendForm.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBarService.successModal(res.message)
          } else {
            this.messageBarService.errorModal(res.message)
          }
        })
        console.log("sendForm : ", this.sendForm.value);
      }
    }, "ยืนยันการอนุมติ")

  }
  sendfail() {
    this.messageBarService.comfirm((comfirm) => {
      if (comfirm) {
        this.sendForm.patchValue({
          checkStatus: "ไม่ผ่าน",
          approveDate: new Date(),
          id: this.id
        })
        var URL = "ia/int11/02/updateCheckStatus";
        this.ajaxService.doPost(URL, this.sendForm.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBarService.successModal(res.message)
          } else {
            this.messageBarService.errorModal(res.message)
          }
        })
        console.log("sendForm : ", this.sendForm.value);
      }
    }, "ยืนยันการปฎิเสธ")
  }


  dataMock() {
    this.tableMock = [
      { no: "1", issues: "ตรวจสอบรายได้", comment: "" },
      { no: "1.1", issues: "การตรวจสอบใบเสร็จเสีย", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.2", issues: "ติดตามผลการตรวจสอบ", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.3", issues: "การตรวจสอบการนำเงินฝากเข้าบัญชีพักหน่วยงานและกองทุน", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.4", issues: "รายงานผลการตรวจสอบ", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.5", issues: "ตรวจสอบใบเสร็จรับเงินภาษีสรรพสามิต", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.6", issues: "ตรวจสอบใบอนุญาต", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.7", issues: "ตรวจสอบใบเสร็จค่าปรับเปรียบเทียบคดี", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.8", issues: "ตรวจสอบการนำฝาก/ส่งเงินรายได้", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.9", issues: "ตรวจสอบงบสรุปยอดเงินค่าภาษีกับงบทดลอง", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.10", issues: "ตรวจสอบสถิติการชำระภาษีของผู้ประกอบการ", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.11", issues: "ตรวจสอบสถิติการต่ออายุใบอนุญาต", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.12", issues: "ตรวจสอบสถิติการพิมพ์ใบอนุญาตซ้ำ", comment: "สิ่งที่ควรจะเป็น" },
      { no: "1.13", issues: "รายงานตัดปีงบประมาณเงินผลประโยชน์", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2", issues: "ตรวจสอบรายได้", comment: "" },
      { no: "2.1", issues: "ตรวจสอบแสตมป์", comment: "" },
      { no: "2.1.1", issues: "ตรวจสอบแสตมป์", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.1.2", issues: "งบเดือนการรับ-จ่ายแสตมป์", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.1.3", issues: "บัญชีคุมการรับ-จ่ายแสตมป์", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.2", issues: "ตรวจสอบสินทรัพย์", comment: "" },
      { no: "2.2.1", issues: "ตรวจสอบสินทรัพย์แบบอัพโหลด", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.2.2", issues: "ตรวจสอบสินทรัพย์แบบเพิ่มข้อมูล", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.2.3", issues: "บันทึกข้อมูลสินทรัพย์", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.3", issues: "ตรวจสอบจัดซื้อจัดจ้าง", comment: "" },
      { no: "2.3.1", issues: "ตรวจสอบผลการจัดซื้อจัดจ้าง", comment: "สิ่งที่ควรจะเป็น" },
      { no: "2.3.2", issues: "บันทึกผลการจัดซื้อจัดจ้าง", comment: "สิ่งที่ควรจะเป็น" },
    ]
  };

}
