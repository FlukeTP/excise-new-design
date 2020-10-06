import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { MessageService } from 'services/message.service';
import { DecimalFormat } from 'helpers/decimalformat';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import thaibath from 'helpers/thaibath';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';

declare var $: any;


const URLS = {
  GET_COA_CODE: "ia/int15/02/get-dropdown-coa-code",
  GET_INC_CODE: "ia/int15/02/get-dropdown-inc-code",
  SAVE_DATA: "ia/int15/02/save",
  GET_LIST: "ia/int15/02/list",
  GET_PARAMETER_AOC: "preferences/parameter/IA_ACCOUNT_TYPE",
  DELETE : "ia/int15/02/delete"
}


@Component({
  selector: 'app-int1502',
  templateUrl: './int1502.component.html',
  styleUrls: ['./int1502.component.css']
})
export class Int1502Component implements OnInit {

  breadcrumb: BreadCrumb[] = [];
  tap: any = '1';
  formsearch: FormGroup;
  formsave: FormGroup;
  formSearchModal: FormGroup;
  coaParametor: any[] = [];
  coaCode: any[] = [];
  incCodeDataList: any[] = [];
  dataList: any[] = [];
  datain1: any[] = [];
  datain2: any[] = [];
  incDropdown: any[] = [];
  dataEditId: any;
  table: any;
  table2: any;
  table3: any;
  coaCode1: any = null;
  coaName1: any;
  coaType: any = "5";
  selectOutCoa: any;
  incCodeSerach: any;
  incCode1: any = null;
  incName1: any;
  incNamePrint1: any;
  selectOutInc: any;
  filterCoaName1: any[] = [];

