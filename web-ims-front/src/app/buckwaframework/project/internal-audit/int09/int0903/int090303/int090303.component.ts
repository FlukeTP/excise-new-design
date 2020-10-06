import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { TextDateTH, formatter } from "helpers/datepicker";
import { Utils } from "helpers/utils";
import { AuthService } from "services/auth.service";
import { AjaxService } from "services/ajax.service";
import { BreadCrumb, ResponseData } from 'models/index';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;
const URL = {
  SEARCH_PLAN: "ia/int10/find/ins-plan-params",
  SEARCH: "ia/int09/03/03/list",
  BADGET_TYPE: "ia/int09/03/03/budgetTypeDropdown",
  EXPORT: AjaxService.CONTEXT_PATH + "ia/int09/03/03/export",
}

@Component({
  selector: 'app-int090303',
  templateUrl: './int090303.component.html',
  styleUrls: ['./int090303.component.css']
})
export class Int090303Component implements OnInit {

  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  budgetTypeList: any[] = [];

  //formSearch
  formSearch: FormGroup;

  //flag :
  loading: boolean = false;
  checkSearchFlag: boolean = false;

  //table
  table: any;
  dataList: any = [];

  constructor(
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.formDataSearch();
    this.getSector();
    this.getBudgetType();
    this.dataList = [];
    // this.idinspec = this.route.snapshot.queryParams["id"];
    // console.log("idinspec : ", this.idinspec);
    //this.getData();
  }


  ngAfterViewInit(): void {
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
      //call searchCriteria
      this.searchCriteria(this.formSearch.value);
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
    this.dataList = [];
    setTimeout(() => {
      this.loading = false;
      this.tablePlan();
    }, 1000);
  }



  //=================================== call Back End ==================================
  searchCriteria(formSearch: any) {
    this.loading = true;
    this.ajax.doPost(URL.SEARCH, formSearch).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = res.data;
      } else {
        console.log("error searchCriteria :", res.message);
      }
      setTimeout(() => {
        this.tablePlan();
        this.loading = false;
      }, 1000);
    });
  }


  export() {
    if (this.dataList.length > 0) {
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

  // getData() {
  //   let id = this.idinspec;
  //   this.ajax.doGet(`${URL.FIND_INSPECTION_PLAN}/${id}`).subscribe((response: ResponseData<any>) => {
  //     if (MessageService.MSG.SUCCESS == response.status) {
  //       this.dataFilterIdParams = response.data;
  //       this.datas = this.dataFilterIdParams[0];
  //       console.log(this.dataFilterIdParams.length);
  //       console.log("response int 10/01 : ", this.dataFilterIdParams);
  //     } else {
  //       this.messageBarService.errorModal(response.message);
  //     }
  //   }, err => {
  //     this.messageBarService.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
  //   });
  // }


  //=================================== data table ==================================
  tablePlan = () => {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      scrollX: true,
      lengthChange: true,
      searching: false,
      loading: true,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.dataList,
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }
        , {
          data: "paymentDate", className: "text-center",
          render: (data, type, row, meta) => {
            return new DateStringPipe().transform(data, false);
          }
        }, {
          data: "refPayment", className: "text-center"
        }, {
          data: "bankName", className: "text-left"
        }, {
          data: "amount", className: "text-right",
          render: (data, type, row, meta) => {
            return Utils.moneyFormatDecimal(data);
          }
        }, {
          data: "budgetType", className: "text-left"
        }, {
          data: "itemDesc", className: "text-left"
        }, {
          data: "payee", className: "text-left"
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


