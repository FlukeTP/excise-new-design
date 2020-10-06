import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import * as moment from 'moment';
import * as TA0301ACTION from "../ta0301.action";
import { ResponseData } from 'models/response-data.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { UserModel } from 'models/user.model';
import { MessageService } from 'services/message.service';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0424",
}
@Component({
  selector: 'app-ta030424',
  templateUrl: './ta030424.component.html',
  styleUrls: ['./ta030424.component.css']
})
export class Ta030424Component implements OnInit {
  [x: string]: any;
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  monthTypeList: string[] = [];
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  startmonth: any;
  endmonth: any;
  userProfile: UserModel;
  formGroup0424: FormGroup;
  provinceList: ProvinceList[];
  amphurList: AmphurList[];
  amphurListFilter: AmphurList[];
  districtList: DistrictList[];
  districtListFilter: DistrictList[];
  taFormTS0423DtlVoList: FormArray;
  provinceStore: any;
  amphurStore: any;
  districtStore: any;

  items: FormArray;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.createFormGroup();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.formGroup0424.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })
    this.getMonth();
    console.log("ngOnInit formGroup : ", this.formGroup0424.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup0424.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0424)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup0424.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup0424.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.formGroup0424.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
        }, 200);
      }
    });
  }

  createFormGroup() {
    this.formGroup0424 = this.fb.group({
      formTsNumber: [''],
      factoryName: [''],
      auditMonthStart: [''],
      auditMonthEnd: [''],
      auditYear: [''],
      auditPlanCode: [''],
      auditStepStatus: [''],
      taFormTS0424DtlVoList: this.fb.array([this.createItem()])
    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      formTs0424DtlId: [''],
      recNo: [''],
      operatorOfficeName: [''],
      operatorFullName: [''],
      ownerFullName: [''],
      newRegId: [''],
      factoryTypeText: [''],
      callDocNo: [''],
      callDocDate: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      taxAmt: [''],
      fineAmt: [''],
      extraAmt: [''],
      moiAmt: [''],
      nettaxAmt: [''],
      residueNum: [''],
      officerComment: ['']

    });
  }

  clearItem() {
    console.log('this.formGroup0424.value', this.formGroup0424.value)
    this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());

    setTimeout(() => {
      console.log('this.formGroup0424.get(taFormTS0424DtlVoList).value', this.formGroup0424.get('taFormTS0424DtlVoList').value)
      for (let i = 0; i < this.formGroup0424.get('taFormTS0424DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
  }

  addItem(): void {
    this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
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

  ngAfterViewInit(): void {
    this.callCalendarDefault('auditYear', 'auditYear', 'year');
    this.callCalendar('0');

  }
  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(`${type}`),
      onChange: (date, text) => {
        this.formGroup0424.get(`${formControlName}`).patchValue(text);
      }
    });
  }
  callCalendar(idx): void {
    $("#auditDateStart" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateStart').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#auditDateEnd" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateEnd').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
    $("#callDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
        this.items.at(idx).get('callDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

  }

  calculateMoney(index: number) {
    this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
    let taxAmt = Number(this.items.at(index).get('taxAmt').value.toString().replace(/,/g, ""));
    let fineAmt = Number(this.items.at(index).get('fineAmt').value.toString().replace(/,/g, ""));
    let extraAmt = Number(this.items.at(index).get('extraAmt').value.toString().replace(/,/g, ""));
    let moiAmt = (taxAmt + fineAmt + extraAmt) * 0.1;
    let nettaxAmt = moiAmt * 10;
    this.items.at(index).get('moiAmt').patchValue(Utils.moneyFormatDecimal(moiAmt));
    this.items.at(index).get('nettaxAmt').patchValue(Utils.moneyFormatDecimal(moiAmt + nettaxAmt));
  }

  onFocusMoney(index: number, name: any) {
    this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
    let count = this.items.at(index).get(name).value.toString().replace(/,/g, "");
    this.items.at(index).get(name).patchValue(Number(count));

  }

  onBlurMoney(index: number, name: string) {
    this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
    let count = Number(this.items.at(index).get(name).value);
    this.items.at(index).get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney(index);
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0424/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formGroup0424.patchValue({
          formTsNumber: json.formTsNumber,
          factoryName: json.factoryName,
          auditMonthStart: json.auditMonthStart,
          auditMonthEnd: json.auditMonthEnd,
          auditYear: json.auditYear,

        })

        this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0424DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0424DtlVoList.length; i++) {
            console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0424DtlVoList.forEach(element => {
            this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0424DtlId: `${element.formTs0424DtlId}`,
              recNo: `${element.recNo}`,
              operatorOfficeName: `${element.operatorOfficeName}`,
              auditDateStart: `${element.auditDateStart}`,
              auditDateEnd: `${element.auditDateEnd}`,
              operatorFullName: `${element.operatorFullName}`,
              ownerFullName: `${element.ownerFullName}`,
              auditReason: `${element.auditReason}`,
              newRegId: `${element.newRegId}`,
              factoryTypeText: `${element.factoryTypeText}`,
              callDocNo: `${element.callDocNo}`,
              callDocDate: `${element.callDocDate}`,
              taxAmt: `${element.taxAmt}`,
              fineAmt: `${element.fineAmt}`,
              extraAmt: `${element.extraAmt}`,
              moiAmt: `${element.moiAmt}`,
              nettaxAmt: `${element.nettaxAmt}`,
              residueNum: `${element.residueNum}`,
              officerComment: `${element.officerComment}`,

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
            this.formGroup0424.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formGroup0424.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 0424");
        }
      })
    })
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formGroup0424.get('formTsNumber').value)

        console.log("export : ", this.formGroup0424.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formGroup0424.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }
  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formGroup0424.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup0424.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  saveTs(): Observable<any> {

    return new Observable(obs => {
      this.formGroup0424.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      // delete ',' on number
      this.items = this.formGroup0424.get('taFormTS0424DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        let taxAmt = Number(element.get('taxAmt').value.replace(/,/g, ""));
        let fineAmt = Number(element.get('fineAmt').value.replace(/,/g, ""));
        let extraAmt = Number(element.get('extraAmt').value.replace(/,/g, ""));
        let moiAmt = Number(element.get('moiAmt').value.replace(/,/g, ""));
        let nettaxAmt = Number(element.get('nettaxAmt').value.replace(/,/g, ""));
        this.items.at(index).get('taxAmt').patchValue(taxAmt);
        this.items.at(index).get('fineAmt').patchValue(fineAmt);
        this.items.at(index).get('extraAmt').patchValue(extraAmt);
        this.items.at(index).get('moiAmt').patchValue(moiAmt);
        this.items.at(index).get('nettaxAmt').patchValue(nettaxAmt);
      }
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup0424.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }
  clear(e) {
    this.formGroup0424.reset();
    this.clearItem();
  }
  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  getMonth() {
    this.ajax.doPost("preferences/parameter/MONTH_LIST", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.monthTypeList = res.data;
        console.log(this.monthTypeList.values);

      } else {
        this.msg.errorModal(res.message);
      }
    })
  }
}
class AppState {
  Ta0301: {
    ta0301: Ta0301,

  }
}

