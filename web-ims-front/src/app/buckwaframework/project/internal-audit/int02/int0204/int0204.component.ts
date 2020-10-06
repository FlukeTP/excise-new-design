import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter, Utils } from 'helpers/index';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ia/int02/04/filter",
  CANCEL_SEND: "ia/int02/04/cancel-send-qtn"
}
@Component({
  selector: 'app-int0204',
  templateUrl: './int0204.component.html',
  styleUrls: ['./int0204.component.css']
})
export class Int0204Component implements OnInit {

  breadcrumb: BreadCrumb[];
  searchForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  dataTable: any;
  test: string = "sasaas";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "ส่งแบบสอบถามระบบการควบคุมภายใน", route: "#" }
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
        setTimeout(() => {
          this.handleSearch({ preventDefault: () => console.log("Searching..") });
        }, 200);
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

  handleSearch(e) {
    e.preventDefault();
    // this.submitted = true;
    this.dataTable.ajax.reload();
  }

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
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.searchForm.value));
        }
      },
      columns: [
        // row 0
        {
          render: function (data, type, full, meta) {
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
        //   render: renderString
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
          data: "startDate",
          render: function (data, type, full, meta) {
            return full.startDate == null ? "-" : new DateStringPipe().transform(full.startDate, true);
          }
        },
        // row 9
        {
          data: "endDate",
          render: function (data, type, full, meta) {
            return full.endDate == null ? "-" : new DateStringPipe().transform(full.endDate, true);
          }
        },
        // row 10
        {
          data: "statusStr", className: "text-center",
          render: renderString
        },
        // row 11
        {
          className: "text-center",
          render: function (data, type, full, meta) {
            let btn = "";
            btn = `<button type="button" class="ui mini button blue dtl-s" id="dtl-${full.id}"><i class="eye icon"></i>รายละเอียด</button>`;
            // if (full.status === '1') {
            //   // btn += `<button type="button" class="ui mini button yellow" id="dtlSide-${full.id}"><i class="edit icon"></i>แก้ไข</button>`;
            //   btn += `<button type="button" class="ui mini button red" id="cancel-${full.id}">  <i class="trash icon"></i>ลบ</button>`
            // } 
            // else {
            //   btn += `<button type="button" class="ui mini button red" id="cancel-${full.id}" disabled>  <i class="trash icon"></i>ลบ</button>`
            // }
            // if (full.status === 'SUCCESS_HDR' || full.status === 'FINISH') {
            //   btn += `<button type="button" class="ui mini button red" id="cancel-${full.id}"><i class="remove icon"></i>ยกเลิกแบบสอบถาม</button>`
            // }

            return btn;
          }
        }
      ],
      columnDefs: [
        {
          targets: [0],
          className: "center"
        }
      ]
    });
  }

  clickTdButton = () => {
    this.dataTable.on("click", "button", e => {
      let dataRow = this.dataTable.row($(e.currentTarget).closest("tr")).data();
      console.log(dataRow);
      const { id } = e.currentTarget;

      if (Utils.isNotNull(dataRow)) {
        if (id.split("-")[0] === 'dtl') {
          let _updatedBy = Utils.isNotNull(dataRow.updatedBy) ? dataRow.updatedBy : dataRow.createdBy;
          let _updatedDateStr = Utils.isNotNull(dataRow.updatedDateStr) ? dataRow.updatedDateStr : dataRow.createdDateStr;
          this.router.navigate(['int02/01'], {
            queryParams: {
              id: dataRow.id,
              updatedBy: _updatedBy,
              updatedDateStr: _updatedDateStr,
              budgetYear: dataRow.budgetYear
            }
          });
        } else if (id.split("-")[0] === 'dtlSide') {
          this.router.navigate(['int02/01/01'], {
            queryParams: {
              id: dataRow.id
            }
          });
        } else {
          if (dataRow.status === '1') {
            this.msg.comfirm((c) => {
              if (c) {
                this.ajax.doPut(`${URL.CANCEL_SEND}/${dataRow.id}`, null).subscribe((response: ResponseData<any>) => {
                  if (response.status === 'SUCCESS') {
                    this.msg.successModal("ลบแบบสอบถามสำเร็จ");
                    this.dataTable.ajax.reload();
                  } else {
                    this.msg.errorModal(response.message);
                  }
                }), error => {
                  this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
                };
              }
            }, "ยืนยันการลบแบบสอบถาม")
          }

        } //end else
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
      nameQtn: [''],
    });
  }


}