  constructor(
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private authService: AuthService,
    private fb: FormBuilder,
    private department: DepartmentDropdownService,
    private formBuilder: FormBuilder
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "เตรียมข้อมูล", route: "#" },
      { label: "จับคู่รหัสหมวดภาษีระบบรายได้กับรหัสบัญชีะบบ GFMIS", route: "#" }
    ];
    this.formsearch = this.formBuilder.group({
      chartAndIncId: [''],
      coaCode: [''],
      incCode: [''],
      coaName: [''],
      incName: ['']
    })
    this.formsave = this.formBuilder.group({
      chartAndIncId: [''],
      coaCode: [''],
      incCode: [''],
      coaName: [''],
      incName: ['']
    })
    this.formSearchModal = this.formBuilder.group({
      coaType: [''],
      coaCode: [''],
      incCode: ['']
    })
  }

  ngOnInit() {
    this.getDorpdownCoa();
    this.getCoaCodeList();
    this.getIncCodeList();
    this.getlistdata();
    this.tabSlite("1");
  }

  ngAfterViewInit() {
    $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
    this.tableCoa();
    this.tableInc();
    this.datatableall();
  }

  getDorpdownCoa() {
    this.ajax.doPost(`${URLS.GET_PARAMETER_AOC}`, {}).subscribe((res: ResponseData<any>) => {
      this.coaParametor = res.data;
      console.log("res : ", this.coaParametor);
    });
  }

  getCoaCodeList() {
    this.ajax.doGet(URLS.GET_COA_CODE).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.coaCode = res.data;
        console.log("this.coaCode :", this.coaCode);
        this.sortDataInArry1();
      } else {
        //console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }

  onChangeCoa(e) {
    console.log(" e.target.value : ", e.target.value);
    this.coaType = e.target.value;
    this.sortDataInArry1();
  }

  onChangeCoaCode(e) {
    console.log(" e.target.value : ", e.target.value);
    this.datain1 = this.datain1.filter((data) => {
      return data.coaCode === e.target.value
    })
    console.log("test : ", this.datain1);
    this.table.clear().draw()
    this.table.rows.add(this.datain1).draw()
    this.table.columns.adjust().draw();

    this.datain1 = this.coaCode.filter((data) => {
      return data.coaType === this.coaType
    })
  }

  sortDataInArry1() {
    this.datain1 = this.coaCode.filter((data) => {
      return data.coaType === this.coaType
    })
    console.log("test : ", this.datain1);
    this.table.clear().draw()
    this.table.rows.add(this.datain1).draw()
    this.table.columns.adjust().draw();
  }

  tableCoa = () => {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#tableCoa").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      data: this.datain1,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "coaCode", className: "text-center"
        }, {
          data: "coaName", className: "text-left"
        }
      ]
    });
    $.fn.DataTable.ext.pager.numbers_length = 5;
    this.table.on("dblclick", "tr", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.selectOutCoa = data
      this.formsearch.patchValue({
        coaCode: this.selectOutCoa.coaCode,
        coaName: this.selectOutCoa.coaName
      })
      console.log("outplan ", data);
      $('#detail1').modal('hide');
    });
  }

  // ------------------------------------------------------------------------------------

  getIncCodeList() {
    this.ajax.doGet(URLS.GET_INC_CODE).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.incDropdown = res.data;
        this.incCodeDataList = this.incDropdown;
        this.table2.clear().draw()
        this.table2.rows.add(this.incCodeDataList).draw()
        this.table2.columns.adjust().draw();
        // this.sortDataInArry2();
        console.log("this.incCode :", this.incCodeDataList);
      } else {
        //console.log("getauditIncNo findAllDataHeader Error !!");
      }
    })
  }

  onChangeIncCode(e) {
    console.log(" e.target.value : ", e.target.value);
    this.incCodeSerach = e.target.value;
    this.sortDataInArry2();
    if (e.target.value == "0") {
      this.getIncCodeList();
    }
  }

  sortDataInArry2() {
    this.incCodeDataList = this.incDropdown.filter((data) => {
      return data.incCode === this.incCodeSerach
    })
    this.table2.clear().draw()
    this.table2.rows.add(this.incCodeDataList).draw()
    this.table2.columns.adjust().draw();
    // this.getIncCodeList();
    console.log("test : ", this.datain2);
  }

  tableInc = () => {
    if (this.table2 != null) {
      this.table2.destroy();
    }
    this.table2 = $("#tableInc").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      data: this.incCodeDataList,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "incCode", className: "text-center"
        }, {
          data: "incName", className: "text-left"
        }, {
          data: "accCode", className: "text-center"
        }
      ]
    });
    $.fn.DataTable.ext.pager.numbers_length = 5;
    this.table2.on("dblclick", "tr", (event) => {
      let data = this.table2.row($(event.currentTarget).closest("tr")).data();
      this.selectOutInc = data
      console.log("outplan ", data);
      $('#detail2').modal('hide');
      this.filterCoaName(this.selectOutInc);
    });
  }

  filterCoaName(dataAccCode: any) {
    this.formsearch.reset();
    if (dataAccCode.accCode == null) {
      this.formsearch.patchValue({
        incCode: dataAccCode.incCode,
        incName: dataAccCode.incName
      })
    } else {
      this.filterCoaName1 = this.coaCode.filter((data) => {
        return data.coaCode === dataAccCode.accCode
      })
      this.formsearch.patchValue({
        incCode: dataAccCode.incCode,
        incName: dataAccCode.incName,
        coaCode: this.filterCoaName1[0].coaCode,
        coaName: this.filterCoaName1[0].coaName
      })
    }
    console.log("this.filterCoaName1  :", this.formsearch.value);
  }

  getlistdata() {
    this.ajax.doPost(`${URLS.GET_LIST}`, {}).subscribe((res: ResponseData<any>) => {
      this.dataList = res.data;
      this.table3.clear().draw()
      this.table3.rows.add(this.dataList).draw()
      this.table3.columns.adjust().draw();
      this.datatableall();
      console.log("res : ", this.dataList);
    });
  }


  datatableall = () => {
    if (this.table3 != null) {
      this.table3.destroy();
    }
    this.table3 = $("#datatableall").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      data: this.dataList,
      columns: [
       {
          data: "incCode", className: "text-center"
        }, {
          data: "incName", className: "text-left"
        }, {
          data: "coaCode", className: "text-center"
        }, {
          data: "coaName", className: "text-left"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button"><i class="edit icon"></i>แก้ไข</button>`;
            return btn;
          }, className: "text-center"
        }       
      ]
    });
    this.table3.on("click", "td > button.edit", (event) => {
      var data = this.table3.row($(event.currentTarget).closest("tr")).data();
      this.editData(data.chartAndIncId);
      console.log("test : ",data);
    });
  }

  saveTwoData() {
    this.formsave.patchValue({
      coaCode: this.formsearch.value.coaCode,
      incCode: this.formsearch.value.incCode
    })
    console.log("formsave :", this.formsave.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formsave.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsearch.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  editData(id: any) {
    console.log("ididididi : ", id);
    this.tabSlite(3);
    this.dataEditId = this.dataList.filter((data) => {
      return data.chartAndIncId === id
    })
    console.log("this.dataEditId  ;", this.dataEditId);
    this.formsearch.patchValue({
      chartAndIncId: this.dataEditId[0].chartAndIncId,
      coaCode: this.dataEditId[0].coaCode,
      coaName: this.dataEditId[0].coaName,
      incCode: this.dataEditId[0].incCode,
      incName: this.dataEditId[0].incName
    })
    this.formsave.patchValue({
      chartAndIncId: this.formsearch.value.chartAndIncId,
      coaCode: this.formsearch.value.coaCode,
      incCode: this.formsearch.value.incCode
    })
  }

  editApi() {
    console.log("formedit :", this.formsave.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formsearch.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsearch.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }

  
  deleteData(){
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.DELETE, this.formsave.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsearch.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการลบข้อมูลข้อมูล")
  }

  viewDetail1() {
    $('#detail1').modal('show');
    $("#coaType").dropdown('set selected', this.coaType);
    this.tableCoa();
  }

  viewDetail2() {
    $('#detail2').modal('show');
    this.tableInc();
  }

  closeModal() {
    $('#detail1').modal('hide');
  }

  closeModal2() {
    $('#detail2').modal('hide');
  }

  tabSlite(tabin: any) {
    if (tabin == "1") {
      $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
      this.tap = "1";
      this.getlistdata();
      this.datatableall();
    } else if (tabin == "2") {
      setTimeout(() => {
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
      }, 50);
      this.tap = "2";
      this.formsearch.reset();
    } else if (tabin == "3") {
      this.tap = "3";
      setTimeout(() => {
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
      }, 50);
    }
  }
}
