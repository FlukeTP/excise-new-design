import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadCrumb, ResponseData } from 'models/index';
import { Department } from 'projects/internal-audit/int02/int0201/int0201vo.model';
import { ROLES } from 'services/auth.service';
import { AjaxService, AuthService, MessageBarService, MessageService } from 'services/index';
import { TypeOfCompany, TypeOfLicense } from './ope0207.mock';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "oa/02/07/filter",
  POST_SECTOR_LIST: "preferences/department/sector-list",
  POST_AREA_LIST: "preferences/department/area-list",
}

@Component({
  selector: 'app-ope0207',
  templateUrl: './ope0207.component.html',
  styleUrls: ['./ope0207.component.css']
})
export class Ope0207Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "/ope02/" },
    { label: "ข้อมูลผู้ได้รับอนุญาต (ผู้ใช้/ตัวแทน) น้ำมันหล่อลื่น", route: "#" }
  ];
  offCode: string = "";
  dataTable: any = null;
  form: FormGroup = null;
  sectors: Department[] = [];
  areas: Department[] = [];
  constructor(
    private router: Router,
    private msg: MessageBarService,
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      sector: [''],
      area: ['']
    });
    this.getSector();
  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.offCode = this.authService.getUserDetails().officeCode;
  }

  ngAfterViewInit() {
    if (this.isMain) {
      // ส่วนกลาง
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
      setTimeout(() => this.initialTableMain(), 600);
    } else if (this.isSector) {
      // ภาค
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
      setTimeout(() => this.initialTableSector(), 600);
    } else if (this.isArea) {
      // พื้นที่
      setTimeout(() => $('#sector').dropdown('set selected', this.offCode.substring(0, 2) + "0000"), 300);
      setTimeout(() => $('#area').dropdown('set selected', this.offCode), 600);
      setTimeout(() => this.initialTableArea(), 1000);
    }
  }

  initialTableMain() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.form.value));
        }
      },
      columns: [
        // column 0
        {
          className: "text-center",
          render: function (data, type, full, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
        // column 1
        {
          className: "text-left",
          data: "sectorName"
        },
        // column 2
        {
          className: "text-left",
          data: "receiveNo"
        },
        // column 3
        {
          className: "text-left",
          data: "name"
        },
        // column 4
        {
          className: "text-left",
          data: "companyName"
        },
        // column 5
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
        // column 8
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return this.checkTypeOfLicense(full.licenseType);
          }
        },
        // column 9
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            const strBf: string = this.roleOperator ? "" : "<!--";
            const strAf: string = this.roleOperator ? "" : "-->";
            return `
            <button type="button" class="ui mini button blue" id="dtl-${full.oaCuslicenseId}"><i class="eye icon"></i>ข้อมูลใบอนุญาต</button>
            ${strBf}<button type="button" class="ui mini button yellow" id="edt-${full.oaCuslicenseId}"><i class="edit icon"></i>แก้ไข</button>${strAf}
            `;
          }
        }
      ]
    });
    this.clickTdButton();
  }

  initialTableSector() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.form.value));
        }
      },
      columns: [
        // column 0
        {
          className: "text-center",
          render: function (data, type, full, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
        // column 1
        {
          className: "text-left",
          data: "sectorName"
        },
        // column 2
        {
          className: "text-left",
          data: "areaName",
          render: (data, type, full, meta) => {
            return full.areaName || "-";
          }
        },
        // column 3
        {
          className: "text-left",
          data: "receiveNo"
        },
        // column 4
        {
          className: "text-left",
          data: "name"
        },
        // column 5
        {
          className: "text-left",
          data: "companyName"
        },
        // column 6
        {
          className: "text-center",
          data: "identifyNo"
        },
        // column 7
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.startDate);
          }
        },
        // column 8
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.endDate);
          }
        },
        // column 9
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return this.checkTypeOfLicense(full.licenseType);
          }
        },
        // column 10
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            const strBf: string = this.roleOperator ? "" : "<!--";
            const strAf: string = this.roleOperator ? "" : "-->";
            return `
            <button type="button" class="ui mini button blue" id="dtl-${full.oaCuslicenseId}"><i class="eye icon"></i>ข้อมูลใบอนุญาต</button>
            ${strBf}<button type="button" class="ui mini button yellow" id="edt-${full.oaCuslicenseId}"><i class="edit icon"></i>แก้ไข</button>${strAf}
            `;
          }
        }
      ]
    });
    this.clickTdButton();
  }

  initialTableArea() {
    if (this.dataTable != null) {
      this.dataTable.destroy();
    }
    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, this.form.value));
        }
      },
      columns: [
        // column 0
        {
          className: "text-center",
          render: function (data, type, full, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
        },
        // column 1
        {
          className: "text-left",
          data: "receiveNo"
        },
        // column 2
        {
          className: "text-left",
          data: "name"
        },
        // column 3
        {
          className: "text-left",
          data: "companyName"
        },
        // column 4
        {
          className: "text-center",
          data: "identifyNo"
        },
        // column 5
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.startDate);
          }
        },
        // column 6
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return new DateStringPipe().transform(full.endDate);
          }
        },
        // column 7
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            return this.checkTypeOfLicense(full.licenseType);
          }
        },
        // column 8
        {
          className: "text-center",
          render: (data, type, full, meta) => {
            const strBf: string = this.roleOperator ? "" : "<!--";
            const strAf: string = this.roleOperator ? "" : "-->";
            return `
            <button type="button" class="ui mini button blue" id="dtl-${full.oaCuslicenseId}"><i class="eye icon"></i>ข้อมูลใบอนุญาต</button>
            ${strBf}<button type="button" class="ui mini button yellow" id="edt-${full.oaCuslicenseId}"><i class="edit icon"></i>แก้ไข</button>${strAf}
            `;
          }
        }
      ]
    });
    this.clickTdButton();
  }

  back() { }

  clickTdButton() {
    this.dataTable.on("click", "button", e => {
      let dataRow = this.dataTable.row($(e.currentTarget).closest("tr")).data();
      const { id } = e.currentTarget;
      if (dataRow) {
        if (id.split("-")[0] === 'dtl') {
          this.router.navigate(['/ope02/07/01'], {
            queryParams: {
              id: id.split("-")[1],
              state: "VIEW"
            }
          });
        }
        if (id.split("-")[0] === 'edt') {
          this.router.navigate(['/ope02/07/01'], {
            queryParams: {
              id: id.split("-")[1],
              state: "EDIT"
            }
          });
        }
      }
    });
  }

  add() {
    this.router.navigate(['/ope02/07/01']);
  }

  delete(id: number) {
    this.msg.comfirm(event => {
      if (event) {
        this.dataTable.ajax.reload();
      }
    }, MessageBarService.CONFIRM_DELETE);
  }

  search() {
    this.dataTable.ajax.reload();
  }

  reset() {
    if (this.isMain) {
      // ส่วนกลาง
      this.areas = [];
      this.form.reset();
      $('#sector').dropdown('clear');
      $('#area').dropdown('clear');
    } else if (this.isSector) {
      // ภาค
      this.form.get('area').reset();
      $('#area').dropdown('clear');
    } else if (this.isArea) {
      // พื้นที่
    }
  }

  getSector() {
    this.ajaxService.doPost(URL.POST_SECTOR_LIST, {}).subscribe((response: ResponseData<Department[]>) => {
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
    this.ajaxService.doPost(`${URL.POST_AREA_LIST}/${value}`, {}).subscribe((response: ResponseData<Department[]>) => {
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

  checkTypeOfLicense(type: string): string {
    return TypeOfLicense[type.trim()];
  }

  checkTypeOfCompany(type: string): string {
    return TypeOfCompany[type.trim()];
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

  get roleOperator() {
    return this.authService.roleMatch(ROLES.ROLE_OA_OPERATOR);
  }

  get roleHead() {
    return this.authService.roleMatch(ROLES.ROLE_OA_HEAD);
  }

  get roleAuditor() {
    return this.authService.roleMatch(ROLES.ROLE_OA_AUDITOR);
  }

}