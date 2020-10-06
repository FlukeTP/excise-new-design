import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { MessageService } from 'services/message.service';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { ResponseData } from 'models/response-data.model';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0105",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030105',
  templateUrl: './ta030105.component.html',
  styleUrls: ['./ta030105.component.css']
})
export class Ta030105Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taFormTS0105: FormGroup;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.setTaFormTS0105();
    this.getDataListForSearchModal();
  }

  // =============== Initial setting ================
  ngOnInit() {

    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.taFormTS0105.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS0105.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0105)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS0105.get('formTsNumber').value)) {
        this.getFormTs(this.taFormTS0105.get('formTsNumber').value);
        this.formNumber = this.taFormTS0105.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.taFormTS0105.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
        }, 200);
      }
    });
  }
  ngOnDestroy(): void {

    this.dataStore.unsubscribe();
  }


  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.   
    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date', 'วดป');
    this.callCalendarDefault('calendarCaseDate', 'caseDate', 'date', 'วดป');
    this.callCalendarDefault('calendarCaseTime', 'caseTime', 'time', 'เวลา');
    this.callCalendarDefault('calendarDestDate', 'destDate', 'date', 'วดป');
    this.callCalendarDefault('calendarDestTime', 'destTime', 'time', 'เวลา');
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.taFormTS0105.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  clear(e) {
    this.taFormTS0105.reset();
  }
  setTaFormTS0105() {
    this.taFormTS0105 = this.fb.group({
      formTsNumber: [""],
      bookNumber1: [""],
      bookNumber2: [""],
      officeName: [""],
      docDate: [""],
      docDear: [""],
      refBookNumber1: [""],
      refBookNumber2: [""],
      refDocDate: [""],
      refDocSend: [""],
      caseDate: [""],
      caseTime: [""],
      destText: [""],
      destDate: [""],
      destTime: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      otherText: [""],
      otherPhone: [""],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }

  // ================ Action =======================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taFormTS0105.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }

  export(e) {
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.taFormTS0105.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.taFormTS0105.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taFormTS0105.value).toString();
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

  // ================= call back-end ================
  saveTs(): Observable<any> {
    return new Observable(obs => {

      this.taFormTS0105.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.taFormTS0105.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.taFormTS0105.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.taFormTS0105.get('docDate').value)) {
        let docDate = converDate(this.taFormTS0105.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS0105.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.taFormTS0105.get('refDocDate').value)) {
        let refDocDate = converDate(this.taFormTS0105.get('refDocDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS0105.get('refDocDate').patchValue(refDocDate);
      }
      if (Utils.isNotNull(this.taFormTS0105.get('caseDate').value)) {
        let caseDate = converDate(this.taFormTS0105.get('caseDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS0105.get('caseDate').patchValue(caseDate);
      }
      if (Utils.isNotNull(this.taFormTS0105.get('destDate').value)) {
        let destDate = converDate(this.taFormTS0105.get('destDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS0105.get('destDate').patchValue(destDate);
      }
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS0105.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);


    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0105/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taFormTS0105.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          officeName: json.officeName,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docDear: json.docDear,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: Utils.isNotNull(json.refDocDate) ? converDate(json.refDocDate, patternDate.DD_MM_YYYY) : '',
          refDocSend: json.refDocSend,
          caseDate: Utils.isNotNull(json.caseDate) ? converDate(json.caseDate, patternDate.DD_MM_YYYY) : '',
          caseTime: json.caseTime,
          destText: json.destText,
          destDate: Utils.isNotNull(json.destDate) ? converDate(json.destDate, patternDate.DD_MM_YYYY) : '',
          destTime: json.destTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          otherText: json.otherText,
          otherPhone: json.otherPhone,
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

            this.taFormTS0105.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taFormTS0105.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 12");
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
        this.taFormTS0105.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.taFormTS0105.get('signOfficerPosition').patchValue(data.linePosition);
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


