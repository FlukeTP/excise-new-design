import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;

@Component({
  selector: 'app-epa02-1',
  templateUrl: './epa02-1.component.html',
  styleUrls: ['./epa02-1.component.css']
})
export class Epa021Component implements OnInit {

  datatable: any;
  $form: any;
  $page: any;
  exciseId: string = "";
  exciseName: string = "";
  startDate: string = "";
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
    //this.authService.reRenderVersionProgram('EXP-02100');
    this.exciseId = this.route.snapshot.queryParams["exciseId"];
    this.exciseName = this.route.snapshot.queryParams["exciseName"];
    this.searchFlag = this.route.snapshot.queryParams["searchFlag"];
    this.$form = $('#exportForm');
    this.calenda();
  }

  ngAfterViewInit(): void {
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
    const URL = AjaxService.CONTEXT_PATH + "epa/epa021/search";
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
            "exciseId": this.exciseId,
            "exciseName": this.exciseName,
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
          data: "cusName",
          className: "ui center aligned",
        }, {
          data: "checkPointDest",
          className: "ui center aligned",
        }, {
          data: "dateOutDisplay",
          className: "ui center aligned",
        }, {
          data: "dateInDisplay",
          className: "ui center aligned",
        }, {
          data: "id",
          className: "ui center aligned",
          render: function (data, row) {
            return '<button type="button" class="ui mini primary button checking-button"><i class="edit icon"></i>ตรวจสอบ</button>';
          }
        },
      ],
    });



    this.datatable.on("click", "td > .checking-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      // console.log(data);
      this.router.navigate(["/epa02/2", { viewId : data.id }]);
    });

  };

  onClickSearch() {
    this.searchFlag = "TRUE";
    this.datatable.ajax.reload();
  };

  onClickClear() {
    this.exciseId = "";
    this.searchFlag = "FALSE";
    this.datatable.ajax.reload();
  };

}
