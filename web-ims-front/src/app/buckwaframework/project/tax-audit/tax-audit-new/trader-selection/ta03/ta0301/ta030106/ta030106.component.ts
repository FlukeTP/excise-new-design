import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Store } from '@ngrx/store';
import * as TA0301ACTION from "../ta0301.action";
import { ListFormTsNumber, Ta0301, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';

import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0106",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta030106',
  templateUrl: './ta030106.component.html',
  styleUrls: ['./ta030106.component.css']
})
export class Ta030106Component implements OnInit, AfterViewInit {

  formTS0106: FormGroup;
  submit: boolean = false;
  loading: boolean = false;

  formTsNumber: any;
  pathTs: any;
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

  ta0301: Ta0301

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  constructor(
    private fb: FormBuilder,

    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.setFormTS0106();
  }

  // ==================== Initial setting ================
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0106.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0106)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0106.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0106.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0106.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.onSetNewRegId();
        }, 200);
      }

    });

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date');
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const FAC_PROVINCE_SEARCH = "facProvinceSearch";
    const FAC_AMPHUR_SEARCH = "facAmphurSearch";
    const AUTH_PROVINCE_SEARCH = "authProvinceSearch";
    const AUTH_AMPHUR_SEARCH = "authAmphurSearch";
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
          this.formTS0106.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formTS0106.get('facAmphurName').reset();
              this.formTS0106.get('facTambolName').reset();

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
              this.formTS0106.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;
            // province 2 search TODO filter amphur
            case AUTH_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formTS0106.get('authAmphurName').reset();
              this.formTS0106.get('authTambolName').reset();

              this.callSearch(this.amphurListFilter, 'authAmphurSearch', 'amphurName', 'authAmphurName');
              break;
            // amphur 2 search TODO filter district
            case AUTH_AMPHUR_SEARCH:
              this.districtListFilter = [];
              var regex = /^\d{4}/g;
              this.districtListFilter = this.districtList.filter(({ districtCode }) => {
                return districtCode.match(regex)[0] == result.amphurCode;
              });
              // reset tambol when amphur new select
              this.formTS0106.get('authTambolName').reset();

              this.callSearch(this.districtListFilter, 'authTambolSearch', 'districtName', 'authTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formTS0106.get(`${formControlName}`).patchValue(text);
      }
    });
  }
  ngOnDestroy(): void {

    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }
  setFormTS0106() {
    this.formTS0106 = this.fb.group({
      formTsNumber: ["", Validators.required],
      docPlace: ["", Validators.required],
      docDate: ["", Validators.required],
      writerFullName: ["", Validators.required],
      writerPositionFlag: ["", Validators.required],
      factoryName: ["", Validators.required],
      newRegId: ["", Validators.required],
      facAddrNo: ["", Validators.required],
      facMooNo: ["", Validators.required],
      facSoiName: ["", Validators.required],
      facThnName: ["", Validators.required],
      facTambolName: ["", Validators.required],
      facAmphurName: ["", Validators.required],
      facProvinceName: ["", Validators.required],
      facZipCode: ["", Validators.required],
      facTelNo: ["", Validators.required],
      refBookNumber1: ["", Validators.required],
      refBookNumber2: ["", Validators.required],
      refDocDate: ["", Validators.required],
      authFullName: ["", Validators.required],
      authAge: ["", Validators.required],
      authAddrNo: ["", Validators.required],
      authSoiName: ["", Validators.required],
      authThnName: ["", Validators.required],
      authTambolName: ["", Validators.required],
      authAmphurName: ["", Validators.required],
      authProvinceName: ["", Validators.required],
      authZipCode: ["", Validators.required],
      authTelNo: ["", Validators.required],
      authCardId: ["", Validators.required],
      authCardPlace: ["", Validators.required],
      docText: ["", Validators.required],
      signAuthFullName1: ["", Validators.required],
      signAuthFullName2: ["", Validators.required],
      signAuthFullName3: ["", Validators.required],
      signWitnessFullName1: ["", Validators.required],
      signWitnessFullName2: ["", Validators.required],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }

  // ==================== Action =======================
  writerPositionFlagClick(number: string) {
    this.formTS0106.get('writerPositionFlag').patchValue(number);
  }


  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0106.get('newRegId').value)
    let newRegId = this.formTS0106.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0106.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
          facTelNo: res.data.facTelno
        })
        console.log("formTS0106 : ", this.formTS0106.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }
  save(e) {
    if (Utils.isNull(this.formTS0106.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0106.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }

  clear(e) {
    this.formTS0106.reset();
    this.formTsNumber = '';
  }

  export(e) {
    if (Utils.isNull(this.formTS0106.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0106.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0106.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0106.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
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
          this.formTS0106.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formTS0106.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0106');
        }
      });
    });
  }

  // ==================== call back-end ======================
  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.formTS0106.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formTS0106.get('docDate').value)) {
        let docDate = converDate(this.formTS0106.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0106.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.formTS0106.get('refDocDate').value)) {
        let refDocDate = converDate(this.formTS0106.get('refDocDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0106.get('refDocDate').patchValue(refDocDate);
      }
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0106.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0106/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0106.patchValue({
          formTsNumber: json.formTsNumber,
          docPlace: json.docPlace,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          writerFullName: json.writerFullName,
          writerPositionFlag: json.writerPositionFlag,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facMooNo: json.facMooNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          facTelNo: json.facTelNo,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: Utils.isNotNull(json.refDocDate) ? converDate(json.refDocDate, patternDate.DD_MM_YYYY) : '',
          authFullName: json.authFullName,
          authAge: json.authAge,
          authAddrNo: json.authAddrNo,
          authSoiName: json.authSoiName,
          authThnName: json.authThnName,
          authTambolName: json.authTambolName,
          authAmphurName: json.authAmphurName,
          authProvinceName: json.authProvinceName,
          authZipCode: json.authZipCode,
          authTelNo: json.authTelNo,
          authCardId: json.authCardId,
          authCardPlace: json.authCardPlace,
          docText: json.docText,
          signAuthFullName1: json.signAuthFullName1,
          signAuthFullName2: json.signAuthFullName2,
          signAuthFullName3: json.signAuthFullName3,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,
        });
        // call new search 
        // find amphur for get provinceId and amphurId
        var facAmphur = this.amphurList.find((element) => {
          return element.amphurName == json.facAmphurName;
        });
        if (Utils.isNotNull(facAmphur)) {
          // filter facAmphur and facDistrict
          var facAmphurListFilter = this.amphurList.filter(({ provinceId }) => {
            return provinceId == facAmphur.provinceId;
          });
          var facDistrictListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
            return provinceId == facAmphur.provinceId && amphurId == facAmphur.amphurId;
          });
          // call search after filter facAmphur and facDistrict
          this.callSearch(facAmphurListFilter, 'facAmphurSearch', 'amphurName', 'facAmphurName');
          this.callSearch(facDistrictListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
        }
        // call new search 
        // find amphur for get provinceId and amphurId
        var authAmphur = this.amphurList.find((element) => {
          return element.amphurName == json.authAmphurName;
        });
        if (Utils.isNotNull(authAmphur)) {
          // filter authAmphur and authDistrict
          var authAmphurListFilter = this.amphurList.filter(({ provinceId }) => {
            return provinceId == authAmphur.provinceId;
          });
          var authDistrictListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
            return provinceId == authAmphur.provinceId && amphurId == authAmphur.amphurId;
          });
          // call search after filter authAmphur and authDistrict
          this.callSearch(authAmphurListFilter, 'authAmphurSearch', 'amphurName', 'authAmphurName');
          this.callSearch(authDistrictListFilter, 'authTambolSearch', 'districtName', 'authTambolName');
        }

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

            this.formTS0106.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0106.get('formTsNumber').value,
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

  getProvinceList() {
    this.provinceStore = this.store.select(state => state.Ta0301.proviceList).subscribe(datas => {
      this.provinceList = [];
      this.provinceList = datas;
      this.callSearch(this.provinceList, 'facProvinceSearch', 'provinceName', 'facProvinceName');
      this.callSearch(this.provinceList, 'authProvinceSearch', 'provinceName', 'authProvinceName');
    });
  }

  getAmphurList() {
    this.amphurStore = this.store.select(state => state.Ta0301.amphurList).subscribe(datas => {
      this.amphurList = [];
      this.amphurList = datas;
      this.callSearch(this.amphurList, 'facAmphurSearch', 'amphurName', 'facAmphurName');
      this.callSearch(this.amphurList, 'authAmphurSearch', 'amphurName', 'authAmphurName');
    });
  }

  getDistrictList() {
    this.districtStore = this.store.select(state => state.Ta0301.districtList).subscribe(datas => {
      this.districtList = [];
      this.districtList = datas;
      this.callSearch(this.districtList, 'facTambolSearch', 'districtName', 'facTambolName');
      this.callSearch(this.districtList, 'authTambolSearch', 'districtName', 'authTambolName');
    });
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

