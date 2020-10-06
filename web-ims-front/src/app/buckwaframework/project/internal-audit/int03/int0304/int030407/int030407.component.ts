import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Int030407Vo } from './int030407vo.model';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { revertCondition } from 'helpers/convertCondition';

declare var $: any;

const URLS = {
  GET_INCOME_YEAR: "ia/int03/04/07/year",
  GET_INCOME_YEAR_EXPORT: "ia/int03/04/07/year/export",
}

@Component({
  selector: 'app-int030407',
  templateUrl: './int030407.component.html',
  styleUrls: ['./int030407.component.css']
})
export class Int030407Component implements OnInit {
  breadcrumb: BreadCrumb[];
  dataSessionList0304: any;
  idConfig: any;
  inspectionWork: any;
  budgetYear: any;
  riskFactors: string;
  infoUsedRiskDesc: string;
  lists: Int030407Vo[] = [];
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
  
  showBody: boolean = false;
  dataopen1: boolean = false;
  dataopen2: boolean = false;
  toggleButtonTxt: string = 'แสดง รายละเอียดเงื่อนไขความเสี่ยง'
  dataTable: any

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
    this.getList();
  }

  ngAfterViewInit() {
    this.calendar()

    this.dataTablef1()

  }

  toggleBody() { }



  getDataList() {
    this.ajax.doGet(`${URLS.GET_INCOME_YEAR}/${this.budgetYear}/${this.idConfig}`).subscribe((response: ResponseData<Int030407Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.lists = response.data;
        this.dataTable.clear().draw()
        this.dataTable.rows.add(this.lists).draw()
        this.dataTable.columns.adjust().draw();
      }
    });
  }

  dataTablef1() {
    this.dataTable = $("#dataTable").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      data: this.lists,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "exciseDepartmentVo.sector",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {
          data: "exciseDepartmentVo.area",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {
          data: "sumAmount", className: "text-right",
          render: function (data) {
            data = data.toFixed(2)
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }, {
          data: "forecaseAmount", className: "text-right",
          render: function (data) {
            data = data.toFixed(2)
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }, {
          data: "diffAmount", className: "text-right",
          render: function (data) {
            data = data.toFixed(2)
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }, {
          data: "rateAmount", className: "text-right",
          render: function (data) {
            data = data.toFixed(2)
            return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        },
        {
          data: "rateRisk", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {
          data: "textRisk", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }

      ], createdRow: function (row, data, dataIndex) {
        if (data.intCalculateCriteriaVo.codeColor) {
          $(row).find('td:eq(8)').css('background-color', data.intCalculateCriteriaVo.codeColor)
        }
      },
    })
  }

  calendar() {
    const year: Date = new Date();
    const budgetYear: string = this.route.snapshot.queryParams["budgetYear"];
    year.setFullYear(parseInt(budgetYear || "2562"));
    $("#yearCalendar").calendar({
      type: "year",
      text: TextDateTH,
      initialDate: year,
      formatter: formatter('ป'),
      onChange: (date, text, mode) => {
      }
    });
    setTimeout(() => {
      $("#yearCalendar").calendar('set date', year);
    }, 200);
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

  getList = () => {
    // var URL = "ia/int03/04/getSessionList0304";
    // this.ajax.post(URL, {}, res => {
    //   this.dataSessionList0304 = res.json();
    //   console.log("dataSessionList0304 : ", this.dataSessionList0304);
    //   this.riskFactors = this.dataSessionList0304.iaRiskFactors.riskFactors
    //   this.infoUsedRiskDesc = this.dataSessionList0304.iaRiskFactorsConfig.infoUsedRiskDesc
    //   this.getDataList();
    // });
    const URL = "ia/int03/04/05/getForm0304"
    this.ajax.doPost(URL, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      this.dataSessionList0304 = res
      console.log("dataSessionList0304 : ", this.dataSessionList0304);
      this.riskFactors = this.dataSessionList0304.iaRiskFactors.riskFactors
      this.infoUsedRiskDesc = this.dataSessionList0304.iaRiskFactorsConfig.infoUsedRiskDesc
      this.getDataList();
    })
  }

  export() {
    // TODO
    let riskHrdPaperName = this.dataExport.value.riskHrdPaperName;
    var createUserName = this.dataExport.value.createUserName;
    var createLastName = this.dataExport.value.createLastName;
    var createPosition = this.dataExport.value.createPosition;
    var checkUserName = this.dataExport.value.checkUserName;
    var checkLastName = this.dataExport.value.checkLastName;
    var checkPosition = this.dataExport.value.checkPosition;
    this.ajax.download(`${URLS.GET_INCOME_YEAR_EXPORT}/${this.budgetYear}/${this.idConfig}/${riskHrdPaperName}/${createUserName}/${createLastName}/${createPosition}/${checkUserName}/${checkLastName}/${checkPosition}`);
  }

}
