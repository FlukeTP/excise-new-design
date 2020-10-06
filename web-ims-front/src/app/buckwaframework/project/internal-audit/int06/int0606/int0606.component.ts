import { Component, OnInit } from "@angular/core";
import { AjaxService } from "../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../common/services/message-bar.service";
import { Router, ActivatedRoute } from "@angular/router";
import { TextDateTH, formatter } from '../../../../common/helper/datepicker';
import { BreadCrumb, ResponseData } from "models/index";
import { AuthService } from "services/auth.service";
import { DecimalFormat } from "helpers/index";
import { MessageService } from 'services/message.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';
declare var $: any;

const URL = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
}

@Component({
  selector: "int0606",
  templateUrl: "./int0606.component.html",
  styleUrls: ["./int0606.component.css"]
})
export class Int0606Component implements OnInit {
  breadcrumb: BreadCrumb[];
  startDate: any = '';
  endDate: any = '';
  offCode: any;
  dataTableList: any[];
  lic: Lic;
  datatable: any;
  loading: boolean = false;
  idinspec: any;
  dataFilterIdParams: any = [];
  dataFillter: FormGroup
  dataConCri: FormGroup
  datas: any;
  datass :any;
  constructor(
    private router: Router,
    private ajax: AjaxService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private formBuilder: FormBuilder,
  ) {
    this.dataTableList = [];
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบรายได้", route: "#" },
      { label: "ตรวจสอบใบอนุญาต", route: "#" }
    ];
    this.dataFillter = this.formBuilder.group({
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      offCode: ["", Validators.required]
    });

