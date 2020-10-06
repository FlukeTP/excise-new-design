import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Utils } from 'helpers/utils';


declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ia/int09/03/04/list",
  BADGET_TYPE: "ia/int09/03/04/budgetTypeDropdown",
  EXPORT: AjaxService.CONTEXT_PATH + "ia/int09/03/04/export",
}
@Component({
  selector: 'app-int090304',
  templateUrl: './int090304.component.html',
  styleUrls: ['./int090304.component.css']
})
export class Int090304Component implements OnInit {

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  budgetTypeList: any[] = [];

  //formSearch
  formSearch: FormGroup;

  //flag :
  loading: boolean = false;
  checkSearchFlag: boolean = false;
  exportFlag: boolean = true;

  //table
  table: any;

  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.formDataSearch();
    this.getSector();
    this.getBudgetType();
  }

  ngAfterViewInit() {
    $('.ui.dropdown').dropdown();
    this.calendar();
    this.tablePlan();
  }

  //======================= Form =============================
  formDataSearch() {
    this.formSearch = this.formBuilder.group({
      sector: ['', Validators.required],
      area: ['', Validators.required],
      branch: ['', Validators.required],
      budgetType: [''],
      offcode: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }
  //=======================  calendar ==================================
  calendar = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('startDate').patchValue(text);
      }
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSearch.get('endDate').patchValue(text);
      }
    });
  }

  //=========== getSector , getArea , getBranch , getAuditIncNo =======
  getSector() {
    this.ajax.doPost("preferences/department/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        console.log("getSector no Data !!");
      }
    })
  }
  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        console.log("getArea no Data !!");
      }
    })
  }
  getBranch(officeCode) {
    this.ajax.doPost("preferences/department/branch-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.branch = res.data;
      } else {
        console.log("getBranch no Data !!");
      }
    })
  }

  getBudgetType() {
    this.ajax.doPost(URL.BADGET_TYPE, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetTypeList = res.data;
      } else {
        console.log("getBudgetType no Data !!");
      }
    });
  }
  //================================= action ==============================
  onChangeSector(e) {
    $("#area").val("0");
    $("#branch").val("0");
    $("#budgetType").val("0");
    this.formSearch.patchValue({
      area: '0',
      branch: '0',
      budgetType: '0'
    });
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getArea(e.target.value);
  }
  onChangeArea(e) {
    $("#branch").val("0");
    this.formSearch.patchValue({ branch: '0' });
    this.branch = [];
    if ("0" != e.target.value && "" != e.target.value)
      this.getBranch(e.target.value);
  }

  onChangeBudgetType(e) {
    if (this.formSearch.get('budgetType').value == '0') {
      this.formSearch.get('budgetType').patchValue('');
    }
  }

  //============ serach ===========================
  serach() {
    this.checkSearchFlag = true;
    if (this.formSearch.valid) {
      console.log("ฟอร์มกรอกครบ :", this.formSearch.valid);
      if (this.formSearch.get('branch').value != "0") {
        this.formSearch.get('offcode').patchValue(this.formSearch.get('branch').value);
      } else {
        if (this.formSearch.get('area').value != "0") {
          this.formSearch.get('offcode').patchValue(this.formSearch.get('area').value);
        } else {
          if (this.formSearch.get('sector').value != "") {
            this.formSearch.get('offcode').patchValue(this.formSearch.get('sector').value);
          } else {
            this.formSearch.patchValue({ offcode: "" });
          }
        }
      }
      if (this.formSearch.get('budgetType').value == '0') {
        this.formSearch.get('budgetType').patchValue('');
      }
      if (Utils.isNotNull(this.formSearch.get('offcode').value)) {
        this.exportFlag = false;
      }

      //call searchCriteria
      setTimeout(() => {
        this.loading = false;
        this.table.ajax.reload();
      }, 1000);
    } else {
      console.log("ฟอร์มกรอกไม่ครบ :", this.formSearch.valid);
    }

  }
  //============ clear ===========================
  clear() {
    this.loading = true;
    this.checkSearchFlag = false;
    $("#sector").dropdown('restore defaults');
    $("#area").dropdown('restore defaults');
    $("#branch").dropdown('restore defaults');
    $("#budgetType").dropdown('restore defaults');
    $("#inputDate1").val('');
    $("#inputDate2").val('');
    this.formSearch.reset();
    this.exportFlag = true;
    setTimeout(() => {
      this.loading = false;
      this.table.ajax.reload();
    }, 1000);
  }


  //=================================== call Back End ==================================
  export() {
    if (!this.exportFlag) {
      var form = $("#form-excel").get(0);
      form.method = "POST";
      form.action = URL.EXPORT;
      form.startDate.value = this.formSearch.get('startDate').value;
      form.endDate.value = this.formSearch.get('endDate').value;
      form.budgetType.value = this.formSearch.get('budgetType').value;
      form.offcode.value = this.formSearch.get('offcode').value;
      form.submit();
    }
  }

  //=================================== data table ==================================
  tablePlan = () => {
    this.table = $("#dataTable").DataTableTh({
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
          return JSON.stringify($.extend({}, d, this.formSearch.value));
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
          data: "payee", className: "text-left"
        }
        ,
        {
          data: "refPayment", className: "text-center"
        }
        ,
        {
          data: "budgetType", className: "text-left"
        }
        ,
        {
          data: "itemDesc", className: "text-center"
        }
        ,
        {
          data: "amount", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }
        ,
        {
          data: "paymentDate", className: "text-center"
        }
      ],
      dom:  "<'ui stackable grid'" +
                "<'row dt-table'"+
                  "<'sixteen wide column'tr>"+
                  ">"+
                "<'row'"+
                  "<'left aligned five wide column'l>"+
                  "<'center aligned six wide column'i>"+
                  "<'right aligned five wide column'p>"+
                ">"+
              ">"
    });
  }


  //==================== valid ================================
  invalidSearchFormControl(control: string) {
    return this.formSearch.get(control).invalid && (this.formSearch.get(control).touched || this.checkSearchFlag);
  }
}
