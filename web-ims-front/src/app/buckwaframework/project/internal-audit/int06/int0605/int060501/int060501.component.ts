import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService, AuthService, MessageBarService } from "services/index";
import { Int06051Service } from '../int0605-1.services';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { Int060501Service } from './int060501.service';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';

declare var $: any;

const URL = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
}

@Component({
  selector: "int060501",
  templateUrl: "./int060501.component.html",
  styleUrls: ["./int060501.component.css"],
  providers: [Int060501Service]
})
export class Int060501Component implements OnInit, AfterViewInit {

  breadcrumb: BreadCrumb[] = []
  idinspec: any
  dataFilterIdParams: any = []
  dataFillter: FormGroup
  dateFillter: FormGroup
  datas: any
  dataStartConvate: any
  dataEndConvate: any
  submit: boolean = true

  showDetail: boolean = false
  submitted: boolean = false

  dataTable: any
  dataInTable: any = []
  constructor(
    private main: Int06051Service,
    private router: Router,
    private ajax: AjaxService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private formBuilder: FormBuilder,
    private selfService: Int060501Service,
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบรายได้", route: "#" },
      { label: "ตรวจสอบใบเสร็จรับเงินภาษีสรรพสามิต", route: "#" }
    ]

    this.dataFillter = this.formBuilder.group({
      texC: ["", Validators.required],
      texN: ["", Validators.required],
      officeCode: [""],
      // YearMonthFrom: ["", Validators.required],
      // YearMonthTo: ["", Validators.required],
      NettaxAmount: ["", Validators.required],
      printNo: ["", Validators.required],
      // PageNo: ["0", Validators.required],
      // DateType: ["Income", Validators.required],
      // DataPerPage: ["0", Validators.required],
    })

    this.dateFillter = this.formBuilder.group({
      officeCode: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    })
  }

  ngOnInit() {
    this.idinspec = this.route.snapshot.queryParams["id"]
    this.getData()
  }

  ngAfterViewInit() {
    // Dropdowns
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.search").css("width", "100%")
    $(".ui.dropdown.ai").css("width", "100%")
    this.calenda();
    // this.inDataTable()

  }

  getData() {
    let id = this.idinspec
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilterIdParams = response.data
        // เอา datas ตัวนี้ไปใช้หน้าบ้านเพื่อดึงข้อมูล สรรพสามิต
        this.datas = this.dataFilterIdParams[0]
        console.log("response : ", this.dataFilterIdParams)
        // เอาค่า offcode ใส่เข้าไปใน form
        var offCodeTo = this.datas.exciseCode
        this.dataFillter.patchValue({
          offCode: offCodeTo
        })
        // ดูค่าใน form ทั้งหมด
        console.log("dataFillter : ", this.dataFillter.value)
        this.inputConvertCN()
      } else {
        this.messageBarService.errorModal(response.message)
      }
    }, err => {
      this.messageBarService.errorModal("กรุณาติดต่อผู้ดูแลระบบ")
    })
  }

  inputConvertCN() {
    var year = this.datas.budgetYear.split("25")
    var TexC_To = this.datas.exciseCode + year[1] + '/000'
    var TexN_To = this.datas.exciseCode + year[1] + '/000'
    this.dataFillter.patchValue({
      texC: TexC_To,
      texN: TexN_To
    })
  }

  onSubmit() {
    var startdate1 = this.dataFillter.value.startDate
    var startyear = this.dataFillter.value.startDate[6] + this.dataFillter.value.startDate[7] + this.dataFillter.value.startDate[8] + this.dataFillter.value.startDate[9]
    var endDate1 = this.dataFillter.value.endDate
    var endyear = this.dataFillter.value.endDate[6] + this.dataFillter.value.endDate[7] + this.dataFillter.value.endDate[8] + this.dataFillter.value.endDate[9]
    this.dataStartConvate = `${startyear - 543}${startdate1[3]}${startdate1[4]}`
    this.dataEndConvate = `${endyear - 543}${endDate1[3]}${endDate1[4]}`
    this.dataFillter.patchValue({
      YearMonthFrom: this.dataStartConvate,
      YearMonthTo: this.dataEndConvate
    })
    console.log("dataFillter : ", this.dataFillter.value)
    // var offCodeTo = this.dataFilterIdParams[0].exciseCode;
    // this.dataFillter.patchValue({
    //   offCode: offCodeTo
    // });
    // this.ajax.post("ia/int06/06/list", this.dataFillter.value, res => {
    //   this.dataTableList = res.json().data;
    //   console.log("dataTableList :", this.dataTableList);
    //   this.initDatatable();
    // });
  }

  calenda = () => {
    $("#dateF").calendar({
      endCalendar: $("#dateT"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dateFillter.patchValue({
          startDate: text
        })
      }
    })

    $("#dateT").calendar({
      startCalendar: $("#dateF"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dateFillter.patchValue({
          endDate: text
        })
      }
    })
  }

  inDataTable() {
    this.dataTable = $("#table").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      data: this.dataInTable,
      columns: [
        {//1
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {//2
          data: "receiptDate", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//3
          data: "depositDate", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//4
          data: "sendDate", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//5
          data: "incomeName", className: "text-left",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//6
          data: "taxPrintNo", className: "text-center",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//7
          data: "receiptNo", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//8
          data: "netTaxAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//9
          data: "checkedAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//10
          data: "netLocAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//11
          data: "locOthAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//12
          data: "locExpAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//13
          data: "olderFundAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//14
          data: "sumAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//15
          data: "sendAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//16
          data: "customAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }, {//17
          data: "stampAmount", className: "text-right",
          render(data) {
            return new IsEmptyPipe().transform(data, [])
          }
        }
      ]
    })
  }

  dateSearch() {
    this.dateFillter.patchValue({
      officeCode: this.datas.exciseCode
    })
    this.selfService.dateFillter(this.dateFillter).then(data => {
      console.log(data)
      this.showDetail = true
      this.dataInTable = data
      setTimeout(() => {
        this.inDataTable()
        // this.dataTable.clear().draw()
        // this.dataTable.rows.add(this.dataInTable).draw()
        // this.dataTable.columns.adjust().draw();
      }, 200);
    }).catch(err => {
      this.showDetail = false
    })
  }

  dataSearch() {
    this.submitted = true
    console.log("dataSearch => ", this.dataFillter.value);

  }

  invalidDataFillterControl(control: string) {
    return this.dataFillter.get(control).invalid && (this.dataFillter.get(control).touched || this.submitted);
  }
}


