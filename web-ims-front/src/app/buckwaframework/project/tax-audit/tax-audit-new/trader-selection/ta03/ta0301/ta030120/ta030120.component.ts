import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import * as moment from 'moment';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0120",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details"
}

@Component({
  selector: 'app-ta030120',
  templateUrl: './ta030120.component.html',
  styleUrls: ['./ta030120.component.css']
})
export class Ta030120Component implements OnInit {

  taFormTS0120: FormGroup;
  formTsNumber: any;

  submit: boolean = false;
  loading: boolean = false;

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

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301;

  constructor(
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private store: Store<AppState>,
    private ajax: AjaxService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // ============= Initial setting =================
    this.setTaFormTS0120();
  }


  ngOnInit() {

    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    console.log("ngOnInit formGroup : ", this.taFormTS0120.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS0120.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0120)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS0120.get('formTsNumber').value)) {
        this.getFormTs(this.taFormTS0120.get('formTsNumber').value);
      } else {
        this.clear('');
        setTimeout(() => {
          this.taFormTS0120.patchValue({
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

    $("#bookDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('bookDate').patchValue(text);
      }
    });
    //สำหรับรอบระยะเวลาการตรวจสอบ
    let dateFrom = new Date();
    let dateTo = new Date();
    if (this.taFormTS0120.get('auditDateEnd').value && this.taFormTS0120.get('auditDateStart').value) {
      const dF = this.taFormTS0120.get('auditDateStart').value.split('/');
      const dT = this.taFormTS0120.get('auditDateEnd').value.split('/');
      dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#auditDateStart").calendar({
      type: "date",
      endCalendar: $('#auditDateEnd'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.taFormTS0120.get('auditDateStart').patchValue(text);
      }
    });
    $("#auditDateEnd").calendar({
      type: "date",
      startCalendar: $('#auditDateStart'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.taFormTS0120.get('auditDateEnd').patchValue(text);
      }
    });

    let dateFrom2 = new Date();
    let dateTo2 = new Date();
    if (this.taFormTS0120.get('expandDateNew').value && this.taFormTS0120.get('expandDateOld').value) {
      const dF = this.taFormTS0120.get('expandDateOld').value.split('/');
      const dT = this.taFormTS0120.get('expandDateNew').value.split('/');
      dateFrom2 = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo2 = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#expandDateOld").calendar({
      type: "date",
      endCalendar: $('#expandDateNew'),
      text: TextDateTH,
      initialDate: dateFrom2,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('expandDateOld').patchValue(text);
      }
    });
    $("#expandDateNew").calendar({
      type: "date",
      startCalendar: $('#expandDateOld'),
      text: TextDateTH,
      initialDate: dateTo2,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('expandDateNew').patchValue(text);
      }
    });
    $("#signOfficerDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('signOfficerDate').patchValue(text);
      }
    });
    $("#signHeadOfficerDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('signHeadOfficerDate').patchValue(text);
      }
    });
    $("#signApproverDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.taFormTS0120.get('signApproverDate').patchValue(text);
      }
    });
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  setTaFormTS0120() {
    this.taFormTS0120 = this.fb.group({
      formTsNumber: ["", Validators.required],
      factoryName: ["", Validators.required],
      docDear: ["", Validators.required],
      bookNumber1: ["", Validators.required],
      bookDate: ["", Validators.required],
      factoryName2: ["", Validators.required],
      newRegId: ["", Validators.required],
      auditDateStart: ["", Validators.required],
      auditDateEnd: ["", Validators.required],
      facAddrNo: ["", Validators.required],
      facMooNo: ["", Validators.required],
      facSoiName: ["", Validators.required],
      facThnName: ["", Validators.required],
      facTambolName: ["", Validators.required],
      facAmphurName: ["", Validators.required],
      facProvinceName: ["", Validators.required],
      facZipCode: ["", Validators.required],
      expandReason: ["", Validators.required],
      expandFlag: ["", Validators.required],
      expandNo: [{ value: "", disabled: true }],
      expandDateOld: [{ value: "", disabled: true }],
      expandDateNew: ["", Validators.required],
      signOfficerFullName: ["", Validators.required],
      signOfficerDate: ["", Validators.required],
      headOfficerComment: ["", Validators.required],
      signHeadOfficerFullName: ["", Validators.required],
      signHeadOfficerDate: ["", Validators.required],
      approverComment: ["", Validators.required],
      approveFlag: ["", Validators.required],
      signApproverFullName: ["", Validators.required],
      signApproverDate: ["", Validators.required],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
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
          this.taFormTS0120.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.taFormTS0120.get('facAmphurName').reset();
              this.taFormTS0120.get('facTambolName').reset();

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
              this.taFormTS0120.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  // ============== Action ==================== 
  disableEnableInput(num: string) {
    if (num === '2') {
      this.taFormTS0120.get("expandNo").enable();
      this.taFormTS0120.get("expandDateOld").enable();
    } else {
      this.taFormTS0120.get("expandNo").disable();
      this.taFormTS0120.get("expandDateOld").disable();
      this.taFormTS0120.patchValue({
        expandNo: '',
        expandDateOld: '',
      });
    }
  }

  save(e) {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.taFormTS0120.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก");
  }
  clear(e) {
    this.taFormTS0120.reset();
  }
  export(e) {
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.taFormTS0120.get('formTsNumber').value);

        this.loading = false;
        this.submit = true;

        //export
        var form = document.createElement("form");
        form.method = "POST";
        // form.target = "_blank";
        form.action = URL.EXPORT;

        form.style.display = "none";
        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taFormTS0120.value);
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
    });
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
            this.taFormTS0120.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))
          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taFormTS0120.get('formTsNumber').value,
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

  searchNewRegId() {
    console.log("searchNewRegId", this.taFormTS0120.get('newRegId').value)
    let newRegId = this.taFormTS0120.get('newRegId').value;
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
          this.taFormTS0120.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.taFormTS0120.get('newRegId').value);
        } else {
          console.log('error getNewRegId taFormTS0120');
        }
      });
    });
  }
  
  // ================ call back-end =================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taFormTS0120.patchValue({
          factoryName: res.data.facFullname,
          factoryName2: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
        })
        console.log("formTS0120 : ", this.taFormTS0120.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0120/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taFormTS0120.patchValue({
          formTsNumber: json.formTsNumber,
          factoryName: json.factoryName,
          docDear: json.docDear,
          bookNumber1: json.bookNumber1,
          bookDate: json.bookDate,
          factoryName2: json.factoryName2,
          newRegId: json.newRegId,
          auditDateStart: json.auditDateStart,
          auditDateEnd: json.auditDateEnd,
          facAddrNo: json.facAddrNo,
          facMooNo: json.facMooNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          expandReason: json.expandReason,
          expandFlag: json.expandFlag,
          expandNo: json.expandNo,
          expandDateOld: json.expandDateOld,
          expandDateNew: json.expandDateNew,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerDate: json.signOfficerDate,
          headOfficerComment: json.headOfficerComment,
          signHeadOfficerFullName: json.signHeadOfficerFullName,
          signHeadOfficerDate: json.signHeadOfficerDate,
          approverComment: json.approverComment,
          approveFlag: json.approveFlag,
          signApproverFullName: json.signApproverFullName,
          signApproverDate: json.signApproverDate,
        });
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

  saveTs(): Observable<any> {
    return new Observable(obs => {
      this.taFormTS0120.patchValue({
        auditPlanCode: this.auditPlanCode,
        auditStepStatus: this.auditStepStatus
      })
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS0120.value).toString() }).subscribe((res: ResponseData<any>) => {
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

}

class AppState {
  Ta0301: {
    ta0301: Ta0301,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[]
  }
}
