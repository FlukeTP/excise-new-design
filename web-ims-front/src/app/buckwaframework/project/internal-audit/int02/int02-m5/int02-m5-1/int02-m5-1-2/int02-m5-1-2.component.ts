import { Component, OnInit } from '@angular/core';
import { BreadCrumb, IntCtrlAss } from 'models/index';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
declare var $: any;
const URL = {
  downloadNewTempage: "ia/int02m51/downloadNewTempage"
};
@Component({
  selector: 'app-int02-m5-1-2',
  templateUrl: './int02-m5-1-2.component.html',
  styleUrls: ['./int02-m5-1-2.component.css']
})
export class Int02M512Component implements OnInit {



  breadcrumb: BreadCrumb[];
  datatable: any;
  budgetYear: any;
  wsRiskList: any;

  pageMapping: any;
  riskHdrName: string;
  officeCode: any;

  intCtrlAss: IntCtrlAss[];
  constructor(private authService: AuthService, private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBarService: MessageBarService) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ระบบควบคุมภายใน", route: "#" },
      { label: "แบบประเมินระบบควบคุมภายใน", route: "#" },
      { label: "รายการใหม่", route: "#" },
    ];


  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('INT-05120');
    this.officeCode = this.route.snapshot.queryParams["officeCode"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
    this.ajax.post(URL.downloadNewTempage, { officeCode: this.officeCode, budgetYear: this.budgetYear }, res => {
      this.intCtrlAss = res.json();
      this.initDatatable();
    });
  }

  initDatatable(): void {

    console.log(this.intCtrlAss);
    this.datatable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.intCtrlAss,

      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        },
        { data: "intCtrlAssName" },
        { data: "budgetYear", className: "center" },
        {

          render: function () {
            return '<a class="ui mini dtl"> ตรวจสอบ</a>'
              + '<a class="ui mini export"> ส่งออก</a>';
          },
          className: "center"
        }

      ],
      rowCallback: (row, data, index) => {
        $("td > .dtl", row).bind("click", () => {
          this.router.navigate(["/int02/m5/1/3"], {
            queryParams: {
              officeCode: this.officeCode,
              budgetyear: this.budgetYear
            }
          });


        })
        $("td > .export", row).bind("click", () => {

          console.log('555');
        });
      }

    });
  }


}
