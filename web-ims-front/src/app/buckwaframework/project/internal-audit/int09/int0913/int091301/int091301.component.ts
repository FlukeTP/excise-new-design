import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
import { Utils } from 'helpers/utils';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import * as moment from 'moment';
import { DepartmentDropdownService } from 'services/department-dropdown.service';

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ia/int091301/find-091301-search",
  GET_DEPARTMENT: "ia/int091301/get-091301-department",
  DELETE: "ia/int091301/find-091302-delete"
}

declare var $: any;
@Component({
  selector: 'app-int091301',
  templateUrl: './int091301.component.html',
  styleUrls: ['./int091301.component.css']
})
export class Int091301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];

  formHeader: FormGroup = new FormGroup({});
  submitted: boolean;
  dataTable: any;
  // department: FormGroup = new FormGroup({});
  flagBtn: string = "1";
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) { }

  ngOnInit() {
    this.initVariable();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    // this.getDepartmentLogin();
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown();
    // .css("width", "100%");
    this.calendar();
    $('#ShowDataTable1').hide();
    $('#ShowDataTable2').hide();
    this.datatable();
  }

  // getDepartmentLogin() {
  //   this.ajax.doGet(`${URL.GET_DEPARTMENT}`).subscribe((response: ResponseData<any>) => {
  //     if (MessageService.MSG.SUCCESS == response.status) {
  //       this.formHeader.get('officeCode').patchValue(response.data.officeCode);
  //       this.formHeader.get('sector').patchValue(new IsEmptyPipe().transform(response.data.sector));
  //       this.formHeader.get('area').patchValue(new IsEmptyPipe().transform(response.data.area));
  //       this.formHeader.get('branch').patchValue(new IsEmptyPipe().transform(response.data.branch));
  //       this.formHeader.get('offShortName').patchValue(new IsEmptyPipe().transform(response.data.offShortName));
  //       console.log(this.formHeader.value);
  //     } else {
  //       this.msg.errorModal(response.message);
  //     }
  //   }, err => {
  //     this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
  //   });
  // }

  search() {
    this.formHeader.get('flagSearch').patchValue("Y");
    this.dataTable.ajax.reload();
  }

  routeTo(path: string, value?: any, value2?: any, value3?: any) {
    this.router.navigate([path], {
      queryParams: {
        id: value,
        param2: value2,
        budgetYear: value3
      }
    });
  }

  changeFlagBtn(flagBtn: string) {
    this.flagBtn = flagBtn;
    this.formHeader.get('ubillType').patchValue(flagBtn);
    this.datatable();
  }

  clearValue() {
    this.areas = [];
    this.branch = [];
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    this.formHeader.reset();
    this.initVariable();
    this.changeFlagBtn("1")
    this.dataTable.ajax.reload();
  }

  /* _________________ initVariable _________________ */
  initVariable() {
    this.formHeader = this.fb.group({
      budgetYear: [MessageService.budgetYear()],
      monthWdPayFrom: [""],
      monthWdPayTo: [""],
      ubillType: ["1"],
      flagSearch: ["N"],

      /* departmentVo */
      sector: [""],
      area: [""],
      branch: [""],
      officeCode: [""],
      offShortName: [""],
    });
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#budgetYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formHeader.get('budgetYear').patchValue(text);
      }
    }).css("width", "100%");

    $('#monthWdPayFromCld').calendar({
      endCalendar: $("#monthWdPayToCld"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formHeader.get('monthWdPayFrom').patchValue(text);
      }
    }).css("width", "100%");

    $('#monthWdPayToCld').calendar({
      startCalendar: $("#monthWdPayFromCld"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formHeader.get('monthWdPayTo').patchValue(text);
      }
    }).css("width", "100%");
  }

  /* _________________ datatable _________________ */
  datatable = () => {
    if (Utils.isNotNull(this.dataTable)) {
      this.dataTable.destroy();
    }

    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };

    if (this.flagBtn === '3' || this.flagBtn === '4') {
      $('#ShowDataTable2').hide();
      $('#ShowDataTable1').show();
      this.dataTable = $("#dataTable").DataTableTh({
        lengthChange: true,
        searching: false,
        ordering: false,
        processing: true,
        serverSide: false,
        paging: true,
        ajax: {
          type: "POST",
          url: URL.SEARCH,
          contentType: "application/json",
          data: (d) => {
            return JSON.stringify($.extend({}, d, this.formHeader.value));
          }
        },
        columns: [
          // row 0
          {
            data: "monthWdPay",
            render: renderString
          },
          // row 1
          {
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          },
          // row 2
          {
            data: "invoiceMonth",
            render: renderString
          },
          // row 3
          {
            data: "invoiceNo",
            render: renderString
          },
          // row 4
          {
            data: "telInvNumber",
            render: renderString
          },
          // row 5
          {
            data: "invoiceDate",
            render: renderString
          },
          // row 6
          {
            data: "receiveInvDate",
            render: renderString
          },
          // row 7
          {
            data: "invoiceAmt",
            render: renderNumber
          },
          // row 8
          {
            data: "reqWdDate",
            render: renderString
          },
          // row 9
          {
            data: "reqWdNo",
            render: renderString
          },
          // row 10
          {
            data: "reqWdAmt",
            render: renderNumber
          },
          // row 11
          {
            data: "reqTaxAmt",
            render: renderNumber
          },
          // row 12
          {
            data: "reqNetAmt",
            render: renderNumber
          },
          // row 13
          {
            data: "reqPayNo",
            render: renderString
          },
          // row 14
          {
            data: "reqReceiptDate",
            render: renderString
          },
          // row 15
          {
            render: (data, type, full, meta) => {
              return this.calculateDay(full.reqWdDate, full.receiveInvDate);
            }
          },
          // row 16
          {
            data: "latePayCause",
            render: renderString
          },
          // row 17
          {
            data: "ubillRemark",
            render: renderString
          },
          // row 18
          {
            render: function (data, type, full, meta) {
              let btn = "";
              btn += `<button type="button" class="ui mini button yellow" id="edit-${full.utilityBillSeq}"><i class="eye icon"></i>แก้ไข</button>`;
              // btn += `<button type="button" class="ui mini button red" id="delete-${full.utilityBillSeq}"><i class="trash icon"></i>ลบ</button>`;
              return btn;
            }
          }
        ],
        columnDefs: [
          { targets: [0, 1, 2, 4, 5, 6, 14], className: "center" },
          { targets: [3, 7, 9, 10, 11, 12, 13, 15], className: "right" }
        ]
      });
    } else {
      $('#ShowDataTable1').hide();
      $('#ShowDataTable2').show();
      this.dataTable = $("#dataTable2").DataTableTh({
        lengthChange: true,
        searching: false,
        ordering: false,
        processing: true,
        serverSide: false,
        paging: true,
        ajax: {
          type: "POST",
          url: URL.SEARCH,
          contentType: "application/json",
          data: (d) => {
            return JSON.stringify($.extend({}, d, this.formHeader.value));
          }
        },
        columns: [
          // row 0
          {
            data: "monthWdPay",
            render: renderString
          },
          // row 1
          {
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          },
          // row 2
          {
            data: "invoiceMonth",
            render: renderString
          },
          // row 3
          {
            data: "invoiceNo",
            render: renderString
          },
          // row 4
          // {
          //   data: "telInvNumber",
          //   render: renderString
          // },
          // row 5
          {
            data: "invoiceDate",
            render: renderString
          },
          // row 6
          {
            data: "receiveInvDate",
            render: renderString
          },
          // row 7
          {
            data: "invoiceAmt",
            render: renderNumber
          },
          // row 8
          {
            data: "reqWdDate",
            render: renderString
          },
          // row 9
          {
            data: "reqWdNo",
            render: renderString
          },
          // row 10
          {
            data: "reqWdAmt",
            render: renderNumber
          },
          // row 11
          {
            data: "reqTaxAmt",
            render: renderNumber
          },
          // row 12
          {
            data: "reqNetAmt",
            render: renderNumber
          },
          // row 13
          {
            data: "reqPayNo",
            render: renderString
          },
          // row 14
          {
            data: "reqReceiptDate",
            render: renderString
          },
          // row 15
          {
            render: (data, type, full, meta) => {
              return this.calculateDay(full.reqWdDate, full.receiveInvDate);
            }
          },
          // row 16
          {
            data: "latePayCauseStr",
            render: renderString
          },
          // row 17
          {
            data: "ubillRemark",
            render: renderString
          },
          // row 18
          {
            render: function (data, type, full, meta) {
              let btn = "";
              btn += `<button type="button" class="ui mini button yellow" id="edit-${full.utilityBillSeq}"><i class="eye icon"></i>แก้ไข</button>`;
              // btn += `<button type="button" class="ui mini button red" id="delete-${full.utilityBillSeq}"><i class="trash icon"></i>ลบ</button>`;
              return btn;
            }
          }
        ],
        columnDefs: [
          { targets: [0, 1, 2, 4, 5, 7, 13], className: "center" },
          { targets: [3, 6, 8, 9, 10, 11, 12, 14], className: "right" }
        ]
      });
    }
    /* ___________ call button in datatable ___________ */
    this.clickTdButton();
  }

  clickTdButton = () => {
    this.dataTable.on("click", "button", e => {
      let dataRow = this.dataTable.row($(e.currentTarget).closest("tr")).data();
      const { id } = e.currentTarget;
      if (Utils.isNotNull(dataRow)) {
        if (id.split("-")[0] === 'edit') {
          this.routeTo('/int09/13/02', dataRow.utilityBillSeq, this.formHeader.get('officeCode').value)
        } else if (id.split("-")[0] === 'delete') {
          this.msg.comfirm((c) => {
            if (c) {
              this.ajax.doPost(`${URL.DELETE}/${dataRow.utilityBillSeq}`, {}).subscribe((response: ResponseData<any>) => {
                if (MessageService.MSG.SUCCESS == response.status) {
                  this.msg.successModal(response.message);
                  this.dataTable.ajax.reload();
                } else {
                  this.msg.errorModal(response.message);
                }
              }), error => {
                this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
              };
            }
          }, MessageService.MSG_CONFIRM.DELETE)
        }
      }
    });
  }

  dropdownChange(e, flagDropdown: string) {
    if ("0" != e.target.value && "" != e.target.value) {
      /* ____________ set office code ____________ */
      if (flagDropdown === 'SECTOR') {
        this.formHeader.get('officeCode').setValue(this.formHeader.get('sector').value);
        /* ____________ clear dropdown ____________ */
        this.areas = [];
        this.branch = [];
        $("#area").dropdown('restore defaults');
        $("#branch").dropdown('restore defaults');

        /* ____________ set default value ____________ */
        this.formHeader.patchValue({ area: "0" });
        /* ____________ get area list ____________  */
        this.department.getArea(this.formHeader.get('officeCode').value).subscribe(response => { this.areas = response.data });
      } else if (flagDropdown === 'AREA') {
        this.formHeader.get('officeCode').patchValue(this.formHeader.get('area').value);

        /* ____________ set default value ____________ */
        this.formHeader.patchValue({ branch: "0" });

        /* ____________ get branch list ____________  */
        this.department.getBranch(this.formHeader.get('officeCode').value).subscribe(response => { this.branch = response.data });
      } else if (flagDropdown === 'BRANCH') {
        this.formHeader.get('officeCode').patchValue(this.formHeader.get('branch').value);
      }
    }
  }

  /* _________________ calculate difference day _________________ */
  calculateDay(startDate: string, endDate: string) {
    let _endDate = moment(endDate, "DD/MM/YYYY");
    let _start = moment(startDate, "DD/MM/YYYY")

    if (!isNaN(_endDate.diff(_start, 'days'))) {
      return _start.diff(_endDate, 'days');
    } else {
      return "-";
    }
  }

}
