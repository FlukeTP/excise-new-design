import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { UserModel } from 'models/user.model';
import { AuthService } from 'services/auth.service';
import { ActivatedRoute } from '@angular/router';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0114",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030114',
  templateUrl: './ta030114.component.html',
  styleUrls: ['./ta030114.component.css']
})
export class Ta030114Component implements OnInit, AfterViewInit {
  userProfile: UserModel;
  formGroup: FormGroup;
  items: FormArray;

  submit: boolean = false;
  loading: boolean = false;
  auditDateStart: string = '';
  auditDateEnd: string = '';
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
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private formBulider: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private authService: AuthService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {

    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.createFormGroup();
    this.setUserProfileForm();
    this.getDataListForSearchModal();
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }
  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.formGroup.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formGroup.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0114)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formGroup.get('formTsNumber').value)) {
        this.getFormTs(this.formGroup.get('formTsNumber').value);
        this.formNumber = this.formGroup.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formGroup.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
          this.onSetNewRegId();
          this.setUserProfileForm();
        }, 200);
      }
    });
  }
  createFormGroup() {
    this.formGroup = this.formBulider.group({
      formTsNumber: [''],
      factoryName: [''],
      newRegId: [''],
      facAddrNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      facZipCode: [''],
      facTelNo: [''],
      facFaxNumber: [''],
      factoryTypeText: [''],
      officerFullName: [''],
      officerDept: [''],
      auditDate: [''],
      bookNumber1: [''],
      bookDate: [''],
      auditDateStart: [''],
      auditDateEnd: [''],
      auditSumMonth: [''],
      auditSumDay: [''],
      auditBookType: [''],
      auditBookTypeOther: [{ value: "", disabled: true }],
      auditBookNumber: [''],
      auditBookDate: [''],
      docNum: [''],
      doc1Num: [''],
      doc1Date: [''],
      doc2Num: [''],
      doc2Date: [''],
      doc3Num: [''],
      doc3Date: [''],
      doc4Num: [''],
      doc5Num: [''],
      doc6Num: [''],
      doc7Num: [''],
      doc8Num: [''],
      doc9Num: [''],
      assReason: [''],
      taFormTS0114DtlVoList: this.formBulider.array([this.createItem()]),
      signOfficerFullName: [''],
      signOfficerPosition: [''],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }
  createItem(): FormGroup {
    return this.formBulider.group({
      formTs0114DtlId: [''],
      recNo: [''],
      taxDate: [''],
      dutyTypeText: [''],
      taxAmt: [''],
      fineAmt: [''],
      extraAmt: [''],
      moiAmt: [''],
      sumAmt: [''],
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendar('0');

    this.callCalendarDefault('calendarAuditDate', 'auditDate', 'date');
    this.callCalendarDefault('calendarBookDate', 'bookDate', 'date');
    this.callCalendarDefault('calendarDoc1Date', 'doc1Date', 'date');
    this.callCalendarDefault('calendarDoc2Date', 'doc2Date', 'date');
    this.callCalendarDefault('calendarDoc3Date', 'doc3Date', 'date');
    this.callCalendarDefault('calendarAuditBookDate', 'auditBookDate', 'date');

    $("#calendarAuditDateStart").calendar({
      maxDate: new Date(),
      //endCalendar: $('#calendarAuditDateEnd'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formGroup.get('auditDateStart').patchValue(text);
        this.auditDateStart = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear()
        this.calulateMonths();
      }
    });
    $("#calendarAuditDateEnd").calendar({
      maxDate: new Date(),
      //startCalendar: $('#calendarAuditDateStart'),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formGroup.get('auditDateEnd').patchValue(text);
        this.auditDateEnd = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear()
        this.calulateMonths();
      }
    });
  }

  //call calendar from array
  callCalendar(idx): void {
    $("#calendarTaxDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
        this.items.at(idx).get('taxDate').patchValue(text);
        console.log("Date calendarTaxDate onChange", idx);
      }
    });
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formGroup.get(`${formControlName}`).patchValue(text);
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
          this.formGroup.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formGroup.get('facAmphurName').reset();
              this.formGroup.get('facTambolName').reset();

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
              this.formGroup.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  addItem(): void {
    this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
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
  clearItem() {
    console.log('this.formGroup.value', this.formGroup.value)
    this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createItem());

    setTimeout(() => {
      console.log('this.formGroup.get(taFormTS0114DtlVoList).value', this.formGroup.get('taFormTS0114DtlVoList').value)
      for (let i = 0; i < this.formGroup.get('taFormTS0114DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callCalendar(i)
      }
    }, 50);
  }
  save(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formGroup.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formGroup.reset();
    this.clearItem();
  }
  export(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formGroup.get('formTsNumber').value)

        console.log("export : ", this.formGroup.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formGroup.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formGroup.get('newRegId').value)
    let newRegId = this.formGroup.get('newRegId').value;
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
          this.formGroup.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formGroup.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0114');
        }
      });
    });
  }


  // validateField(formControlName: string): Boolean {
  //   return this.submit && !this.formGroup.get(formControlName).valid;
  // }

  calulateMonths() {
    console.log("calulateMonths")
    let auditDateStart = this.auditDateStart;
    let auditDateEnd = this.auditDateEnd;
    console.log("auditDateStart : ", auditDateStart)
    console.log("auditDateEnd : ", auditDateEnd)

    var startdateMoment = moment(auditDateStart, "DD/MM/YYYY");
    var enddateMoment = moment(auditDateEnd, "DD/MM/YYYY");
    //getting the difference in years
    var years = enddateMoment.diff(startdateMoment, 'years');

    //moment returns the total months between the two dates, subtracting the years
    var months = enddateMoment.diff(startdateMoment, 'months') - (years * 12);

    //to calculate the days, first get the previous month and then subtract it
    startdateMoment.add(years, 'years').add(months, 'months');
    var days = enddateMoment.diff(startdateMoment, 'days');

    console.log("num_years => ", years);
    console.log("num_months => ", months);
    console.log("num_days => ", days);
    this.formGroup.get('auditSumMonth').patchValue(months);
    this.formGroup.get('auditSumDay').patchValue(days);
    console.log("formGroup : ", this.formGroup.value)
    //}
  }

  calculateMoney(index: number) {
    this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
    let taxAmt = Number(this.items.at(index).get('taxAmt').value.toString().replace(/,/g, ""));
    let fineAmt = Number(this.items.at(index).get('fineAmt').value.toString().replace(/,/g, ""));
    let extraAmt = Number(this.items.at(index).get('extraAmt').value.toString().replace(/,/g, ""));
    let moiAmt = (taxAmt + fineAmt + extraAmt) * 0.1;
    this.items.at(index).get('moiAmt').patchValue(Utils.moneyFormatDecimal(moiAmt));
    this.items.at(index).get('sumAmt').patchValue(Utils.moneyFormatDecimal(taxAmt + fineAmt + extraAmt + moiAmt));
  }

  onFocusMoney(index: number, name: string) {
    this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
    let count = this.items.at(index).get(name).value.toString().replace(/,/g, "");
    this.items.at(index).get(name).patchValue(Number(count));

  }

  onBlurMoney(index: number, name: string) {
    this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
    let count = Number(this.items.at(index).get(name).value);
    this.items.at(index).get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney(index);
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  //========================= backend==============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formGroup.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
          facTelNo: res.data.facTelno,
          factoryTypeText: res.data.factoryTypeText
        })
        console.log("formGroup : ", this.formGroup.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }
  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0114/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          facTelNo: json.facTelNo,
          facFaxNumber: json.facFaxNumber,
          factoryTypeText: json.factoryTypeText,
          officerFullName: json.officerFullName,
          officerDept: json.officerDept,
          auditDate: Utils.isNotNull(json.auditDate) ? converDate(json.auditDate, patternDate.DD_MM_YYYY) : '',
          bookNumber1: json.bookNumber1,
          bookDate: Utils.isNotNull(json.bookDate) ? converDate(json.bookDate, patternDate.DD_MM_YYYY) : '',
          auditDateStart: Utils.isNotNull(json.auditDateStart) ? converDate(json.auditDateStart, patternDate.DD_MM_YYYY) : '',
          auditDateEnd: Utils.isNotNull(json.auditDateEnd) ? converDate(json.auditDateEnd, patternDate.DD_MM_YYYY) : '',
          auditSumMonth: json.auditSumMonth,
          auditSumDay: json.auditSumDay,
          auditBookType: json.auditBookType,
          auditBookTypeOther: json.auditBookTypeOther,
          auditBookNumber: json.auditBookNumber,
          auditBookDate: Utils.isNotNull(json.auditBookDate) ? converDate(json.auditBookDate, patternDate.DD_MM_YYYY) : '',
          docNum: json.docNum,
          doc1Num: json.doc1Num,
          doc1Date: Utils.isNotNull(json.doc1Date) ? converDate(json.doc1Date, patternDate.DD_MM_YYYY) : '',
          doc2Num: json.doc2Num,
          doc2Date: Utils.isNotNull(json.doc2Date) ? converDate(json.doc2Date, patternDate.DD_MM_YYYY) : '',
          doc3Num: json.doc3Num,
          doc3Date: Utils.isNotNull(json.doc3Date) ? converDate(json.doc3Date, patternDate.DD_MM_YYYY) : '',
          doc4Num: json.doc4Num,
          doc5Num: json.doc5Num,
          doc6Num: json.doc6Num,
          doc7Num: json.doc7Num,
          doc8Num: json.doc8Num,
          doc9Num: json.doc9Num,
          assReason: json.assReason,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          auditPlanCode: json.auditPlanCode
        })

        this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
        //  this.formGroup.get('taFormTS0114DtlVoList').patchValue([]);
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0114DtlVoList.length; i++) {
          this.items.push(this.createItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0114DtlVoList.length; i++) {
            console.log("callCalendar ==> i : ", i)
            this.callCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0114DtlVoList.forEach(element => {
            this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0114DtlId: `${element.formTs0114DtlId}`,
              taxDate: `${Utils.isNotNull(element.taxDate) ? converDate(element.taxDate, patternDate.DD_MM_YYYY) : ''}`,
              dutyTypeText: `${element.dutyTypeText}`,
              taxAmt: `${element.taxAmt}`,
              fineAmt: `${element.fineAmt}`,
              extraAmt: `${element.extraAmt}`,
              moiAmt: `${element.moiAmt}`,
              sumAmt: `${element.sumAmt}`,
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
            this.formGroup.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formGroup.get('formTsNumber').value,
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

  saveTs(): Observable<any> {
    return new Observable(obs => {

      if (Utils.isNotNull(this.auditPlanCode)) {
        this.formGroup.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formGroup.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formGroup.get('auditDate').value)) {
        let auditDate = converDate(this.formGroup.get('auditDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDate').patchValue(auditDate);
      }
      if (Utils.isNotNull(this.formGroup.get('bookDate').value)) {
        let bookDate = converDate(this.formGroup.get('bookDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('bookDate').patchValue(bookDate);
      }
      if (Utils.isNotNull(this.formGroup.get('auditDateStart').value)) {
        let auditDateStart = converDate(this.formGroup.get('auditDateStart').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDateStart').patchValue(auditDateStart);
      }
      if (Utils.isNotNull(this.formGroup.get('auditDateEnd').value)) {
        let auditDateEnd = converDate(this.formGroup.get('auditDateEnd').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDateEnd').patchValue(auditDateEnd);
      }
      if (Utils.isNotNull(this.formGroup.get('auditBookDate').value)) {
        let auditBookDate = converDate(this.formGroup.get('auditBookDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditBookDate').patchValue(auditBookDate);
      }
      if (Utils.isNotNull(this.formGroup.get('doc1Date').value)) {
        let doc1Date = converDate(this.formGroup.get('doc1Date').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('doc1Date').patchValue(doc1Date);
      }
      if (Utils.isNotNull(this.formGroup.get('doc2Date').value)) {
        let doc2Date = converDate(this.formGroup.get('doc2Date').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('doc2Date').patchValue(doc2Date);
      }
      if (Utils.isNotNull(this.formGroup.get('doc3Date').value)) {
        let doc3Date = converDate(this.formGroup.get('doc3Date').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('doc3Date').patchValue(doc3Date);
      }
      this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        if (Utils.isNotNull(element.get('taxDate').value)) {
          let taxDate = converDate(element.get('taxDate').value, patternDate.DD_MMMM_YYYY);
          element.get('taxDate').patchValue(taxDate);
        }
      }
      // delete ',' on number
      this.items = this.formGroup.get('taFormTS0114DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        let taxAmt = Number(element.get('taxAmt').value.replace(/,/g, ""));
        let fineAmt = Number(element.get('fineAmt').value.replace(/,/g, ""));
        let extraAmt = Number(element.get('extraAmt').value.replace(/,/g, ""));
        let moiAmt = Number(element.get('moiAmt').value.replace(/,/g, ""));
        let sumAmt = Number(element.get('sumAmt').value.replace(/,/g, ""));
        this.items.at(index).get('taxAmt').patchValue(taxAmt);
        this.items.at(index).get('fineAmt').patchValue(fineAmt);
        this.items.at(index).get('extraAmt').patchValue(extraAmt);
        this.items.at(index).get('moiAmt').patchValue(moiAmt);
        this.items.at(index).get('sumAmt').patchValue(sumAmt);
      }
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup.value).toString() }).subscribe((res: ResponseData<any>) => {
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
  // ================ Action ==========================
  disableEnableInput(num: string) {
    if (num === '3') {
      this.formGroup.get("auditBookTypeOther").enable();
    } else {
      this.formGroup.get("auditBookTypeOther").disable();
      this.formGroup.patchValue({
        auditBookTypeOther: '',
      });
    }
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.title
    })
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
        this.formGroup.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('signOfficerPosition').patchValue(data.linePosition);
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
