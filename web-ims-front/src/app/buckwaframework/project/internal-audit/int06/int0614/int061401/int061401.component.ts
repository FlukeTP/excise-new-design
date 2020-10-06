import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
declare var $: any;

const URL = {
  GET_AUDITTXINSUR_NO_LIST: "ia/int06/14/01/get-dropdown",
  SEARCH: AjaxService.CONTEXT_PATH + "ia/int06/14/01/filter",
  GET_HEADER: "ia/int06/14/02/get-data-header",
}

@Component({
  selector: 'app-int061401',
  templateUrl: './int061401.component.html',
  styleUrls: ['./int061401.component.css']
})
export class Int061401Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];

  loading: boolean = false;
  formGroup: FormGroup = new FormGroup({});

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  auditTxinsurNoList: any[] = [];

  table: any;
  dataList: any = [];

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.createformGroup();
    this.getAuditTxinsurNo();
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.datatable();
    this.clickBtnTable();

  }


  //======================================== Form ====================================
  createformGroup() {
    this.formGroup = this.fb.group({
      iaAuditTxinsurHId: [''],
      sector: [''],
      area: [''],
      branch: [''],
      officeCode: [''],
      regDateStart: [''],
      regDateEnd: [''],
      auditTxinsurNo: [''],
      txinsurAuditFlag: [''],
      txinsurConditionText: [''],
      txinsurCriteriaText: [''],
      flagSearch: false
    });
  }

  /* ______________ get Dropdown ________________ */
  getAuditTxinsurNo() {
    this.ajax.doGet(`${URL.GET_AUDITTXINSUR_NO_LIST}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.auditTxinsurNoList = response.data;
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  onChangeauditTxinsurNo(e) {
    if (Utils.isNotNull(this.formGroup.get('auditTxinsurNo').value)) {
      this.loading = true;
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
    }
  }

  //=================== data_Table =========================
  datatable = () => {
    //render check number is null or empty
    let renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? "-"
        : $.fn.dataTable.render.number(",", ".", 2, "").display(data);
    };

    //render check string is null or empty
    let renderString = function (data, type, row, meta) {
      return Utils.isNull($.trim(data)) ? "-" : data;
    };

    //render date is null or empty to string
    let renderDatToString = function (data, type, row, meta) {
      return Utils.isNull(data) ? "-" : new DateStringPipe().transform(data);
    };

    this.table = $("#dataTable").DataTableTh({
      scrollX: true,
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "officeCode": this.formGroup.get('officeCode').value,
            "regDateStart": this.formGroup.get('regDateStart').value,
            "regDateEnd": this.formGroup.get('regDateEnd').value,
            "auditTxinsurNo": this.formGroup.get('auditTxinsurNo').value,
            "flagSearch": this.formGroup.get('flagSearch').value
          }
          ));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        },
        {
          data: "newRegId",
          render: renderString,
          className: "text-right"
        },
        {
          data: "",
          render: renderString,
          className: "text-right"
        },
        {
          data: "cusFullname",
          render: renderString,
        },
        {
          data: "facFullname",
          render: renderString,
        },
        {
          data: "dutyGroupName",
          render: renderString,
        },
        {
          data: "regDate",
          render: renderDatToString,
          className: "text-center"
        },
        {
          data: "cusAddress",
          render: renderString,
        },
        {
          data: "facAddress",
          render: renderString,
        },
        {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini primary button detail" type="button">
                      <i class="eye icon"></i>
                      รายละเอียด
                    </button>
                    `;
            return btn;
          }
        }
      ],
    });
  }

  clickBtnTable() {
    this.table.on("click", "td > button.detail", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.routeTo('/int06/14/03', data.wsReg4000Id, this.formGroup.get('iaAuditTxinsurHId').value);
    });
  }

  //======================  ! data_Table ===============================

  routeTo(path: string, value?: any, value2?: any) {
    this.router.navigate([path], {
      queryParams: {
        param1: value,
        param2: value2
      }
    });
  }

  dropdownChange(e) {
    this.formGroup.get('auditTxinsurNo').patchValue(e.target.value);
    this.getDataHeader();
    this.formGroup.get('flagSearch').patchValue(true);
    this.table.ajax.reload();
  }

  getDataHeader() {
    this.ajax.doPost(URL.GET_HEADER, this.formGroup.get('auditTxinsurNo').value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.formGroup.get('regDateStart').patchValue(new IsEmptyPipe().transform(response["data"]["registDateStartStr"]));
        this.formGroup.get('regDateEnd').patchValue(new IsEmptyPipe().transform(response["data"]["registDateEndStr"]));
        this.formGroup.get('sector').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["sector"]));
        this.formGroup.get('area').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["area"]));
        this.formGroup.get('branch').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["branch"]));
        this.formGroup.get('officeCode').patchValue(response["data"]["officeCode"]);
        this.formGroup.get('iaAuditTxinsurHId').patchValue(response["data"]["iaAuditTxinsurHId"]);
        this.formGroup.get('txinsurAuditFlag').patchValue(response["data"]["txinsurAuditFlag"]);
        this.formGroup.get('txinsurConditionText').patchValue(response["data"]["txinsurConditionText"]);
        this.formGroup.get('txinsurCriteriaText').patchValue(response["data"]["txinsurCriteriaText"]);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  clearFormSearch() {
    this.formGroup.get('sector').reset();
    this.formGroup.get('area').reset();
    this.formGroup.get('branch').reset();
    this.formGroup.get('regDateStart').reset();
    this.formGroup.get('regDateEnd').reset();
    this.formGroup.get('officeCode').reset();
  }

}
