import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { formatter, TextDateTH, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { UserModel } from 'models/user.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';



declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0101",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030101',
  templateUrl: './ta030101.component.html',
  styleUrls: ['./ta030101.component.css']
})
export class Ta030101Component implements OnInit {
  formTS0101: FormGroup
  userProfile: UserModel;

  loading: boolean = false;
  submit: boolean = false;

  pathTs: any;
  dataStore: any;

  listFormTsNumber: ListFormTsNumber;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private authService: AuthService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setForm();
    this.setUserProfileForm();
    this.getDataListForSearchModal();
  }

  ngOnInit() {

    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.formTS0101.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formTS0101.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0101.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0101)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0101.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0101.get('formTsNumber').value);
        this.formNumber = this.formTS0101.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0101.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
          this.onSetNewRegId();
          this.setUserProfileForm();
        }, 200);
      }
    });

  }

  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarAnalysisDateStart', 'analysisDateStart', 'date');
    this.callCalendarDefault('calendarAnalysisDateEnd', 'analysisDateEnd', 'date');
    this.callCalendarDefault('calendarSignOfficerDate', 'signOfficerDate', 'date');
    this.callCalendarDefault('calendarSignApprDate', 'signApprDate', 'date');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setForm() {
    this.formTS0101 = this.fb.group({
      formTsNumber: [""],
      newRegId: [""],
      factoryName: [""],
      factoryTypeText: [""],
      factoryAddress: [""],
      analysisDateStart: [""],
      analysisDateEnd: [""],
      analysisData1: [""],
      analysisData2: [""],
      analysisData3: [""],
      analysisData4: [""],
      analysisData5: [""],
      analysisResultDear: [""],
      analysisResultText: [""],
      callAuditFlag: [""],
      otherText: [{ value: "", disabled: true }],
      signOfficerFullName: [""],
      signSupOfficerFullName: [""],
      signOfficerDate: [""],
      approvedFlag: [""],
      signApprOfficerFullName: [""],
      signApprOfficerPosition: [""],
      signApprDate: [""],
      auditPlanCode: [''],
      auditStepStatus: ['']
    })
  }

  setUserProfileForm() {
    this.formTS0101.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formTS0101.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  // ================ Action ==========================
  disableEnableInput(num: string) {
    if (num === '2') {
      this.formTS0101.get("otherText").enable();
    } else {
      this.formTS0101.get("otherText").disable();
      this.formTS0101.patchValue({
        otherText: '',
      });
    }
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0101.get('newRegId').value)
    let newRegId = this.formTS0101.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  async onSetNewRegId() {
    if (Utils.isNotNull(this.auditPlanCode)) {
      try {
        const data = await this.getNewRegId(this.auditPlanCode);
        await this.getOperatorDetails(data.toString());
      } catch (error) {
        console.error(error.message)
      }
    }
  }

  getNewRegId(auditPlanCode: string) {
    return new Promise((resolve) => {
      const URL = "ta/tax-audit/get-operator-details-by-audit-plan-code";
      this.ajax.doPost(URL, { auditPlanCode: auditPlanCode }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.formTS0101.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formTS0101.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0101');
        }
      });
    });
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }
  //=============================== backend=============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0101.patchValue({
          factoryName: res.data.facFullname,
          factoryAddress: res.data.facAddress,
          factoryTypeText: res.data.factoryTypeText
        })
        console.log("formTS0101 : ", this.formTS0101.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  save(e) {
    if (Utils.isNull(this.formTS0101.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0101.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formTS0101.reset();
  }
  export(e) {
    if (Utils.isNull(this.formTS0101.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0101.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0101.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0101.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0101/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0101.patchValue({
          formTsNumber: json.formTsNumber,
          newRegId: json.newRegId,
          factoryName: json.factoryName,
          factoryTypeText: json.factoryTypeText,
          factoryAddress: json.factoryAddress,
          analysisDateStart: Utils.isNotNull(json.signApprDate) ? converDate(json.analysisDateStart, patternDate.DD_MM_YYYY) : '',
          analysisDateEnd: Utils.isNotNull(json.signApprDate) ? converDate(json.analysisDateEnd, patternDate.DD_MM_YYYY) : '',
          analysisData1: json.analysisData1,
          analysisData2: json.analysisData2,
          analysisData3: json.analysisData3,
          analysisData4: json.analysisData4,
          analysisData5: json.analysisData5,
          analysisResultDear: json.analysisResultDear,
          analysisResultText: json.analysisResultText,
          callAuditFlag: json.callAuditFlag,
          otherText: json.otherText,
          signOfficerFullName: json.signOfficerFullName,
          signSupOfficerFullName: json.signSupOfficerFullName,
          signOfficerDate: Utils.isNotNull(json.signApprDate) ? converDate(json.signOfficerDate, patternDate.DD_MM_YYYY) : '',
          approvedFlag: json.approvedFlag,
          signApprOfficerFullName: json.signApprOfficerFullName,
          signApprOfficerPosition: json.signApprOfficerPosition,
          signApprDate: Utils.isNotNull(json.signApprDate) ? converDate(json.signApprDate, patternDate.DD_MM_YYYY) : '',
          auditPlanCode: json.auditPlanCode
        })
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }

  getFromTsNumberList(): Observable<any> {
    return new Observable(obs => {
      let data = {
        auditPlanCode: this.auditPlanCode
      }
      this.ajax.doPost(`ta/report/form-ts-number/${this.pathTs}`, data).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          this.listFormTsNumber = {
            listFormTsNumber: res.data
          }
          if (res.data.length != 0) {
            this.formNumber = res.data[0];
            this.formTS0101.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0101.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======

        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber ");
        }
      })
    })
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.formTS0101.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formTS0101.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formTS0101.get('analysisDateStart').value)) {
        let analysisDateStart = converDate(this.formTS0101.get('analysisDateStart').value, patternDate.DD_MMMM_YYYY);
        this.formTS0101.get('analysisDateStart').patchValue(analysisDateStart);
      }
      if (Utils.isNotNull(this.formTS0101.get('analysisDateEnd').value)) {
        let analysisDateEnd = converDate(this.formTS0101.get('analysisDateEnd').value, patternDate.DD_MMMM_YYYY);
        this.formTS0101.get('analysisDateEnd').patchValue(analysisDateEnd);
      }
      if (Utils.isNotNull(this.formTS0101.get('signOfficerDate').value)) {
        let signOfficerDate = converDate(this.formTS0101.get('signOfficerDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0101.get('signOfficerDate').patchValue(signOfficerDate);
      }
      if (Utils.isNotNull(this.formTS0101.get('signApprDate').value)) {
        let signApprDate = converDate(this.formTS0101.get('signApprDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0101.get('signApprDate').patchValue(signApprDate);
      }

      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0101.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);

    })
  }

  getDataListForSearchModal() {
    this.ajax.doGet(URL.DATA_TABLE_LIST).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.dataList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  // ================ data table ==============
  dataTable(num: number) {
    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#tableModal").DataTableTh({
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
        }, {
          render: function (data, type, row, meta) {
            return row.personThName + " " + row.personThSurname;
          },
          className: "text-center"
        }, {
          data: "linePosition", className: "text-center"
        }
      ],
    });

    $.fn.DataTable.ext.pager.numbers_length = 5;

    this.table.on("dblclick", "tr", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      // console.log("double data => ", data);
      if (num == 1) {
        this.formTS0101.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
      } else if (num == 2) {
        this.formTS0101.get('signApprOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formTS0101.get('signApprOfficerPosition').patchValue(data.linePosition);
      }

      $('#searchModal').modal('hide');
    });

    this.table.on('draw.dt', function () {
      $('.paginate_button').not('.previous, .next').each(function (i, a) {
        var val = $(a).text();
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        $(a).text(val);
      })
    });
  }

}

class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}



