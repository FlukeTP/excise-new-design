import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import * as moment from 'moment';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { ListFormTsNumber, Ta0301 } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { MessageBarService } from 'services/message-bar.service';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import * as TA0301ACTION from "../ta0301.action";
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + 'ta/report/form-ts/pdf/ta-form-ts0108'
}
@Component({
  selector: 'app-ta030108',
  templateUrl: './ta030108.component.html',
  styleUrls: ['./ta030108.component.css']
})
export class Ta030108Component implements OnInit {

  add: number;
  formTS0108: FormGroup;
  taFormTS0108DtlVoList: FormArray;
  items: FormArray;

  submit: boolean = false;
  loading: boolean = false;
  auditDateStart: string = '';
  auditDateEnd: string = '';
  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  formNumber: string = "";

  beans: any;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.createFormGroup()

  }
  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();
  }

  ngOnInit() {

    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.formTS0108.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formTS0108.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0108.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0108)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0108.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0108.get('formTsNumber').value);
        this.formNumber = this.formTS0108.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0108.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
        }, 200);
      }
    });
  }
  createFormGroup() {
    this.formTS0108 = this.fb.group({
      formTsNumber: [''],
      auditPlanCode: [''],
      auditStepStatus: [''],
      taFormTS0108DtlVoList: this.fb.array([this.createItem()]),

    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      formTs0108DtlId: ["", Validators.required],
      recNo: ["", Validators.required],
      auditDate: ["", Validators.required],
      officerFullName: ["", Validators.required],
      officerPosition: ["", Validators.required],
      auditTime: ["", Validators.required],
      auditDest: ["", Validators.required],
      auditTopic: ["", Validators.required],
      approvedAck: ["", Validators.required],
      officerAck: ["", Validators.required],
      // auditResultDocNo: ["", Validators.required],
      auditResultDate: ["", Validators.required],
      auditComment: ["", Validators.required],
    });
  }
  ngAfterViewInit(): void {
    this.callCalendar('0');
  }
  callCalendar(idx): void {
    $("#auditDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        this.items.at(idx).get('auditDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
    $("#auditResultDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        this.items.at(idx).get('auditResultDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
  }

  clearItem() {
    console.log('this.formGroup.value', this.formTS0108.value)
    this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());

    setTimeout(() => {
      console.log('this.formTS0108.get(taFormTS0108DtlVoList).value', this.formTS0108.get('taFormTS0108DtlVoList').value)
      for (let i = 0; i < this.formTS0108.get('taFormTS0108DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
  }
  addItem(): void {
    this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
    this.items.push(this.createItem());
    console.log("addItem :", this.items.controls);
    setTimeout(() => {
      this.callCalendar(this.items.controls.length - 1);
    }, 50);
  }
  removeItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0108.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }

  exportFile = e => {
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0108.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0108.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0108.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.formTS0108.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formTS0108.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        if (Utils.isNotNull(element.get('auditDate').value)) {
          let auditDate = converDate(element.get('auditDate').value, patternDate.DD_MMMM_YYYY);
          element.get('auditDate').patchValue(auditDate);
        }
        if (Utils.isNotNull(element.get('auditResultDate').value)) {
          let auditResultDate = converDate(element.get('auditResultDate').value, patternDate.DD_MMMM_YYYY);
          element.get('auditResultDate').patchValue(auditResultDate);
        }
      }
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0108.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);

    })
  }
  clear(e) {
    this.formTS0108.reset();
    this.clearItem();
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0108/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0108.patchValue({
          formTsNumber: json.formTsNumber,
          auditPlanCode: json.auditPlanCode
        })

        this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        // console.log("json ==> loop", this.items.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0108DtlVoList.length; i++) {
          this.items.push(this.createItem());
          // console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0108DtlVoList.length; i++) {
            // console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0108DtlVoList.forEach(element => {
            this.items = this.formTS0108.get('taFormTS0108DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0108DtlId: `${element.formTs0108DtlId}`,
              recNo: `${element.recNo}`,
              auditDate: `${Utils.isNotNull(element.auditDate) ? converDate(element.auditDate, patternDate.DD_MM_YYYY) : ''}`,
              officerFullName: `${element.officerFullName}`,
              officerPosition: `${element.officerPosition}`,
              auditTime: `${element.auditTime}`,
              auditDest: `${element.auditDest}`,
              auditTopic: `${element.auditTopic}`,
              approvedAck: `${element.approvedAck}`,
              officerAck: `${element.officerAck}`,
              auditResultDate: `${Utils.isNotNull(element.auditResultDate) ? converDate(element.auditResultDate, patternDate.DD_MM_YYYY) : ''}`,
              auditComment: `${element.auditComment}`,
            })
            i++;
          });
        }, 100);
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

            this.formTS0108.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0108.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 08");
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
