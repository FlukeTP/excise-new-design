import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { TextDateTH, formatter, patternDate, converDate } from 'helpers/datepicker';
import { UserModel } from 'models/user.model';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0102",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030102',
  templateUrl: './ta030102.component.html',
  styleUrls: ['./ta030102.component.css']
})
export class Ta030102Component implements OnInit {

  formGroup: FormGroup;
  userProfile: UserModel;

  submit: boolean = false;
  loading: boolean = false;

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
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private authService: AuthService,
    private store: Store<AppState>,
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

    this.formGroup.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formGroup.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0102)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup.get('formTsNumber').value);
        this.formNumber = this.formGroup.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formGroup.patchValue({
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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.callCalendarDefault("calendarAuditDateStart", "auditDateStart", "date");
    this.callCalendarDefault("calendarAuditDateEnd", "auditDateEnd", "date");
    this.callCalendarDefault("calendarSignOfficerDate", "signOfficerDate", "date");
    this.callCalendarDefault("calendarSignRegDate", "signRegDate", "date");
    this.callCalendarDefault("calendarSignComdDate", "signComdDate", "date");
    this.callCalendarDefault("calendarSignFinanceDate", "signFinanceDate", "date");
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }


  setForm() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      bookNumber1: [''],
      bookNumber2: [''],
      docDear: [''],
      docFrom: [''],
      docText1: [''],
      companyType: [''],
      factoryName: [''],
      newRegId: [''],
      factoryAddress: [''],
      factoryTypeText: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      auditCase: [''],
      signOfficerFullName: [''],
      signOfficerPosition: [''],
      signOfficerDate: [''],
      regDear: [''],
      regText: [''],
      signRegFullName: [''],
      signRegPosition: [''],
      signRegDate: [''],
      comdTypeFlag: [''],
      signComdFullName: [''],
      signComdPosition: [''],
      signComdDate: [''],
      financeBookNumber1: [''],
      financeBookNumber2: [''],
      financeDear: [''],
      signFinanceFullName: [''],
      signFinancePosition: [''],
      signFinanceDate: [''],
      auditPlanCode: [''],
      auditStepStatus: ['']
    });
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.departmentName
    })
  }


  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formGroup.get(`${formControlName}`).patchValue(text);
      }
    });
  }
  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup.get('newRegId').value)
    let newRegId = this.formGroup.get('newRegId').value;
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
          this.formGroup.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formGroup.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0102');
        }
      });
    });
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  //=================== backend =======================
  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup.patchValue({
          factoryName: res.data.facFullname,
          factoryAddress: res.data.facAddress,
          companyType: res.data.factoryType
        })
        console.log("formGroup : ", this.formGroup.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  save(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formGroup.reset();
  }
  export(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formGroup.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formGroup.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formGroup.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0102/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docDear: json.docDear,
          docFrom: json.docFrom,
          docText1: json.docText1,
          companyType: json.companyType,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          factoryAddress: json.factoryAddress,
          factoryTypeText: json.factoryTypeText,
          auditDateStart: Utils.isNotNull(json.auditDateStart) ? converDate(json.auditDateStart, patternDate.DD_MM_YYYY) : '',
          auditDateEnd: Utils.isNotNull(json.auditDateEnd) ? converDate(json.auditDateEnd, patternDate.DD_MM_YYYY) : '',
          auditCase: json.auditCase,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          signOfficerDate: Utils.isNotNull(json.signOfficerDate) ? converDate(json.signOfficerDate, patternDate.DD_MM_YYYY) : '',
          regDear: json.regDear,
          regText: json.regText,
          signRegFullName: json.signRegFullName,
          signRegPosition: json.signRegPosition,
          signRegDate: Utils.isNotNull(json.signRegDate) ? converDate(json.signRegDate, patternDate.DD_MM_YYYY) : '',
          comdTypeFlag: json.comdTypeFlag,
          signComdFullName: json.signComdFullName,
          signComdPosition: json.signComdPosition,
          signComdDate: Utils.isNotNull(json.signComdDate) ? converDate(json.signComdDate, patternDate.DD_MM_YYYY) : '',
          financeBookNumber1: json.financeBookNumber1,
          financeBookNumber2: json.financeBookNumber2,
          financeDear: json.financeDear,
          signFinanceFullName: json.signFinanceFullName,
          signFinancePosition: json.signFinancePosition,
          signFinanceDate: Utils.isNotNull(json.signFinanceDate) ? converDate(json.signFinanceDate, patternDate.DD_MM_YYYY) : '',
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
            this.formGroup.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formGroup.get('formTsNumber').value,
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
        this.formGroup.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formGroup.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formGroup.get('auditDateStart').value)) {
        let auditDateStart = converDate(this.formGroup.get('auditDateStart').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDateStart').patchValue(auditDateStart);
      }
      if (Utils.isNotNull(this.formGroup.get('auditDateEnd').value)) {
        let auditDateEnd = converDate(this.formGroup.get('auditDateEnd').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDateEnd').patchValue(auditDateEnd);
      }
      if (Utils.isNotNull(this.formGroup.get('signOfficerDate').value)) {
        let signOfficerDate = converDate(this.formGroup.get('signOfficerDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('signOfficerDate').patchValue(signOfficerDate);
      }
      if (Utils.isNotNull(this.formGroup.get('signRegDate').value)) {
        let signRegDate = converDate(this.formGroup.get('signRegDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('signRegDate').patchValue(signRegDate);
      }
      if (Utils.isNotNull(this.formGroup.get('signComdDate').value)) {
        let signComdDate = converDate(this.formGroup.get('signComdDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('signComdDate').patchValue(signComdDate);
      }
      if (Utils.isNotNull(this.formGroup.get('signFinanceDate').value)) {
        let signFinanceDate = converDate(this.formGroup.get('signFinanceDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('signFinanceDate').patchValue(signFinanceDate);
      }

      setTimeout(() => {

        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup.value).toString() }).subscribe((res: ResponseData<any>) => {
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
        this.formGroup.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('signOfficerPosition').patchValue(data.linePosition);
      } else if (num == 2) {
        this.formGroup.get('signRegFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('signRegPosition').patchValue(data.linePosition);
      } else if (num == 3) {
        this.formGroup.get('signComdFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('signComdPosition').patchValue(data.linePosition);
      } else if (num == 4) {
        this.formGroup.get('signFinanceFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('signFinancePosition').patchValue(data.linePosition);
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
