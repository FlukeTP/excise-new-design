import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AjaxService } from "../../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../../common/services/message-bar.service";

declare var jQuery: any;
declare var $: any;

const URL = {
  //DATATABLE: `${AjaxService.CONTEXT_PATH}oa/cop013/oa_oper_plan/datatable`
  DATATABLE: `${AjaxService.CONTEXT_PATH}ia/02m052/searchIaIceReportHdr`
}

@Component({
  selector: "app-int02-m5-2",
  templateUrl: "./int02-m5-2.component.html",
  styleUrls: ["./int02-m5-2.component.css"]
})
export class Int02M52Component implements OnInit {
  datatable: any;
  subSectionName: any;
  endDate: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBarService: MessageBarService
  ) {

  }


  ngOnInit(): void {
    this.subSectionName = this.route.snapshot.queryParams["subSectionName"];
    this.initDatatable();
  }

  initDatatable(): void {
    console.log(this.subSectionName);
    console.log(URL.DATATABLE);
    this.datatable = $("#dataTable").DataTable({
      lengthChange: false,
      searching: false,
      select: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      pagingType: "full_numbers",
      ajax: {
        type: "POST",
        url: URL.DATATABLE,
        data: { subSectionName: this.subSectionName }
      },
      columns: [
        { data: "subSectionName" },
        { data: "endDate" },
        { data: "createdDate" },
        { data: "createdBy" },

        {
          render: function () {
            return '<button type="button" class="ui mini primary button ">เเสดงบันทึกข้อความ</button>';
          }
        }
      ],
      columnDefs: [
        { targets: [1, 2, 3], className: "center aligned" }
      ]
    });
  }

  search() {
    
  }

}
