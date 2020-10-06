import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { ExciseService, AjaxService, MessageBarService, AuthService } from 'services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Ope020103Store, Ope020103Vo } from 'projects/operation-audit/ope02/ope0201/ope020103/ope020103.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as OPE020103ACTION from "projects/operation-audit/ope02/ope0201/ope020103/ope020103.action";

declare var $: any;
const URL = {
  GET_FIND: AjaxService.CONTEXT_PATH + "oa/02/01/03/findAuditer",
  GET_DETAILS: "oa/02/01/02/detail",
  PUT_UPDATE: "oa/02/01/02/save",
  POST_SECTOR_LIST: "preferences/department/sector-list",
  POST_AREA_LIST: "preferences/department/area-list",
}


@Component({
  selector: 'app-ope010103',
  templateUrl: './ope010103.component.html',
  styleUrls: ['./ope010103.component.css']
})
export class Ope010103Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สารละลายประเภทไฮโดรคาร์บอน", route: "#" },
    { label: "เลือกผู้ออกตรวจ", route: "#" },
  ];
  copLists: BreadCrumb[] = [];
  dateFrom: string = "";
  dateTo: string = "";
  lists: string[] = [];
  employees1: string[] = [];
  employees2: string[] = [];
  tableData1: any;
  formData: any;
  searchFrom: FormGroup;
  dataStore: Observable<Ope020103Store>;
  ope020103Store: Ope020103Store;
  ope020103: Ope020103Vo;

  offCode: string;
  constructor(
    private router: Router,
    private exciseService: ExciseService,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService
  ) {
    this.employees1 = [
      "นาย อาทิตย์ แก่นใจ"
    ];
    this.employees2 = [
      "ดร. ธีรวุฒิ กุลธิชัย",
      "รศ.ดร. เอกลักษณ์ อัมพุธ",
      "ว่าที่ร้อยตรี ธนพนธ์ โป่งมณี"
    ];
    this.formData = {
      id: "",
      listID: []
    }
  }
  toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }

  ngOnInit() {
    $('.dropdown').dropdown();
    let data = this.exciseService.getData();
    if (data && data.dataTables) {
      const index = data.dataTables.findIndex(obj => obj.id == data.idSelect);
      // this.lists = data.dataTables[index].lists;
    }
  }
  ngAfterViewInit(): void {
    this.initVo();
    this.dataStore = this.store.select(state => state.Ope02.Ope020103);
    this.dataStore.subscribe(data => {
      this.ope020103Store = data;
    });

    this.ope020103Store.auditer.forEach(element => {
      let wsId = {
        id: null
      }
      wsId.id = element.wsUserId
      this.formData.listID.push(wsId);
    });
    this.table1();
  }

  approve() {
    const data = Object.assign({}, this.exciseService.getData());
    let newData = data;
    const index = data.dataTables.findIndex(obj => obj.id == data.idSelect);
    for (let i = 0; i < newData.dataTables[index].details.length; i++) {
      if (i == data.monthSelect) {
        newData.dataTables[index].dateFrom = this.dateFrom;
        newData.dataTables[index].dateTo = this.dateTo;
        newData.dataTables[index].details[data.monthSelect] = 1;
        newData.dataTables[index].lists = this.lists;
      } else {
        newData.dataTables[index].details[i] = 0;
      }
    }
    this.exciseService.setData({ ...data, newData });
    this.back();
  }

  table1() {
    if (this.tableData1 != null) {
      this.tableData1.destroy();
    }

    this.tableData1 = $('#dataTable1').DataTable({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      // data: this.dataTables1,
      ajax: {
        type: "POST",
        url: URL.GET_FIND,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.formData));
        }
      },
      columns: [
        // {
        //   render: function (data, type, full, meta) {
        //     return `<input class="ui checkbox" type="checkbox" name="chk${meta.row}" id="chk${
        //       meta.row
        //       }" value="${$("<div/>")
        //         .text(data)
        //         .html()}">`;
        //   },
        //   className: "center"
        // },
        {
          render: function (data, type, full, meta) {
            return meta.row + 1;
          },
          className: "center"
        },
        { data: 'userThaiName' },
        { data: 'title' },
        {
          render: function (data, type, full, meta) {
            return `<div style="text-align: center !important"><button class='ui primary button' id="del-${full.oaCuslicenseId}" >เลือก</button></div>`;
          }
        }
      ],
      rowCallback: (row, data, index) => {

      }
    });
    this.clickTdButton();

  }

  clickTdButton() {
    this.tableData1.on("click", "button", e => {

      let dataRow = this.tableData1.row($(e.currentTarget).closest("tr")).data();
      const { id } = e.currentTarget;
      if (dataRow) {
        this.ope020103.userThaiName = dataRow.userThaiName;
        this.ope020103.wsUserId = dataRow.wsUserId;
        this.ope020103.title = dataRow.title;
        this.ope020103.userId = dataRow.userId;
        this.ope020103.oaPersonAuditPlanId = dataRow.oaPersonAuditPlanId
        this.ope020103Store.auditer.push(this.ope020103)
        this.store.dispatch(new OPE020103ACTION.UpdateUserAuditer(this.ope020103Store));

        this.router.navigate(['/ope01/01'], {
          queryParams: {
            to: "DETAIL"
          }
        });
      }
    });
  }

  save() {
    this.router.navigate(['/ope01/01']);
  }

  back() {
    this.router.navigate(['/ope01/01'], {
      queryParams: {
        to: "DETAIL"
      }
    });
  }
  initVo() {
    this.ope020103 = {
      wsUserId: null,
      userThaiId: "",
      userThaiName: "",
      userThaiSurname: "",
      userEngName: "",
      userEngSurname: "",
      title: "",
      officeId: "",
      accessAttr: "",
      officeCode: "",
      userId: "",
      oaPersonAuditPlanId:null
    }

  }

}
class AppState {
  // ope020102: {
  //   "ope020102": Ope020102Vo
  // }
  Ope02: {
    Ope020103: Ope020103Store
  }
}

