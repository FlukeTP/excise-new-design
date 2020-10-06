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
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0423",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta030423',
  templateUrl: './ta030423.component.html',
  styleUrls: ['./ta030423.component.css']
})
export class Ta030423Component implements OnInit {
  [x: string]: any;
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;

  userProfile: UserModel;
  formGroup0423: FormGroup;
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
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute

  ) {
    this.createFormGroup();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.formGroup0423.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })
    console.log("ngOnInit formGroup : ", this.formGroup0423.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup0423.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0423)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup0423.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup0423.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.formGroup0423.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.onSetNewRegId();
        }, 200);
      }
    });
  }

  ngAfterViewInit(): void {
    this.callCalendar('0');
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  createFormGroup() {
    this.formGroup0423 = this.fb.group({
      formTsNumber: [''],
      alphabet: [''],
      factoryTypeText: [''],
      ownerName: [''],
      newRegId: [''],
      facAddrNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      auditPlanCode: [''],
      auditStepStatus: [''],
      taFormTS0423DtlVoList: this.fb.array([this.createItem()])
    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      formTs0424DtlId: [''],
      recNo: [''],
      operatorOfficeName: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      reqDocDate: [''],
      informDocDate: [''],
      auditReason: [''],
      auditResult: [''],
      officerFullName: ['']
    });
  }
  clearItem() {
    console.log('this.formGroup.value', this.formGroup0423.value)
    this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());

    setTimeout(() => {
      console.log('this.formGroup0423.get(taFormTS0423DtlVoList).value', this.formGroup0423.get('taFormTS0423DtlVoList').value)
      for (let i = 0; i < this.formGroup0423.get('taFormTS0423DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
  }
  addItem(): void {
    this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
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


  callCalendar(idx): void {
    $("#auditDateStart" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
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
        this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateEnd').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
    $("#reqDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
        this.items.at(idx).get('reqDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
    $("#informDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
        this.items.at(idx).get('informDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup0423.get('newRegId').value)
    let newRegId = this.formGroup0423.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const FAC_PROVINCE_SEARCH = "facProvinceSearch";
    const FAC_AMPHUR_SEARCH = "facAmphurSearch";
    // Clears value from cache, if no parameter passed clears all cache
    $(`.${className}`).search('clear cache');

    $(`.${className}`)
      .search({
        source: data,
        showNoResults: false,
        searchFields: [`${fieldName}`],
        fields: {
          // results: 'items',
          title: `${fieldName}`,
        },
        onSelect: (result, response) => {
          this.formGroup0423.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formGroup0423.get('facAmphurName').reset();
              this.formGroup0423.get('facTambolName').reset();

              this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
              break;
            // amphur search TODO filter district
            case FAC_AMPHUR_SEARCH:
              this.districtListFilter = [];
              var regex = /^\d{4}/g;
              this.districtListFilter = this.districtList.filter(({ districtCode }) => {
                return districtCode.match(regex)[0] == result.amphurCode;
              });
              // reset tambol when amphur new select
              this.formGroup0423.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
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
          this.formGroup0423.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formGroup0423.get('newRegId').value);
        } else {
          console.log('error getNewRegId formGroup0423');
        }
      });
    });
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup0423.patchValue({
          ownerName: res.data.cusFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          factoryTypeText: res.data.factoryTypeText
        })
        // call new search 
        // find amphur for get provinceId and amphurId
        var amphur = this.amphurList.find((element) => {
          return element.amphurName == res.data.facAmphurName;
        });
        if (Utils.isNotNull(amphur)) {
          // filter amphur and district
          this.amphurListFilter = this.amphurList.filter(({ provinceId }) => {
            return provinceId == amphur.provinceId;
          });
          this.districtListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
            return provinceId == amphur.provinceId && amphurId == amphur.amphurId;
          });
          // call search after filter amphur and district
          this.callSearch(this.amphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
          this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
        }

        console.log("formGroup0423 : ", this.formGroup0423.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0423/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formGroup0423.patchValue({
          formTsNumber: json.formTsNumber,
          alphabet: json.alphabet,
          factoryTypeText: json.factoryTypeText,
          ownerName: json.ownerName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,

        })

        this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0423DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0423DtlVoList.length; i++) {
            console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0423DtlVoList.forEach(element => {
            this.items = this.formGroup0423.get('taFormTS0423DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0423DtlId: `${element.formTs0423DtlId}`,
              recNo: `${element.recNo}`,
              operatorOfficeName: `${element.operatorOfficeName}`,
              auditDateStart: `${element.auditDateStart}`,
              auditDateEnd: `${element.auditDateEnd}`,
              reqDocDate: `${element.reqDocDate}`,
              informDocDate: `${element.informDocDate}`,
              auditReason: `${element.auditReason}`,
              auditResult: `${element.auditResult}`,
              officerFullName: `${element.officerFullName}`,
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
            this.formGroup0423.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formGroup0423.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 0423");
        }
      })
    })
  }

  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formGroup0423.get('formTsNumber').value)

        console.log("export : ", this.formGroup0423.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formGroup0423.value).toString();
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
        console.log('json : ', JSON.stringify(this.formGroup0423.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup0423.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.formGroup0423.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup0423.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }


  getProvinceList() {
    this.provinceStore = this.store.select(state => state.Ta0301.proviceList).subscribe(datas => {
      this.provinceList = [];
      this.provinceList = datas;
      this.callSearch(this.provinceList, 'facProvinceSearch', 'provinceName', 'facProvinceName');
    });
  }

  getAmphurList() {
    this.amphurStore = this.store.select(state => state.Ta0301.amphurList).subscribe(datas => {
      this.amphurList = [];
      this.amphurList = datas;
      this.callSearch(this.amphurList, 'facAmphurSearch', 'amphurName', 'facAmphurName');
    });
  }

  getDistrictList() {
    this.districtStore = this.store.select(state => state.Ta0301.districtList).subscribe(datas => {
      this.districtList = [];
      this.districtList = datas;
      this.callSearch(this.districtList, 'facTambolSearch', 'districtName', 'facTambolName');
    });
  }

  clear(e) {
    this.formGroup0423.reset();
    this.clearItem();
  }

}



class AppState {
  Ta0301: {
    ta0301: Ta0301,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[]
  }
}