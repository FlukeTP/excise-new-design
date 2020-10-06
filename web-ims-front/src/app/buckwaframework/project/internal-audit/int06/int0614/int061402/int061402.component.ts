import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Utils, TextDateTH, formatter } from 'helpers/index'
import { DateStringPipe } from 'app/buckwaframework/common/pipes';
import { ActivatedRoute, Router } from '@angular/router';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import { DepartmentDropdownService } from 'services/department-dropdown.service';

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ia/int06/14/02/filter",
  SAVE: "ia/int06/14/02/save",
  GET_HEADER: "ia/int06/14/02/get-data-header",
}

declare var $: any;
@Component({
  selector: 'app-int061402',
  templateUrl: './int061402.component.html',
  styleUrls: ['./int061402.component.css'],
  providers: [DepartmentDropdownService]
})
export class Int061402Component implements OnInit {
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
  listCheckbox: any = [];
  table: any;
  submitted: boolean = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router,
    private department: DepartmentDropdownService
  ) {

  }

  ngOnInit() {
    this.formHeader();
    this.department.getSector().subscribe(response => { this.sectors = response.data });
    this.formGroup.get('auditTxinsurNo').setValue(this.route.snapshot.queryParams["param1"] || null);
    if (this.formGroup.get('auditTxinsurNo').value != null) {
      // this.formGroup.get('sector').disable();
      // this.formGroup.get('area').disable();
      // this.formGroup.get('branch').disable();
      // this.formGroup.get('regDateStart').disable();
      // this.formGroup.get('regDateEnd').disable();
      // this.formGroup.get('auditTxinsurNo').disable();
      this.getDataHeader();
    }
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.calendar();
    this.datatable();
    this.onChangeCheckbox();
  }

  formHeader() {
    this.formGroup = this.fb.group({
      sector: ['', Validators.required],
      area: [''],
      branch: [''],
      officeCode: [''],
      regDateStart: [''],
      regDateEnd: [''],
      auditTxinsurNo: [''],
      flagSearch: ['N']
    });
  }

  getDataHeader() {
    this.ajax.doPost(URL.GET_HEADER, this.formGroup.get('auditTxinsurNo').value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.formGroup.get('regDateStart').patchValue(new IsEmptyPipe().transform(response["data"]["registDateStartStr"]));
        this.formGroup.get('regDateEnd').patchValue(new IsEmptyPipe().transform(response["data"]["registDateEndStr"]));
        this.formGroup.get('sector').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["sector"]));
        this.formGroup.get('area').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["area"]));
        this.formGroup.get('branch').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["branch"]));
        this.formGroup.get('auditTxinsurNo').patchValue(response.data.auditTxinsurNo);
        this.formGroup.get('officeCode').patchValue(response["data"]["officeCode"]);
        this.formGroup.get('flagSearch').patchValue('Y');

        this.table.ajax.reload();
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#regDateStartCld').calendar({
      endCalendar: $('#regDateEndCld'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formGroup.get('regDateStart').patchValue(text);
      }
    }).css("width", "100%");

    $('#regDateEndCld').calendar({
      startCalendar: $('#regDateStartCld'),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formGroup.get('regDateEnd').patchValue(text);
      }
    }).css("width", "100%");
  }

  search() {
    this.listCheckbox = [];
    this.submitted = true;
    /* validator fied */
    if (this.formGroup.invalid) {
      this.msg.errorModal(MessageService.MSG.REQUIRE_FIELD);
      return;
    }
    this.formGroup.get('flagSearch').patchValue('Y');
    this.table.ajax.reload();
  }

  dropdownChange(e, flagDropdown) {
    // console.log("value: ", e.target.value);
    // console.log("flagDropdown: ", flagDropdown);

    if ("0" != e.target.value && "" != e.target.value) {
      /* ____________ set office code ____________ */
      if (flagDropdown === 'SECTOR') {
        this.formGroup.get('officeCode').patchValue(this.formGroup.get('sector').value);

        /* ____________ clear dropdown ____________ */
        this.areas = [];
        this.branch = [];
        $("#area").dropdown('restore defaults');
        $("#branch").dropdown('restore defaults');

        /* ____________ set default value ____________ */
        this.formGroup.patchValue({ area: "0" });

        /* ____________ get area list ____________  */
        this.department.getArea(this.formGroup.get('officeCode').value).subscribe(response => { this.areas = response.data });
      } else if (flagDropdown === 'AREA') {
        this.formGroup.get('officeCode').patchValue(this.formGroup.get('area').value);

        /* ____________ set default value ____________ */
        this.formGroup.patchValue({ branch: "0" });

        /* ____________ get branch list ____________  */
        this.department.getBranch(this.formGroup.get('officeCode').value).subscribe(response => { this.branch = response.data });
      } else if (flagDropdown === 'BRANCH') {
        this.formGroup.get('officeCode').patchValue(this.formGroup.get('branch').value);
      }
    }
  }

  clearFormSearch() {
    this.submitted = false;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    this.areas = [];
    this.branch = [];
    this.formGroup = new FormGroup({});
    this.formHeader();
    this.table.ajax.reload();
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
          data: "assetBalanceId",
          className: "text-center",
          render: function (data, type, full, meta) {
            return (
              '<div class="ui checkbox"><input name="checkDelId" value="' +
              full.wsReg4000Id +
              '" type="checkbox"><label></label></div>'
            );
          }
        },
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
        }, {
          data: "dutyGroupName",
          render: renderString,
        }, {
          data: "regDate",
          render: renderDatToString,
          className: "text-center"
        }, {
          data: "cusAddress",
          render: renderString,
        }, {
          data: "facAddress",
          render: renderString,
        }
      ]
    });
  }

  onChangeCheckbox = () => {
    this.table.on("click", "input[type='checkbox']", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      let index = this.listCheckbox.findIndex(obj => obj.wsReg4000Id == data.wsReg4000Id);
      if (index == -1) {
        this.listCheckbox.push(data);
      } else {
        this.listCheckbox.splice(index, 1);
      }
      console.log("this.listCheckbox: ", this.listCheckbox);
    });
  }

  //======================  ! data_Table ===============================

  save(e) {
    e.preventDefault();
    let header = {
      officeCode: this.formGroup.get('officeCode').value,
      registDateStart: this.formGroup.get('regDateStart').value,
      registDateEnd: this.formGroup.get('regDateEnd').value,
      auditTxinsurNo: this.formGroup.get('auditTxinsurNo').value,
    }

    this.ajax.doPost(URL.SAVE, { header: header, detail: this.listCheckbox }).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message);
        this.routeTo('/int06/14/01');
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });

    // var data = $("#dataTable").DataTable().rows().nodes();
    // $.each(data, function (index, value) {
    //   if ($(this).find('input').prop('checked')) {
    //     console.log("value: ", value, " ", index);
    //   }
    // });
  }

  routeTo(path: string, value?: any, value2?: any) {
    this.router.navigate([path]);
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formGroup.get(control).invalid;
  }


}
