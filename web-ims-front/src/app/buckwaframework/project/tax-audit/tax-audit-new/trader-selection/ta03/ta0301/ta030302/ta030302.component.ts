import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UserModel } from 'models/user.model';
import { ListFormTsNumber, ProvinceList, AmphurList, DistrictList, Ta0301 } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { PathTs } from '../path.model';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Observable } from 'rxjs/internal/Observable';
import * as TA0301ACTION from "../ta0301.action";
import { ActivatedRoute } from '@angular/router';


declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0302",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta030302',
  templateUrl: './ta030302.component.html',
  styleUrls: ['./ta030302.component.css']
})
export class Ta030302Component implements OnInit {
  formTS0302: FormGroup
  items: FormArray;
  userProfile: UserModel;

  loading: boolean = false;
  submit: boolean = false;

  pathTs: string = '';
  dataStore: any;
  listFormTsNumber: ListFormTsNumber;

  provinceList: ProvinceList[];
  amphurList: AmphurList[];
  amphurListFilter: AmphurList[];
  districtList: DistrictList[];
  districtListFilter: DistrictList[];

  provinceStore: any;
  amphurStore: any;
  districtStore: any;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // =============== Initial setting ==========//
    this.setForm();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.formTS0302.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })
    console.log("ngOnInit formGroup : ", this.formTS0302.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0302.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0302)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0302.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0302.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0302.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.onSetNewRegId();
        }, 200);
      }
    });
  }
  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();
    this.callCalendar('0');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  setForm() {
    this.formTS0302 = this.fb.group({
      formTsNumber: [""],
      factoryName: [""],
      factoryTypeText: [""],
      ownerName: [""],
      newRegId: [""],
      facAddrNo: [""],
      facSoiName: [""],
      facThnName: [""],
      facTambolName: [""],
      facAmphurName: [""],
      facProvinceName: [""],
      assessmentText: [""],
      auditPlanCode: [""],
      auditStepStatus: [""],
      taFormTS0302DtlVoList: this.fb.array([this.createListItem()])
    })
  }

  //set oop for dataList
  createListItem(): FormGroup {
    return this.fb.group({
      formTs0302DtlId: [""],
      auditNo: [""],
      operatorOfficeName: [""],
      operatorFullName: [""],
      refDocNo: [""],
      refDocDate: [""],
      auditDateStart: [""],
      auditDateEnd: [""],
      auditStatus: [""],
      auditStatusDate: [""],
      resultDocNo: [""],
      resultDocDate: [""],
      resultTaxAmt: [""],
      resultFineAmt: [""],
      resultExtraAmt: [""],
      resultMoiAmt: [""],
      resultNetTaxAmt: [""],
      assessmentAmt: [""],
      officerFullName: [""],
      officerDate: [""],
      officerComment: [""]
    });
  }
  //=============================== callCalendar =============================
  callCalendar(idx): void {

    $("#refDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.at(idx).get('refDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#auditDateStart" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
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
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.at(idx).get('auditDateEnd').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#auditStatusDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.at(idx).get('auditStatusDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#resultDocDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.at(idx).get('resultDocDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

    $("#officerDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.at(idx).get('officerDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });

  }
  //=============================== getProvinceList , getAmphurList , getDistrictList=============================
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
          this.formTS0302.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formTS0302.get('facAmphurName').reset();
              this.formTS0302.get('facTambolName').reset();

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
              this.formTS0302.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  //=============================== action=============================
  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0302.get('newRegId').value)
    let newRegId = this.formTS0302.get('newRegId').value;
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
          this.formTS0302.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formTS0302.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0302');
        }
      });
    });
  }

  addListItem(): void {
    this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
    this.items.push(this.createListItem());
    console.log("addItem :", this.items.controls);
    setTimeout(() => {
      this.callCalendar(this.items.controls.length - 1);
    }, 50);
  }
  removeListItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }

  clearItem() {
    this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createListItem());

    setTimeout(() => {
      for (let i = 0; i < this.formTS0302.get('taFormTS0302DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
    
  }

  calculateMoney(index: number) {
    this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
    let resultTaxAmt = Number(this.items.at(index).get('resultTaxAmt').value.toString().replace(/,/g, ""));
    let resultFineAmt = Number(this.items.at(index).get('resultFineAmt').value.toString().replace(/,/g, ""));
    let resultExtraAmt = Number(this.items.at(index).get('resultExtraAmt').value.toString().replace(/,/g, ""));
    let resultMoiAmt = (resultTaxAmt+resultFineAmt+resultExtraAmt)*0.1;
    let resultNetTaxAmt = resultMoiAmt*10;
    this.items.at(index).get('resultMoiAmt').patchValue(Utils.moneyFormatDecimal(resultMoiAmt));
    this.items.at(index).get('resultNetTaxAmt').patchValue(Utils.moneyFormatDecimal(resultMoiAmt+resultNetTaxAmt));
  }

  onFocusMoney(index: number, name: any) {
    this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
    let count = this.items.at(index).get(name).value.toString().replace(/,/g, "");
    this.items.at(index).get(name).patchValue(Number(count));

  }

  onBlurMoney(index: number, name: string) {
    this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
    let count = Number(this.items.at(index).get(name).value);
    this.items.at(index).get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney(index);
  }

  //=============================== backend=============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0302.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          factoryTypeText: res.data.factoryTypeText
        })
        console.log("formTS0302 : ", this.formTS0302.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formTS0302.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0302.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formTS0302.reset();
    this.clearItem();
  }
  export(e) {
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formTS0302.get('formTsNumber').value)

        console.log("export : ", this.formTS0302.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0302.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.formTS0302.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      // delete ',' on number
      this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        let resultTaxAmt = Number(element.get('resultTaxAmt').value.replace(/,/g, ""));
        let resultFineAmt = Number(element.get('resultFineAmt').value.replace(/,/g, ""));
        let resultExtraAmt = Number(element.get('resultExtraAmt').value.replace(/,/g, ""));
        let resultMoiAmt = Number(element.get('resultMoiAmt').value.replace(/,/g, ""));
        let resultNetTaxAmt = Number(element.get('resultNetTaxAmt').value.replace(/,/g, ""));
        this.items.at(index).get('resultTaxAmt').patchValue(resultTaxAmt);
        this.items.at(index).get('resultFineAmt').patchValue(resultFineAmt);
        this.items.at(index).get('resultExtraAmt').patchValue(resultExtraAmt);
        this.items.at(index).get('resultMoiAmt').patchValue(resultMoiAmt);
        this.items.at(index).get('resultNetTaxAmt').patchValue(resultNetTaxAmt);
      }
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0302.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
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
            this.formTS0302.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0302.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======

        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber");
        }
      })
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0302/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0302.patchValue({
          formTsNumber: json.formTsNumber,
          factoryName: json.factoryName,
          factoryTypeText: json.factoryTypeText,
          ownerName: json.ownerName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          assessmentText: json.assessmentText
        })

        this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0302DtlVoList.length; i++) {
          this.items.push(this.createListItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0302DtlVoList.length; i++) {
            console.log("callListCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0302DtlVoList.forEach(element => {
            this.items = this.formTS0302.get('taFormTS0302DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0302DtlId: `${element.formTs0302DtlId}`,
              auditNo: `${element.auditNo}`,
              operatorOfficeName: `${element.operatorOfficeName}`,
              operatorFullName: `${element.operatorFullName}`,
              refDocNo: `${element.refDocNo}`,
              refDocDate: `${element.refDocDate}`,
              auditDateStart: `${element.auditDateStart}`,
              auditDateEnd: `${element.auditDateEnd}`,
              auditStatus: `${element.auditStatus}`,
              auditStatusDate: `${element.auditStatusDate}`,
              resultDocNo: `${element.resultDocNo}`,
              resultDocDate: `${element.resultDocDate}`,
              resultTaxAmt: `${element.resultTaxAmt}`,
              resultFineAmt: `${element.resultFineAmt}`,
              resultExtraAmt: `${element.resultExtraAmt}`,
              resultMoiAmt: `${element.resultMoiAmt}`,
              resultNetTaxAmt: `${element.resultNetTaxAmt}`,
              assessmentAmt: `${element.assessmentAmt}`,
              officerFullName: `${element.officerFullName}`,
              officerDate: `${element.officerDate}`,
              officerComment: `${element.officerComment}`
            })
            i++;
          });
        }, 100);
        // call new search 
        // find amphur for get provinceId and amphurId
        var amphur = this.amphurList.find((element) => {
          return element.amphurName == json.facAmphurName;
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
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error !! getFormTsNumber ");
      }
    })
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
