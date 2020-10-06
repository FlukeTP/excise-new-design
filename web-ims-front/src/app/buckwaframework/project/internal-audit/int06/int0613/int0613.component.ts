import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../../common/helper";
import { AjaxService, MessageBarService, AuthService, MessageService } from "../../../../common/services";
import { Router, ActivatedRoute } from "@angular/router";
import { monthsToNumber } from "helpers/datepicker";
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Int0613Service } from './int0613.service';


declare var $: any;
const URL = {
  export: "/ia/int0171/exportFile",
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
}
@Component({
  selector: 'app-int0613',
  templateUrl: './int0613.component.html',
  styleUrls: ['./int0613.component.css'],
  providers: [Int0613Service]
})
export class Int0613Component implements OnInit {
  [x: string]: any;

  formSearch: FormGroup
  travelTo1List: any;
  travelTo2List: any;
  travelTo3List: any;

  offcode: any;
  yearMonthFrom: any;
  yearMonthTo: any;
  pageNo: any;
  dataPerPage: any;
  searchFlag: any = "FALSE";
  idinspec: any
  breadcrumb: BreadCrumb[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private msg: MessageBarService,
    private formBuilder: FormBuilder,
    private selfService: Int0613Service
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบรายได้", route: "#" },
      { label: "ตรวจสอบสถิติการพิมพ์ใบอนุญาตซ้ำ", route: "#" }
    ];
    this.formSearch = this.formBuilder.group({
      dataPerPage: [],
      offcode: [],
      pageNo: [],
      searchFlag: [],
      yearMonthFrom: [],
      yearMonthTo: [],
    })
  }

  ngOnInit() {
    // this.authService.reRenderVersionProgram('INT-01710');
    // this.travelTo1Dropdown();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.getDataInspectionPlan()
  }

  ngAfterViewInit() {
    this.calenda();
    this.dataTable();
  }


  initDatatable() {

  }
  calenda = () => {
    $("#date1").calendar({
      endCalendar: $("#date2"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('ดป'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({
          yearMonthFrom: text
        })
      }

    });
    $("#date2").calendar({
      startCalendar: $("#date1"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('ดป'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({
          yearMonthTo: text
        })
      }

    });
  }

  getDataInspectionPlan() {
    this.idinspec = this.route.snapshot.queryParams["id"]
    this.selfService.getDataInspectionPlan(this.idinspec).then(data => {
      // console.log("data = >",data);
      this.formSearch.patchValue({
        offcode: data[0].exciseCode
      })
    })
  }

  chicksearch = () => {
    $('#table').DataTable().ajax.reload();
    // let yearFrom = parseInt($("#dateIn1").val().split(" ")[1]) - 543;
    // let yearTo = parseInt($("#dateIn2").val().split(" ")[1]) - 543;

    // this.offcode = "100300";
    // this.yearMonthFrom = String(yearFrom) + monthsToNumber($("#dateIn1").val().split(" ")[0]);
    // this.yearMonthTo = String(yearTo) + monthsToNumber($("#dateIn2").val().split(" ")[0]);
    // this.pageNo = '1';
    // this.dataPerPage = '1000';
    // this.searchFlag = "TRUE";
    // $('#table').DataTable().ajax.reload();

  }

  clickClear = function () {
    this.searchFlag = "FALSE";
    $('input[type=text]').val("");
    $('select').val("");
    $('input[type=calendar]').val("");
    $('#table').DataTable().ajax.reload();
  }


  dataTable = () => {
    var table = $('#table').DataTableTh({
      "lengthChange": true,
      "serverSide": true,
      "searching": false,
      "ordering": false,
      "processing": true,
      "scrollX": true,
      "ajax": {
        "url": AjaxService.CONTEXT_PATH + 'ia/int06/13/list',
        "contentType": "application/json",
        "type": "POST",
        "data": (d) => {
          return JSON.stringify($.extend({}, d, this.formSearch.value));
        },
      },
      "columns": [
        {
          "className": "center",
          "render": function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          "data": "cusFullName"
        }, {
          "data": "licName"
        }, {
          "data": "licCode"
        }, {
          "data": "licType"
        }, {
          "data": "printCount"
        }
      ]
    });
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
    console.log(" e.target.value : ", e.target.value);
  }
  exportFile = () => {
    console.log("exportFile");
    let param = "";

    param += "?offcode=" + this.offcode,
      param += "&yearMonthFrom=" + this.yearMonthFrom,
      param += "&yearMonthTo=" + this.yearMonthTo,
      param += "&pageNo=" + this.pageNo,
      param += "&dataPerPage=" + this.dataPerPage

    this.ajax.download(URL.export + param);
  }
}

