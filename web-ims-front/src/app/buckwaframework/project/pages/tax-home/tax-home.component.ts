import { Component, OnInit } from '@angular/core';
import { TaxHomeService } from 'projects/pages/tax-home/tax-home.service';
import { Utils } from 'helpers/utils';

import { BreadCrumb } from "models/index";
import { AjaxService } from 'services/ajax.service';

import { MessageBarService } from 'services/message-bar.service';
import { digit, EnYearToThYear } from 'helpers/index';

declare var $: any;
@Component({
  selector: 'app-tax-home',
  templateUrl: './tax-home.component.html',
  styleUrls: ['./tax-home.component.css'],
  providers: [TaxHomeService]
})
export class TaxHomeComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภาษี", route: "#" }
  ];
  countNotificationData: any;
  dataTypeTable: any = [];
  dataForm: any;
  yearSelect: any;
  type: any;
  datatable: any;
  constructor(
    private taxHomeService: TaxHomeService,
    private msg: MessageBarService
  ) { }

  ngOnInit() {
    this.countNotification();

    // $('#calendar').fullCalendar({
    //   header: {
    //     left: 'prev,next today',
    //     center: 'title',
    //     right: 'month,basicWeek,basicDay'
    //   },
    //   defaultDate: '2016-12-12',
    //   navLinks: true, // can click day/week names to navigate views
    //   editable: true,
    //   eventLimit: true, // allow "more" link when too many events
    //   events: [
    //     {
    //       title: 'All Day Event',
    //       start: '2016-12-01'
    //     },
    //     {
    //       title: 'Long Event',
    //       start: '2016-12-07',
    //       end: '2016-12-10'
    //     },
    //     {
    //       id: 999,
    //       title: 'Repeating Event',
    //       start: '2016-12-09T16:00:00'
    //     },
    //     {
    //       id: 999,
    //       title: 'Repeating Event',
    //       start: '2016-12-16T16:00:00'
    //     },
    //     {
    //       title: 'Conference',
    //       start: '2016-12-11',
    //       end: '2016-12-13'
    //     },
    //     {
    //       title: 'Meeting',
    //       start: '2016-12-12T10:30:00',
    //       end: '2016-12-12T12:30:00'
    //     },
    //     {
    //       title: 'Lunch',
    //       start: '2016-12-12T12:00:00'
    //     },
    //     {
    //       title: 'Meeting',
    //       start: '2016-12-12T14:30:00'
    //     },
    //     {
    //       title: 'Happy Hour',
    //       start: '2016-12-12T17:30:00'
    //     },
    //     {
    //       title: 'Dinner',
    //       start: '2016-12-12T20:00:00'
    //     },
    //     {
    //       title: 'Birthday Party',
    //       start: '2016-12-13T07:00:00'
    //     },
    //     {
    //       title: 'Click for Google',
    //       url: 'https://google.com/',
    //       start: '2016-12-28'
    //     }
    //   ]
    // });
    $("#selectYear").dropdown('set selected', 2562).css('min-width', '100%');

  }

  ngAfterViewInit() {
    this.callDropdown();
    this.dataTable();
  }

  callDropdown() {
    $("#stampType").dropdown().css('min-width', '100%');
    $("#stampBrand").dropdown().css('min-width', '100%');
    $("#status").dropdown().css('min-width', '100%');
  }

  countNotification = () => {
    this.taxHomeService.countNotification().then(res => {
      this.countNotificationData = res;
      console.log(this.countNotificationData);
    });
  }

  onClickType = (type: any) => {
    
    // if (Utils.isNotNull(this.yearSelect) && Utils.isNotNull(this.type)) {
    //   this.type = type;
    //   this.dataTable();
    // } else {
    //   this.msg.errorModal("กรุณาเลือกปี");
    // }
    this.type = type;
    this.dataTable();
  }

  dataTable = () => {
    if ($('#tableData').DataTable() != null) { $('#tableData').DataTable().destroy(); };

    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };

    const URL = AjaxService.CONTEXT_PATH + 'taxHome/selectType'
    this.datatable = $("#tableData").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            type: this.type,
            date: this.yearSelect
          }));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        }, {
          data: "exciseId",
          render: renderString
        }, {
          data: "companyName",
          render: renderString
        }, {
          render: function (data, type, full, meta) {
            let _div = '';
            _div += `<div class="ui red progress">
              <div class="bar"></div> </div>`;
            return _div;
          }
        }, {
          render: function (data, type, full, meta) {
            let _btn = '';
            _btn += `<button class="circular ui basic button" type="button" 
            >รายละเอียด</button>`;
            return _btn;
          },
          className: "center"
        },
      ],
    });
  }

  async toTax() {
    const newDate = new Date();
    const response = await this.taxHomeService.taxPull();
    const data = {
      dateFrom: `01/${EnYearToThYear((newDate.getFullYear() - 1).toString())}`,
      dateTo: `12/${EnYearToThYear((newDate.getFullYear() - 1).toString())}`,

      monthNonPay: "2",
      percent1: response.percent1 ? parseInt(response.percent1) : "",
      percent2: response.percent2 ? parseInt(response.percent2) : "",
      percent3: response.percent3 ? parseInt(response.percent3) : "",

      symbol1: ">",
      symbol2: "<",
      symbol3: "="
    }
    this.taxHomeService.save(data);
  }

}
