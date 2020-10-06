import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/index';
import { IaService } from 'services/index';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/index';
import { Store } from '@ngrx/store';
import { formatter } from 'helpers/index';
import { TextDateTH } from 'helpers/index';
import { Observable } from 'rxjs';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/index';
import * as moment from 'moment';
import * as TA0301ACTION from '../../ta03/ta0301/ta0301.action'
declare var $: any;
@Component({
  selector: 'app-ta0205',
  templateUrl: './ta0205.component.html',
  styleUrls: ['./ta0205.component.css']
})
export class Ta0205Component implements OnInit {
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
  assignName:String;
  edLogin:String;
  planData:any;
  budgetYear:string;
  budgetYearList:any[];
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
    this.dataStore = this.store.select(state => state.user).subscribe(user => {
      this.auSubdeptCode = user.subdeptCode;
      this.isCentral = user.isCentral;
      this.subdeptLevel = user.subdeptLevel;
    })
    let newYear = moment(new Date()).year() + 543;
    this.yearSelect = newYear.toString();
    this.getAuditType();
    this.setFormModal();
    this.addDataStore("", "")
  }

  ngAfterViewInit(): void {
    this.callDropdown();
    // this.dataTable();
    // this.calenda();
    this.getBudgetYearList();
    // this.getPlanNumber(this.yearSelect).subscribe((resPlanAndAnalysis: any) => {
    //   console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
    //   console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
    //   this.planNumber = resPlanAndAnalysis.planNumber;
    //   this.analysisNumber = resPlanAndAnalysis.analysisNumber;
    //   this.tablePlan();

    // });
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
    })
  }

  createItemAssign(): FormGroup {
    return this.fb.group({
      name: [''],
      edLogin:[''],
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
    }
    // this.inputSearch();
  }
  removeItemAssign(idx) {
    this.items = this.formAssign.get('names') as FormArray;
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

  onSearch(){
    this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
      // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
      // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
      this.planNumber = resPlanAndAnalysis.planNumber;
      this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      this.tablePlan();
    });
  }

  onClickType = (type: any) => {

    // if (Utils.isNotNull(this.yearSelect) && Utils.isNotNull(this.type)) {
    //   this.type = type;
    //   this.dataTable();
    // } else {
    //   this.msg.errorModal("กรุณาเลือกปี");
    // }
    this.type = type;
    // this.dataTable();
  }


  // countNotifications = (): Promise<any> => {
  //   let url = "mobile-api/countNotification";
  //   return new Promise((resolve, reject) => {
  //     this.ajax.post(url, {}, res => {
  //       resolve(res.json());
  //     })
  //   });
  // }
  tablePlan = () => {
    // console.log("datatable call");
    if (this.table != null) {
      this.table.destroy();
    }
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
        // {
        //   data: "dutyDesc", className: "text-left"
        // },
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
          className: "left"
        },
        {
          data: "auditDate",
          className: "center"
        },
        // {
        //   render: (data, type, full, meta) => {
        //     let _btn = '';
        //     if (this.isCentral) {
        //       // if (Utils.isNotNull(this.auSubdeptCode)) {
        //       if ( this.subdeptLevel && this.subdeptLevel == "3" )   {
        //         _btn = `<button class="circular inverted yellow ui  button icon assign disabled" type="button"
        //         ><i class="user icon"></i></button>`;
        //       }else if ( full.auditStatus == '0401' ){
        //         _btn = `<button class="circular inverted green ui  button icon assign" type="button"
        //         ><i class="user icon"></i></button>`;
        //       } else if ( full.auditStatus != '0400' ){
        //         _btn = `<button class="circular inverted yellow ui  button icon assign disabled" type="button"
        //         ><i class="user icon"></i></button>`;
        //       } else {
        //         _btn = `<button class="circular inverted yellow ui  button icon assign" type="button"
        //         ><i class="user icon"></i></button>`;
        //       }
        //     } else {
        //       _btn = `<button class="circular inverted yellow ui  button icon assign" type="button"
        //       ><i class="user icon"></i></button>`;
        //     }

        //     return _btn;
        //   },
        //   className: "center"
        // },
        {
          render: (data, type, full, meta) => {
            // console.log("datatable data ", full.auditStatus);
            let _btn = '';
            // if (full.auditStatus == '0401'){
            //   _btn = `<button class="circular  ui  button detail" type="button"
            //   >ดำเนินการ</button>`;
            // }else{
            //   _btn = `<button class="circular ui  button detail disabled" type="button"
            // >ดำเนินการ</button>`;
            // }
            _btn = `<button class="circular ui  button detail" type="button"
            >ดำเนินการ</button>`;

            return _btn;
          },
          className: "center"
        }

      ]
    });

    this.table.on('click', 'tbody tr button.assign', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.planData = data;
      console.log('data', data)
      $('#assignModal').modal({
        onShow: () => {
          this.formAssign.get('newRegId').patchValue(data.newRegId);
          this.formAssign.get('cusFullname').patchValue(data.cusFullname);
          this.formAssign.get('secDesc').patchValue(data.secDesc);
          this.formAssign.get('areaDesc').patchValue(data.areaDesc);
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
        this.router.navigate(["tax-audit-new/ta02/02/01"], {
          queryParams: {
            auditPlanCode: data.auditPlanCode
          }
        });
        console.log('addDataStore')
        console.log('newRegId', data.newRegId)
        console.log('auditPlanCode', data.auditPlanCode)
      }, 300);

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
  inputSearch(id: string) {
    console.log('inputSearch id : ', id);
    //$(`#seaech${id}`)
    // $(`.ui.dropdown`)
    setTimeout(() =>
      $('#' + id)
        .search({
          apiSettings: {
            // url: '//api.github.com/search/repositories?q={query}'
            url:  AjaxService.CONTEXT_PATH+'person/person-list/{query}'
          },
          fields: {
            results: 'data',
            title: 'name',
            // url: 'html_url'
          },
          minCharacters: 3,
          onSelect: (result, response) => {
            this.assignName = result.edPositionName;
            this.edLogin = result.edLogin
          }
        }), 400);
  }

  saveAssign() {
    let items = this.formAssign.get('names') as FormArray;
    let longin = "" ;
    for (let index = 0; index < items.length; index++) {
      if (index == items.length -1){
        longin =longin + items.at(index).get("edLogin").value;
      }else{
        longin = longin + items.at(index).get("edLogin").value+",";
      }
    }

    this.planData.auJobResp = longin;
    this.planData.auditStatus = "0401";
    this.ajax.doPost("ta/tax-operator/update-plan-worksheetDtl", this.planData).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.auditType = res.data;
        this.messageBar.successModal(res.message);
        // this.searchPlan();
        this.tablePlan();
      }
    });


  }

  onNameChange(event, index) {
    setTimeout(() => {
      let items = this.formAssign.get('names') as FormArray;
      items.at(index).get("name").patchValue(event.target.value);
      items.at(index).get("position").patchValue(this.assignName);
      items.at(index).get("edLogin").patchValue(this.edLogin);
    }, 200);
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
}
