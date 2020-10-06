import { Component, OnInit, ViewChild } from '@angular/core';
import { formatter, TextDateTH, Utils } from 'helpers/index';
import { BreadCrumb, ResponseData } from 'models/index';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Questionnaire, _Questionnaire } from '../int0202/int0202.mock';
import { Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';

declare var $: any;

const URL = {
  FILTER: AjaxService.CONTEXT_PATH + "ia/int0202/filter"
}

@Component({
  selector: "app-int0202",
  // host: { '(window:keydown)': 'hotkeys($event)' },
  templateUrl: "./int0202.component.html",
  styleUrls: ["./int0202.component.css"]
})
export class Int0202Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  searchForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  dataTable: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "ตอบแบบสอบถามระบบการควบคุมภายใน", route: "#" }
    ];
  }

  ngOnInit() {
    this.initVariable();
  }

  ngAfterViewInit() {
    //datatable
    this.datatable();
    this.clickTdButton();

    //calendar
    this.calendar();

    //dropdown
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  calendar() {
    $('#year').calendar({
      type: 'year',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date, text) => {
        this.searchForm.get('budgetYear').patchValue(text);
        this.dataTable.ajax.reload();
      }
    })

    $('#date1').calendar({
      endCalendar: $('#date2'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.searchForm.get('startDate').patchValue(text);
      }
    });

    $('#date2').calendar({
      startCalendar: $('#date1'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.searchForm.get('endDate').patchValue(text);
      }
    });
  }

  // handleSearch(e) {
  //   e.preventDefault();
  //   // this.submitted = true;
  //   this.dataTable.ajax.reload();
  // }

  datatable(): void {
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

    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.FILTER,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.searchForm.value));
        }
      },
      columns: [
        // row 0
        {
          className: "center",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        // row 1
        {
          data: "qtnHeaderName",
          render: renderString
        },
        // row 2
        // {
        //   data: "budgetYear",
        //   render: renderString
        // },
        // row 3
        {
          data: "note",
          render: renderString
        },
        // row 4
        // {
        //   data: "createdBy",
        //   render: renderString,
        // },
        // // row 5
        // {
        //   data: "createdDate",
        //   render: function (data, type, full, meta) {
        //     return full.createdDate == null ? "-" : new DateStringPipe().transform(full.createdDate, true);
        //   }
        // },
        // // row 6
        // {
        //   data: "updatedBy",
        //   render: renderString
        // },
        // // row 7
        // {
        //   data: "updatedDate",
        //   render: function (data, type, full, meta) {
        //     return full.updatedDate == null ? "-" : new DateStringPipe().transform(full.updatedDate, true);
        //   }
        // },
        // row 8
        {
          className: "center",
          data: "startDate",
          render: function (data, type, full, meta) {
            return full.startDate == null ? "-" : new DateStringPipe().transform(full.startDate, true);
          }
        },
        // row 9
        {
          className: "center",
          data: "endDate",
          render: function (data, type, full, meta) {
            return full.endDate == null ? "-" : new DateStringPipe().transform(full.endDate, true);
          }
        },
        // row 10
        {
          className: "center",
          data: "statusStr",
          render: renderString
        },
        // row 11
        {
          className: "center",
          render: function (data, type, full, meta) {
            let btn = "";
            if (full.status === '1' || full.status === '2') {
              btn = `<button type="button" class="ui mini button green" id="dtl-${full.id}"><i class="paper plane icon"></i>ตอบแบบสอบถาม</button>`;
            } else if (full.status === '3' || full.status === '4') {
              btn = `<button type="button" class="ui mini button blue" id="dtl-${full.id}"><i class="eye icon"></i>ดูรายละเอียด</button>`;
            }
            return btn;
          }
        }
      ],
    });
  }

  clickTdButton() {
    this.dataTable.on("click", "button", e => {
      let dataRow = this.dataTable.row($(e.currentTarget).closest("tr")).data();
      const { id } = e.currentTarget;
      console.log("dataRow: ", dataRow);
      if (Utils.isNotNull(dataRow)) {
        if (id.split("-")[0] === 'dtl') {
          // let _updatedBy = Utils.isNotNull(dataRow.updatedBy) ? dataRow.updatedBy : dataRow.createdBy;
          // let _updatedDateStr = Utils.isNotNull(dataRow.updatedDateStr) ? dataRow.updatedDateStr : dataRow.createdDateStr;
          this.router.navigate(['int02/02/01'], {
            queryParams: {
              idMadeHdr: dataRow.id,
              idHdr: dataRow.idHdr,
              // updatedBy: _updatedBy,
              // updatedDateStr: _updatedDateStr,
              budgetYear: dataRow.budgetYear,
              // status: dataRow.status
            }
          });
        }
      }
    });
  }

  initVariable() {
    const budgetYear = MessageService.budgetYear();
    this.searchForm = this.fb.group({
      budgetYear: [budgetYear],
      createdBy: [''],
      startDate: [''],
      endDate: [''],
      qtnName: ['']
    });
  }

}