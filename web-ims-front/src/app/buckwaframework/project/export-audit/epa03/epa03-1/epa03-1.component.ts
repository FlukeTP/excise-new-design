import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-epa03-1',
  templateUrl: './epa03-1.component.html',
  styleUrls: ['./epa03-1.component.css']
})
export class Epa031Component implements OnInit {

  datatable: any;
  exciseId: string = "";
  startDate: string = "test";
  searchFlag: string = "FALSE";
  loading: boolean = false;
  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-03100');
    this.exciseId = this.route.snapshot.queryParams["exciseId"];
    this.searchFlag = this.route.snapshot.queryParams["searchFlag"];
    this.calenda();
  }

  ngAfterViewInit() {
    this.initDatatable();
  }

  calenda = () => {
    let date = new Date();
    $("#date").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.startDate = text;
      }
    });
  }

  initDatatable = () => {
    const URL = AjaxService.CONTEXT_PATH + "epa/epa031/search";
    this.datatable = $("#dataTable").DataTableTh({
      serverSide: true,
      searching: false,
      processing: true,
      ordering: false,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "searchFlag": this.searchFlag
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
          data: "exciseName",
          className: "ui center aligned",
        }, {
          data: "destination",
          className: "ui center aligned",
        }, {
          data: "dateDestination",
          className: "ui center aligned",
        }, {
          data: "dateDestination",
          className: "ui center aligned",
        }, {
          data: "dateDestination",
          className: "ui center aligned",
          render: function (data, row) {
            return '<button type="button" class="ui mini primary button checking-button"><i class="edit icon"></i>ตรวจสอบ</button>';
          }
        },
      ]
    });

    this.datatable.on('click', 'tbody tr button.checking-button', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.datatable.row(closestRow).data();

      this.router.navigate(["/epa03/2"], {
        queryParams: {
          exciseId: data.exciseId,
          exciseName: data.exciseName,
          searchFlag: "TRUE"
        }
      });
    });
  }

  onClickSearch() {
    this.searchFlag = "TRUE";
    this.datatable.ajax.reload();
  }

  onClickClear() {
    this.exciseId = "";
    this.searchFlag = "FALSE";
    this.datatable.ajax.reload();
  }

}
