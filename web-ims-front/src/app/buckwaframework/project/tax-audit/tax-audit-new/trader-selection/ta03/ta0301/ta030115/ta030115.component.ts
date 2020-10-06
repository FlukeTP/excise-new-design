import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserModel } from 'models/user.model';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { ListFormTsNumber, Ta0301, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { Store } from '@ngrx/store';
import { Ta0301Service } from '../ts0301.service';
import { PathTs } from '../path.model';
import * as TA0301ACTION from "../ta0301.action";
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0115",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030115',
  templateUrl: './ta030115.component.html',
  styleUrls: ['./ta030115.component.css']
})
export class Ta030115Component implements OnInit {
  formTS0115: FormGroup
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
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private store: Store<AppState>,
    private messageBar: MessageBarService,
    private authService: AuthService,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setForm();
    this.setUserProfileForm();
    this.getDataListForSearchModal();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.auditStepStatus = this.route.snapshot.queryParams['auditStepStatus'] || "";
    this.formTS0115.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formTS0115.value)
    this.dataStore = this.store.select(state => state.Ta0301.ta0301).subscribe(datas => {
      this.formTS0115.get('formTsNumber').patchValue(datas.formTsNumber);
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0115)
      console.log("store =>", datas)
      if (Utils.isNotNull(this.formTS0115.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0115.get('formTsNumber').value);
        this.formNumber = this.formTS0115.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0115.patchValue({
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

  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callListCalendar('0');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  setForm() {
    this.formTS0115 = this.fb.group({
      formTsNumber: [""],
      officeName: [""],
      docDate: [""],
      ownerFullName: [""],
      factoryType: [""],
      factoryName: [""],
      newRegId: [""],
      facAddrNo: [""],
      facSoiName: [""],
      facThnName: [""],
      facTambolName: [""],
      facAmphurName: [""],
      facProvinceName: [""],
      facZipCode: [""],
      taFormTS0115DtlVoList: this.fb.array([this.createListItem()]),
      signOwnerFullName: [""],
      signOfficerFullName: [""],
      signWitnessFullName1: [""],
      signWitnessFullName2: [""],
      auditPlanCode: [""],
      auditStepStatus: [""]
    })
  }
  //set oop for dataList
  createListItem(): FormGroup {
    return this.fb.group({
      formTs0115DtlId: [""],
      recNo: [""],
      recDate: [""],
      dutyTypeText: [""],
      taxAmt: [""],
      fineAmt: [""],
      extraAmt: [""],
      moiAmt: [""],
      sumTaxAmt: [""]
    });
  }

  setUserProfileForm() {
    this.formTS0115.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formTS0115.get(`${formControlName}`).patchValue(text);
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
          this.formTS0115.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formTS0115.get('facAmphurName').reset();
              this.formTS0115.get('facTambolName').reset();

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
              this.formTS0115.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0115.get('newRegId').value)
    let newRegId = this.formTS0115.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  calculateMoney(index: number) {
    this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
    let taxAmt = Number(this.items.at(index).get('taxAmt').value.toString().replace(/,/g, ""));
    let fineAmt = Number(this.items.at(index).get('fineAmt').value.toString().replace(/,/g, ""));
    let extraAmt = Number(this.items.at(index).get('extraAmt').value.toString().replace(/,/g, ""));
    let moiAmt = (taxAmt + fineAmt + extraAmt) * 0.1;
    let sumTaxAmt = moiAmt * 10;
    this.items.at(index).get('moiAmt').patchValue(Utils.moneyFormatDecimal(moiAmt));
    this.items.at(index).get('sumTaxAmt').patchValue(Utils.moneyFormatDecimal(moiAmt + sumTaxAmt));
  }

  onFocusMoney(index: number, name: any) {
    this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
    let count = this.items.at(index).get(name).value.toString().replace(/,/g, "");
    this.items.at(index).get(name).patchValue(Number(count));

  }

  onBlurMoney(index: number, name: string) {
    this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
    let count = Number(this.items.at(index).get(name).value);
    this.items.at(index).get(name).patchValue(Utils.moneyFormatDecimal(count));

    this.calculateMoney(index);
  }

  //-------------------------------action  for List-------------------------------------
  //call calendar from array
  callListCalendar(idx): void {
    $("#calendarListDate" + idx).calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
        this.items.at(idx).get('recDate').patchValue(text);
        console.log("Date calendarListDate onChange", idx);
      }
    });
  }

  addListItem(): void {
    this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
    this.items.push(this.createListItem());
    console.log("addItem :", this.items.controls);
    setTimeout(() => {
      this.callListCalendar(this.items.controls.length - 1);
    }, 50);
  }
  removeListItem(idx): void {
    console.log("removeItem  idx :", idx);
    this.items.removeAt(idx)
  }
  clearItem() {
    this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
    this.items.controls.splice(0, this.items.controls.length)
    this.items.push(this.createListItem());

    setTimeout(() => {
      for (let i = 0; i < this.formTS0115.get('taFormTS0115DtlVoList').value.length; i++) {
        console.log("callCalendar ==> i : ", i)
        this.callListCalendar(i)
      }
    }, 50);

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
          this.formTS0115.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formTS0115.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0115');
        }
      });
    });
  }
  //-------------------------------!action  for List-------------------------------------

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  //=============================== backend=============================

  getOperatorDetails(newRegId: string) {
    this.loading = true;
    this.ajax.doPost(URL.OPERATOR_DETAILS, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getOperatorDetails : ", res.data)
        this.formTS0115.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facMooNo: res.data.facMoono,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
        })
        console.log("formTS0115 : ", this.formTS0115.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }


  save(e) {
    if (Utils.isNull(this.formTS0115.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        console.log('path: ', this.pathTs)
        console.log('json : ', JSON.stringify(this.formTS0115.value).toString())
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message);
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formTS0115.get('formTsNumber').value)
            this.loading = false;
          })
        })
      }
    }, "ยืนยันการทำรายการ");
  }
  clear(e) {
    this.formTS0115.reset();
    this.clearItem();
  }
  export(e) {
    if (Utils.isNull(this.formTS0115.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.submit = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formTS0115.get('formTsNumber').value)

        console.log("export : ", this.formTS0115.value);
        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0115.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
        this.loading = false;
      });
    })
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0115/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data);
        this.formTS0115.patchValue({
          formTsNumber: json.formTsNumber,
          officeName: json.officeName,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          ownerFullName: json.ownerFullName,
          factoryType: json.factoryType,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          signOwnerFullName: json.signOwnerFullName,
          signOfficerFullName: json.signOfficerFullName,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,
          auditPlanCode: json.auditPlanCode
        })

        this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
        this.items.controls = []
        console.log("json ==> loop", this.items.value)
        //==> add items   
        for (let i = 0; i < json.taFormTS0115DtlVoList.length; i++) {
          this.items.push(this.createListItem());
          console.log('add item ==> i : ', i);
        }

        //==> call calendar items
        setTimeout(() => {
          for (let i = 0; i < json.taFormTS0115DtlVoList.length; i++) {
            console.log("callListCalendar ==> i : ", i)
            this.callListCalendar(i)
          }
        }, 50);
        let i = 0;
        setTimeout(() => {
          json.taFormTS0115DtlVoList.forEach(element => {
            this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
            this.items.at(i).patchValue({
              formTs0115DtlId: `${element.formTs0115DtlId}`,
              recDate: `${Utils.isNotNull(element.recDate) ? converDate(element.recDate, patternDate.DD_MM_YYYY) : ''}`,
              dutyTypeText: `${element.dutyTypeText}`,
              taxAmt: `${element.taxAmt}`,
              fineAmt: `${element.fineAmt}`,
              extraAmt: `${element.extraAmt}`,
              moiAmt: `${element.moiAmt}`,
              sumTaxAmt: `${element.sumTaxAmt}`,
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
            this.formTS0115.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0115.get('formTsNumber').value,
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
        this.formTS0115.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formTS0115.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formTS0115.get('docDate').value)) {
        let docDate = converDate(this.formTS0115.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0115.get('docDate').patchValue(docDate);
      }
      this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        if (Utils.isNotNull(element.get('recDate').value)) {
          let recDate = converDate(element.get('recDate').value, patternDate.DD_MMMM_YYYY);
          element.get('recDate').patchValue(recDate);
        }
      }
      // delete ',' on number
      this.items = this.formTS0115.get('taFormTS0115DtlVoList') as FormArray;
      for (let index = 0; index < this.items.controls.length; index++) {
        const element = this.items.controls[index];
        let taxAmt = Number(element.get('taxAmt').value.replace(/,/g, ""));
        let fineAmt = Number(element.get('fineAmt').value.replace(/,/g, ""));
        let extraAmt = Number(element.get('extraAmt').value.replace(/,/g, ""));
        let moiAmt = Number(element.get('moiAmt').value.replace(/,/g, ""));
        let sumTaxAmt = Number(element.get('sumTaxAmt').value.replace(/,/g, ""));
        this.items.at(index).get('taxAmt').patchValue(taxAmt);
        this.items.at(index).get('fineAmt').patchValue(fineAmt);
        this.items.at(index).get('extraAmt').patchValue(extraAmt);
        this.items.at(index).get('moiAmt').patchValue(moiAmt);
        this.items.at(index).get('sumTaxAmt').patchValue(sumTaxAmt);
      }
      setTimeout(() => {
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0115.value).toString() }).subscribe((res: ResponseData<any>) => {
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
        this.formTS0115.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
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
