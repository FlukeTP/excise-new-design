import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { IsNaNPipe } from 'app/buckwaframework/common/pipes/isnan.pipe';

const URL = {
  SEARCH_TAB_I: AjaxService.CONTEXT_PATH + "ia/int08/02/search-tab1",
  SEARCH_TAB_II: AjaxService.CONTEXT_PATH + "ia/int08/02/search-tab2",
  GET_DROPDOWN: "preferences/org-gfmis/find/disburseunit-and-name",
  GET_RANGE_PERIOD: "ia/int08/02/get-range-period"
}
declare let $: any;
@Component({
  selector: 'app-int0802',
  templateUrl: './int0802.component.html',
  styleUrls: ['./int0802.component.css']
})
export class Int0802Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบบัญชี", route: "#" },
    { label: "ตรวจสอบงบทดลองกระทบยอด เดบิต เครดิต บัญชีแยกประเภท", route: "#" },
  ];

  formSearch: FormGroup = new FormGroup({});
  loading: boolean = false;
  flagHdr: string = 'A';
  gfDisburseUnitList: any[] = [];
  periodFromList: any[] = [];
  dataTable: any;
  submitted: boolean = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initialletiable();
    this.getGfDisburseUnitDropdown();
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown();
    // .css("width", "100%")
    this.calendar();
    this.datatable();
  }

  getGfDisburseUnitDropdown() {
    this.ajax.doPost(URL.GET_DROPDOWN, {}).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.gfDisburseUnitList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  dropdownChange(e) {
    e.preventDefault();
    /* _____________ set value gfExciseName _____________ */
    // this.formSearch.get('gfExciseName').patchValue(this.gfDisburseUnitList.filter(obj => obj.gfDisburseUnit == e.target.value)[0].gfExciseName);

    /* _____________ get dropdown period _____________ */
    this.periodFromList = [];
    this.ajax.doGet(`${URL.GET_RANGE_PERIOD}/${e.target.value}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.periodFromList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  search() {
    this.submitted = true;
    // if (this.formSearch.get('periodTo').value.length >= 3) {
    //   this.formSearch.get('periodTo').clearValidators();
    //   this.formSearch.get('periodTo').updateValueAndValidity();
    // } else {
    //   this.formSearch.get('periodTo').setValidators([Validators.maxLength(3)]);
    //   this.formSearch.get('periodTo').updateValueAndValidity();
    // }
    if (this.formSearch.invalid) {
      return this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
    }
    this.formSearch.get('flagSearch').patchValue("Y");
    this.dataTable.ajax.reload();
    // this.ajax.doPost(URL.SEARCH, this.formSearch.value).subscribe((response: ResponseData<any>) => {
    //   if (MessageService.MSG.SUCCESS === response.status) {
    //     this.datatable = response.data;
    //   } else {
    //     this.msg.errorModal(response.message);
    //   }
    // }, err => {
    //   this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    // });
  }

  changeFlagBtn(flag: string) {
    this.flagHdr = flag;
    this.formSearch.get('flagSearch').patchValue("N");
    this.datatable();
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

    if (this.flagHdr === 'A') {
      $('#ShowDataTable2').hide();
      $('#ShowDataTable1').show();
      this.dataTable = $("#dataTable").DataTableTh({
        // fixedHeader: {
        //   header: true,
        //   headerOffset: $('#pageHeader').outerHeight()
        // },
        lengthChange: false,
        searching: false,
        ordering: false,
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: false,
        // "scrollY": "350px",
        ajax: {
          type: "POST",
          url: URL.SEARCH_TAB_I,
          contentType: "application/json",
          data: (d) => {
            return JSON.stringify($.extend({}, d, this.formSearch.value));
          }
        },
        columns: [
          {
            data: "accNo",
            render: renderString,
            className: "text-center"
          },
          {
            data: "accName",
            render: renderString
          },
          {
            data: "bringForward",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "debit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "credit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "carryForward",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "debit2",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "credit2",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "diffDebit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "diffCredit",
            render: renderNumber,
            className: "text-right"
          }
        ],
        // "createdRow": (row, data, dataIndex) => {
        //   if (data.accName === 'รวม') {
        //     $(row).css("background-color", "#cccc");
        //   }
        // }
        "footerCallback": function (row, data, start, end, display) {
          var api = this.api(), data;

          if (data.length > 0) {
            // converting to interger to find total
            let intVal = function (type) {
              switch (typeof (type)) {
                case 'string': type = type.replace(/[\$,]/g, '');
                  break;
                case 'number': type = type;
                  break;
                default: type = 0;
                  break;
              }
              return type;
            };

            let reducer = function (a, b) { return intVal(a) + intVal(b) }
            // computing column Total of the complete result 
            let sumColumn2 = api.column(2).data().reduce(reducer, 0);
            let sumColumn3 = api.column(3).data().reduce(reducer, 0);
            let sumColumn4 = api.column(4).data().reduce(reducer, 0);
            let sumColumn5 = api.column(5).data().reduce(reducer, 0);
            let sumColumn6 = api.column(6).data().reduce(reducer, 0);
            let sumColumn7 = api.column(7).data().reduce(reducer, 0);
            let sumColumn8 = api.column(8).data().reduce(reducer, 0);
            let sumColumn9 = api.column(9).data().reduce(reducer, 0);

            /* ____________ set data on column ____________ */
            let formatNumber = function (data) {
              return '<b>' + $.fn.dataTable.render.number(",", ".", 2, "").display(data) + '</b>';
            }
            $(api.column(2).footer()).html(formatNumber(sumColumn2));
            $(api.column(3).footer()).html(formatNumber(sumColumn3));
            $(api.column(4).footer()).html(formatNumber(sumColumn4));
            $(api.column(5).footer()).html(formatNumber(sumColumn5));
            $(api.column(6).footer()).html(formatNumber(sumColumn6));
            $(api.column(7).footer()).html(formatNumber(sumColumn7));
            $(api.column(8).footer()).html(formatNumber(sumColumn8));
            $(api.column(9).footer()).html(formatNumber(sumColumn9));
          } else {
            /* __________ clear data in footer __________ */
            $(api.column(2).footer()).html('');
            $(api.column(3).footer()).html('');
            $(api.column(4).footer()).html('');
            $(api.column(5).footer()).html('');
            $(api.column(6).footer()).html('');
            $(api.column(7).footer()).html('');
            $(api.column(8).footer()).html('');
            $(api.column(9).footer()).html('');
          }
        }
      });
    } else {
      $('#ShowDataTable1').hide();
      $('#ShowDataTable2').show();
      this.dataTable = $("#dataTable2").DataTableTh({
        lengthChange: false,
        searching: false,
        ordering: false,
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: false,
        // fixedHeader: {
        //   header: true
        // },
        // "scrollY": "350px",
        ajax: {
          type: "POST",
          url: URL.SEARCH_TAB_II,
          contentType: "application/json",
          data: (d) => {
            return JSON.stringify($.extend({}, d, this.formSearch.value));
          }
        },
        columns: [
          {
            data: "accNo",
            render: renderString,
            className: "text-center"
          },
          {
            data: "accName",
            render: renderString
          },
          {
            data: "bringForward",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "debit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "credit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "carryForward",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "debit2",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "credit2",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "debit3",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "credit3",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "diffDebit",
            render: renderNumber,
            className: "text-right"
          },
          {
            data: "diffCredit",
            render: renderNumber,
            className: "text-right"
          },
        ],
        // "createdRow": (row, data, dataIndex) => {
        //   if (data.accName === 'รวม') {
        //     $(row).css("background-color", "#cccc");
        //   }
        // }
        "footerCallback": function (row, data, start, end, display) {
          var api = this.api(), data;

          if (data.length > 0) {
            // converting to interger to find total
            let intVal = function (type) {
              switch (typeof (type)) {
                case 'string': type = type.replace(/[\$,]/g, '');
                  break;
                case 'number': type = type;
                  break;
                default: type = 0;
                  break;
              }
              return type;
            };

            let reducer = function (a, b) { return intVal(a) + intVal(b) }
            // computing column Total of the complete result 
            let sumColumn2 = api.column(2).data().reduce(reducer, 0);
            let sumColumn3 = api.column(3).data().reduce(reducer, 0);
            let sumColumn4 = api.column(4).data().reduce(reducer, 0);
            let sumColumn5 = api.column(5).data().reduce(reducer, 0);
            let sumColumn6 = api.column(6).data().reduce(reducer, 0);
            let sumColumn7 = api.column(7).data().reduce(reducer, 0);
            let sumColumn8 = api.column(8).data().reduce(reducer, 0);
            let sumColumn9 = api.column(9).data().reduce(reducer, 0);
            let sumColumn10 = api.column(10).data().reduce(reducer, 0);
            let sumColumn11 = api.column(11).data().reduce(reducer, 0);
            let formatNumber = function (data) {
              return '<b>' + $.fn.dataTable.render.number(",", ".", 2, "").display(data) + '</b>';
            }
            /* ____________ set data on column ____________ */
            $(api.column(2).footer()).html(formatNumber(sumColumn2));
            $(api.column(3).footer()).html(formatNumber(sumColumn3));
            $(api.column(4).footer()).html(formatNumber(sumColumn4));
            $(api.column(5).footer()).html(formatNumber(sumColumn5));
            $(api.column(6).footer()).html(formatNumber(sumColumn6));
            $(api.column(7).footer()).html(formatNumber(sumColumn7));
            $(api.column(8).footer()).html(formatNumber(sumColumn8));
            $(api.column(9).footer()).html(formatNumber(sumColumn9));
            $(api.column(10).footer()).html(formatNumber(sumColumn10));
            $(api.column(11).footer()).html(formatNumber(sumColumn11));
          } else {
            /* __________ clear data in footer __________ */
            $(api.column(2).footer()).html('');
            $(api.column(3).footer()).html('');
            $(api.column(4).footer()).html('');
            $(api.column(5).footer()).html('');
            $(api.column(6).footer()).html('');
            $(api.column(7).footer()).html('');
            $(api.column(8).footer()).html('');
            $(api.column(9).footer()).html('');
            $(api.column(10).footer()).html('');
            $(api.column(11).footer()).html('');
          }
        }
      });
    }
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#fromYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('fromYear').patchValue(text);
      }
    }).css("width", "100%");

    $('#toYearCld').calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter('year'),
      onChange: (date, text) => {
        this.formSearch.get('toYear').patchValue(text);
      }
    }).css("width", "100%");
  }

  initialletiable() {
    /* __________________ formSearch _____________________ */
    this.formSearch = this.fb.group({
      gfDisburseUnit: ['', Validators.required],
      periodFrom: ['', Validators.required],
      periodTo: ['', [Validators.required, Validators.minLength(3)]],
      fromYear: [(Number(MessageService.budgetYear()) - 1).toString()],
      toYear: [MessageService.budgetYear()],
      flagSearch: ['N']
    });
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formSearch.get(control).invalid;
  }

}