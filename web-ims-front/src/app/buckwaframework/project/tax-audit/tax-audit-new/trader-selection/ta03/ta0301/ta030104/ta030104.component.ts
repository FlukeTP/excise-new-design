import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { UserModel } from 'models/user.model';
import { AuthService } from 'services/auth.service';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0104",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030104',
  templateUrl: './ta030104.component.html',
  styleUrls: ['./ta030104.component.css']
})
export class Ta030104Component implements OnInit {

  formTS0104: FormGroup;
  userProfile: UserModel;

  submit: boolean = false;
  loading: boolean = false;

  pathTs: any;
  dataStore: any;

  listFormTsNumber: ListFormTsNumber;

  ta0301: Ta0301

  auditPlanCode: string = "";
  auditStepStatus: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setFormTS0104();
    this.setUserProfileForm();
    this.getDataListForSearchModal();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    console.log("ngOnInit formGroup : ", this.formTS0104.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0104.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0104)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0104.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0104.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0104.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.setUserProfileForm();
        }, 200);
      }
    });
  }

  ngAfterViewInit(): void {
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarDestDate', 'destDate', 'date', 'วดป');
    this.callCalendarDefault('calendarDestTime', 'destTime', 'time', 'เวลา');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setFormTS0104() {
    this.formTS0104 = this.fb.group({
      formTsNumber: [""],
      bookNumber1: [""],
      bookNumber2: [""],
      subject1: [""],
      subject2: [""],
      docDate: [""],
      docTopic: [""],
      docDear: [""],
      docReference: [""],
      docRequire: [""],
      destText: [""],
      destDate: [""],
      destTime: [""],
      docPaper: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      otherText: [""],
      otherPhone: [""],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }

  setUserProfileForm() {
    this.formTS0104.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.title
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formTS0104.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  // ============== Action ======================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0104.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formTS0104.reset();
  }
  export(e) {
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0104.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0104.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0104.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }
  // ==================== call back-end ==============

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0104/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0104.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          subject1: json.subject1,
          subject2: json.subject2,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docTopic: json.docTopic,
          docDear: json.docDear,
          docReference: json.docReference,
          docRequire: json.docRequire,
          destText: json.destText,
          destDate: Utils.isNotNull(json.destDate) ? converDate(json.destDate, patternDate.DD_MM_YYYY) : '',
          destTime: json.destTime,
          docPaper: json.docPaper,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          otherText: json.otherText,
          otherPhone: json.otherPhone
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
            this.formTS0104.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0104.get('formTsNumber').value,
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
      this.formTS0104.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formTS0104.get('docDate').value)) {
        let docDate = converDate(this.formTS0104.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0104.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.formTS0104.get('destDate').value)) {
        let destDate = converDate(this.formTS0104.get('destDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0104.get('destDate').patchValue(destDate);
      }
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0104.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
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
        this.formTS0104.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formTS0104.get('signOfficerPosition').patchValue(data.linePosition);
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

