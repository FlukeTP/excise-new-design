import { Component, OnInit } from "@angular/core";
import { BreadCrumb, ResponseData } from "models/index";
import { TextDateTH, formatter } from "helpers/index";
import { AjaxService } from "services/ajax.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
declare var $: any;
const URLS = {
  GET_DATA_HEAD: "ia/int11/01/findConcludeFollowHdr",
  GET_DETAIL_LIST: "ia/int11/01/findConcludeFollowHdrDetailList",
}

@Component({
  selector: "app-int1101",
  templateUrl: "./int1101.component.html",
  styleUrls: ["./int1101.component.css"]
})
export class INT1101Component implements OnInit {
  riskList: any[];
  riskType: any;
  budgetYear: any;
  idHead: string;
  dataHead: any;
  detailList: any;
  headerLineTwo:any;
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" },
    { label: "สรุปผลการตรวจสอบภายใน", route: "#" }
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
    this.getDataList()
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");

    $("#year")
      .calendar({
        type: "year",
        initialDate: new Date(),
        text: TextDateTH,
        formatter: formatter("ป"),
        onChange: date => {
          //console.log(date.getFullYear())
          this.changeYear(date.getFullYear() + 543);
        }
      })
      .calendar("set date", new Date());
  }

  ngAfterViewInit() {
    $("#example").DataTableTh({
      lengthChange: false,
      serverSide: false,
      searching: false,
      processing: false,
      ordering: false,
      scrollX: true,
      paging: false
    });
  }

  changeYear(year) {
    this.budgetYear = year;
    //console.log(this.budgetYear);
    const URL = "combobox/controller/findByBudgetYear";
    this.ajax.post(URL, { budgetYear: this.budgetYear }, res => {
      this.riskList = res.json();
      //console.log(this.riskList);
    });
  }

  getDataHead() {
    this.ajax.doGet(`${URLS.GET_DATA_HEAD}/${this.idHead}`).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.dataHead = result.data;
        console.log(this.dataHead);
        if( this.dataHead.inspectionWork == 3){
          this.headerLineTwo = this.dataHead.projectName;
        }else if(this.dataHead.inspectionWork == 4 ){
          this.headerLineTwo = this.dataHead.systemName;
        }else if(this.dataHead.inspectionWork == 5){
          this.headerLineTwo = this.dataHead.sector;
        }
      } else {
        this.messageBar.errorModal(result.message);
      }
    })
  }

  getDataList() {
    this.ajax.doGet(`${URLS.GET_DETAIL_LIST}/${this.idHead}`).subscribe((result: any) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.detailList = result.data;
        console.log(this.detailList);

      } else {
        this.messageBar.errorModal(result.message);
      }
    })
  }
  goLocation() {

  }

  sentLeader() {
    var sendStatusTo = "Sent"
    this.messageBar.comfirm((comfirm) => {
      if (comfirm) {
        var URL = "ia/int11/01/updateSentStatus";
        this.ajax.doPost(URL, {
          "id": this.idHead,
          "sendStatus": sendStatusTo
        }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการส่งอธิบดีกรมสรรพสามิต")
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