    this.dataConCri = this.formBuilder.group({
      id : ["", Validators.required],
      detectedObserved: ["", Validators.required],
      whatShouldBe: ["", Validators.required],
      issues: ["", Validators.required]
      // budgetYear: ["", Validators.required],
      // exciseCode: ["", Validators.required]
    })
  }

  ngOnInit() {
    this.idinspec = this.route.snapshot.queryParams["id"];
    console.log("idinspec : ", this.idinspec);
    this.getData();
    this.lic = new Lic();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    $("#idint").hide();
    $("#id").hide();

  }

  ngAfterViewInit(): void {
    this.calenda();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.search").css("width", "100%");
  }

  getData() {
    let id = this.idinspec;
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilterIdParams = response.data;
        this.datas = this.dataFilterIdParams[0];
        console.log(this.dataFilterIdParams.length);
        console.log("response int 10/01 : ", this.dataFilterIdParams);
        this.getIdHdr();
        this.onSubmit();
      } else {
        this.messageBarService.errorModal(response.message);
      }
    }, err => {
      this.messageBarService.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  onSubmit() {
    var offCodeTo = this.dataFilterIdParams[0].exciseCode;
    this.dataFillter.patchValue({
      offCode: offCodeTo
    });
    this.ajax.post("ia/int06/06/list", this.dataFillter.value, res => {
      this.dataTableList = res.json().data;
      console.log("dataTableList :", this.dataTableList);
      this.initDatatable();
    });
  }


  calenda = () => {
    $("#dateF").calendar({
      endCalendar: $("#dateT"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFillter.patchValue({
          startDate: text
        });
      }
    });

    $("#dateT").calendar({
      startCalendar: $("#dateF"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFillter.patchValue({
          endDate: text
        });
      }
    });
  }

  reset() {
    $(".ui.dropdown").dropdown('restore defaults');
    $("#startDate").val('');
    $("#endDate").val('');
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.startDate = '';
    this.endDate = '';
  }

  popupEditData() {
    $("#modalEditData").modal("show");
    $("#modalInt062").modal("show");
    $("#idint").show();
    $("#id").show();
    $("#selectTrading").show();
  }

  closePopupEdit() {
    $("#selectTrading").show();
    $("#modalEditData").modal("hide");
    $("#modalInt062").modal("hide");
  }

  addPrint(event) { }

  initDatatable(): void {
    if (this.datatable != null) {
      this.datatable.destroy();
    }
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: false,
      data: this.dataTableList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        },
        {
          data: "licensDate",
          className: "center",
          render(data) {
            return new DateStringPipe().transform(data, false)
          }
        },
        {
          data: "dateRemittance",
          className: "center",
          render(data) {
            return new DateStringPipe().transform(data, false)
          }
        },
        {
          data: "licenseType"
        },
        {
          data: "printNumber",
          className: "center"
        },
        {
          data: "licenseNumber",
          className: "center"
        },
        {
          data: "amountOutSystem",
          className: "right"
        },
        {
          data: "amountCopyLicense",
          className: "right"
        },
        {
          data: "amountFees",
          className: "right"
        },
        {
          data: "interiorCostAmount",
          className: "right"
        },
        {
          data: "total",
          className: "center",
        },
        {
          data: "dateLicenseEffective",
          className: "center",
          render(data) {
            return new DateStringPipe().transform(data, false)
          }
        },
        {
          data: "licenseExpiratDate",
          className: "center",
          render(data) {
            return new DateStringPipe().transform(data, false)
          }
        }
      ],
      // columnDefs: [
      //   { targets: [0, 1, 2, 11, 12], className: "center aligned" },
      //   { targets: [6, 7, 8, 9], className: "right aligned" }
      // ], rowCallback: (row, data, index) => {
      //   $("td > .licNo", row).bind("click", () => {
      //     console.log('row', row);
      //     console.log('data', data);
      //     console.log('index', index);
      //     this.lic = data;
      //   })
      // }, createdRow: function (row, data, dataIndex) {
      //   console.log(row);
      //   console.log(data);
      //   if (data.licAmount != null && data.licAmount != data.licPrice) {
      //     $(row).find('td:eq(6)').addClass('bg-c-red');
      //     $(row).find('td:eq(7)').addClass('bg-c-red');
      //   }
      // }
    });
  }

  dateFormat(date: string): string {
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6);
    return (date && date != null) ? `${day}/${month}/${year}` : "-";
  }

  df(what): string {
    const df = new DecimalFormat("###,###.00");
    return df.format(what);
  }

  round(num: number): string {
    return this.df(parseFloat(num.toString()).toFixed(2));
  }

  editDataInlist() {
    this.dataTableList.forEach(element => {
      if (element.licNo == this.lic.licNo) {
        element.printCode = this.lic.printCode;
        element.licAmount = this.lic.licAmount;
      }
    });
    this.lic = new Lic();
    this.initDatatable();
  }

  nextPage() {
    this.router.navigate(["/int01/2/3"], {
      queryParams: {
        offCode: this.offCode,
        startDate: this.startDate,
        endDate: this.endDate
      }
    });
  }

  getIdHdr() {
    console.log("4444444444444");
    
    var URL = "ia/int06/06/FindIdHdr";
    this.ajax.doPost(URL, {
      "budgetYear": this.datas.budgetYear,
      "exciseCode": this.datas.exciseCode
    }).subscribe((res: ResponseData<any>) => {
      this.datass = res.data[0].id
      console.log("datass : ",this.datass);
    })
  }

  saveAllData() {
    this.dataConCri.patchValue({
      id: this.datass,
      issues: "ตรวจสอบใบอนุญาตสุรา ยาสูบ ไพ่"
      // budgetYear: this.datas.budgetYear,
      // exciseCode: this.datas.exciseCode
    })
    this.messageBarService.comfirm((comfirm) => {
      if (comfirm) {
        var URL = "ia/int06/06/saveConcludeFollow";
        this.ajax.doPost(URL, this.dataConCri.value ).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBarService.successModal(res.message)
          } else {
            this.messageBarService.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึก")
  }
}
export class Lic {
  printCode: any = '';
  licNo: any = '';
  licAmount: any = 0;
}
