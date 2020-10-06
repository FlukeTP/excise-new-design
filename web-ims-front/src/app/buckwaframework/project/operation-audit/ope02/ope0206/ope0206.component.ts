import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadCrumb, ResponseData } from 'models/index';
import { Department } from 'projects/internal-audit/int02/int0201/int0201vo.model';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope020106ButtonVo } from '../ope0201/ope020106/ope020106vo.model';
import { TypeOfCompany } from '../ope0207/ope0207.mock';

declare var $: any;
const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "oa/02/06/getData",
  POST_SECTOR_LIST: "preferences/department/sector-list",
  POST_AREA_LIST: "preferences/department/area-list",
  EXPROT_PDF: "oa/02/06/pdf",
  EXPROT_PDF_SOLVENT: "oa/02/06/pdf/lubricant",
  GET_BUTTONS: "oa/02/01/06/detail",
}

@Component({
  selector: 'app-ope0206',
  templateUrl: './ope0206.component.html',
  styleUrls: ['./ope0206.component.css']
})
export class Ope0206Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "#" },
    { label: "รายงานผลการออกตรวจ", route: "#" },
  ];

  licenseTypeArr = {
    A: "ผู้ใช้",
    B: "ตัวแทน",
  }

  dataTable: any = null;
  form: FormGroup = null;
  sectors: Department[] = [];
  areas: Department[] = [];
  buttons: Ope020106ButtonVo = null;
  constructor(private router: Router,
    private msg: MessageBarService,
    private fb: FormBuilder,
    private ajaxService: AjaxService,
    private ajax: AjaxService, ) {

    this.form = this.fb.group({
      sector: [''],
      area: [''],
      id: ['']
    });
    // this.getSector();
  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.initialTable();
  }

  ngAfterViewInit() {
    this.initialTable();
  }

  initialTable() {
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
        { data: "companyName" },
        // column 2
        { data: "address" },
        // column 3
        { data: "startDate" },
        // column 4
        {
          data: "identityType", className: "text-center",
          render: (data, type, full, meta) => {
            return this.checkTypeOfCompany(data);
          },
        },
        {
          data: "licenseType", className: "text-center",
          render: (data, type, full, meta) => {
            return this.licenseTypeArr[data];
          },
        },
        { data: "approve" },
        // column 5
        {
          className: "text-center",
          render: function (data, type, full, meta) {
            return `
            <button type="button" class="ui mini button blue" id="results-${full.oaLicensePlan}"><i class="eye icon"></i>ผลการตรวจสอบ</button>
            <button type="button" class="ui mini button blue" id="solvent-${full.oaLicensePlan}"><i class="eye icon"></i>แบบ Lubricant 01</button>
            <!--<button type="button" class="ui mini button red" id="${full.oaLicensePlan}"><i class="trash icon"></i>ลบ</button>-->
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
      if (id.split('-')[0] == "results") {
        this.exportPDF(id.split('-')[1]);
      }
      if (id.split('-')[0] == "solvent") {
        this.exportPDFSolvent(id.split('-')[1]);
      }
    });
  }

  exportPDF(id: string) {
    let idDtl = this.getButtonId(id);
    // console.log(" find id ", idDtl);
    var form = document.createElement("form");
    this.ajax.doGet(`${URL.GET_BUTTONS}/${id}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        form.method = "GET";
        form.target = "_blank";
        form.action = AjaxService.CONTEXT_PATH + URL.EXPROT_PDF + "/" + this.buttons.oaCuslicenseId + "/" + this.buttons.oaLubricantsDtlId;
        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    });
  };

  exportPDFSolvent(id: string) {
    let idDtl = this.getButtonId(id);
    var form = document.createElement("form");
    this.ajax.doGet(`${URL.GET_BUTTONS}/${id}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        form.method = "GET";
        form.target = "_blank";
        form.action = AjaxService.CONTEXT_PATH + URL.EXPROT_PDF_SOLVENT + "/" + this.buttons.oaCuslicenseId + "/" + this.buttons.oaLubricantsDtlId + "/" + this.buttons.oaPlanId;
        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    });
  };

  delete(id: number) {
    this.msg.comfirm(event => {
      if (event) {
        console.log("DELETE => ", id);
        this.dataTable.ajax.reload();
      }
    }, MessageBarService.CONFIRM_DELETE);
  }

  search() {
    this.dataTable.ajax.reload();
  }

  reset() {
    this.areas = [];
    this.form.reset();
    this.getSector();
    $('#sector').dropdown('clear');
    $('#area').dropdown('clear');
  }

  getButtonId(customerlicense: string) {
    // this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${customerlicense}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        // this.loading = false;
        return this.buttons.oaLubricantsDtlId
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    });
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

  checkTypeOfCompany(type: string) {
    return TypeOfCompany[type];
  }

}
