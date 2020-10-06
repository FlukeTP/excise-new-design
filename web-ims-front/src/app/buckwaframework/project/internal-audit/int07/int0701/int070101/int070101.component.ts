import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { MessageService } from 'services/message.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;

const URL = {
  export: "ia/int0511/exportFile",
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params"
}

@Component({
  selector: 'app-int070101',
  templateUrl: './int070101.component.html',
  styleUrls: ['./int070101.component.css']
})
export class Int070101Component implements OnInit {
  // BreadCrumb
  breadcrumb: BreadCrumb[];

  sector: any;
  area: any;
  branch: any;
  statusList: any;
  datas: any;
  $form: any;
  listFileName: any;
  showData: boolean = true;
  loading: boolean = false;
  riskType: string = "";
  idinspec: any;
  dataFilterIdParams: any = [];
  officeCode: any;
  areato: any;
  startDate: any;
  endDate: any;
  statussead: any;
  tabled: any = null;
  dataFillter: FormGroup

  constructor(
    //private authService: AuthService,
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private message: MessageBarService,
    private msg: MessageBarService,
    private route: ActivatedRoute) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบพัสดุ", route: "#" },
      { label: "ตรวจสอบแสตมป์", route: "#" },
    ];

    this.dataFillter = this.formBuilder.group({
      status: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      offCode:["" ,Validators.required]
    });
  }

  ngOnInit() {
    this.idinspec = this.route.snapshot.queryParams["id"];
    $(".ui.dropdown.ai").dropdown().css('width', '100%');
    this.getData();
    this.table();
  }

  ngAfterViewInit() {
    this.calenda();
  }

  onSubmit(e) {
    this.dataFillter.patchValue({
      offCode : this.officeCode
    });
    this.table();
    $("#dataTable").DataTable().ajax.reload();
  }

  getData() {
    let id = this.idinspec;
    this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dataFilterIdParams = response.data;
        this.datas = this.dataFilterIdParams[0];
        this.officeCode = this.datas.exciseCode;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
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

  onClear = () => {
    console.log("Clear");
    $(".ui.dropdown.ai").dropdown('restore defaults');
    $("#dateForm").val("");
    $("#dateTo").val("");
    $("#searchFlag").val("FALSE");
    $("#dataTable").DataTable().ajax.reload();
  }

  table = () => {
    if (this.tabled) {
      this.tabled.destroy();
    }
    this.tabled = $("#dataTable").DataTableTh({
      serverSide: true,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      ajax: {
        type: "POST",
        url: AjaxService.CONTEXT_PATH + "ia/int07/01/01/list",
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.dataFillter.value));
        }
      },
      "columns": [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "ui center aligned"
        }, {
          data: "dateRecPayRe",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        }, {
          data: "statusRecPay",
          className: "ui center aligned"
        }, {
          data: "agenAcceptPayStamps",
          className: "ui left aligned"
        }, {
          data: "bookNumRequestStamp",
          className: "ui left aligned"
        }, {
          data: "dateRequestStamp",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        }, {
          data: "bookNumSendStamps",
          className: "ui left aligned"
        }, {
          data: "dateSendStamps",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        }, {
          data: "leafNum5",
          className: "ui left aligned"
        }, {
          data: "downDate",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        }, {
          data: "countDate",
          className: "ui center aligned",
          render(data){
            return new DateStringPipe().transform(data , false)
          }
        }, {
          data: "reviewer1",
          className: "ui left aligned"
        }, {
          data: "reviewer2",
          className: "ui left aligned"
        }, {
          data: "reviewer3",
          className: "ui left aligned"
        }, {
          data: "stampTypePacksize",
          className: "ui left aligned"
        }, {
          data: "numBook",
          className: "ui right aligned"
        }, {
          data: "numHoroscope",
          className: "ui right aligned",
          render: function (data) {
            return Utils.moneyFormatInt(data);
          }
        }, {
          data: "printBahtPerHor",
          className: "ui right aligned",
          render: function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          data: "includPrintFeeB",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "taxBaht",
          "className": "ui right aligned",
          "render": function (data) {
            return Utils.moneyFormat(data);
          }
        }, {
          "data": "stampCodeStart",
          "className": "ui left aligned"
        }, {
          "data": "stampCodeEnd",
          "className": "ui left aligned"
        }
        // , {
        //   "render": function (data, type, row) {
        //     return null
        //   }
        // }, {
        //   "render": function (data, type, row) {
        //     var btn = '';
        //     // btn += '<button class="ui mini blue button btn-detail"><i class="eye icon"></i>รายละเอียด</button>';
        //     btn += '<button class="ui mini yellow button btn-edit"><i class="edit icon"></i>แก้ไข</button>';
        //     btn += '<button class="ui mini red button btn-delete"><i class="trash alternate icon"></i>ลบ</button>';
        //     return btn;
        //   },
        //   "className": "ui center aligned"
        // }
      ]
    });

    // table.on('click', 'tbody tr button.btn-detail', (e) => {
    //   var closestRow = $(e.target).closest('tr');
    //   var data = table.row(closestRow).data();
    // });
  }
}

// export class FormSearch {
//   sector: string = "";
//   area: string = "";
//   branch: string = "";
//   dateFrom: string = "";
//   dateTo: string = "";
//   searchFlag: string = "FALSE";
// }
