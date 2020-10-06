import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ope020102Store, Ope0201001Vo } from 'projects/operation-audit/ope02/ope0201/ope020102/ope020102.model';
import { MessageBarService, MessageService } from 'services/index';
import { AjaxService } from 'services/index';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'services/index';
import { Observable } from 'rxjs';
import * as OPE020102ACTION from "projects/operation-audit/ope02/ope0201/ope020102/ope020102.action";
import { Department } from 'projects/internal-audit/int02/int0201/int0201vo.model';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;

const URL = {
  // GET_FIND: AjaxService.CONTEXT_PATH + "oa/02/01/02/getLicenseCustomer",
  GET_FIND_CUS:AjaxService.CONTEXT_PATH +"oa/04/12/filter",
  GET_DETAILS: "oa/02/01/02/detail",
  PUT_UPDATE: "oa/02/01/02/save",
  POST_SECTOR_LIST: "preferences/department/sector-list",
  POST_AREA_LIST: "preferences/department/area-list",
}

@Component({
  selector: 'app-ope040102',
  templateUrl: './ope040102.component.html',
  styleUrls: ['./ope040102.component.css']
})
export class Ope040102Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "คัดเลือกรายจากการค้นหา", route: "#" }
  ];

  licenseTypeArr = {
    A: "ผู้ใช้",
    B: "ตัวแทน",
    O:"-"
  }
  dataTables1: any = [];
  tableData1: any;
  formData: Ope0201001Vo;
  dataStore: Observable<Ope020102Store>;
  ope020102Store: Ope020102Store;
  ope020102: Ope0201001Vo;
  sectors: Department[] = [];
  areas: Department[] = [];
  searchFrom: FormGroup;
  dataSearchFrom: any;

  offCode:string;
  planStatus:string;
  planId:string;
  listID:any[]= [];
  constructor(
    private _location: Location,
    private router: Router,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,

  ) {

    this.searchFrom = this.fb.group({
      sector: [''],
      area: [''],
      // id: ['']
      listID: []
    });
    this.dataSearchFrom = {
      id: "",
      listID: []
    }
  }

  ngOnInit() {
    $('.dropdown').dropdown();
    this.offCode = this.authService.getUserDetails().officeCode;
    this.checkDropdown();
    this.planStatus = this.route.snapshot.queryParams["to"] || "";
    this.planId = this.route.snapshot.queryParams["planId"] || "";
  }

  ngAfterViewInit() {

    this.initVo();
    this.dataStore = this.store.select(state => state.Ope02.Ope020102);

    this.dataStore.subscribe(data => {
      this.ope020102Store = data;
    });

    this.ope020102Store.customerLicenseList.forEach(element => {
      let wsId = {
        id: null
      }
      wsId.id = element.oaCuslicenseId
      this.listID.push(wsId);
      // this.searchFrom.listID.push(wsId);
    });
    this.searchFrom.patchValue({listID:this.listID});
    this.getSector();
    this.table1();

  }

  onSaveLicense() {

  }

  goBack() {
    this.router.navigate(['/ope04/01'], {
      queryParams: {
        to: this.planStatus,
        planId:this.planId
      }
    });
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
        url: URL.GET_FIND_CUS,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.searchFrom.value));
        }
      },
      columns: [
        {
          // render: function (data, type, full, meta) {
          //   return `<input class="ui checkbox" type="checkbox" name="chk${meta.row}" id="chk${
          //     meta.row
          //     }" value="${$("<div/>")
          //       .text(data)
          //       .html()}">`;
          // },
          render: function(data, type, full, meta){
            return meta.row+1
          },
          className: "center"
        },
        { data: 'sectorName' },
        { data: 'areaName' },
        { data: 'companyName' },
        // {
        //   className: "text-center",
        //   render: (data, type, full, meta) => {
        //     return this.checkTypeOfCompany(full.licenseType);
        //   }
        // },
        {
          className: "text-center",
          data: "identifyNo"
        },
        // column 6
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.startDate);
          }
        },
        // column 7
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.endDate);
          }
        },
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

        this.formData.oaCuslicenseId = dataRow.oaCuslicenseId;
        this.formData.companyName = dataRow.companyName;
        this.formData.licenseType = dataRow.licenseType;
        this.formData.officeName1 = dataRow.sectorName;
        this.formData.officeName2 = dataRow.areaName;

        this.ope020102Store.customerLicenseList.push(this.formData)
        this.store.dispatch(new OPE020102ACTION.UpdateLicenseCustomer(this.ope020102Store));
        this.router.navigate(['/ope04/01'], {
          queryParams: {
            to: "DETAIL",
            planId:this.planId
          }
        });

      }
    });
  }
  getSector() {
    this.ajax.doPost(URL.POST_SECTOR_LIST, {}).subscribe((response: ResponseData<Department[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.sectors = response.data;
      } else {
        this.sectors = [];
        this.areas = [];
        this.msg.errorModal(response.message);
      }
    });
  }

  getArea(value: string) {
    this.areas = [];
    $('#area').dropdown('clear');
    this.ajax.doPost(`${URL.POST_AREA_LIST}/${value}`, {}).subscribe((response: ResponseData<Department[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.areas = response.data;
      } else {
        this.areas = [];
        this.msg.errorModal(response.message);
      }
    });
  }

  sectorChange(event) {
    if (event.target.value) {
      this.getArea(event.target.value);
    }
  }

  search() {
    this.tableData1.ajax.reload();
  }

  reset() {
    this.areas = [];
    this.searchFrom.reset();
    this.getSector();
    $('#sector').dropdown('clear');
    $('#area').dropdown('clear');
  }
  checkTypeOfCompany(type: string): string {
    return this.licenseTypeArr[type.trim()];
  }

  checkAll1 = (e) => {
    var rows = this.tableData1.rows({ search: "applied" }).nodes();
    $('input[type="checkbox"]', rows).prop("checked", e.target.checked);
  }

  checkDropdown() {
    if (this.isMain) {
      // ส่วนกลาง
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
    } else if (this.isSector) {
      // ภาค
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
    } else if (this.isArea) {
      // พื้นที่
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode.substring(0, 2) + "0000"), 300);
      setTimeout(() => $('#area').dropdown('set selected', this.offCode), 600);
    }
  }

  get isMain() {
    return this.offCode && this.offCode.length == 6 && this.offCode.substring(0, 2) == "00" && this.offCode.substring(4, 6) == "00";
  }

  get isArea() {
    return this.offCode && this.offCode.length == 6 && this.offCode.substring(0, 2) != "00" && this.offCode.substring(2, 4) != "00" && this.offCode.substring(4, 6) == "00";
  }

  get isSector() {
    return this.offCode && this.offCode.length == 6 && this.offCode.substring(0, 2) != "00" && this.offCode.substring(2, 4) == "00" && this.offCode.substring(4, 6) == "00";
  }


  initVo() {
    this.formData = {
      officeName1: "",
      officeName2: "",
      oaCuslicenseId: null,
      oaCustomerId: null,
      companyName: "",
      licenseType: "",
      address: "",
      identifyNo: "",
      licensePlanId:null
    }

  }
}

class AppState {
  Ope02: {
    Ope020102: Ope020102Store
  }
}

