import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import * as TA0301ACTION from '../../ta03/ta0301/ta0301.action';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { Observable } from 'rxjs/internal/Observable';
import { Department } from 'projects/internal-audit/int02/int0201/int0201vo.model';
import { timingSafeEqual } from 'crypto';
import { checkboxList } from '../../table-custom/table-custom.model';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
declare var $: any;
@Component({
  selector: 'app-ta0204',
  templateUrl: './ta0204.component.html',
  styleUrls: ['./ta0204.component.css']
})
export class Ta0204Component implements OnInit {

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
  formEdit: FormGroup;
  submitted: boolean = false;
  datas: any = [

  ]



  table: any;
  tableSearch:any;
  planNumber: any;
  analysisNumber: any;
  taxDepartment: any = [];
  areas: any = [];
  planData: any;
  dataStore: any;
  subdeptLevel: string = '';
  officeCode: string = '';
  userLogin: string = '';
  isAssing: boolean = false;
  isRecieve: boolean = false;
  isAllAssign: boolean = true;
  departmentName: string = '';

  checkList: any = [];
  isCheckAll: boolean = false;

  assignList: any;
  tbData: any;
  auditTypeList: string[] = [];
  listRes: any = [];
  reserveFlag: string = 'I';
  cusReplace: any;
  countPlan: Number;
  countPlanReserve: Number;
  countOutPlan: Number;

