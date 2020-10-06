import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/index';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';
declare var $ : any;

const URLS = {
  GET_DATA_HEAD: "ia/int11/01/findConcludeFollowHdr",
  GET_DETAIL_LIST: "ia/int11/01/findConcludeFollowHdrDetailList",
}

@Component({
  selector: 'app-int110501',
  templateUrl: './int110501.component.html',
  styleUrls: ['./int110501.component.css']
})
export class Int110501Component implements OnInit {
  name1;
  name2;
  riskList: any[];
  budgetYear: any;

  idHead: string;
  dataHead: any;
  detailList: any;
  datas: any = [];
  headerLineTwo : any;
  dateReceivingCon : any;


  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "รายงานผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
    { label: "รายละเอียดรายงานผลการปฏิบัติตามข้อเสนอแนะ", route: "#" }
  ];

  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.idHead = this.route.snapshot.queryParams["detailId"]
    this.getDataHead()
    this.name1 = "นาย กอ";
    this.name2 = "นาย ขอ";
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    $('#year').calendar({
      type: 'year',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
        this.changeYear(date.getFullYear() + 543);
      }
    }).calendar("set date",new Date())
  }

  ngAfterViewInit(){
    this.getDataList();
  }

  changeYear(year) {
    this.budgetYear = year;
    const URL = "combobox/controller/findByBudgetYear";
    this.ajax.post(URL, { budgetYear: this.budgetYear }, res => {
      this.riskList = res.json();
    });
  }

  getDataHead() {
    this.ajax.doGet(`${URLS.GET_DATA_HEAD}/${this.idHead}`).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.dataHead = result.data;
        this.dateReceivingCon =  new DateStringPipe().transform(this.dataHead.dateReceiving, false)     
        if( this.dataHead.inspectionWork == 3){
          this.headerLineTwo = this.dataHead.projectName;
        }else if(this.dataHead.inspectionWork == 4 ){
          this.headerLineTwo = this.dataHead.systemName;
        }else if(this.dataHead.inspectionWork == 5){
          this.headerLineTwo = this.dataHead.sector;
        }
        console.log("DataHead : ",this.dataHead);
      } else {
        this.messageBar.errorModal(result.message);
      }
    })
  }

  getDataList() {
    const url = "ia/int11/02/iaConcludeFollowDetail"
    this.ajax.doPost(url, {
      "id": this.idHead
    }).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
    })
  }

  routeTo(parth: string, fontEditId: number) {
    this.router.navigate([parth], {
      queryParams: {
        editId: fontEditId,
        detailId : this.idHead
      }
    })
  }
}

