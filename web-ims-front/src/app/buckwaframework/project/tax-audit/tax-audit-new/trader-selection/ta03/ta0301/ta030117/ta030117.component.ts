import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { ListFormTsNumber, Ta0301, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { Utils } from 'helpers/utils';
import { PathTs } from '../path.model';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute } from '@angular/router';
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0117",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}
declare var $: any;
@Component({
  selector: 'app-ta030117',
  templateUrl: './ta030117.component.html',
  styleUrls: ['./ta030117.component.css']
})
export class Ta030117Component implements OnInit {
  submit: boolean = false;
  loading: boolean = false;
  pathTs: any;
  listFormTsNumber: ListFormTsNumber;
  dataStore: any;
  taformTS0117: FormGroup;

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
    this.setTaFormTS0117();
    this.getDataListForSearchModal();
  }

  // ============= Initial setting ==================
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";

    this.taformTS0117.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taformTS0117.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0117)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taformTS0117.get('formTsNumber').value)) {
        this.getFormTs(this.taformTS0117.get('formTsNumber').value);
        this.formNumber = this.taformTS0117.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.taformTS0117.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
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

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarRefDocDate', 'refDocDate', 'date', 'วดป');
    this.callCalendarDefault('calendarAuditDate', 'auditDate', 'date', 'วดป');
    this.callCalendarDefault('calendarCallBookDate', 'callBookDate', 'date', 'วดป');
    this.callCalendarDefault('calendarTaxFormDateStart', 'taxFormDateStart', 'date', 'วดป');
    this.callCalendarDefault('calendarTaxFormDateEnd', 'taxFormDateEnd', 'date', 'วดป');
    this.callCalendarDefault('calendarTestimonyDate', 'testimonyDate', 'date', 'วดป');
    this.callCalendarDefault('calendarExtraDate', 'extraDate', 'date', 'วดป');
    this.callCalendarDefault('calendarPaymentDate', 'paymentDate', 'date', 'วดป');
    this.callCalendarDefault('calendarOfficeDate', 'officeDate', 'date', 'วดป');
    this.callCalendarDefault('calendarOfficeTime', 'officeTime', 'time', 'เวลา');
  }

  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.taformTS0117.get(`${formControlName}`).patchValue(text);
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
          this.taformTS0117.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.taformTS0117.get('facAmphurName').reset();
              this.taformTS0117.get('facTambolName').reset();

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
              this.taformTS0117.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  setTaFormTS0117() {
    this.taformTS0117 = this.fb.group({
      formTsNumber: ["",],
      bookNumber1: [""],
      bookNumber2: [""],
      docTopic: [""],
      docDate: [""],
      docDear: [""],
      refBookNumber1: [""],
      refBookNumber2: [""],
      refDocDate: [""],
      auditDate: [""],
      callBookNumber1: [""],
      callBookNumber2: [""],
      callBookDate: [""],
      factoryName: [""],
      newRegId: [""],
      facAddrNo: [""],
      facMooNo: [""],
      facSoiName: [""],
      facThnName: [""],
      facTambolName: [""],
      facAmphurName: [""],
      facProvinceName: [""],
      facZipCode: [""],
      officerFullName: [""],
      officerPosition: [""],
      taxFormDateStart: [""],
      taxFormDateEnd: [""],
      testimonyDate: [""],
      factDesc: [""],
      lawDesc: [""],
      factoryName2: [""],
      taxAmt: [""],
      fineAmt: [""],
      extraAmt: [""],
      exciseTaxAmt: [""],
      moiAmt: [""],
      sumAllTaxAmt: [""],
      extraDate: [""],
      paymentDest: [""],
      paymentExciseTaxAmt: [""],
      paymentDate: [""],
      officeDest: [""],
      officeDate: [""],
      officeTime: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      officeName: [''],
      officePhone: [''],
      headOfficerFullName: [''],
      auditPlanCode: [''],
      auditStepStatus: ['']
    })
  }

  calculateMoney() {
    if (Utils.isNull(this.taformTS0117.get('taxAmt').value)) {
      this.taformTS0117.get('taxAmt').patchValue('0');
    }
    if (Utils.isNull(this.taformTS0117.get('fineAmt').value)) {
      this.taformTS0117.get('fineAmt').patchValue('0');
    }
    if (Utils.isNull(this.taformTS0117.get('extraAmt').value)) {
      this.taformTS0117.get('extraAmt').patchValue('0');
    }
    let taxAmt = Number(this.taformTS0117.get('taxAmt').value.toString().replace(/,/g, ""));
    let fineAmt = Number(this.taformTS0117.get('fineAmt').value.toString().replace(/,/g, ""));
    let extraAmt = Number(this.taformTS0117.get('extraAmt').value.toString().replace(/,/g, ""));
    let exciseTaxAmt = taxAmt + fineAmt + extraAmt;
    let moiAmt = exciseTaxAmt * 0.1;
    let sumAllTaxAmt = exciseTaxAmt + moiAmt;
    this.taformTS0117.get('exciseTaxAmt').patchValue(Utils.moneyFormatDecimal(exciseTaxAmt));
    this.taformTS0117.get('moiAmt').patchValue(Utils.moneyFormatDecimal(moiAmt));
    this.taformTS0117.get('sumAllTaxAmt').patchValue(Utils.moneyFormatDecimal(sumAllTaxAmt));
  }

  onFocusMoney(name: string) {
    if (Utils.isNull(this.taformTS0117.get(name).value)) {
      this.taformTS0117.get(name).patchValue('0');
    }
    let count = this.taformTS0117.get(name).value.toString().replace(/,/g, "");
    this.taformTS0117.get(name).patchValue(Number(count));

  }

  onBlurMoney(name: string) {
    if (Utils.isNull(this.taformTS0117.get(name).value)) {
      this.taformTS0117.get(name).patchValue('0');
    }
    let count = Number(this.taformTS0117.get(name).value);
    this.taformTS0117.get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney();
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.taformTS0117.get('newRegId').value)
    let newRegId = this.taformTS0117.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  getOperatorDetails(newRegId: string) {
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taformTS0117.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode
        })
        console.log("formTS0117: ", this.taformTS0117.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
    });
  }

  save(e) {
    if (Utils.isNull(this.taformTS0117.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.taformTS0117.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  saveTs(): Observable<any> {
    return new Observable(obs => {
      if (Utils.isNotNull(this.auditPlanCode)) {
        this.taformTS0117.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.taformTS0117.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.taformTS0117.get('docDate').value)) {
        let docDate = converDate(this.taformTS0117.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('refDocDate').value)) {
        let refDocDate = converDate(this.taformTS0117.get('refDocDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('refDocDate').patchValue(refDocDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('auditDate').value)) {
        let auditDate = converDate(this.taformTS0117.get('auditDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('auditDate').patchValue(auditDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('callBookDate').value)) {
        let callBookDate = converDate(this.taformTS0117.get('callBookDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('callBookDate').patchValue(callBookDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('taxFormDateStart').value)) {
        let taxFormDateStart = converDate(this.taformTS0117.get('taxFormDateStart').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('taxFormDateStart').patchValue(taxFormDateStart);
      }
      if (Utils.isNotNull(this.taformTS0117.get('taxFormDateEnd').value)) {
        let taxFormDateEnd = converDate(this.taformTS0117.get('taxFormDateEnd').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('taxFormDateEnd').patchValue(taxFormDateEnd);
      }
      if (Utils.isNotNull(this.taformTS0117.get('testimonyDate').value)) {
        let testimonyDate = converDate(this.taformTS0117.get('testimonyDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('testimonyDate').patchValue(testimonyDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('extraDate').value)) {
        let extraDate = converDate(this.taformTS0117.get('extraDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('extraDate').patchValue(extraDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('paymentDate').value)) {
        let paymentDate = converDate(this.taformTS0117.get('paymentDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('paymentDate').patchValue(paymentDate);
      }
      if (Utils.isNotNull(this.taformTS0117.get('officeDate').value)) {
        let officeDate = converDate(this.taformTS0117.get('officeDate').value, patternDate.DD_MMMM_YYYY);
        this.taformTS0117.get('officeDate').patchValue(officeDate);
      }
      // delete ',' on number
      let taxAmt = Utils.isNotNull(this.taformTS0117.get('taxAmt').value) ? Number(this.taformTS0117.get('taxAmt').value.toString().replace(/,/g, "")) : '0';
      let fineAmt = Utils.isNotNull(this.taformTS0117.get('fineAmt').value) ? Number(this.taformTS0117.get('fineAmt').value.toString().replace(/,/g, "")) : '0';
      let extraAmt = Utils.isNotNull(this.taformTS0117.get('extraAmt').value) ? Number(this.taformTS0117.get('extraAmt').value.toString().replace(/,/g, "")) : '0';
      let exciseTaxAmt = Utils.isNotNull(this.taformTS0117.get('exciseTaxAmt').value) ? Number(this.taformTS0117.get('exciseTaxAmt').value.toString().replace(/,/g, "")) : '0';
      let moiAmt = Utils.isNotNull(this.taformTS0117.get('moiAmt').value) ? Number(this.taformTS0117.get('moiAmt').value.toString().replace(/,/g, "")) : '0';
      let sumAllTaxAmt = Utils.isNotNull(this.taformTS0117.get('sumAllTaxAmt').value) ? Number(this.taformTS0117.get('sumAllTaxAmt').value.toString().replace(/,/g, "")) : '0';
      this.taformTS0117.get('taxAmt').patchValue(taxAmt);
      this.taformTS0117.get('fineAmt').patchValue(fineAmt);
      this.taformTS0117.get('extraAmt').patchValue(extraAmt);
      this.taformTS0117.get('exciseTaxAmt').patchValue(exciseTaxAmt);
      this.taformTS0117.get('moiAmt').patchValue(moiAmt);
      this.taformTS0117.get('sumAllTaxAmt').patchValue(sumAllTaxAmt);
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taformTS0117.value).toString() }).subscribe((res: ResponseData<any>) => {
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
    this.taformTS0117.reset();
  }
  export(e) {
    if (Utils.isNull(this.taformTS0117.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.taformTS0117.get('formTsNumber').value)

        console.log("export : ", this.taformTS0117.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.taformTS0117.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })

  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0117/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.taformTS0117.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docTopic: json.docTopic,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docDear: json.docDear,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: Utils.isNotNull(json.refDocDate) ? converDate(json.refDocDate, patternDate.DD_MM_YYYY) : '',
          auditDate: Utils.isNotNull(json.auditDate) ? converDate(json.auditDate, patternDate.DD_MM_YYYY) : '',
          callBookNumber1: json.callBookNumber1,
          callBookNumber2: json.callBookNumber2,
          callBookDate: Utils.isNotNull(json.callBookDate) ? converDate(json.callBookDate, patternDate.DD_MM_YYYY) : '',
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
          officerFullName: json.officerFullName,
          officerPosition: json.officerPosition,
          taxFormDateStart: Utils.isNotNull(json.taxFormDateStart) ? converDate(json.taxFormDateStart, patternDate.DD_MM_YYYY) : '',
          taxFormDateEnd: Utils.isNotNull(json.taxFormDateEnd) ? converDate(json.taxFormDateEnd, patternDate.DD_MM_YYYY) : '',
          testimonyDate: Utils.isNotNull(json.testimonyDate) ? converDate(json.testimonyDate, patternDate.DD_MM_YYYY) : '',
          factDesc: json.factDesc,
          lawDesc: json.lawDesc,
          factoryName2: json.factoryName2,
          taxAmt: json.taxAmt,
          fineAmt: json.fineAmt,
          extraAmt: json.extraAmt,
          exciseTaxAmt: json.exciseTaxAmt,
          moiAmt: json.moiAmt,
          sumAllTaxAmt: json.sumAllTaxAmt,
          extraDate: Utils.isNotNull(json.extraDate) ? converDate(json.extraDate, patternDate.DD_MM_YYYY) : '',
          paymentDest: json.paymentDest,
          paymentExciseTaxAmt: json.paymentExciseTaxAmt,
          paymentDate: Utils.isNotNull(json.paymentDate) ? converDate(json.paymentDate, patternDate.DD_MM_YYYY) : '',
          officeDest: json.officeDest,
          officeDate: Utils.isNotNull(json.officeDate) ? converDate(json.officeDate, patternDate.DD_MM_YYYY) : '',
          officeTime: json.officeTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName2: json.officeName2,
          officePhone: json.officePhone,
          headOfficerFullName: json.headOfficerFullName,
          auditPlanCode: json.auditPlanCode
        })
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
            this.taformTS0117.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taformTS0117.get('formTsNumber').value,
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
          this.taformTS0117.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.taformTS0117.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0117');
        }
      });
    });
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
        this.taformTS0117.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.taformTS0117.get('signOfficerPosition').patchValue(data.linePosition);
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
    ta0301: Ta0301,
    proviceList: ProvinceList[],
    amphurList: AmphurList[],
    districtList: DistrictList[]
  }
}

