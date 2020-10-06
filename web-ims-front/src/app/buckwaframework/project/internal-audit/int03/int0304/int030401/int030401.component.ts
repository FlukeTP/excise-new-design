import { DecimalFormatPipe } from './../../../../../common/pipes/decimal-format.pipe';
import { Component, OnInit } from "@angular/core";
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { revertCondition } from 'helpers/convertCondition';

declare var $: any;

const URLS = {
  GET_EXPORT: "ia/int03/04/01/export",
  FACTOR_DATA: "ia/int03/04/01/factorsDataList"
}
@Component({
  selector: "app-int030401",
  templateUrl: "./int030401.component.html",
  styleUrls: ["./int030401.component.css"]
})
export class Int030401Component implements OnInit {
  breadcrumb: BreadCrumb[];
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
  showDataTableCode4: boolean = false;
  showDataTableCode5: boolean = false;

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
    private authService: AuthService
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
    this.getSessionList0304();
    this.checkShowDataTable()
  }

  ngAfterViewInit() {
    this.calendar()
    this.inDataTable()
  }

  toggleBody() {

  }

  checkShowDataTable() {
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"]
    if (this.inspectionWork == 3) {
      this.showDataTable = true;
      this.showDataTableCode4 = false;
      this.showDataTableCode5 = false;
    } else if (this.inspectionWork == 4) {
      this.showDataTable = false;
      this.showDataTableCode4 = true;
      this.showDataTableCode5 = false;
    } else if (this.inspectionWork == 5) {
      this.showDataTable = false;
      this.showDataTableCode4 = false;
      this.showDataTableCode5 = true;
    }
  }

  inDataTable() {
    if (this.inspectionWork == 3) {
      this.dataTable = $("#dataTableF1").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: false,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "iaRiskFactorsData.project", className: "text-left"
          }, {
            data: "iaRiskFactorsData.riskCost", className: "text-right",
            render(data) {
              return new DecimalFormatPipe().transform(data,"###,###.00")
            }
          }, {
            data: "intCalculateCriteriaVo.riskRate", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }, {
            data: "intCalculateCriteriaVo.translatingRisk", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }
        ], createdRow: function (row, data, dataIndex) {
          if (data.intCalculateCriteriaVo.codeColor) {
            $(row).find('td:eq(4)').css('background-color', data.intCalculateCriteriaVo.codeColor)
          }
        },
      })
    } else if (this.inspectionWork == 4) {
      this.dataTable = $("#dataTableF2").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: false,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "iaRiskFactorsData.systemCode", className: "text-left"
          }, {
            data: "iaRiskFactorsData.systemName", className: "text-left"
          }, {
            data: "iaRiskFactorsData.riskCost", className: "text-right",
            render(data) {
              return new DecimalFormatPipe().transform(data,"###,###.00")
            }
          }, {
            data: "intCalculateCriteriaVo.riskRate", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }, {
            data: "intCalculateCriteriaVo.translatingRisk", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }
        ], createdRow: function (row, data, dataIndex) {
          if (data.intCalculateCriteriaVo.codeColor) {
            $(row).find('td:eq(5)').css('background-color', data.intCalculateCriteriaVo.codeColor)
          }
        },
      })
    } else if (this.inspectionWork == 5) {
      this.dataTable = $("#dataTableF3").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: false,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "iaRiskFactorsData.exciseCode", className: "text-left"
          }, {
            data: "iaRiskFactorsData.sector", className: "text-left"
          }, {
            data: "iaRiskFactorsData.area", className: "text-left"
          }, {
            data: "iaRiskFactorsData.riskCost", className: "text-right",
            render(data) {
              return new DecimalFormatPipe().transform(data,"###,###.00")
            }
          }, {
            data: "intCalculateCriteriaVo.riskRate", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }, {
            data: "intCalculateCriteriaVo.translatingRisk", className: "text-center",
            render(data) {
              return new IsEmptyPipe().transform(data, [])
            }
          }
        ], createdRow: function (row, data, dataIndex) {
          if (data.intCalculateCriteriaVo.codeColor) {
            $(row).find('td:eq(6)').css('background-color', data.intCalculateCriteriaVo.codeColor)
          }
        },
      })
    }
  }

  getDataList() {

    this.ajax.doPost(URLS.FACTOR_DATA, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idFactors": this.dataSessionList0304.iaRiskFactors.id,
      "idConfig": this.idConfig
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


  getSessionList0304 = () => {
    // var URL = "ia/int03/04/getSessionList0304";
    // this.ajax.post(URL, {}, res => {
    //   this.dataSessionList0304 = res.json();
    //   console.log("dataSessionList0304 : ", this.dataSessionList0304);
    //   this.riskFactors = this.dataSessionList0304.iaRiskFactors.riskFactors
    //   this.infoUsedRiskDesc = this.dataSessionList0304.iaRiskFactorsConfig.infoUsedRiskDesc
    //   this.startDate = this.dataSessionList0304.iaRiskFactorsConfig.startDate
    //   this.endDate = this.dataSessionList0304.iaRiskFactorsConfig.endDate

    //   this.getDataList()

    //   $("#dateCalendarStartDate").calendar('set date', this.startDate);
    //   $("#dateCalendarEndDate").calendar('set date', this.endDate);
    // });

    const url = "ia/int03/04/05/getForm0304"
    this.ajax.doPost(url, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      console.log("getForm0304", res);
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
    let idFactors = this.dataSessionList0304.iaRiskFactors.id
    let riskHrdPaperName = this.dataExport.value.riskHrdPaperName;
    var createUserName = this.dataExport.value.createUserName;
    var createLastName = this.dataExport.value.createLastName;
    var createPosition = this.dataExport.value.createPosition;
    var checkUserName = this.dataExport.value.checkUserName;
    var checkLastName = this.dataExport.value.checkLastName;
    var checkPosition = this.dataExport.value.checkPosition;
    this.ajax.download(`${URLS.GET_EXPORT}/${idFactors}/${this.idConfig}/${this.budgetYear}/${this.inspectionWork}/${riskHrdPaperName}/${createUserName}/${createLastName}/${createPosition}/${checkUserName}/${checkLastName}/${checkPosition}`);
  }

}
