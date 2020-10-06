import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber } from '../ta0301.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import * as moment from 'moment';
import * as TA0301ACTION from "../ta0301.action";
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-ta030121',
  templateUrl: './ta030121.component.html',
  styleUrls: ['./ta030121.component.css']
})
export class Ta030121Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taFormTS0121: FormGroup;
  formTsNumber: any;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  
  constructor(
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.setTaFormTS0121();
  }

  // ================== Initial settting =====================
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.taFormTS0121.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS0121.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0121)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS0121.get('formTsNumber').value)) {
        this.getFormTs(this.taFormTS0121.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.taFormTS0121.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
        }, 200);
      }
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.   
    this.callCalendarDefault('docDate', 'docDate', 'date');
    this.callCalendarDefault('comdDate', 'comdDate', 'date');
  }
  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0121.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  setTaFormTS0121() {
    this.taFormTS0121 = this.fb.group({
      formTsNumber: [""],
      factoryName: [""],
      officerSendFullName1: [""],
      officerSendPosition1: [""],
      officerReceiveFullName1: [""],
      officerReceivePosition1: [""],
      officeName: [""],
      docDate: [""],
      comdDesc: [""],
      comdDate: [""],
      officerSendFullName2: [""],
      factoryName2: [""],
      officerReceiveFullName2: [""],
      officerSendFullName3: [""],
      officerReceiveFullName3: [""],
      factoryName3: [""],
      doc1Num: [""],
      docAcct1Num: [""],
      docAcct1No: [""],
      docAcct2Num: [""],
      docAcct2No: [""],
      docOther: [""],
      signOfficerFullName1: [""],
      signOfficerFullName2: [""],
      signWitnessFullName1: [""],
      signWitnessFullName2: [""],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0121/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taFormTS0121.patchValue({
          formTsNumber: json.formTsNumber,
          factoryName: json.factoryName,
          officerSendFullName1: json.officerSendFullName1,
          officerSendPosition1: json.officerSendPosition1,
          officerReceiveFullName1: json.officerReceiveFullName1,
          officerReceivePosition1: json.officerReceivePosition1,
          officeName: json.officeName,
          docDate: json.docDate,
          comdDesc: json.comdDesc,
          comdDate: json.comdDate,
          officerSendFullName2: json.officerSendFullName2,
          factoryName2: json.factoryName2,
          officerReceiveFullName2: json.officerReceiveFullName2,
          officerSendFullName3: json.officerSendFullName3,
          officerReceiveFullName3: json.officerReceiveFullName3,
          factoryName3: json.factoryName3,
          doc1Num: json.doc1Num,
          docAcct1Num: json.docAcct1Num,
          docAcct1No: json.docAcct1No,
          docAcct2Num: json.docAcct2Num,
          docAcct2No: json.docAcct2No,
          docOther: json.docOther,
          signOfficerFullName1: json.signOfficerFullName1,
          signOfficerFullName2: json.signOfficerFullName2,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,

        })
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
  }
  ngOnDestroy(): void {

    this.dataStore.unsubscribe();
  }
  // ===================== Action ===========================
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.taFormTS0121.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก");
  }

  export = e => {
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.taFormTS0121.get('formTsNumber').value);

        this.loading = false;
        this.submit = true;

        //export
        const URL = "ta/report/form-ts/pdf/ta-form-ts0121/";
        var form = document.createElement("form");
        form.method = "POST";
        // form.target = "_blank";
        form.action = AjaxService.CONTEXT_PATH + URL;

        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taFormTS0121.value);
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  clear(e) {
    this.taFormTS0121.reset();
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
            this.taFormTS0121.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taFormTS0121.get('formTsNumber').value,
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

  // validateField(value: string) {
  //   return this.submit && this.taFormTS0121.get(value).errors;
  // }
  // ================ call back-end ====================
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.taFormTS0121.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS0121.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }

}

class AppState {
  Ta0301: {
    ta0301: Ta0301
  }
}
