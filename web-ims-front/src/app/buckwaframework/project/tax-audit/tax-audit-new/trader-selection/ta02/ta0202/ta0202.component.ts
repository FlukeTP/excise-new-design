import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { Router } from '@angular/router';
import { IaService } from 'app/buckwaframework/common/services/ia.service';
import { BreadCrumb, ResponseData } from 'app/buckwaframework/common/models/index';
import { TextDateTH, formatter } from 'app/buckwaframework/common/helper/datepicker';
import * as moment from 'moment';
import * as TA0301ACTION from '../../ta03/ta0301/ta0301.action'
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { BreadcrumbContant } from '../../../BreadcrumbContant';
import { Store } from '@ngrx/store';
declare var $: any;
@Component({
  selector: 'app-ta0202',
  templateUrl: './ta0202.component.html',
  styleUrls: ['./ta0202.component.css']
})
export class Ta0202Component implements OnInit, AfterViewInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route }
  ];
  countNotificationData: any;
  dataTypeTable: any = [];
  dataForm: any;
  yearSelect: string;
  type: any;
  auditType: any;
  datatable: any;
  formModal: FormGroup;
  formAssign: FormGroup;
  formAssignAll: FormGroup;
  submitted: boolean = false;
  datas: any = [

  ]
  items: FormArray;


  table: any;
  planNumber: any;
  analysisNumber: any;

  auSubdeptCode: string = '';
  subdeptLevel: string = '';
  dataStore: any;
  isCentral: boolean = false;
  assignName: String;
  edLogin: String;
  planData: any;
  isAssing: boolean = false;
  personList: any[];

  checkList: any = [];
  isCheckAll: boolean = false;
  auditTypeList: any = [];

  budgetYearList: any[];
  budgetYear: string;
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private obectService: IaService,
    private modelService: IaService,
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<any>,
  ) {
    this.createFormAssign();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.dataStore.unsubscribe();
  }
  // ==> app fucntoin start
  ngOnInit() {
    this.planData =  {
      auSubdeptLevel: "",
      auSubdeptCode: "",
      auJobResp : "",
      auditStatus : "",
      listCompany: []
    }
    this.dataStore = this.store.select(state => state.user).subscribe(user => {
      this.auSubdeptCode = user.subdeptCode;
      this.isCentral = user.isCentral;
      this.subdeptLevel = user.subdeptLevel;
    })
    let newYear = moment(new Date()).year() + 543;
    this.yearSelect = newYear.toString();
    this.getAuditType();
    this.setFormModal();
    this.addDataStore("", "");
    // this.getPerson();
  }

  ngAfterViewInit(): void {
    this.callDropdown();
    this.calenda();

    // this.getPlanNumber(this.yearSelect).subscribe((resPlanAndAnalysis: any) => {
    //   console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
    //   console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
    //   this.planNumber = resPlanAndAnalysis.planNumber;
    //   this.analysisNumber = resPlanAndAnalysis.analysisNumber;
    //   this.getPerson( this.auSubdeptCode);


    // });
    this.getBudgetYearList();
    this.inputSearch('edPersonName0')
    // this.addItemAssign();

  }
  createFormAssign() {
    this.formAssign = this.fb.group({
      newRegId: [''],
      cusFullname: [''],
      secDesc: [''],
      areaDesc: [''],
      names: this.fb.array([this.createItemAssign()]), //ผุ้รับผิดชอบ
      deptShortName: [''],
      subdeptShortName: ['']
    })

    this.formAssignAll = this.fb.group({
      newRegId: [''],
      cusFullname: [''],
      secDesc: [''],
      areaDesc: [''],
      names: this.fb.array([this.createItemAssign()]), //ผุ้รับผิดชอบ
      deptShortName: [''],
      subdeptShortName: ['']
    })
  }

  createItemAssign(): FormGroup {
    return this.fb.group({
      name: [''],
      edLogin: [''],
      position: [''],
    });
  }

  addItemAssign(): void {

    this.items = this.formAssign.get('names') as FormArray;
    if (this.items.length <= 4) {
      this.items.push(this.createItemAssign());
      console.log("addItem :", this.items.controls);
      // this.inputSearch();
    }
    for (let i = 0; i < this.items.length; i++) {

      this.inputSearch('edPersonName' + i)
      // $("#edPersonName"+i).dropdown().css('width', '100%');
    }
    // this.inputSearch();
    setTimeout(() => { $(".ui.dropdown").dropdown().css('min-width', '3em'); }, 500)
    // $(".ui.dropdown").dropdown().css('width', '100%');
  }

  

  addItemAssignAll(): void {

    this.items = this.formAssignAll.get('names') as FormArray;
    if (this.items.length <= 4) {
      this.items.push(this.createItemAssign());
      console.log("addItem :", this.items.controls);
    }
    for (let i = 0; i < this.items.length; i++) {
      this.inputSearch('edPersonName' + i)
    }

    setTimeout(() => { $(".ui.dropdown").dropdown().css('min-width', '3em'); }, 500)
  }


  removeItemAssign(idx) {
    this.items = this.formAssign.get('names') as FormArray;
    this.items.removeAt(idx);
  }
  removeItemAssignAll(idx){
    this.items = this.formAssignAll.get('names') as FormArray;
    this.items.removeAt(idx);
  }
  toTax() { }

  selectAuditType() {
    $('#auditType').modal('show');
  }

  view() {
    $('#view').modal('show');
  }


  setFormModal() {
    this.formModal = this.fb.group({
      auditType: ["", Validators.required]
    });
  }

  progressClass(progress: number) {
    if (progress <= 24 && progress >= 0) {
      return 'ui progress red';
    } else if (progress <= 50 && progress >= 25) {
      return 'ui active progress';
    } else if (progress <= 75 && progress >= 51) {
      return 'ui progress warning';
    } else if (progress <= 100 && progress >= 76) {
      return 'ui progress success';
    }
  }



  callDropdown() {
    $("#stampType").dropdown().css('min-width', '100%');
    $("#stampBrand").dropdown().css('min-width', '100%');
    $("#status").dropdown().css('min-width', '100%');
    $("ui.dropdown").dropdown().css('min-width', '100%');

  }

  goToPlan() {
    this.router.navigate(['/tax-audit-new/ta02/01'], {
      queryParams: {
        year: this.yearSelect
      }
    })
  }

  validateFormModal(value: string) {
    return this.submitted && this.formModal.get(value).errors;
  }

  modalSubmit() {
    $('#auditType').modal('hide');
  }

  modalClose() {
    $('#auditType').modal('hide');
  }

  calenda = () => {
    $('#date1').calendar({
      type: 'year',
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
        let newYear = moment(date).year() + 543;
        this.yearSelect = newYear.toString();
      }
    });
  }

  onClickType = (type: any) => {

    this.type = type;
    // this.dataTable();
  }

  tablePlan = () => {
    // console.log("datatable call");
    if (this.table != null) {
      this.table.destroy();
    }
    this.auditTypeList = [];
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-by-offcode";
    this.table = $("#tablePlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            planNumber: this.planNumber
          }));
        }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            // this.datas.push(row);
            if (row.auditStatus == '0401'){
              return (
                '<div class="ui disabled checkbox"><input disabled="disabled" name="checkDelId" type="checkbox" checked ><label></label></div>'
              );
            }

            let check = this.checkList.find(x => x.planWorksheetDtlId == row.planWorksheetDtlId);
            if (check) {

              return (
                '<div class="ui checkbox"><input name="checkDelId" value="' +
                row.planWorksheetDtlId +
                '" id="' +
                row.planWorksheetDtlId +
                '" type="checkbox" checked ><label></label></div>'
              );
            } else {
              return (
                '<div class="ui checkbox"><input name="checkDelId" value="' +
                row.planWorksheetDtlId +
                '" id="' +
                row.planWorksheetDtlId +
                '" type="checkbox"><label></label></div>'
              );
            }
            

          },
          className: "text-center"
        },

        {
          className: "ui center aligned",
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "newRegId", className: "text-left"
        },
        // {
        //   data: "cusFullname", className: "text-left"
        // },
        {
          data: "facFullname", className: "text-left"
        },
        {
          data: "dutyDesc", className: "text-center"
        },
        // {
        //   data: "facAddress", className: "text-left"
        // },
        {
          data: "secDesc", className: "text-left"
        }, {
          data: "areaDesc", className: "text-left"
        },
        // {
        //   data: "dutyDesc", className: "text-left"
        // },
        { className: "text-center",
          render: (data, type, row, meta) => {
            if (row.planType == 'R'){
              return ("สำรอง");
            }else if (row.planType == 'E') {
              return ("เพิ่มราย");
            }else{
              return ("ในแผน");
            }
          }
        },
        {
          data: "auditStatusDesc", className: "text-center"
          // {
          //   render: (data, type, full, meta) => {
          //     let _div = `<div class="ui progress">
          //           <div class="bar">
          //             <div class="progress"></div>
          //           </div>
          //         </div>`;
          //     return _div;
          //   }
        },
        {
          data: "auditType",
          className: "center"
        },
        {
          data: "auditDate",
          className: "center"
        },
        {
          render: (data, type, full, meta) => {
            let _btn = '';
            if (this.isCentral) {
              // if (Utils.isNotNull(this.auSubdeptCode)) {
              if (this.subdeptLevel && this.subdeptLevel == "3") {
                _btn = `<button class="circular inverted yellow ui  button icon assign disabled" type="button"
                ><i class="user icon"></i></button>`;
              } else if (full.auditStatus == '0401') {
                _btn = `<button class="circular inverted green mini ui  button icon assign" type="button"
                ><i class="user icon"></i></button> <br>`+ this.mapPersonListByauJobResp(full.auJobResp);
              } else if (full.auditStatus != '0400') {
                _btn = `<button class="circular inverted yellow ui  button icon assign disabled" type="button"
                ><i class="user icon"></i></button>`;
              } else {
                _btn = `<button class="circular inverted yellow ui  button icon assign" type="button"
                ><i class="user icon"></i></button>`;
              }
            } else {
              _btn = `<button class="circular inverted yellow ui  button icon assign" type="button"
              ><i class="user icon"></i></button>`;
            }

            // _btn = `<button class="circular inverted green ui  button icon " type="button"
            // ><i class="user icon"></i></button>`;

            return _btn;
          },
          className: "center"
        },
        {
          render: (data, type, full, meta) => {
            // console.log("datatable data ", full.auditStatus);
            this.isCheckAll = false;

            // if (full.auditStatus == "0400") {
            //   this.isAssing = true;
            // } else {
            //   this.isAssing = false;
            // }
            this.auditTypeList.push(full.auditStatus)
            let _btn = '';
            if (full.auditStatus == '0401') {
              _btn = `<button class="circular  ui  button detail" type="button"
              >ดำเนินการ</button>`;
            } else {
              _btn = `<button class="circular ui  button detail disabled" type="button"
            >ดำเนินการ</button>`;
            }

            return _btn;
          },
          className: "center"
        }

      ], drawCallback: (oSettings) => {
        this.checkAuditTypeForAssign();
      }
    });

    this.table.on('click', 'tbody tr button.assign', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.planData = data;
      console.log('data', data)
      $('#assignModal').modal({
        onShow: () => {
          this.createFormAssign();
          this.formAssign.get('newRegId').patchValue(data.newRegId);
          this.formAssign.get('cusFullname').patchValue(data.cusFullname);
          this.formAssign.get('secDesc').patchValue(data.secDesc);
          this.formAssign.get('areaDesc').patchValue(data.areaDesc);
          this.formAssign.get('deptShortName').patchValue(data.deptShortName);
          this.formAssign.get('subdeptShortName').patchValue(data.subdeptShortName);
          // this.getPerson(data.auSubdeptCode);
          let nameSprit = '';
          if ( data.auJobResp){
            let person:string = data.auJobResp;
            let index = person.indexOf(',');

            if (index >0 ){
              nameSprit = person.slice(0,index+1);
            }else{
              nameSprit = person;
            }
            var name = this.personList.filter(function (peson) {
              return peson.edLogin == nameSprit;
            });
            let indexDropdown = this.personList.findIndex(obj => obj.edLogin == nameSprit);
            console.log("index dropdown ", indexDropdown);
  
            this.assignName = name[0].edPositionName;
            this.edLogin = name[0].edLogin;
            setTimeout(() => {
              let items = this.formAssign.get('names') as FormArray;
              $("#edPersonName0").dropdown('set selected', indexDropdown);
              items.at(0).get("name").patchValue(name[0].name);
              items.at(0).get("position").patchValue(this.assignName);
              items.at(0).get("edLogin").patchValue(this.edLogin);
            }, 300);
          }
          setTimeout(() => { $(".ui.dropdown").dropdown().css('min-width', '3em'); }, 200);
        }
      }).modal('show');

    });
    this.table.on('click', 'tbody tr button.detail', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      console.log("click detail", data);
      //this.modelService.setData(data);
      this.addDataStore(data.newRegId, data.planNumber)
      setTimeout(() => {
        this.router.navigate(["/tax-audit-new/ta02/02/01"], {
          queryParams: {
            newRegId: data.newRegId,
            budgetYear: this.yearSelect,
            planNumber: data.planNumber,
            auditPlanCode: data.auditPlanCode
          }
        });
        // console.log('addDataStore')
        // console.log('newRegId', data.newRegId)
        // console.log('planNumber', data.planNumber)
      }, 300);

    });

    this.table.on("click", "input[type='checkbox']", (event) => {
      // console.log("data at row ",event);
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      // console.log("data at row ", data);
      var chk = $('#' + data.planWorksheetDtlId).prop('checked');
      // console.log("data at row ", chk);
      if (chk) {
        let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data.planWorksheetDtlId);
        if (index == -1) {
          this.checkList.push(data);
        } else {
          // this.checkList.splice(index, 1);
        }
      } else {
        let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data.planWorksheetDtlId);
        if (index >= 0) {
          this.checkList.splice(index, 1);
        } else {
          // this.checkList.push(data);
        }
      }
    });

  }

  checkAll(e) {
    var rows = this.table.rows({ search: "applied" }).nodes();
    $('input[type="checkbox"]', rows).prop("checked", e.target.checked);
    this.isCheckAll = true;

    var chk = $('#checkAll').prop('checked')

    // console.log("is checked ", chk);

    var data = this.table.rows().data();
    if (chk) {
      // this.checkList = [];
      for (let index = 0; index < data.length; index++) {
        let arrIndex = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data[index].planWorksheetDtlId);
        if (arrIndex == -1) {
          this.checkList.push(data[index]);
        }

      }
    } else {
      for (let index = 0; index < data.length; index++) {
        let arrIndex = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data[index].planWorksheetDtlId);
        if (arrIndex >= 0) {
          this.checkList.splice(arrIndex, 1);
        }
      }
    }


    this.datas = [];

  }

  onAssignList() {

    if (this.isAssing) {
    // this.getPerson(this.auSubdeptCode);
    // console.log(this.checkList)
    $('#assignAllModal').modal({
      onShow: () => {
        this.createFormAssign();
        // this.formEdit.get('assignOfficeCode').patchValue(this.departmentName);
        // this.getArea(this.officeCode);
        setTimeout(() => { $(".ui.dropdown").dropdown().css('min-width', '3em'); }, 200)
      }
    }).modal('show');
    }

  }

  searchPlan() {
    this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
      // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
      // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
      this.planNumber = resPlanAndAnalysis.planNumber;
      this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      this.getPerson( this.auSubdeptCode);
    });
  }

  addDataStore(newRegId: string, planNumber: string) {
    this.store.dispatch(new TA0301ACTION.AddDataCusTa({
      newRegId: newRegId,
      planNumber: planNumber
    }))

    // this.store.dispatch(new TA0301ACTION.AddPathTsSelect({
    //   docType: "2",
    //   topic: "FORM_TS01_07"
    // }));

    // this.store.dispatch(new TA0301ACTION.AddFormTsNumber({
    //   formTsNumber: "",
    //   pathTs: "ta-form-ts0107"
    // }))
  }
  //==> app function end
  // ==> call backend start

  queryDatas = (dataForm: any): Promise<any> => {
    let url = "taxHome/selectType";
    return new Promise((resolve, reject) => {
      this.ajax.post(url, dataForm, res => {
        resolve(res.json());
      });
    });
  }

  saves(form): Promise<any> {
    let url = "taxAudit/selectList/findCondition1";
    return new Promise((resolve, reject) => {
      resolve();
      this.obectService.setData(form);
      this.router.navigate(['/tax-audit/tax00006']);
    });
  }

  taxPulls(): Promise<any> {
    let url = "combobox/controller/configCreteria";
    return this.ajax.get(url, res => {
      return res.json();
    });
  }

  getAuditType() {
    const URL = "preferences/parameter/TA_AUDIT_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = res.data;
      }
    })
  }
  getPlanNumber(resbudgetYear: any): Observable<any> {
    return new Observable((resObs => {
      this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": resbudgetYear }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resObs.next(res.data);
        } else {
          this.messageBar.errorModal(res.message);
        }

      });
    }));
  }
  getPerson(subDeptCode) {
    let URL = "person/person-list";
    if (Utils.isNotNull(subDeptCode)) {
      URL = "person/person-list-officeCode/" + subDeptCode;
    }
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.personList = res.data; 
        this.tablePlan();  
      }
    })
  }

  mapPersonListByauJobResp(auJobResp:string):string{
    if(auJobResp){
      var person = this.personList.filter(function (peson) {
        return peson.edLogin == auJobResp;
      });
      if (person){
        let temp:string = person[0].name;
        let index = temp.indexOf(' ');
        if (index){
          let name = temp.slice(0,index+2);
          return name+'.';
        }
      }else{
        return "";
      }
    }
  }

  inputSearch(id: string) {
    // console.log('inputSearch id : ', id);
    //$(`#seaech${id}`)
    // $(`.ui.dropdown`)
    // setTimeout(() =>
    //   $('#' + id)
    //     .search({
    //       apiSettings: {
    //         // url: '//api.github.com/search/repositories?q={query}'
    //         url:  AjaxService.CONTEXT_PATH+'person/person-list/{query}'
    //       },
    //       fields: {
    //         results: 'data',
    //         title: 'name',
    //         // url: 'html_url'
    //       },
    //       minCharacters: 3,
    //       onSelect: (result, response) => {
    //         this.assignName = result.edPositionName;
    //         this.edLogin = result.edLogin
    //       }
    //     }), 400);

    setTimeout(() =>
      $('#' + id)
        .search({
          onSelect: (result, response) => {
            // console.log("selected ");
            this.assignName = result.edPositionName;
            this.edLogin = result.edLogin
          }
        }), 400);

  }

  saveAssign() {
    let items = this.formAssign.get('names') as FormArray;
    let longin = "";
    for (let index = 0; index < items.length; index++) {
      if (index == items.length - 1) {
        longin = longin + items.at(index).get("edLogin").value;
      } else {
        longin = longin + items.at(index).get("edLogin").value + ",";
      }
    }

    this.planData.auJobResp = longin;
    this.planData.auditStatus = "0401";
    this.planData.replaceRegId = "";
    this.planData.planType = "";
    this.ajax.doPost("ta/tax-operator/update-plan-worksheetDtl", this.planData).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.auditType = res.data;
        this.messageBar.successModal(res.message);
        // this.searchPlan();
        this.tablePlan();
      }
    });

  }

  onSaveAssignAll() {
    let items = this.formAssignAll.get('names') as FormArray;
    let longin = "";
    for (let index = 0; index < items.length; index++) {
      if (index == items.length - 1) {
        longin = longin + items.at(index).get("edLogin").value;
      } else {
        longin = longin + items.at(index).get("edLogin").value + ",";
      }
    }
    // console.log("save all ", longin)

    this.planData.auJobResp = longin;
    this.planData.auditStatus = "0401";
    this.planData.listCompany = this.checkList;
    this.planData.replaceRegId = "";
    this.planData.planType = "";
    if (this.checkList.length == 0){
      this.messageBar.errorModal("กรุณาเลือกผู้ประกอบการ");
    }else{
      this.ajax.doPost("ta/tax-operator/update-plan-worksheetDtl-list", this.planData).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // this.auditType = res.data;
          this.messageBar.successModal(res.message);
          // this.searchPlan();
          this.tablePlan();
          this.checkList = []
        }
      });
    }


  }

  onNameChange(event, index) {
    console.log("onNameChange", this.personList[event.target.value].edLogin)
    this.assignName = this.personList[event.target.value].edPositionName;
    this.edLogin = this.personList[event.target.value].edLogin;
    setTimeout(() => {
      let items = this.formAssign.get('names') as FormArray;
      items.at(index).get("name").patchValue(this.personList[event.target.value].name);
      items.at(index).get("position").patchValue(this.assignName);
      items.at(index).get("edLogin").patchValue(this.edLogin);
    }, 300);
  }

  onNameChangeAll(event, index) {
    // console.log("onNameChange", this.personList[event.target.value].edPositionName)
    this.assignName = this.personList[event.target.value].edPositionName;
    this.edLogin = this.personList[event.target.value].edLogin;
    setTimeout(() => {
      let items = this.formAssignAll.get('names') as FormArray;
      // items.at(index).get("name").patchValue(this.personList[event.target.value].name);
      items.at(index).get("position").patchValue(this.assignName);
      items.at(index).get("edLogin").patchValue(this.edLogin);
    }, 300);
  }

  onSelectName(obj, index) {
    console.log("onSelectName ", obj, index)
    // setTimeout(() => {
    //   let items = this.formAssign.get('names') as FormArray;
    //   items.at(index).get("name").patchValue(event.target.value);
    //   items.at(index).get("position").patchValue(this.assignName);
    //   items.at(index).get("edLogin").patchValue(this.edLogin);
    // }, 300);
  }

  checkAuditTypeForAssign() {
    var countIs0401 = this.auditTypeList.reduce(function (n, status) {
      if (status == "0400") {
        return n + 1;
      } else {
        return n;
      }
    }, 0);
    // console.log("count ",countIs0401)
    if (countIs0401 > 0){
      this.isAssing = true;
    }else{
      this.isAssing = false;
    }
  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.budgetYear = this.budgetYearList[0];
          console.log("get budget year", this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.budgetYear);

          this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
            // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
            // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
            this.planNumber = resPlanAndAnalysis.planNumber;
            this.analysisNumber = resPlanAndAnalysis.analysisNumber;
            this.getPerson( this.auSubdeptCode);
            this.tablePlan();

          });

        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
        }
      } else {
      }
    });
  }
  budgerYearChange(event) {
    this.budgetYear = event.target.value;
  }

  get formData() { return <FormArray>this.formAssign.get('names'); }

  get formDataAll() { return <FormArray>this.formAssignAll.get('names'); }
}
