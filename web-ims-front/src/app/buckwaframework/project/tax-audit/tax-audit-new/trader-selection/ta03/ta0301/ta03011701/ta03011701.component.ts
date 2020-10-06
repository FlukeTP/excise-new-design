import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';
import * as moment from 'moment';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts01171",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta03011701',
  templateUrl: './ta03011701.component.html',
  styleUrls: ['./ta03011701.component.css']
})
export class Ta03011701Component implements OnInit {

  taFormTS01171: FormGroup;
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
    this.setTaFormTS01171();
    this.resetRadio();
    this.getDataListForSearchModal();
  }

  // ============= Initial setting ===============
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.taFormTS01171.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })
    console.log("ngOnInit taFormTS01171 : ", this.taFormTS01171.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.taFormTS01171.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts01171)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.taFormTS01171.get('formTsNumber').value)) {
        this.getFormTs(this.taFormTS01171.get('formTsNumber').value);
        this.formNumber = this.taFormTS01171.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.taFormTS01171.patchValue({
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
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarRefDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarExtraDate', 'extraDate', 'date', 'วดป');
    this.callCalendarDefault('calendarOfficeDate', 'officeDate', 'date', 'วดป');
    this.callCalendarDefault('calendarOfficeTime', 'officeTime', 'time', 'เวลา');

    let dateFrom = new Date();
    let dateTo = new Date();
    if (this.taFormTS01171.get('auditDateEnd').value && this.taFormTS01171.get('auditDateStart').value) {
      const dF = this.taFormTS01171.get('auditDateStart').value.split('/');
      const dT = this.taFormTS01171.get('auditDateEnd').value.split('/');
      dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#auditDateStart").calendar({
      type: "date",
      endCalendar: $('#auditDateEnd'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter('วดป'),
      onChange: (date, text, mode) => {
        this.taFormTS01171.get('auditDateStart').patchValue(text);
      }
    });
    $("#auditDateEnd").calendar({
      type: "date",
      startCalendar: $('#auditDateStart'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter('วดป'),
      onChange: (date, text, mode) => {
        this.taFormTS01171.get('auditDateEnd').patchValue(text);
      }
    });
  }

  ngOnDestroy(): void {
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
        this.taFormTS01171.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  setTaFormTS01171() {
    this.taFormTS01171 = this.fb.group({
      formTsNumber: ["", Validators.required],
      bookNumber1: ["", Validators.required],
      bookNumber2: ["", Validators.required],
      docTopic: ["", Validators.required],
      docDate: ["", Validators.required],
      docDear: ["", Validators.required],
      factoryName: ["", Validators.required],
      newRegId: ["", Validators.required],
      factoryType: ["", Validators.required],
      facAddrNo: ["", Validators.required],
      facMooNo: ["", Validators.required],
      facSoiName: ["", Validators.required],
      facThnName: ["", Validators.required],
      facTambolName: ["", Validators.required],
      facAmphurName: ["", Validators.required],
      facProvinceName: ["", Validators.required],
      facZipCode: ["", Validators.required],
      bookType: ["", Validators.required],
      refBookNumber1: ["", Validators.required],
      refBookNumber2: ["", Validators.required],
      refDocDate: ["", Validators.required],
      auditDateStart: ["", Validators.required],
      auditDateEnd: ["", Validators.required],
      factDesc: ["", Validators.required],
      lawDesc: ["", Validators.required],
      factoryName2: ["", Validators.required],
      taxAmt: ["", Validators.required],
      fineAmt: ["", Validators.required],
      extraAmt: ["", Validators.required],
      exciseTaxAmt: ["", Validators.required],
      moiAmt: ["", Validators.required],
      sumAllTaxAmt: ["", Validators.required],
      extraDate: ["", Validators.required],
      officeDest: ["", Validators.required],
      officeDate: ["", Validators.required],
      officeTime: ["", Validators.required],
      signOfficerFullName: ["", Validators.required],
      signOfficerPosition: ["", Validators.required],
      officeName: ["", Validators.required],
      offficePhone: ["", Validators.required],
      headOfficerFullName: ["", Validators.required],
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
          this.taFormTS01171.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.taFormTS01171.get('facAmphurName').reset();
              this.taFormTS01171.get('facTambolName').reset();

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
              this.taFormTS01171.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  // ===================== Action ====================
  taxAmtChange() {
    var taxAmt = Number(this.setNumber(this.taFormTS01171.get('taxAmt').value).toString().replace(/,/g, ""));
    var fineAmt = Number(this.setNumber(this.taFormTS01171.get('fineAmt').value).toString().replace(/,/g, ""));
    var extraAmt = Number(this.setNumber(this.taFormTS01171.get('extraAmt').value).toString().replace(/,/g, ""));
    let exciseTaxAmt = taxAmt + fineAmt + extraAmt;
    var moiAmt = exciseTaxAmt * 0.1;
    let sumAllTaxAmt = exciseTaxAmt + moiAmt;
    this.taFormTS01171.get('exciseTaxAmt').patchValue(Utils.moneyFormatDecimal(exciseTaxAmt));
    this.taFormTS01171.get('moiAmt').patchValue(Utils.moneyFormatDecimal(moiAmt));
    this.taFormTS01171.get('sumAllTaxAmt').patchValue(Utils.moneyFormatDecimal(sumAllTaxAmt));
  }

  onFocusMoney(name: string) {
    let count = this.setNumber(this.taFormTS01171.get(name).value).toString().replace(/,/g, "");
    this.taFormTS01171.get(name).patchValue(Number(count));

  }

  onBlurMoney(name: string) {
    let count = Number(this.setNumber(this.taFormTS01171.get(name).value));
    this.taFormTS01171.get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.taxAmtChange();
  }

  setNumber(obj): number {
    if (obj === null || obj === undefined || obj === "") {
      return 0;
    } else {
      return obj;
    }
  }

  save(e) {
    if (Utils.isNull(this.taFormTS01171.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.taFormTS01171.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก");
  }

  export = e => {
    if (Utils.isNull(this.taFormTS01171.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.taFormTS01171.get('formTsNumber').value);

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
        jsonInput.value = JSON.stringify(this.taFormTS01171.value);
        form.appendChild(jsonInput);

        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  clear(e) {
    this.taFormTS01171.reset();
    this.resetRadio();
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.taFormTS01171.get('newRegId').value)
    let newRegId = this.taFormTS01171.get('newRegId').value;
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
          this.taFormTS01171.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.taFormTS01171.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0107');
        }
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
            this.taFormTS01171.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.taFormTS01171.get('formTsNumber').value,
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

  resetRadio() {
    setTimeout(() => {
      $('input[name="factoryType"]').prop('checked', false);
      $('input[name="bookType"]').prop('checked', false);
    }, 100);
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  // ================ call back-end =================
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts01171/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        let json = JSON.parse(res.data)
        this.taFormTS01171.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          docTopic: json.docTopic,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docDear: json.docDear,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          factoryType: json.factoryType,
          facAddrNo: json.facAddrNo,
          facMooNo: json.facMooNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          bookType: json.bookType,
          refBookNumber1: json.refBookNumber1,
          refBookNumber2: json.refBookNumber2,
          refDocDate: Utils.isNotNull(json.refDocDate) ? converDate(json.refDocDate, patternDate.DD_MM_YYYY) : '',
          auditDateStart: Utils.isNotNull(json.auditDateStart) ? converDate(json.auditDateStart, patternDate.DD_MM_YYYY) : '',
          auditDateEnd: Utils.isNotNull(json.auditDateEnd) ? converDate(json.auditDateEnd, patternDate.DD_MM_YYYY) : '',
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
          officeDest: json.officeDest,
          officeDate: Utils.isNotNull(json.officeDate) ? converDate(json.officeDate, patternDate.DD_MM_YYYY) : '',
          officeTime: json.officeTime,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName: json.officeName,
          offficePhone: json.offficePhone,
          headOfficerFullName: json.headOfficerFullName,
          auditPlanCode: json.auditPlanCode
        })
        $('#factoryType').prop('checked', false);
        $(`#factoryType${json.factoryType}`).prop('checked', true);
        $('#bookType').prop('checked', false);
        $(`#bookType${json.bookType}`).prop('checked', true);
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

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.taFormTS01171.patchValue({
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
        console.log("formTS01171 : ", this.taFormTS01171.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  saveTs(): Observable<any> {
    return new Observable(obs => {

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.taFormTS01171.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.taFormTS01171.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.taFormTS01171.get('docDate').value)) {
        let docDate = converDate(this.taFormTS01171.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.taFormTS01171.get('refDocDate').value)) {
        let refDocDate = converDate(this.taFormTS01171.get('refDocDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('refDocDate').patchValue(refDocDate);
      }
      if (Utils.isNotNull(this.taFormTS01171.get('auditDateStart').value)) {
        let auditDateStart = converDate(this.taFormTS01171.get('auditDateStart').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('auditDateStart').patchValue(auditDateStart);
      }
      if (Utils.isNotNull(this.taFormTS01171.get('auditDateEnd').value)) {
        let auditDateEnd = converDate(this.taFormTS01171.get('auditDateEnd').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('auditDateEnd').patchValue(auditDateEnd);
      }
      if (Utils.isNotNull(this.taFormTS01171.get('extraDate').value)) {
        let extraDate = converDate(this.taFormTS01171.get('extraDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('extraDate').patchValue(extraDate);
      }
      if (Utils.isNotNull(this.taFormTS01171.get('officeDate').value)) {
        let officeDate = converDate(this.taFormTS01171.get('officeDate').value, patternDate.DD_MMMM_YYYY);
        this.taFormTS01171.get('officeDate').patchValue(officeDate);
      }
      // delete ',' on number
      let exciseTaxAmt = Utils.isNotNull(this.taFormTS01171.get('exciseTaxAmt').value) ? Number(this.taFormTS01171.get('exciseTaxAmt').value.replace(/,/g, "")) : '0';
      let sumAllTaxAmt = Utils.isNotNull(this.taFormTS01171.get('sumAllTaxAmt').value) ? Number(this.taFormTS01171.get('sumAllTaxAmt').value.replace(/,/g, "")) : '0';
      this.taFormTS01171.get('exciseTaxAmt').patchValue(exciseTaxAmt);
      this.taFormTS01171.get('sumAllTaxAmt').patchValue(sumAllTaxAmt);
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.taFormTS01171.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);

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
        this.taFormTS01171.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.taFormTS01171.get('signOfficerPosition').patchValue(data.linePosition);
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