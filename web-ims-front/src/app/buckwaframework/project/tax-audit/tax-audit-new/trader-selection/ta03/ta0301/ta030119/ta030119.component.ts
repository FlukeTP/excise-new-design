import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0119",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}
@Component({
  selector: 'app-ta030119',
  templateUrl: './ta030119.component.html',
  styleUrls: ['./ta030119.component.css']
})
export class Ta030119Component implements OnInit {
  [x: string]: any;
  submit: boolean = false;
  loading: boolean = false;

  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;

  userProfile: UserModel;

  formGroup3019: FormGroup;

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
  formNumber: string = "";

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    this.setFormTS0119();
  }



  ngOnInit() {

    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.formGroup3019.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup3019.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0119)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup3019.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup3019.get('formTsNumber').value);
        this.formNumber = this.formGroup3019.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formGroup3019.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
          this.onSetNewRegId();
        }, 200);
      }
    });

  }
  setFormTS0119() {
    this.formGroup3019 = this.fb.group({
      formTsNumber: [''],
      bookNumber1: [''],
      bookNumber2: [''],
      docText1: [''],
      docText2: [''],
      docText3: [''],
      docDate: [''],
      docDear: [''],
      companyName: [''],
      factoryType: [''],
      factoryName: [''],
      newRegId: [''],
      facAddrNo: [''],
      facMooNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      facZipCode: [''],
      followTypeFlag1: [''],
      refBookNumber: [''],
      refBookDate: [''],
      officeName1: [''],
      followTypeFlag2: [''],
      signOfficerFullName: [''],
      signOfficerPosition: [''],
      officeName2: [''],
      officePhone: [''],
      auditPlanCode: [''],
      auditStepStatus: ['']
    })
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();
    this.callCalendarDefault('calendar', 'docDate', 'date');
    this.callCalendarDefault('calendar1', 'refBookDate', 'date');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formGroup3019.get(`${formControlName}`).patchValue(text);
      }
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
          this.formGroup3019.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formGroup3019.get('facAmphurName').reset();
              this.formGroup3019.get('facTambolName').reset();

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
              this.formGroup3019.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup3019.get('newRegId').value)
    let newRegId = this.formGroup3019.get('newRegId').value;
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
          this.formGroup3019.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formGroup3019.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0117');
        }
      });
    });
  }
  

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup3019.patchValue({
          companyName: res.data.facFullname,
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
          factoryType: res.data.factoryType
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

        console.log("formTS0119 : ", this.formGroup3019.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formGroup3019.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      if (Utils.isNotNull(this.auditPlanCode)) {
        this.formGroup3019.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formGroup3019.patchValue({
          formTsNumber: this.formNumber
        })
      }
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup3019.value).toString() }).subscribe((res: ResponseData<any>) => {
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
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0119/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup3019.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docText1: json.docText1,
          docText2: json.docText2,
          docText3: json.docText3,
          docDate: json.docDate,
          docDear: json.docDear,
          companyName: json.companyName,
          factoryType: json.factoryType,
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
          followTypeFlag1: json.followTypeFlag1,
          refBookNumber: json.refBookNumber,
          refBookDate: json.refBookDate,
          officeName1: json.officeName1,
          followTypeFlag2: json.followTypeFlag2,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName2: json.officeName2,
          officePhone: json.officePhone,
          auditPlanCode:json.auditPlanCode
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
            this.formGroup3019.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formGroup3019.get('formTsNumber').value,
              pathTs: this.pathTs
            }
            this.store.dispatch(new TA0301ACTION.AddFormTsNumber(this.ta0301));
          }, 200);
          //!==== set formTsNumber  to store =======
        } else {
          this.messageBar.errorModal(res.message);
          console.log("Error !! getFormTsNumber 19");
        }
      })
    })
  }
  clear(e) {
    this.formGroup3019.reset();
  }

  export(e) {
    this.submit = true;
    console.log("export", this.formGroup3019.value)

    var form = document.createElement("form");
    form.action = URL.EXPORT;
    form.method = "POST";
    form.style.display = "none";

    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.formGroup3019.value).toString();
    form.appendChild(jsonInput);
    document.body.appendChild(form);
    form.submit();

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

}

class AppState {
  Ta0301: {
    ta0301: Ta0301,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[]
  }
}