  budgetYearList: any[];
  budgetYear: string;
  formSearchModal:FormGroup;
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private obectService: IaService,
    private modelService: IaService,
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<any>,
  ) {
    this.createFormAssign()
  }

  // ==> app fucntoin start
  ngOnInit() {
    this.dataStore = this.store.select(state => state.user).subscribe(user => {
      this.subdeptLevel = user.subdeptCode;
      this.officeCode = user.officeCode;
      this.userLogin = user.username;
      this.departmentName = user.departmentName;
    })

    let newYear = moment(new Date()).year() + 543;
    this.yearSelect = newYear.toString();
    this.getAuditType();
    this.setFormModal();
    this.addDataStore("", "")
    this.getTaxDepartment();
    // this.checkList =[{planWorksheetDtlId:""}]
    this.getBudgetYearList();

    this.assignList = {
      auSubdeptLevel: "",
      auSubdeptCode: "",
      auJobResp: "",
      auditStatus: "",
      listCompany: []
    }

    this.formSearchModal = this.fb.group({
      newRegId: [''],
      analysisNumber: [''],
      facType: [''],
      dutyCode: [''],
      sector: [''],
      area: ['']

    });

  }

  ngAfterViewInit(): void {
    this.callDropdown();
    $('.ui.grid .row').css('padding-top', '0');
    // this.dataTable();
    this.calenda();
    this.tableCus();
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    // this.searchPlan();

  }

  searchPlan() {
    this.auditTypeList = [];
    // this.callDropdown();
    // this.calenda();
    this.getPlanNumber(this.budgetYear).subscribe((resPlanAndAnalysis: any) => {
      // console.log("PlanNumber : ", resPlanAndAnalysis.planNumber);
      // console.log("AnalysisNumber : ", resPlanAndAnalysis.analysisNumber);
      this.planNumber = resPlanAndAnalysis.planNumber;
      this.analysisNumber = resPlanAndAnalysis.analysisNumber;
      this.getCountPlan();
      this.getCountPlanReserve();
      this.getCountOutPlan();
      
      this.tablePlan();
      //  this.checkAuditTypeForAssign();

    });
  }


  createFormAssign() {
    this.formEdit = this.fb.group({
      newRegId: [''],
      cusFullname: [''],
      secDesc: [''],
      areaDesc: [''],
      officeCode: [''],
      auSubdeptCode: [''],
      assignOfficeCode: [''],
      planReplaceId: [''],
      replaceReason: [''],
      replaceRegId: [''],
      replaceName: [''],
      replaceCusname: ['']
    })
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
            this.getCountPlan();
            this.getCountPlanReserve();
            this.getCountOutPlan();

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

  tablePlan() {
    // console.log("datatable call");
    if (this.table != null) {
      this.table.destroy();
      $('#tablePlan').DataTable().destroy();
      // this.table.clear().draw();
      // this.table.rows.add(this.tbData);
      // this.table.columns.adjust().draw(); 
    }

    this.checkList = [];
    this.auditTypeList = [];
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-by-offcode-assign";
    this.table = $("#tablePlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      destroy: true,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            planNumber: this.planNumber,
            sendAllFlag: "N",
            planType: this.reserveFlag
          }));
        }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            // this.datas.push(row);
            // console.log("checked ", row.auditStatus);
            if (row.auditStatus == '0400' || row.auditStatus == '0401') {
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
        }, {
          className: "ui center aligned",
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "newRegId", className: "text-left"
        },
        {
          data: "facFullname", className: "text-left"
        }
        ,
        {
          data: "dutyDesc", className: "text-center"
        },
        {
          data: "secDesc", className: "text-left"
        }, {
          data: "areaDesc", className: "text-left"
        },
        {
          data: "deptShortName", className: "left"
        }
        , {
          render: (data, type, full, meta) => {
            if (!full.subdeptShortName) {
              this.isAllAssign = false;
            } else {
              this.isAllAssign = true;
            }

            return full.subdeptShortName;
          },
          className: "center"
        }
        , {
          data: "personName", className: "center"
        }
        , {
          render: (data, type, full, meta) => {
            //   let _btn = `<button class="circular yellow inverted ui  button icon edit" type="button"
            // ><i class="edit icon"></i></button>`;
            this.isCheckAll = false;
            if (full.auditStatus == "0300") {
              this.isRecieve = true;
            } else {
              this.isRecieve = false;
            }
            this.auditTypeList.push(full.auditStatus);

            // if (meta.row > 0 ){
            //   if (full.auditStatus == "0301") {
            //     this.isAssing = !this.isAssing && true;
            //   } else {
            //     this.isAssing = !this.isAssing && false;
            //   }

            // }else{
            //   if (full.auditStatus == "0301") {
            //     this.isAssing = true;
            //   } else {
            //     this.isAssing = false;
            //   }
            // }
            // console.log("assing " , this.isAssing)

            let _btn = ''
            if (this.subdeptLevel && this.subdeptLevel == "3") {
              _btn = `<button class="circular yellow inverted ui  button icon edit disabled" type="button"
            ><i class="edit icon"></i></button>`;
            } else if (full.auditStatus == "0300" || full.auditStatus == "0401") {
              _btn = `<button class="circular yellow inverted ui  button icon edit disabled" type="button"
              ><i class="edit icon"></i></button>`;
            } else if (full.auditStatus == "0400") {
              _btn = `<button class="circular yellow inverted ui  button icon edit" type="button"
            ><i class="edit icon"></i></button>`;
            } else {
              _btn = `<button class="circular yellow inverted ui  button icon edit" type="button"
            ><i class="edit icon"></i></button>`;
            }
            return _btn;
          },
          className: "center"
        }

      ], drawCallback: (oSettings) => {
        this.checkAuditTypeForAssign();
      }
    });

    this.table.on('click', 'tbody tr button.edit', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      this.planData = data;
      // console.log("click detail", data);
      $('#auSubdeptCode').dropdown('clear');
      this.checkDropdown();
      this.formEdit.get('replaceName').patchValue("");
      this.formEdit.get('replaceCusname').patchValue("");
      this.formEdit.get('planReplaceId').patchValue("");
      this.formEdit.get('replaceReason').patchValue("");
      if (data.replaceRegId) {
        this.getplanworksheetdtlReserve(data.replaceRegId);
        this.formEdit.get('planReplaceId').patchValue(data.replaceRegId);
        this.formEdit.get('replaceReason').patchValue(data.replaceReason);
      }

      $('#editModal').modal({
        onShow: () => {
          this.formEdit.get('newRegId').patchValue(data.newRegId);
          this.formEdit.get('cusFullname').patchValue(data.cusFullname);
          this.formEdit.get('secDesc').patchValue(data.secDesc);
          this.formEdit.get('areaDesc').patchValue(data.areaDesc);
        }
      }).modal('show');
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

    // $('div.clear').html('');
    $('.ui.grid .row').css('padding-top', '0');

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
          // this.checkList.splice(index, 1);
          this.checkList.push(data[index]);
        }

      }
    } else {
      for (let index = 0; index < data.length; index++) {
        let arrIndex = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data[index].planWorksheetDtlId);
        if (arrIndex >= 0) {
          this.checkList.splice(arrIndex, 1);
        }
        // this.checkList.push(data[index]);
      }
      // this.checkList = [];
    }


    this.datas = [];

  }

  tableCus = () => {

    if (this.tableSearch != null) {
      this.tableSearch.destroy();
    }
    // const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-by-offcode-assign";
    this.tableSearch = $("#tableSearch").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      pageLength:10,
      lengthChange: false,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            planNumber: this.planNumber,
            sendAllFlag: "N",
            planType: "I"
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "auditStatusDesc", className: "text-center"
        }, {
          data: "newRegId", className: "text-left"
        },
        {
          data: "facFullname", className: "text-left"
        },
        {
          data: "cusFullname", className: "text-left"
        }, {
          className: "text-left",
          render: function (data, type, row, meta) {
            return (row.secDesc + "/" + row.areaDesc);
          }
        }, {
          className: "text-right",
          render: function (data, type, row, meta) {
            return new DecimalFormatPipe().transform(row.regCapital, "###,###.00");
          }
        }, {
          data: "dutyDesc", className: "text-left"
        }

      ]
    });

    $.fn.DataTable.ext.pager.numbers_length = 5;

    this.tableSearch.on("dblclick", "tr", (event) => {
      let data = this.tableSearch.row($(event.currentTarget).closest("tr")).data();
      // this.selectOutPlan = data;
      this.formEdit.get('planReplaceId').patchValue(data.newRegId);
      this.formEdit.get('replaceName').patchValue(data.facFullname);
      this.formEdit.get('replaceCusname').patchValue(data.cusFullname);
      // console.log("outplan ", data);
      this.cusReplace = data;
      // this.getplanworksheetdtlReserve(data.newRegId);

      $('#searchCusModal').modal('hide');
      $('#editModal').modal('show');
    });

    this.tableSearch.on('draw.dt', function() {
      $('.paginate_button').not('.previous, .next').each(function(i, a) {
         var val = $(a).text();
         val =  val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
         $(a).text(val);
      })
    });  

  }

  searchCusModal() {
    
    $('#searchCusModal').modal('show');
    setTimeout(() => {
      this.tableCus();
    }, 200);

  }

  onChangeCheckbox = () => {
    this.table.on("click", "input[type='checkbox']", (event) => {
      // console.log("data at row ",event);
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log("data at row ", data);
      let index = this.checkList.findIndex(obj => obj.planWorksheetDtlId == data.planWorksheetDtlId);
      if (index == -1) {
        this.checkList.push(data);
      } else {
        this.checkList.splice(index, 1);
      }

    });
  }


  addDataStore(newRegId: string, planNumber: string) {
    this.store.dispatch(new TA0301ACTION.AddDataCusTa({
      newRegId: newRegId,
      planNumber: planNumber
    }))
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
  saveAssign() {
    this.planData.officeCode = this.formEdit.get("officeCode").value;
    this.planData.auSubdeptCode = this.formEdit.get("auSubdeptCode").value;
    this.planData.auditStatus = "0400";
    if (this.formEdit.get("planReplaceId").value != "") {
      this.planData.planReplaceId = this.cusReplace.planWorksheetDtlId
      this.planData.replaceReason = this.formEdit.get("replaceReason").value;
      this.planData.replaceRegId = this.cusReplace.newRegId
    }
    // console.log("save assign ",  this.planData);

    this.ajax.doPost("ta/tax-operator/update-plan-worksheetDtl", this.planData).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = res.data;
        this.messageBar.successModal(res.message);
        this.searchPlan();
      }
    });
  }

  onReceive() {
    let person = this.initPerson();
    person.edLogin = this.userLogin;
    person.edOffcode = this.officeCode;
    person.auSubdeptCode = this.subdeptLevel;
    if (this.isRecieve) {
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.ajax.doPost("ta/tax-operator/update-receive-plan-worksheetDtl", person).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.auditType = res.data;
              this.messageBar.successModal(res.message);
              this.isRecieve = false;
              this.searchPlan();
            }
          });
        }
      }, "คุณต้องการรับทราบแผนใช่หรือไม่ ?");
    }

  }

  onAssign() {
    let person = this.initPerson();
    person.edLogin = this.userLogin;
    person.edOffcode = this.officeCode;
    person.auSubdeptCode = this.subdeptLevel;
    var messageComfirm = "";
    if (this.isAllAssign) {
      messageComfirm = 'คุณต้องการ Assing ฝ่าย ใช่หรือไม่ ?';
    } else {
      messageComfirm = 'ยังแจกจ่ายงานไม่ครบ คุณต้องการ Assing ฝ่าย ใช่หรือไม่?';
    }

    if (this.isAssing) {
      this.messageBar.comfirm(confirm => {
        if (confirm) {
          this.ajax.doPost("ta/tax-operator/update-assign-plan-worksheetDtl", person).subscribe((res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
              this.auditType = res.data;
              this.messageBar.successModal(res.message);
              this.isAssing = false;
              this.searchPlan();
            }
          });
        }
      }, messageComfirm);
    }

  }

  saveAssignList() {
    // this.planData.officeCode = this.formEdit.get("officeCode").value;
    // this.planData.auSubdeptCode = this.formEdit.get("auSubdeptCode").value;
    // this.planData.auditStatus = "0301";
    if (this.reserveFlag == 'R') {
      this.assignList.edOffcode = this.formEdit.get("assignOfficeCode").value;
    } else {
      this.assignList.edOffcode = "";
    }

    this.assignList.auSubdeptLevel = this.formEdit.get("auSubdeptCode").value;
    this.assignList.auSubdeptCode = this.formEdit.get("auSubdeptCode").value;
    this.assignList.auditStatus = "0400";
    this.assignList.listCompany = this.checkList;
    // auSubdeptCode:"",
    // listCompany:[]
    // console.log("assign list ", this.assignList)
    if (this.checkList.length == 0) {
      this.messageBar.errorModal("กรุณาเลือกผู้ประกอบการ");
    } else {
      this.ajax.doPost("ta/tax-operator/update-plan-worksheetDtl-list", this.assignList).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.auditType = res.data;
          this.messageBar.successModal(res.message);
          this.searchPlan();
          this.checkList = [];
        }
      });
    }



  }

  onAssignList() {
    if (this.isAssing) {
      // console.log(this.checkList)
      $('#auSubdeptCodeAll').dropdown('clear');
      $('#assignOfficeCode').dropdown('clear');

      $('#assignAllModal').modal({
        onShow: () => {
          if (this.reserveFlag == 'R') {
            this.formEdit.get('assignOfficeCode').patchValue(this.officeCode);
          } else {
            this.formEdit.get('assignOfficeCode').patchValue(this.departmentName);
          }
          this.getArea(this.officeCode);
          setTimeout(() => { $(".ui.dropdown").dropdown().css('min-width', '3em'); }, 200)
        }
      }).modal('show');
    }

  }

  getTaxDepartment() {
    const URL = "preferences/department/dept/central-ta";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // this.auditType = res.data;
        // this.formEdit.get('secDesc').patchValue(res.data);
        // console.log("tax department ", res.data);
        this.taxDepartment = res.data;
      }
    })
  }

  sectorChange(event) {

    if (event.target.value) {
      this.getArea(event.target.value);
    }
  }

  getArea(value: string) {
    this.areas = [];
    $('#auSubdeptCode').dropdown('clear');
    this.ajax.doGet("preferences/department/subdept/" + value).subscribe((response: ResponseData<Department[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.areas = response.data;
        // console.log("areas " ,response.data)
      } else {
        this.areas = [];
        // this.msg.errorModal(response.message);
      }
    });
  }

  checkAuditTypeForAssign() {
    var countIs0301 = this.auditTypeList.reduce(function (n, status) {
      if (status == "0301") {
        return n + 1;
      } else {
        return n;
      }
    }, 0);

    // if (countIs0301 > 0) {
    //   this.isAssing = true;
    // } else {
    //   this.isAssing = false;
    // }

    if (countIs0301 > 0 && this.reserveFlag != 'R') {
      this.isAssing = true;
    } else {
      this.isAssing = false;
    }

  }

  checkDropdown() {
    // console.log("chekc droup down", this.planData.officeCode);
    if (this.planData.officeCode) {
      setTimeout(() => $('#officeCode').dropdown('set selected', this.planData.officeCode), 300);
      if (this.planData.auSubdeptCode) {
        this.getArea(this.planData.officeCode);
        setTimeout(() => $('#auSubdeptCode').dropdown('set selected', this.planData.auSubdeptCode), 500);
      }

    }

    // if (this.isMain) {
    //   // ส่วนกลาง
    //   setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
    // } else if (this.isSector) {
    //   // ภาค
    //   setTimeout(() => $('#sector').dropdown('set selected', this.offCode), 300);
    // } else if (this.isArea) {
    //   // พื้นที่
    //   setTimeout(() => $('#sector').dropdown('set selected', this.offCode.substring(0, 2) + "0000"), 300);
    //   setTimeout(() => $('#area').dropdown('set selected', this.offCode), 600);
    // }
  }
  changeReserveFlag(flag: string) {
    this.reserveFlag = flag

    if (flag == 'R' || flag == 'E') {
      this.table.column(0).visible(false);
    } else {
      this.table.column(0).visible(true);
    }
    this.table.ajax.reload();

  }
  replaceChange(event: any) {
    if (event.target.value) {
      let val: string = event.target.value;
      if (val.length >= 17) {
        this.getplanworksheetdtlReserve(val);

      }
    }
  }

  getplanworksheetdtlReserve(regid: string) {
    let request = {
      planNumber: this.planNumber,
      sendAllFlag: "N",
      planType: "I",
      newRegId: regid,
      start: 0,
      length: 1,
      draw: 1
    }
    this.ajax.doPost("ta/tax-operator/plan-selected-by-offcode-assign", request).subscribe((res: ResponseData<any>) => {
      if (res.data) {
        var listResp: any[] = res.data;
        this.cusReplace = listResp[0];
        // this.formEdit.get('replaceName').patchValue(this.cusReplace.cusFullname);
        // this.formEdit.get('replaceCusname').patchValue(this.cusReplace.facFullname);
        // console.log("cus replace name ", this.cusReplace);
      }

    });
  }

  getCountPlan() {
    let request = {
      planNumber: this.planNumber,
      sendAllFlag: "N",
      planType: 'I',
      draw: 1,
      length: 5,
      start: 0
    }
    this.ajax.doPost("ta/tax-operator/plan-selected-by-offcode-assign", request).subscribe((res: any) => {
      if (res != null) {
        this.countPlan = res.recordsTotal;
        // console.log("count plan data resp inplan ", res.recordsTotal)
      }
    });
  }

  getCountPlanReserve() {
    let request = {
      planNumber: this.planNumber,
      sendAllFlag: "N",
      planType: 'R',
      draw: 1,
      length: 5,
      start: 0
    }
    this.ajax.doPost("ta/tax-operator/plan-selected-by-offcode-assign", request).subscribe((res: any) => {
      if (res != null) {
        this.countPlanReserve = res.recordsTotal
        // console.log("count plan data resp reserve ", res.recordsTotal)
      }
    });
  }
  getCountOutPlan() {
    let request = {
      planNumber: this.planNumber,
      sendAllFlag: "N",
      planType: 'E',
      draw: 1,
      length: 5,
      start: 0
    }
    this.ajax.doPost("ta/tax-operator/plan-selected-by-offcode-assign", request).subscribe((res: any) => {
      if (res != null) {
        this.countOutPlan = res.recordsTotal
        // console.log("count plan data resp reserve ", res.recordsTotal)
      }
    });
  }

  initPerson() {
    return {
      edLogin: "",
      edOffcode: "",
      auSubdeptCode: ""
    }
  }

}
