import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from "@angular/core";
import { BreadCrumb, ResponseData } from "models/index";
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var $: any;

@Component({
  selector: "app-int0304",
  templateUrl: "./int0304.component.html",
  styleUrls: ["./int0304.component.css"]
})
export class Int0304Component implements OnInit {
  factorsLevel: Number = 0;
  inspectionWork: any;
  inspectionWorkTab: number = 3;
  budgetYear: any;
  idHead: any;
  private datatable: any;
  searchForm: FormGroup;
  submitted: any;
  inspectionWorkList: any[] = [];
  date = new Date()
  ckeck: boolean = false;
  dataSessionList0304: any;
  dataselect: any;
  datas: any[] = [];

  startDate: any;
  endDate: any;


  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง ", route: "#" },
    { label: "การประเมินความเสี่ยง", route: "#" },
  ];

  constructor(
    private route: ActivatedRoute,
    private ajaxService: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
    private fb: FormBuilder,
    private ajax: AjaxService
  ) {
  }

  ngOnInit() {
    this.initVariable();
    this.inspectionWorkDropdown();
    // this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    // this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    // this.idHead = this.route.snapshot.queryParams["idHead"];
    this.inspectionWork = 3
    var year = this.date.getFullYear()
    this.budgetYear = year
  }

  ngAfterViewInit() {
    this.initDatatable();
    this.calendar();
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")

    var date = new Date();
    $("#budgetYear1").calendar('set date', this.date);
    $("#inspectionWork").dropdown('set selected', 3);
    this.search()

  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      riskType: ["", Validators.required]
    });
  }

  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  inspectionWorkDropdown = () => {
    const URL = "api/preferences/parameter-info";
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต', iconName: 'clipboard' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต', iconName: 'laptop' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่', iconName: 'globe' }]
  }

  calendar() {
    $("#budgetYearCalendar").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.changeSearch(text);
      }
    }).calendar("set date", '2561')

  }

  inspectionWorkClick(paramInfoId: any) {
    $('table').removeClass(`table${this.inspectionWorkTab}`);
    this.inspectionWorkTab = paramInfoId;
    this.inspectionWork = paramInfoId;
    this.changeSearch(false);
  }

  changeSearch(budgetYear: any) {
    if (budgetYear) {
      this.budgetYear = budgetYear
    } else {
      this.budgetYear = this.budgetYear
    }
    setTimeout(() => {
      this.datatable.ajax.reload();
      // add class
      $('table').addClass(`table${this.inspectionWorkTab}`);
    }, 150);
  }

  search() {
    this.budgetYear = $('#budgetYear').val();
    this.datatable.ajax.reload();
    // add class
    $('table').addClass(`table${this.inspectionWorkTab}`);
  }

  initDatatable = () => {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      ajax: {
        type: "POST",
        url: AjaxService.CONTEXT_PATH + "ia/int03/04/list",
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "budgetYear": this.budgetYear,
            "inspectionWork": this.inspectionWork
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "iaRiskFactors.riskFactors",
          className: "ui",
        }, {
          data: "iaRiskFactorsConfig.id",
          className: "ui center aligned",
          render: function (data) {
            var button = '';
            button += '<button type="button" class="ui mini blue button description-button">ประเมินความเสี่ยง</button> ';
            return button
          }
        },
      ],
    });
    // add css
    $('.ui.grid .row').css('padding-top', '0');

    this.datatable.on("click", "td > button.description-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      this.setSessionList0304(data);
      // console.log(data);
      console.log(data);
      var path
      if (data.iaRiskFactors.dataEvaluate == "NEW") {
        path = '/int03/04/01'
      } else if (data.iaRiskFactors.dataEvaluate == "questionnaire") {
        path = '/int03/04/02'
      } else if (data.iaRiskFactors.dataEvaluate == "budget_project") {
        path = '/int03/04/03'
      } else if (data.iaRiskFactors.dataEvaluate == "project_efficiency") {
        path = '/int03/04/04'
      } else if (data.iaRiskFactors.dataEvaluate == "system_unworking") {
        path = '/int03/04/05'
      } else if (data.iaRiskFactors.dataEvaluate == "check_period") {
        path = '/int03/04/06'
      } else if (data.iaRiskFactors.dataEvaluate == "income_perform") {
        path = '/int03/04/07'
      } else if (data.iaRiskFactors.dataEvaluate == "suppression") {
        path = '/int03/04/08'
      } else {
        return
      }
      this.router.navigate([path], {
        queryParams: {
          idConfig: data.iaRiskFactorsConfig.id,
          inspectionWork: this.inspectionWork,
          budgetYear: this.budgetYear
        }
      });
    });

  };

  setSessionList0304 = (data) => {
    var URL = "ia/int03/04/setSessionList0304";
    this.ajax.post(URL, data, res => {
      // this.dataSessionList0304 = res.json();
      console.log("setSessionList0304");
    });
  }

  isEmpty(value) {
    return value == null || value == undefined || value == '';
  }


}
