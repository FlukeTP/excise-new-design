import { Component, OnInit } from '@angular/core';
import { AuthService } from 'services/auth.service';
import { AjaxService } from '../../../../common/services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-epa02-2',
  templateUrl: './epa02-2.component.html',
  styleUrls: ['./epa02-2.component.css']
})
export class Epa022Component implements OnInit {

  formVo: Epa022Form;
  private viewId: string;
  private datatable: any;
  exciseId: string = "";
  constructor(
    private authService: AuthService,
    private ajaxService: AjaxService,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('EXP-02200');

    this.route.paramMap.subscribe(v => {
      console.log("viewId", v.get("viewId"));
      this.viewId = v.get("viewId");
    });

    this.formVo = {
      checkPointDest: "",
      cusName: "",
      cusNewRegid: "",
      dateInDisplay: "",
      dateOutDisplay: "",
      exciseId: "",
      exportName: "",
      facname: "1234",
      id: 1,
      remark: "",
      route: "",
      tin: "",
      transportName: "",
      vatNo: ""
    };

    this.ajax.post("epa/epa021/getDetail", { viewId: this.viewId }, (res) => {
      let data: Epa022Form = res.json();
      this.formVo = data;
    });

  }

  ngAfterViewInit(): void {
    this.initDatatable();
  }


  initDatatable = () => {
    const URL = AjaxService.CONTEXT_PATH + "epa/epa021/searchDetail";
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
            "viewId": this.viewId,
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
          data: "brandName",
          className: "ui center aligned",
        }, {
          data: "productName",
          className: "ui center aligned",
        }, {
          data: "modelName",
          className: "ui center aligned",
        }, {
          data: "goodsSize",
          className: "ui center aligned",
        }, {
          data: "goodsNum",
          className: "ui center aligned",
        }, {
          data: "retailPrice",
          className: "ui center aligned",
        }, {
          data: "taxvalUnit",
          className: "ui center aligned",
        }, {
          data: "taxqtyUnit",
          className: "ui center aligned",
        }, {
          data: "taxAmount",
          className: "ui center aligned",
        }, {
          data: "id",
          className: "ui center aligned",
          render: function (data, row) {
            return '<button type="button" class="ui mini primary button checking-button"><i class="edit icon"></i>ตรวจสอบ</button>';
          }
        }
      ]
    });

    this.datatable.on("click", "td > button.checking-button", (event) => {
      var data = this.datatable.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      let param = {
          hdrId: data.hdrId,
          dtlId: data.id
      };
      this.router.navigate(["/epa02/3", param]);
    });

  }


  onClickBack() {
    this.router.navigate(["/epa02/1"]);
  };

}

interface Epa022Form {
  id: number,
  exportName: String
  checkPointDest: String,
  exciseId: String,
  cusName: String,
  tin: String,
  vatNo: String,
  facname: String,
  cusNewRegid: String,
  remark: String,
  route: String,
  transportName: String,
  dateOutDisplay: String,
  dateInDisplay: String,
}
