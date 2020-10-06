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
  GET_LIST: "ia/int15/04/list",
  SAVE_DATA: "ia/int15/04/save",
  DELET: "ia/int15/03/delete",
  GET_LIST_DEP: "ia/int15/03/list",
  GET_DEPARTMENT: "ia/int15/04/get-department",
  GET_EDIT_DATA:"ia/int15/04/listOrg"
}


@Component({
  selector: 'app-int1504',
  templateUrl: './int1504.component.html',
  styleUrls: ['./int1504.component.css'],
  providers: [DepartmentDropdownService]
})
export class Int1504Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  tap: any = '1';
  dataList: any[] = [];
  depaccList: FormArray = new FormArray([]);
  sectors: any[] = [];
  areas: any[] = [];
  branch: any[] = [];
  datain1: any[] = [];
  DepCode: any[] = [];
  coaParametor: any[] = [];
  table: any;
  table2: any;
  selectOut: any;
  formsave: FormGroup;
  formSearchModal: FormGroup;
  submitted: boolean = false;
  coaType: any = "5";
  dataSendIndex: any;
  formSaveToapi: any;
  formEditToapi: any;
  depart: any;
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
      { label: "รหัสบัญชีเงินฝากระบบ GFMIS", route: "#" }
    ];
    this.formsave = this.formBuilder.group({
      sector: ['', Validators.required],
      area: [''],
      branch: [''],
      officeCode: [''],
      gfExciseCode: [''],
      gfExciseName: [''],
      gfExciseNameAbbr: [''],
      gfCostCenter: [''],
      gfDisburseUnit: [''],
      gfOwnerDeposit: [''],
      gfRecBudget: [''],
      gfDeptCode: [''],
      gfAreaCode: [''],
      depaccList: this.fb.array([])
    })
    this.formSearchModal = this.formBuilder.group({
      coaType: [''],
      coaCode: ['']
    })
  }

  ngOnInit() {
    this.formSaveData();
    this.formEditData();
    this.datatableall();
    this.department.getSector().subscribe(response => { this.sectors = response.data });  //get sector list
    this.getDeplistdata();
    let a = "1000";
    let b = "1000.01";
    let c = "1000.01";
    // console.log("a: ", new DecimalFormatPipe().transform(a) );
    // console.log("b: ", new DecimalFormatPipe().transform(b) );
    c = new DecimalFormatPipe().transform(c, "###,###");
    setTimeout(() => {
      console.log("c: ",  c);
    }, 500);

  }

  ngAfterViewInit() {
    $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
    $(".ui.dropdown").dropdown();
    this.getlistdata();
    this.tableDep();
  }

  dropdownChange(e, flagDropdown) {
    console.log("value: ", e.target.value);
    console.log("flagDropdown: ", flagDropdown);

    /* ______ auditPmQtNo dropdown _____ */
    if (flagDropdown === 'No.') {
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.formsave.get('officeCode').reset();
      this.formsave.get('budgetYear').patchValue(MessageService.budgetYear());
      this.formsave.get('auditPmqtNo').patchValue(e.target.value);
    } else {
      if ("0" != e.target.value && "" != e.target.value) {
        /* ____________ set office code ____________ */
        if (flagDropdown === 'SECTOR') {
          this.formsave.get('officeCode').patchValue(this.formsave.get('sector').value);

          /* ____________ clear dropdown ____________ */
          this.areas = [];
          this.branch = [];
          $("#area").dropdown('restore defaults');
          $("#branch").dropdown('restore defaults');

          /* ____________ set default value ____________ */
          this.formsave.patchValue({ area: "0" });

          /* ____________ get area list ____________  */
          this.department.getArea(this.formsave.get('officeCode').value).subscribe(response => { this.areas = response.data });
        } else if (flagDropdown === 'AREA') {
          this.formsave.get('officeCode').patchValue(this.formsave.get('area').value);

          /* ____________ set default value ____________ */
          this.formsave.patchValue({ branch: "0" });

          /* ____________ get branch list ____________  */
          this.department.getBranch(this.formsave.get('officeCode').value).subscribe(response => { this.branch = response.data });
        } else if (flagDropdown === 'BRANCH') {
          this.formsave.get('officeCode').patchValue(this.formsave.get('branch').value);
        }
      }
    }
  }

  /* _________________ validate field details _________________ */
  validateField(control) {
    return this.submitted && this.formsave.get(control).invalid;
  }

  getlistdata() {
    this.ajax.doPost(`${URLS.GET_LIST}`, {}).subscribe((res: ResponseData<any>) => {
      this.dataList = res.data;
      this.table.clear().draw()
      this.table.rows.add(this.dataList).draw()
      this.table.columns.adjust().draw();
      this.datatableall();
      console.log("res : ", this.dataList);
    });
  }

  datatableall = () => {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#datatableall").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      data: this.dataList,
      columns: [
        {
          data: "gfExciseCode", className: "text-center"
        }, {
          data: "gfExciseName", className: "text-left"
        }, {
          data: "gfCostCenter", className: "text-center"
        }, {
          data: "gfDisburseUnit", className: "text-center"
        }, {
          data: "gfOwnerDeposit", className: "text-center"
        }, {
          data: "gfRecBudget", className: "text-center"
        }, {
          data: "gfDeptCode", className: "text-center"
        }, {
          data: "gfAreaCode", className: "text-center"
        }
        , {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button"><i class="edit icon"></i>แก้ไข</button>`;
            return btn;
          }, className: "text-center"
        }
      ]
    });
    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.editData(data);
      console.log(data.gfExciseCode); 
      this.getdataedit(data.gfExciseCode);
      this.tabSlite(3);
      console.log("test : ", data);
    });
  }

  editData(data: any) {
    this.formsave.patchValue({
      gfExciseCode: data.gfExciseCode,
      gfCostCenter: data.gfCostCenter,
      gfDisburseUnit: data.gfDisburseUnit,
      gfOwnerDeposit: data.gfOwnerDeposit,
      gfRecBudget: data.gfRecBudget,
      gfDeptCode: data.gfDeptCode,
      gfAreaCode: data.gfAreaCode
    })
    this.ajax.doGet(`${URLS.GET_DEPARTMENT}/${data.gfExciseCode}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.depart = response.data
        console.log("his.depart : ", this.depart);
      } else {
        this.messageBar.errorModal(response.message);
      }
    }, err => {
      this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
    this.setdorp();
    // this.formsave.patchValue({
    //   sector : this.depart.sector
    // })

    // this.dropdownChange(data.gfExciseCode, 'SECTOR'); 

    // this.formsave.get('sector').patchValue(new IsEmptyPipe().transform(this.depart.sector));


    // this.formsave.get('area').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["area"]));
    // this.formsave.get('branch').patchValue(new IsEmptyPipe().transform(response["data"]["exciseDepartmentVo"]["branch"]));
  }

  setdorp() {
    setTimeout(() => {
      $("#sector").dropdown('set selected', this.depart.sector);
    }, 50);
    setTimeout(() => {
      $("#area").dropdown('set selected', this.depart.area);
    }, 200);
    setTimeout(() => {
      $("#branch").dropdown('set selected', this.depart.branch);
    }, 400);
  }

  getdataedit(officeCodeto : any) {
    console.log("officeCode : " ,officeCodeto);
   let officeCode =  officeCodeto.toString();
    this.ajax.doPost(URLS.GET_EDIT_DATA, {officeCode}).subscribe((res: ResponseData<any>) => {
      console.log("dataList", res);
      this.depaccList = this.formsave.get('depaccList') as FormArray;
      if (res.data.length > 0) {
        //set show button save
        this.depaccList.controls.splice(0, this.depaccList.controls.length);
        this.depaccList.patchValue([]);
        res.data.forEach((e, index) => {
          this.depaccList.push(this.listDataTab1());
          this.depaccList.at(index).get('orgDepaccId').patchValue(e.orgDepaccId);
          this.depaccList.at(index).get('gfDepositCode').patchValue(e.gfDepositCode);
          this.depaccList.at(index).get('gfOwnerDeposit').patchValue(e.gfOwnerDeposit);
          this.depaccList.at(index).get('officeCode').patchValue(e.officeCode);
        });
      } else {
        this.depaccList.controls.splice(0, this.depaccList.controls.length);
        this.depaccList.patchValue([]);
      }
    })
  }



  editApi() {
    this.formsave.patchValue({
      gfExciseCode: this.formsave.value.officeCode
    })
    this.formEditToapi.exciseOrgGfmisVo.gfExciseCode = this.formsave.get('gfExciseCode').value;
    this.formEditToapi.exciseOrgGfmisVo.gfCostCenter = this.formsave.get('gfCostCenter').value;
    this.formEditToapi.exciseOrgGfmisVo.gfDisburseUnit = this.formsave.get('gfDisburseUnit').value;
    this.formEditToapi.exciseOrgGfmisVo.gfOwnerDeposit = this.formsave.get('gfOwnerDeposit').value;
    this.formEditToapi.exciseOrgGfmisVo.gfRecBudget = this.formsave.get('gfRecBudget').value;
    this.formEditToapi.exciseOrgGfmisVo.gfDeptCode = this.formsave.get('gfDeptCode').value;
    this.formEditToapi.exciseOrgGfmisVo.gfAreaCode = this.formsave.get('gfAreaCode').value;
    this.formEditToapi.exciseOrgDepaccVos = this.formsave.get('depaccList').value;
    console.log("Edit",  this.formEditToapi);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formEditToapi).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }

  formSaveData() {
    this.formSaveToapi = {
      exciseOrgGfmisVo: {
        gfExciseCode: '',
        gfCostCenter: '',
        gfDisburseUnit: '',
        gfOwnerDeposit: '',
        gfRecBudget: '',
        gfDeptCode: '',
        gfAreaCode: ''
      },
      exciseOrgDepaccVos: []
    }
  }

  formEditData() {
    this.formEditToapi = {
      exciseOrgGfmisVo: {
        gfExciseCode: '',
        gfCostCenter: '',
        gfDisburseUnit: '',
        gfOwnerDeposit: '',
        gfRecBudget: '',
        gfDeptCode: '',
        gfAreaCode: ''
      },
      exciseOrgDepaccVos: []
    }
  }

  saveTwoData() {
    this.formsave.patchValue({
      gfExciseCode: this.formsave.value.officeCode
    })
    this.formSaveToapi.exciseOrgGfmisVo.gfExciseCode = this.formsave.get('gfExciseCode').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfCostCenter = this.formsave.get('gfCostCenter').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfDisburseUnit = this.formsave.get('gfDisburseUnit').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfOwnerDeposit = this.formsave.get('gfOwnerDeposit').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfRecBudget = this.formsave.get('gfRecBudget').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfDeptCode = this.formsave.get('gfDeptCode').value;
    this.formSaveToapi.exciseOrgGfmisVo.gfAreaCode = this.formsave.get('gfAreaCode').value;
    this.formSaveToapi.exciseOrgDepaccVos = this.formsave.get('depaccList').value;
    console.log("save", this.formSaveToapi);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formSaveToapi).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  listDataTab1(): FormGroup {
    return this.fb.group({
      orgDepaccId: [''],
      gfDepositCode: [''],
      gfOwnerDeposit: [''],
      officeCode: ['']
    });
  }

  addCreds() {
    this.depaccList = this.formsave.controls.depaccList as FormArray;
    this.depaccList.push(this.fb.group({
      gfDepositCode: '',
      gfOwnerDeposit: '',
      officeCode: ''
    }));
    console.log("this.depaccList : ", this.depaccList);
  }

  deleteCreds = (idx) => {
    console.log("testetstestes", idx);
    let index = idx;
    this.depaccList.removeAt(index);
  }

  viewDetail(indexAdd) {
    $('#detail').modal('show');
    $("#coaType").dropdown('set selected', this.coaType);
    this.tableDep();
    this.dataSendIndex = indexAdd;
  }
  closeModal() {
    $('#detail').modal('hide');
  }

  deleteData() {
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.DELET, this.formsave.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
            this.tabSlite(1);
            this.formsave.reset();
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการลบข้อมูลข้อมูล")
  }

  getDeplistdata() {
    this.ajax.doPost(`${URLS.GET_LIST_DEP}`, {}).subscribe((res: ResponseData<any>) => {
      this.DepCode = res.data;
      this.table2.clear().draw()
      this.table2.rows.add(this.DepCode).draw()
      this.table2.columns.adjust().draw();
      this.tableDep();
      console.log("res : ", this.DepCode);
    });
  }


  tableDep = () => {
    if (this.table2 != null) {
      this.table2.destroy();
    }
    this.table2 = $("#tableCoa").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      data: this.DepCode,
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "gfDepositCode", className: "text-center"
        }, {
          data: "gfDepositName", className: "text-left"
        }
      ]
    });
    $.fn.DataTable.ext.pager.numbers_length = 5;
    this.table2.on("dblclick", "tr", (event) => {
      let data = this.table2.row($(event.currentTarget).closest("tr")).data();
      this.selectOut = data
      let dataTopath = this.dataSendIndex
      this.pathDatato(dataTopath);
      console.log("outplan ", data);
      $('#detail').modal('hide');
    });
  }

  pathDatato(dataTopath) {
    this.depaccList.at(dataTopath).get('gfDepositCode').patchValue(this.selectOut.gfDepositCode);
    for (let i = 0; i < this.depaccList.length; i++) {
      this.depaccList.at(i).get('officeCode').patchValue(this.formsave.value.officeCode);
      this.depaccList.at(i).get('gfOwnerDeposit').patchValue(this.formsave.value.gfOwnerDeposit);
    }
  }

  tabSlite(tabin: any) {
    if (tabin == "1") {
      this.tap = "1";
      this.getlistdata();
      $("#sector").dropdown('restore defaults');
      $("#area").dropdown('restore defaults');
      $("#branch").dropdown('restore defaults');
      this.depaccList.controls = [];
    } else if (tabin == "2") {
      this.tap = "2";
      this.formsave.reset();
      setTimeout(() => {
        $(".ui.dropdown").dropdown();
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
      }, 50);
    } else if (tabin == "3") {
      setTimeout(() => {
        $(".ui.dropdown").dropdown();
        $('.ui.fluid.dropdown.ia-dropdown').dropdown().css('width', '100%')
      }, 50);
      this.tap = "3";
    }
  }

}

