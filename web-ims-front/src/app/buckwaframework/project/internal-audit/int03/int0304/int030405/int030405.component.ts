import { reducers } from './../../../../operation-audit/ope01/ope01.reducers';
import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { revertCondition } from 'helpers/convertCondition';
import { MessageService } from 'services/message.service';

declare var $: any;

const URLS = {
  GET_EXPORT: "ia/int03/04/05/year/export",
}

@Component({
  selector: 'app-int030405',
  templateUrl: './int030405.component.html',
  styleUrls: ['./int030405.component.css']
})

export class Int030405Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง", route: "#" },
    { label: "ผลการประเมินความเสี่ยง", route: "#" }
  ]

  dataSessionList0304: any;
  idConfig: any;
  inspectionWork: any;
  budgetYear: any;
  riskFactors: any;
  infoUsedRiskDesc: any;
  startDate: any;
  endDate: any;
  dataTable: any;
  datas: any = [];
  datalist: any;

  veryhighthai: any;
  highthai: any;
  mediumthai: any;
  lowthai: any;
  verylowthai: any;

  veryhighthai2: any;
  highthai2: any;
  mediumthai2: any;
  lowthai2: any;
  verylowthai2: any;

  showDataTable: boolean = false;
  showDataTableCode: boolean = false;
  showBody: boolean = false;
  dataopen1: boolean = false;
  dataopen2: boolean = false;
  toggleButtonTxt: string = 'แสดง รายละเอียดเงื่อนไขความเสี่ยง'

  trHtml1: any = [];
  trHtml2: any = [];
  trHtmlYear: any[] = [
    {
      text: String,
      col: Number
    }];

  dataExport: FormGroup
  dataUpdate: FormGroup

  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.dataExport = this.formBuilder.group({
      riskHrdPaperName: ["", Validators.required],
      budgetYear: ["", Validators.required],
      createUserName: ["", Validators.required],
      createLastName: ["", Validators.required],
      createPosition: ["", Validators.required],
      checkUserName: ["", Validators.required],
      checkLastName: ["", Validators.required],
      checkPosition: ["", Validators.required]
    });

    this.dataUpdate = this.formBuilder.group({
      id : [""],
      startDate: [""],
      endDate: [""]
    })
    
  }
  ngOnInit() {
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
  }

  ngAfterViewInit() {
    this.calendar()
    this.getList0304();
    this.trHtmlYear = [];
  
  }

  // toggleBody() {
  // }

  getDataList() {
    const URL = "ia/int03/04/05/systemUnworkingList"
    this.ajax.doPost(URL, {
      "budgetYear": this.budgetYear,
      "startDate": $("#startDate").val(),
      "endDate": $("#endDate").val(),
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
      this.setTrHtml();
    })
  }

  setTrHtml() {
    let yearForm = parseInt($("#startDate").val().split("/")[1]);
    let yearTo = parseInt($("#endDate").val().split("/")[1]);
    var yearNo = yearTo - yearForm;
    let monthForm = parseInt($("#startDate").val().split("/")[0]);
    let monthTo = parseInt($("#endDate").val().split("/")[0]);
    this.trHtml1 = [];
    this.trHtml2 = [];
    this.trHtmlYear = [];
    var monthNo = 0;
    console.log("yearForm : " + yearForm + " yearTo : " + yearTo);
    if (yearTo > yearForm) {
      monthNo = (12 - monthForm) + (12 * ((yearTo - yearForm) - 1)) + monthTo;
    } else {
      monthNo = monthTo - monthForm;
    }
    var monthArray = parseInt($("#startDate").val().split("/")[0]) - 1;
    console.log("monthNo :", monthNo);
    console.log("monthArray :", monthArray);
    // Set TR Year
    for (let index = 0; index < yearNo + 1; index++) {
      let trHtmlYear = {
        text: "",
        col: 0
      };
      trHtmlYear.text = String(yearForm + index)
      this.trHtmlYear.push(trHtmlYear);
    }
    // Set TR Month
    var indexTrHY = 0;
    for (let i = 0; i <= monthNo; i++) {
      if (monthArray < 12) {
        // console.log("monthArray :", monthArray);
        // console.log("TextDateTH.months[monthArray] :", TextDateTH.months[monthArray]);
        // this.trHtml1.push(TextDateTH.months[monthArray]);
        this.trHtml2.push(TextDateTH.months[monthArray]);
      } else {
        monthArray = 0;
        // console.log("monthArray :", monthArray);
        // console.log("TextDateTH.months[monthArray] :", TextDateTH.months[monthArray]);
        // this.trHtml1.push(TextDateTH.months[monthArray]);
        this.trHtml2.push(TextDateTH.months[monthArray]);
        indexTrHY++;
      }
      console.log("this.trHtmlYear : ", this.trHtmlYear[indexTrHY].col);
      this.trHtmlYear[indexTrHY].col = this.trHtmlYear[indexTrHY].col + 1;
      monthArray++;
    }
    console.log("trHtmlYear :", this.trHtmlYear);
    setTimeout(() => {
      this.setScrollable();
    }, 1000);
  }

  setScrollable() {
    $(`#dataTableF1`).tableHeadFixer({ "head": true, "left": 2, 'z-index': 0 });
    $(function () {
      let curDown: boolean = false;
      let curYPos: number = 0;
      let curXPos: number = 0;
      $(`#dataTableF1_scroll`).mousemove(function (m) {
        if (curDown === true) {
          $(`#dataTableF1_scroll`).scrollTop($(`#dataTableF1_scroll`).scrollTop() + (curYPos - m.pageY));
          $(`#dataTableF1_scroll`).scrollLeft($(`#dataTableF1_scroll`).scrollLeft() + (curXPos - m.pageX));
        }
      });
      $(`#dataTableF1_scroll`).mousedown(function (m) {
        curDown = true;
        curYPos = m.pageY;
        curXPos = m.pageX;
      });
      $(`#dataTableF1_scroll`).mouseup(function () {
        curDown = false;
      });
    });
  }


  calendar() {
    let dateFrom = new Date();
    let dateTo = new Date();
    $("#dateCalendarStartDate").calendar({
      type: "month",
      text: TextDateTH,
      initialDate: dateFrom,
      endCalendar: $('#dateCalendarEndDate'),
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
      }
    });
    $("#dateCalendarEndDate").calendar({
      type: "month",
      text: TextDateTH,
      initialDate: dateTo,
      startCalendar: $('#dateCalendarStartDate'),
      formatter: formatter('month-year'),
      onChange: (date, text, mode) => {
      }
    });
  }

  updateData() {
    let yearForm = $("#startDate").val()
    console.log("yearForm : ",yearForm);
    let yearTo = $("#endDate").val()
    console.log("yearTo : ",yearTo);
    let Id = this.dataSessionList0304.iaRiskFactorsConfig.id
    this.dataUpdate.patchValue({
      id : Id ,
      startDate: yearForm,
      endDate: yearTo
    })
    console.log("dataUpdate :",this.dataUpdate.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ia/int03/04/05/updateStartDate";
        this.ajax.doPost(URL, this.dataUpdate.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message);
          } else {
            this.messageBar.errorModal(res.message);
          }
        })
      }
    }, "ยืนยันการบันทึก");
    
  }

  showModal1() {
    $("#modal1").modal("show");
    var ricktest = this.riskFactors.split('ปัจจัยเสี่ยง');
    var subrick = this.riskFactors.substring(0, 12);
    var riskHrdPaperName1;
    console.log(this.authService.getUserDetails().userThaiName);
    if (subrick == 'ปัจจัยเสี่ยง') {
      var materick = "กระดาษทำการประเมินความเสี่ยง" + ricktest[1]
      riskHrdPaperName1 = materick
    } else {
      riskHrdPaperName1 = "กระดาษทำการประเมินความเสี่ยง" + this.riskFactors
    }
    this.dataExport.patchValue({
      riskHrdPaperName: riskHrdPaperName1,
      budgetYear: this.budgetYear,
      createUserName: this.authService.getUserDetails().userThaiName,
      createLastName: this.authService.getUserDetails().userThaiSurname,
      createPosition: this.authService.getUserDetails().title
    });
  }

  showModal2() {
    if (this.showBody) {
      this.showBody = false;
      this.toggleButtonTxt = 'แสดง รายละเอียดเงื่อนไขความเสี่ยง'

    } else {
      this.showBody = true;
      this.toggleButtonTxt = 'ซ่อน รายละเอียดเงื่อนไขความเสี่ยง'
    }
    this.datalist = this.dataSessionList0304.iaRiskFactorsConfig;
    console.log("datalist : ", this.datalist);
    let checkrick = this.datalist.factorsLevel;
    //  ----------------------------------------- Set From thai -----------------------------------------
    if (checkrick == 3) {

      this.dataopen1 = true;
      this.dataopen2 = false;

      this.highthai = revertCondition(this.datalist.highCondition.split("|")[0]);
      this.highthai2 = revertCondition(this.datalist.highCondition.split("|")[1]);

      this.mediumthai = revertCondition(this.datalist.mediumCondition.split("|")[0]);
      this.mediumthai2 = revertCondition(this.datalist.mediumCondition.split("|")[1]);

      this.lowthai = revertCondition(this.datalist.lowCondition.split("|")[0]);
      this.lowthai2 = revertCondition(this.datalist.lowCondition.split("|")[1]);


    } else {
      this.dataopen1 = false;
      this.dataopen2 = true;

      this.veryhighthai = revertCondition(this.datalist.veryhighCondition.split("|")[0]);
      this.veryhighthai2 = revertCondition(this.datalist.veryhighCondition.split("|")[1]);

      this.highthai = revertCondition(this.datalist.highCondition.split("|")[0]);
      this.highthai2 = revertCondition(this.datalist.highCondition.split("|")[1]);

      this.mediumthai = revertCondition(this.datalist.mediumCondition.split("|")[0]);
      this.mediumthai2 = revertCondition(this.datalist.mediumCondition.split("|")[1]);

      this.lowthai = revertCondition(this.datalist.lowCondition.split("|")[0]);
      this.lowthai2 = revertCondition(this.datalist.lowCondition.split("|")[1]);

      this.verylowthai = revertCondition(this.datalist.verylowCondition.split("|")[0]);
      this.verylowthai2 = revertCondition(this.datalist.verylowCondition.split("|")[1]);

    }
    //  ----------------------------------------- End Set From thai -----------------------------------------

  }


  getList0304 = () => {
    const URL = "ia/int03/04/05/getForm0304"
    this.ajax.doPost(URL, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      console.log("resData", res);
      this.dataSessionList0304 = res
      this.riskFactors = this.dataSessionList0304.iaRiskFactors.riskFactors
      this.infoUsedRiskDesc = this.dataSessionList0304.iaRiskFactorsConfig.infoUsedRiskDesc
      this.startDate = this.dataSessionList0304.iaRiskFactorsConfig.startDate
      this.endDate = this.dataSessionList0304.iaRiskFactorsConfig.endDate
      
      $("#dateCalendarStartDate").calendar('set date', this.startDate);
      $("#dateCalendarEndDate").calendar('set date', this.endDate);
    })
  }

  export() {
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    let startDate = $("#startDate").val();
    let endDate = $("#endDate").val();
    let riskHrdPaperName = this.dataExport.value.riskHrdPaperName;
    var createUserName = this.dataExport.value.createUserName;
    var createLastName = this.dataExport.value.createLastName;
    var createPosition = this.dataExport.value.createPosition;
    var checkUserName = this.dataExport.value.checkUserName;
    var checkLastName = this.dataExport.value.checkLastName;
    var checkPosition = this.dataExport.value.checkPosition;

    startDate = startDate.replace("/", ".");
    endDate = endDate.replace("/", ".");

    this.ajax.download(`${URLS.GET_EXPORT}/${startDate}/${endDate}/${this.budgetYear}/${this.inspectionWork}/${this.idConfig}/${riskHrdPaperName}/${createUserName}/${createLastName}/${createPosition}/${checkUserName}/${checkLastName}/${checkPosition}`);
  }


}







