import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AjaxService } from "../../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { BaseModel, ManageReq, BreadCrumb } from 'models/index';
import { Int02m51Service } from "projects/internal-audit/int02/int02-m5/int02-m5-1/int02-m5-1.service";
import { promise } from "protractor";
import { TextDateTH, formatter } from "helpers/datepicker";
var jQuery: any;
declare var jQuery: any;
declare var $: any;

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  DATA_WS: "ia/int018/exciseWebService8020"
};


@Component({
  selector: "app-int02-m5-1",
  templateUrl: "./int02-m5-1.component.html",
  styleUrls: ["./int02-m5-1.component.css"],
  providers: [Int02m51Service]
})
export class Int02M51Component implements OnInit, OnDestroy {

  private SECTOR_VALUE: string = 'SECTOR_VALUE';
  subSectionName: any;
  endDate: any;
  code1: any = '00';
  code2: any = '00';
  code3: any = '00';

  // BreadCrumb
  breadcrumb: BreadCrumb[];
  sectorList: any;
  areaList: any;
  localList: any;
  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;
  sector: string;
  area: string;
  local: string;
  date: string;
  comboboxType: string = 'SECTOR_VALUE';
  startDatePic: any;
  endDatePic: any;
  listWs8020List: any[];
  pageWs8020List: any[];
  pagesize: number = 1000;
  sectorSelectted: any;
  areaSelectted: any;
  localSelectted: any;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBarService: MessageBarService,
    private int02m51Service: Int02m51Service
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ระบบควบคุมภายใน", route: "#" },
      { label: "แบบประเมินระบบควบคุมภายใน", route: "#" },
    ];
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.hideData();
    this.travelTo1Dropdown();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");

    $("#budgetyear").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.date = text;

      }

    });
  }
  hideData() {
    $('#data').hide();
  }

  showData() {
    $('#data').show();
  }

  travelTo1Dropdown = () => {
    this.ajax.post(URL.DROPDOWN, { type: this.comboboxType }, res => {
      this.travelTo1List = res.json();
    });
  }

  travelTo2Dropdown = e => {
    this.area = '00';
    this.local = '00';
    var id = e.target.value;
    if (id != "") {
      this.ajax.post(URL.DROPDOWN, { type: this.comboboxType, lovIdMaster: id }, res => {
        this.travelTo2List = res.json();
        this.travelTo3List = [];
      });
    }
  }

  travelTo3Dropdown = e => {
    this.local = '00';
    var id = e.target.value;
    if (id != "") {
      this.ajax.post(URL.DROPDOWN, { type: this.comboboxType, lovIdMaster: id }, res => {
        this.travelTo3List = res.json();
      });
    }
  }


  searchWs() {
    let ofCode = this.getOfCode(this.code1, this.code2, this.code3);


    if (ofCode == '000000') {
      this.messageBarService.errorModal('กรุณาเลือกภาคพื่นที่', 'แจ้งเตือน');
      return;

    }

    if (this.date == null || this.date == undefined || this.date == '') {
      this.messageBarService.errorModal('กรุณาเลือกปีงบประมาณ', 'แจ้งเตือน');
      return;
    }


    this.router.navigate(["/int02/m5/1/2"], {
      queryParams: {
        officeCode: ofCode,
        budgetyear: this.date

      }
    });


  }



  getOfCode(code1, code2, code3) {
    //console.log(code1);
    let ofCode = "";
    if (code1 == '00') {
      ofCode += '00';
    } else {
      for (let index = 0; index < this.travelTo1List.length; index++) {
        const element = this.travelTo1List[index];
        if (element.lovId == code1) {
          ofCode += element.subType;
        }
      }


    }
    //console.log(code2);
    if (code2 == '00') {
      ofCode += '00';
    } else {
      for (let index = 0; index < this.travelTo2List.length; index++) {
        const element = this.travelTo2List[index];
        if (element.lovId == code2) {
          ofCode += element.subType;
        }
      }
    }
    //console.log(code3);
    if (code3 == '00') {
      ofCode += '00';
    } else {
      for (let index = 0; index < this.travelTo3List.length; index++) {
        const element = this.travelTo3List[index];
        if (element.lovId == code3) {
          ofCode += element.subType;
        }
      }
    }
    //console.log(ofCode);
    return ofCode;

  }




}
