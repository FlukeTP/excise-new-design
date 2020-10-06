import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { UserModel } from 'models/user.model';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0103",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}
@Component({
  selector: 'app-ta030103',
  templateUrl: './ta030103.component.html',
  styleUrls: ['./ta030103.component.css']
})
export class Ta030103Component implements OnInit, AfterViewInit {
  userProfile: UserModel;
  formGroup: FormGroup;

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
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private authService: AuthService,
    private store: Store<AppState>,
    private ta0301Service: Ta0301Service,
    private route: ActivatedRoute
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.setFormTS0103();
    this.setUserProfileForm();
    this.getDataListForSearchModal();
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
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0103)
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

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป', new Date());
    this.callCalendarDefault('calendarDestDate', 'destDate', 'date', 'วดป');
    this.callCalendarDefault('calendarDestTime', 'destTime', 'time', 'เวลา');
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
  }

  setFormTS0103() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      bookNumber1: [''],
      bookNumber2: [''],
      officeName1: [''],
      docDate: [''],
      docDear: [''],
      factoryType: [''],
      factoryName: [''],
      facAddrNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      facZipCode: [''],
      newRegId: [''],
      compAddrNo: [''],
      compSoiName: [''],
      compThnName: [''],
      compTambolName: [''],
      compAmphurName: [''],
      compProvinceName: [''],
      compZipCode: [''],
      reasonText: [''],
      lawSection: [''],
      lawGroup: [''],
      destText: [''],
      destDate: [''],
      destTime: [''],
      destDocDesc: [''],
      signOfficerFullName: [''],
      signOfficerPosition: [''],
      officeName2: [''],
      officePhone: [''],
      headOfficerFullName: [''],
      auditPlanCode: [''],
      auditStepStatus: ['']
    });
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.title
    })
  }

  callCalendarDefault(id: string, formControlName: string, type: string, patten: string, maxDate: any = false): void {
    $(`#${id}`).calendar({
      maxDate: maxDate,
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(patten),
      onChange: (date, text) => {
        this.formGroup.get(`${formControlName}`).patchValue(text);
      }
    });
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const FAC_PROVINCE_SEARCH = "facProvinceSearch";
    const FAC_AMPHUR_SEARCH = "facAmphurSearch";
    const AUTH_PROVINCE_SEARCH = "compProvinceSearch";
    const AUTH_AMPHUR_SEARCH = "compAmphurSearch";
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
            // province 2 search TODO filter amphur
            case AUTH_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formGroup.get('compAmphurName').reset();
              this.formGroup.get('compTambolName').reset();

              this.callSearch(this.amphurListFilter, 'compAmphurSearch', 'amphurName', 'compAmphurName');
              break;
            // amphur 2 search TODO filter district
            case AUTH_AMPHUR_SEARCH:
              this.districtListFilter = [];
              var regex = /^\d{4}/g;
              this.districtListFilter = this.districtList.filter(({ districtCode }) => {
                return districtCode.match(regex)[0] == result.amphurCode;
              });
              // reset tambol when amphur new select
              this.formGroup.get('compTambolName').reset();

              this.callSearch(this.districtListFilter, 'compTambolSearch', 'districtName', 'compTambolName');
              break;

            default:
              break;
          }
        },
      });
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
          console.log('error getNewRegId formTS0103');
        }
      });
    });
  }

  searchModalOpen(num: number) {
    $('#searchModal').modal('show');
    this.dataTable(num);
  }

  //===================== backend =================================
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
          factoryType: res.data.factoryType,

          compAddrNo: res.data.cusAddrno,
          compSoiName: res.data.cusSoiname,
          compThnName: res.data.cusThnname,
          compTambolName: res.data.cusTambolname,
          compAmphurName: res.data.cusAmphurname,
          compProvinceName: res.data.cusProvincename,
          compZipCode: res.data.cusZipcode
        })
        console.log("formGroup : ", this.formGroup.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  save(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formGroup.reset();
  }
  export(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formGroup.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formGroup.value)

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
      });
    });
  }

  getFormTs(formTsNumber: string) {
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0103/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          officeName1: json.officeName1,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docDear: json.docDear,
          factoryType: json.factoryType,
          factoryName: json.factoryName,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          newRegId: json.newRegId,
          compAddrNo: json.compAddrNo,
          compSoiName: json.compSoiName,
          compThnName: json.compThnName,
          compTambolName: json.compTambolName,
          compAmphurName: json.compAmphurName,
          compProvinceName: json.compProvinceName,
          compZipCode: json.compZipCode,
          reasonText: json.reasonText,
          lawSection: json.lawSection,
          lawGroup: json.lawGroup,
          destText: json.destText,
          destDate: Utils.isNotNull(json.destDate) ? converDate(json.destDate, patternDate.DD_MM_YYYY) : '',
          destTime: json.destTime,
          destDocDesc: json.destDocDesc,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          officeName2: json.officeName2,
          officePhone: json.officePhone,
          headOfficerFullName: json.headOfficerFullName,
          auditPlanCode: json.auditPlanCode
        })
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
        var compAmphur = this.amphurList.find((element) => {
          return element.amphurName == json.compAmphurName;
        });
        if (Utils.isNotNull(compAmphur)) {
          // filter compAmphur and compDistrict
          var compAmphurListFilter = this.amphurList.filter(({ provinceId }) => {
            return provinceId == compAmphur.provinceId;
          });
          var compDistrictListFilter = this.districtList.filter(({ provinceId, amphurId }) => {
            return provinceId == compAmphur.provinceId && amphurId == compAmphur.amphurId;
          });
          // call search after filter compAmphur and compDistrict
          this.callSearch(compAmphurListFilter, 'compAmphurSearch', 'amphurName', 'compAmphurName');
          this.callSearch(compDistrictListFilter, 'compTambolSearch', 'districtName', 'compTambolName');
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
          console.log("Error !! getFormTsNumber ");
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
      if (Utils.isNotNull(this.formGroup.get('docDate').value)) {
        let docDate = converDate(this.formGroup.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.formGroup.get('destDate').value)) {
        let destDate = converDate(this.formGroup.get('destDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('destDate').patchValue(destDate);
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
      this.callSearch(this.provinceList, 'compProvinceSearch', 'provinceName', 'compProvinceName');
    });
  }

  getAmphurList() {
    this.amphurStore = this.store.select(state => state.Ta0301.amphurList).subscribe(datas => {
      this.amphurList = [];
      this.amphurList = datas;
      this.callSearch(this.amphurList, 'facAmphurSearch', 'amphurName', 'facAmphurName');
      this.callSearch(this.amphurList, 'compAmphurSearch', 'amphurName', 'compAmphurName');
    });
  }

  getDistrictList() {
    this.districtStore = this.store.select(state => state.Ta0301.districtList).subscribe(datas => {
      this.districtList = [];
      this.districtList = datas;
      this.callSearch(this.districtList, 'facTambolSearch', 'districtName', 'facTambolName');
      this.callSearch(this.districtList, 'compTambolSearch', 'districtName', 'compTambolName');
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
