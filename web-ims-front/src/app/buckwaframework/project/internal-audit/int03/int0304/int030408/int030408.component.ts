import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { revertCondition } from 'helpers/convertCondition';

declare var $: any;
@Component({
  selector: 'app-int030408',
  templateUrl: './int030408.component.html',
  styleUrls: ['./int030408.component.css']
})
export class Int030408Component implements OnInit {

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
  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
  ) { }
  ngOnInit() {
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    this.getList0304();
    this.getDataList()
  }

  ngAfterViewInit() {
    this.calendar()
    this.inDataTable()
  }

  toggleBody() {

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
          data: "iaRiskSystemUnworking.systemname", className: "text-left"
        }, {
          data: "iaRiskSystemUnworking.errordetailError10", className: "text-left"
        }, {
          data: "iaRiskSystemUnworking.errordetailError11", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError12", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError01", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError02", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError03", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError04", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError05", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError06", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError07", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError08", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.errordetailError09", className: "text-center"
        }, {
          data: "iaRiskSystemUnworking.countall", className: "text-center"
        }, {
          data: "intCalculateCriteriaVo.riskRate", className: "text-center"
        }, {
          data: "intCalculateCriteriaVo.translatingRisk", className: "text-center"
        }
        // {
        //   className: "ui center aligned",
        //   render: function (data, type, row, meta) {
        //     return meta.row + meta.settings._iDisplayStart + 1;
        //   }
        // }
      ], createdRow: function (row, data, dataIndex) {
        if (data.intCalculateCriteriaVo.color == 'แดง') {
          $(row).find('td:eq(15)').addClass('bg-c-redtable');
          $(row).find('td:eq(16)').addClass('bg-c-redtable');
        } else if (data.intCalculateCriteriaVo.color == 'ส้ม') {
          $(row).find('td:eq(15)').addClass('bg-c-orangetable');
          $(row).find('td:eq(16)').addClass('bg-c-orangetable');
        } else if (data.intCalculateCriteriaVo.color == 'เหลือง') {
          $(row).find('td:eq(15)').addClass('bg-c-yellowtable');
          $(row).find('td:eq(16)').addClass('bg-c-yellowtable');
        }else if (data.intCalculateCriteriaVo.color == 'เขียว') {
          $(row).find('td:eq(15)').addClass('bg-c-greentable');
          $(row).find('td:eq(16)').addClass('bg-c-greentable');
        }else if (data.intCalculateCriteriaVo.color == 'เขียวเข้ม') {
          $(row).find('td:eq(15)').addClass('bg-c-greenuptable');
          $(row).find('td:eq(16)').addClass('bg-c-greenuptable');
        }
      },
    })
  }

  getDataList() {
    const URL = "ia/int03/04/05/systemUnworkingList"
    this.ajax.doPost(URL, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data
      this.dataTable.clear().draw()
      this.dataTable.rows.add(this.datas).draw()
      this.dataTable.columns.adjust().draw();
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


}
