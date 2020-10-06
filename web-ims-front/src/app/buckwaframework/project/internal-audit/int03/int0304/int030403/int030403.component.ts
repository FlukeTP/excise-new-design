import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';

import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { revertCondition } from 'helpers/convertCondition';



declare var $: any;

const URLS = {
  GET_EXPORT: "ia/int03/04/03/year/export",
}

@Component({
  selector: 'app-int030403',
  templateUrl: './int030403.component.html',
  styleUrls: ['./int030403.component.css']
})
export class Int030403Component implements OnInit {
  breadcrumb: BreadCrumb[];
  dataSessionList0304: any;
  idConfig: any;
  inspectionWork: any;
  budgetYear: any;
  projectYear: any;
  projecttypecode: any;
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

  dataExport: FormGroup

  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private formBuilder: FormBuilder,
    private authService : AuthService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "การประเมินความเสี่ยง", route: "#" },
      { label: "รายละเอียดผลการประเมินความเสี่ยง", route: "#" }
    ];
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
  }
  ngOnInit() {
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    console.log("budgetYear inint : ", this.budgetYear);
    this.getList();
    this.checkShowDataTable();

    this.projecttypecode = "1";
  }

  ngAfterViewInit() {
    this.calendar()
    this.inDataTable()
  }

  toggleBody() {

  }

  setExport() {
    console.log(this.dataExport.value);
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
      riskHrdPaperName : riskHrdPaperName1,
      budgetYear : this.budgetYear,
      createUserName : this.authService.getUserDetails().userThaiName,
      createLastName : this.authService.getUserDetails().userThaiSurname,
      createPosition : this.authService.getUserDetails().title
    });
  }


  checkShowDataTable() {
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"]
    if (this.inspectionWork == 3) {
      this.showDataTable = true;
    } else if (this.inspectionWork == 4 || this.inspectionWork == 5) {
      this.showDataTableCode = true;
    }
  }

  inDataTable() {
    this.dataTable = $("#dataTableF1").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      data: this.datas,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "iaRiskBudgetProject.projectname", className: "text-left"
        }, {
          data: "iaRiskBudgetProject.expensebudgetamountm", className: "text-right"
        }, {
          data: "iaRiskBudgetProject.expensebudgetamountx", className: "text-right"
        }, {
          data: "iaRiskBudgetProject.expensebudgetamounta", className: "text-right"
        }, {
          data: "expenseBudgetAmountAll", className: "text-right",
          render: function (data, type, row, meta) {
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }, {
          data: "iaRiskBudgetProject.approvedbudgetamount", className: "text-right"
        }, {
          data: "intCalculateCriteriaVo.riskRate", className: "text-center",
          render(data){
            return new IsEmptyPipe().transform(data,[])
          }
        }, {
          data: "intCalculateCriteriaVo.translatingRisk", className: "text-center",
          render(data){
            return new IsEmptyPipe().transform(data,[])
          }
        }
      ], createdRow: function (row, data, dataIndex) {
        if(data.intCalculateCriteriaVo.codeColor){
          $(row).find('td:eq(8)').css('background-color',data.intCalculateCriteriaVo.codeColor)
        }
      },
    })
  }

  getDataList() {
    this.projecttypecode
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.projectYear = this.route.snapshot.queryParams["budgetYear"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    console.log("projectYear :", this.projectYear);
    console.log("budgetYear :", this.budgetYear);
    const URL = "ia/int03/04/03/list"
    this.ajax.doPost(URL, {
      "projectyear": this.projectYear,
      "projecttypecode": this.projecttypecode,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig,
      "budgetYear": this.budgetYear
    }).subscribe((res: ResponseData<any>) => {
      console.log("res", res);
      this.datas = res.data
      this.dataTable.clear().draw()
      this.dataTable.rows.add(this.datas).draw()
      this.dataTable.columns.adjust().draw();
      // this.messageBar.successModal(res.message)
    })
  }

  calendar() {
    let dateFrom = new Date();
    let dateTo = new Date();

    $("#dateCalendarStartDate").calendar({
      type: "date",
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
      }
    });
    $("#dateCalendarEndDate").calendar({
      type: "date",
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
      }
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
  }
  getList = () => {
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
      this.getDataList()
      $("#dateCalendarStartDate").calendar('set date', this.startDate);
      $("#dateCalendarEndDate").calendar('set date', this.endDate);
    })
  }

  export() {
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.projectYear = this.route.snapshot.queryParams["budgetYear"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    let riskHrdPaperName = this.dataExport.value.riskHrdPaperName;
    var createUserName = this.dataExport.value.createUserName;
    var createLastName = this.dataExport.value.createLastName;
    var createPosition = this.dataExport.value.createPosition;
    var checkUserName = this.dataExport.value.checkUserName;
    var checkLastName = this.dataExport.value.checkLastName;
    var checkPosition = this.dataExport.value.checkPosition;
    this.ajax.download(`${URLS.GET_EXPORT}/${this.projectYear}/${this.projecttypecode}/${this.budgetYear}/${this.inspectionWork}/${this.idConfig}/${riskHrdPaperName}/${createUserName}/${createLastName}/${createPosition}/${checkUserName}/${checkLastName}/${checkPosition}`);
  }
}



