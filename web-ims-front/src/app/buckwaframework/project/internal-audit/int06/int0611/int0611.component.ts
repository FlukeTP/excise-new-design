import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../../common/helper";
import { AjaxService, MessageBarService, AuthService } from "../../../../common/services";
import { Router, ActivatedRoute } from "@angular/router";
import { monthsToNumber } from "helpers/datepicker";
import { BreadCrumb } from 'models/index';

declare var $: any;const URL = {
  export:"/ia/int0151/exportFile"
}
@Component({
  selector: 'app-int0611',
  templateUrl: './int0611.component.html',
  styleUrls: ['./int0611.component.css']
})
export class Int0611Component implements OnInit {

  dataT: any[]= [];
  loading: boolean = false;

  stringColumns: any;

  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;

  trHtml1: any[] = [];
  trHtml2: any[] = [];

  yearForm: any=0;
  yearTo: any=0;

  monthForm: any=0;
  monthTo: any=0;

  officeCode: any;
  yearMonthFrom: any;
  yearMonthTo: any;
  dateType: any;
  pageNo: any;
  dataPerPage: any;
  
  breadcrumb: BreadCrumb[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    
private authService: AuthService
  ) { 
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบรายได้", route: "#" },
      { label: "ตรวจสอบสถิติการชำระภาษีของผู้ประกอบการ", route: "#" }
    ];
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-01510');
    this.calenda();
    this.travelTo1Dropdown();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  ngAfterViewInit() {
  }


  initDatatable() {

  }
  calenda = () => {
    $("#date1").calendar({
      endCalendar: $("#date2"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('ดป')

    });
    $("#date2").calendar({
      startCalendar: $("#date1"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('ดป')

    });
  }

  clickClear = function () {
    $("#searchFlag").val("FALSE");
    $('input[type=text]').val("");
    $('select').val("");
    $('input[type=calendar]').val("");
  }

 getdata = () =>{
  this.loading = true;

  this.officeCode="000300";
  this.yearMonthFrom=(parseInt($("#dateIn1").val().split(" ")[1])-543).toString()+monthsToNumber($("#dateIn1").val().split(" ")[0]);
  this.yearMonthTo=(parseInt($("#dateIn2").val().split(" ")[1])-543).toString()+monthsToNumber($("#dateIn2").val().split(" ")[0]);
  this.dateType="Income";
	this.pageNo="1";
  this.dataPerPage="100";

  this.dataT= [];
  const URL = "ia/int0151/list";
      this.ajax.post(URL, { 
        officeCode:this.officeCode,
        yearMonthFrom:this.yearMonthFrom,
        yearMonthTo:this.yearMonthTo,
        dateType:this.dateType,
        pageNo: this.pageNo,
        dataPerPage: this.dataPerPage
      }, async res => {
        const licenseList8020List = await res.json();

        setTimeout(() => {
          this.loading = false;
        },200);
        
      licenseList8020List.forEach(element => {
        this.dataT.push(element);
      });
      console.log("dataT : ",this.dataT);
      });
 }
  createTrAndDataTable = async () => {

    this.yearForm = await parseInt($("#dateIn1").val().split(" ")[1]);
    this.yearTo = await parseInt($("#dateIn2").val().split(" ")[1]);
    var yearNo = await this.yearTo - this.yearForm;

    this.monthForm = await parseInt(monthsToNumber($("#dateIn1").val().split(" ")[0]));
    this.monthTo = await parseInt(monthsToNumber($("#dateIn2").val().split(" ")[0]));

    this.getdata();
    this.trHtml1 = [];
    this.trHtml2 = [];

    console.log("yearForm :", this.yearForm);
    console.log("yearTo :", this.yearTo);
    var monthNo = 0 ;
    if(this.yearTo>this.yearForm){
      monthNo = (12-this.monthForm)+(12*((this.yearTo-this.yearForm)-1))+this.monthTo;
    }else{
      monthNo = this.monthTo-this.monthForm;
    }
   
    console.log("monthNo :", monthNo);
    var monthArray = this.monthForm-1;
    for (let i = 0; i <= monthNo; i++) {
      if(monthArray<12){
        console.log("monthArray :", monthArray);
        console.log("TextDateTH.months[monthArray] :", TextDateTH.months[monthArray]);
        this.trHtml1.push(TextDateTH.months[monthArray]);
        this.trHtml2.push("วันที่ชำระ");
        this.trHtml2.push("ยอดภาษี");
      }else{
        monthArray=0;
        console.log("monthArray :", monthArray);
        console.log("TextDateTH.months[monthArray] :", TextDateTH.months[monthArray]);
        this.trHtml1.push(TextDateTH.months[monthArray]);
        this.trHtml2.push("วันที่ชำระ");
        this.trHtml2.push("ยอดภาษี");
        
      }
      monthArray++;
    }
    
 
  }

  travelTo1Dropdown = () => {
    const URL = "combobox/controller/getDropByTypeAndParentId";
    this.ajax.post(URL, { type: "SECTOR_VALUE" }, res => {
      this.travelTo1List = res.json();
    });
  }

  travelTo2Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo2List = res.json();
        this.setTravelTo(e);
      });
    }
  }

  travelTo3Dropdown = e => {
    var id = e.target.value;
    if (id != "") {
      const URL = "combobox/controller/getDropByTypeAndParentId";
      this.ajax.post(URL, { type: "SECTOR_VALUE", lovIdMaster: id }, res => {
        this.travelTo3List = res.json();
        this.setTravelTo(e);
      });
    }
  }
  setTravelTo = e => {
    console.log(" e.target.value : ", e);
  }

  exportFile=()=>{
    console.log("exportFile");
    let param = "";

    param +="?officeCode=" + this.officeCode;
    param +="&yearMonthFrom=" + this.yearMonthFrom;
    param +="&yearMonthTo=" + this.yearMonthTo;
    param +="&dateType=" + this.dateType;
    param +="&pageNo=" + this.pageNo;
    param +="&dataPerPage=" + this.dataPerPage;
   
    this.ajax.download(URL.export+param);
  }
}

