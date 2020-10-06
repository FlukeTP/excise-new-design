import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-epa03-2',
  templateUrl: './epa03-2.component.html',
  styleUrls: ['./epa03-2.component.css']
})
export class Epa032Component implements OnInit {

  datatable: any;
  exciseId: string = "";
  exciseName: string = "";
  searchFlag: string = "FALSE";

  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-03200');
    this.exciseId = this.route.snapshot.queryParams["exciseId"];
    this.exciseName = this.route.snapshot.queryParams["exciseName"];
    this.searchFlag = this.route.snapshot.queryParams["searchFlag"];
  }

  ngAfterViewInit() {
    this.initDatatable();
  }

  initDatatable = () => {
    const URL = AjaxService.CONTEXT_PATH + "epa/epa032/search";
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
          data: "typeList",
          className: "ui center aligned",
        }, {
          data: "productName",
          className: "ui center aligned",
        }, {
          data: "model",
          className: "ui center aligned",
        }, {
          data: "size",
          className: "ui center aligned",
        }, {
          data: "amount",
          className: "ui center aligned",
        }, {
          data: "price",
          className: "ui center aligned",
        }, {
          data: "pricePerTax",
          className: "ui center aligned",
        }, {
          data: "amountPer",
          className: "ui center aligned",
        }, {
          data: "tax",
          className: "ui center aligned",
        }, {
          data: "tax",
          className: "ui center aligned",
          render: function (data, row) {
            return '<button type="button" class="ui mini primary button checking-button"><i class="edit icon"></i>ตรวจสอบ</button>';
          }
        }
      ]
    });

    this.datatable.on('click', 'tbody tr button.checking-button', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.datatable.row(closestRow).data();
      console.log(data);

      if (data.size == "30000") {
        this.router.navigate(["/epa03/3"], {
          queryParams: {
            searchFlag: "TRUE"
          }
        });
      }

      if (data.size == "90000") {
        this.router.navigate(["/epa03/3"], {
          queryParams: {
            // searchFlag: "FALSE"
          }
        });
      }

    });
  }

  onClickBack() {
    this.router.navigate(["/epa03/1"], {
      queryParams: {
        exciseId: this.exciseId,
        exciseName: this.exciseName,
        searchFlag: "TRUE"
      }
    });
  }
}
