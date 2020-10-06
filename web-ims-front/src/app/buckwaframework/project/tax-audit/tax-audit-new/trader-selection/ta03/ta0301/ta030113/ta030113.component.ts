import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { UserModel } from 'models/user.model';
import { ListFormTsNumber, Ta0301, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import * as TA0301ACTION from "../ta0301.action";
import { Store } from '@ngrx/store';
import { Utils } from 'helpers/utils';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Observable } from 'rxjs';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0113",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030113',
  templateUrl: './ta030113.component.html',
  styleUrls: ['./ta030113.component.css']
})
export class Ta030113Component implements OnInit {

  loading: boolean = false;
  formGroup: FormGroup;
  userProfile: UserModel;
  dataStore: any;
  pathTs: any;
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
    private route: ActivatedRoute,
  ) {
    // =============== Initial setting ==========//
    this.userProfile = this.authService.getUserDetails()
    this.createFrom()
    this.setUserProfileForm();
    this.getDataListForSearchModal();
  }
  ngOnDestroy(): void {
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
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
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;

      //==>checkpath :
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0113)

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
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date', 'วดป');
    this.callCalendarDefault('calendarRefBookDate', 'refBookDate', 'date', 'วดป');
    this.callCalendarDefault('calendarDocTime', 'docTime', 'time', 'เวลา');
    this.callCalendarDefault('calendarAuditFinishTime', 'auditFinishTime', 'time', 'เวลา');
    this.callCalendarDefault('calendarAuditDate', 'auditDate', 'date', 'วดป');
  }
  callCalendarDefault(id: string, formControlName: string, type: string, fomatter: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter(`${fomatter}`),
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

  createFrom() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      docPlace: [''],
      docDate: [''],
      docTime: [''],
      headOfficerFullName: [''],
      headOfficerPosition: [''],
      refBookNumber1: [''],
      refBookDate: [''],
      factoryType: [''],
      newRegId: [''],
      factoryName: [''],
      facAddrNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      facZipCode: [''],
      auditDate: [''],
      ownerFullName: [''],
      ownerPosition: [''],
      factoryName2: [''],
      auditFinishTime: [''],
      signOwnerFullName: [''],
      signOfficerFullName: [''],
      signWitnessFullName1: [''],
      signWitnessFullName2: [''],
      auditPlanCode: [''],
      auditStepStatus: ['']
    })
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      headOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      headOfficerPosition: this.userProfile.title,
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

  save(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        console.log('save form ==> ', this.formGroup.value)
        this.saveTs().subscribe((res: ResponseData<any>) => {
          this.messageBar.successModal(res.message)

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          })
        })

      }
    }, "ยืนยันการทำรายการ")
  }
  clear(e) {
    this.formGroup.reset();
  }
  export(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {
        this.getFormTs(this.formGroup.get('formTsNumber').value)

        console.log("export url : ", URL.EXPORT);
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
          this.formGroup.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formGroup.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0113');
        }
      });
    });
  }

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
        this.formGroup.patchValue({
          factoryName: res.data.facFullname,
          facAddrNo: res.data.facAddrno,
          facSoiName: res.data.facSoiname,
          facThnName: res.data.facThnname,
          facTambolName: res.data.facTambolname,
          facAmphurName: res.data.facAmphurname,
          facProvinceName: res.data.facProvincename,
          facZipCode: res.data.facZipcode,
          factoryType: res.data.factoryType
        })
        console.log("formGroup : ", this.formGroup.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
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
  getFormTs(formTsNumber: string) {

    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0113/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          docPlace: json.docPlace,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          docTime: json.docTime,
          headOfficerFullName: json.headOfficerFullName,
          headOfficerPosition: json.headOfficerPosition,
          refBookNumber1: json.refBookNumber1,
          refBookDate: Utils.isNotNull(json.refBookDate) ? converDate(json.refBookDate, patternDate.DD_MM_YYYY) : '',
          factoryType: json.factoryType,
          newRegId: json.newRegId,
          factoryName: json.factoryName,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          auditDate: Utils.isNotNull(json.auditDate) ? converDate(json.auditDate, patternDate.DD_MM_YYYY) : '',
          ownerFullName: json.ownerFullName,
          ownerPosition: json.ownerPosition,
          factoryName2: json.factoryName2,
          auditFinishTime: json.auditFinishTime,
          signOwnerFullName: json.signOwnerFullName,
          signOfficerFullName: json.signOfficerFullName,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,
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
      if (Utils.isNotNull(this.formGroup.get('refBookDate').value)) {
        let refBookDate = converDate(this.formGroup.get('refBookDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('refBookDate').patchValue(refBookDate);
      }
      if (Utils.isNotNull(this.formGroup.get('auditDate').value)) {
        let auditDate = converDate(this.formGroup.get('auditDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('auditDate').patchValue(auditDate);
      }
      this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup.value).toString() }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          obs.next(res);
        } else {
          this.messageBar.errorModal(res.message)
        }
        this.loading = false;
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
        this.formGroup.get('headOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('headOfficerPosition').patchValue(data.linePosition);
      } else if (num == 2) {
        this.formGroup.get('ownerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formGroup.get('ownerPosition').patchValue(data.linePosition);
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
