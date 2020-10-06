import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { UserModel } from 'models/user.model';
import { Ta0301Service } from '../ts0301.service';
import * as TA0301ACTION from "../ta0301.action";
import { Store } from '@ngrx/store';
import { PathTs } from '../path.model';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList, DataCusTa } from '../ta0301.model';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0107",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030107',
  templateUrl: './ta030107.component.html',
  styleUrls: ['./ta030107.component.css']
})
export class Ta030107Component implements OnInit {

  formTS0107: FormGroup
  taFormTS0107DtlVoList: FormArray;
  userProfile: UserModel;
  officerModalForm: officerModal[];

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
  personList: any[];
  modalSelectContainer: any[] = [];

  provinceStore: any;
  amphurStore: any;
  districtStore: any;
  saveActive: boolean = false;

  auditPlanCode: string = "";
  auditStepStatus: string = "";

  ta0301: Ta0301
  formNumber: string = "";
  //data table
  dataList: any[] = [];
  table: any;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private ajax: AjaxService,
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

    console.log('-------------this.auditPlanCode---------', this.auditPlanCode);

    this.formTS0107.patchValue({
      auditPlanCode: this.auditPlanCode,
      auditStepStatus: this.auditStepStatus
    })

    console.log("ngOnInit formGroup : ", this.formTS0107.value)
    this.dataStore = this.store.select(state => state.Ta0301).subscribe(datas => {
      console.log("store =>", datas)

      this.formTS0107.patchValue({
        newRegId: datas.dataCusTa.newRegId,
        formTsNumber: datas.ta0301.formTsNumber
      })

      this.pathTs = datas.ta0301.pathTs;

      //check call function save or save2
      this.saveActive = Utils.isNotNull(datas.dataCusTa.newRegId);

      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0107)
      if (Utils.isNotNull(this.formTS0107.get('formTsNumber').value)) {
        this.getFormTs(this.formTS0107.get('formTsNumber').value);
        this.formNumber = this.formTS0107.get('formTsNumber').value;
      } else {
        this.clear('');
        setTimeout(() => {
          this.formTS0107.patchValue({
            auditPlanCode: this.auditPlanCode,
            auditStepStatus: this.auditStepStatus
          })
          this.formNumber = '';
          this.onSetNewRegId();
          this.setUserProfileForm();
        }, 200);
      }
    });

    this.getPerson();
  }

  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    this.callCalendarDefault('calendarDocDate', 'docDate', 'date');
    this.callCalendarDefault('calendarAuditDate', 'auditDate', 'date');
    this.callDropdown();
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();

    this.provinceStore.unsubscribe();
    this.amphurStore.unsubscribe();
    this.districtStore.unsubscribe();
    this.store.dispatch(new TA0301ACTION.RemoveDataCusTa())
    this.store.dispatch(new TA0301ACTION.RemovePathTsSelect())
  }

  setForm() {
    this.formTS0107 = this.fb.group({
      formTsNumber: [""],
      bookNumber1: [""],
      bookNumber2: [""],
      officeName1: [""],
      docDate: [""],
      officeName2: [""],
      headOfficerFullName: [""],
      headOfficerPosition: [""],
      companyName: [""],
      factoryType: [""],
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
      auditDate: [""],
      lawSection: [""],
      headOfficerPhone: [""],
      signOfficerFullName: [""],
      signOfficerPosition: [""],
      otherText: [""],
      otherPhone: [""],
      auditPlanCode: [""],
      auditStepStatus: [""],
      taFormTS0107DtlVoList: this.fb.array([]),
    })
  }

  createTaFormTS0107DtlVoList(): FormGroup {
    return this.fb.group({
      formTs0107DtlId: [""],
      recNo: [""],
      userId: [""],
      officerFullName: [""],
      officerPosition: [""]
    });
  }

  addTaFormTS0107DtlVoList(): void {
    this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
    if (this.taFormTS0107DtlVoList.length <= 9) {
      this.taFormTS0107DtlVoList.push(this.createTaFormTS0107DtlVoList());
    } else {
      // this.messageBar.errorModal("เพิ่มได้ไม่เกิน 10 รายชื่อ", "แจ้งเตือน");
      // console.log('Over Size 10');
    }
  }

  removeTaFormTS0107DtlVoList(index: any): void {
    this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
    this.taFormTS0107DtlVoList.removeAt(index);
  }

  clearTaFormTS0107DtlVoList() {
    this.taFormTS0107DtlVoList = this.formTS0107.get('taFormTS0107DtlVoList') as FormArray;
    this.taFormTS0107DtlVoList.controls.splice(0, this.taFormTS0107DtlVoList.controls.length);
  }

  setUserProfileForm() {
    this.formTS0107.patchValue({
      signOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      signOfficerPosition: this.userProfile.title
    })
  }

  searchNewRegId() {
    console.log("searchNewRegId", this.formTS0107.get('newRegId').value)
    let newRegId = this.formTS0107.get('newRegId').value;
    if (Utils.isNull(newRegId)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.getOperatorDetails(newRegId);
  }

  callCalendarDefault(id: string, formControlName: string, type: string): void {
    $(`#${id}`).calendar({
      maxDate: new Date(),
      type: `${type}`,
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formTS0107.get(`${formControlName}`).patchValue(text);
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
          this.formTS0107.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formTS0107.get('facAmphurName').reset();
              this.formTS0107.get('facTambolName').reset();

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
              this.formTS0107.get('facTambolName').reset();

              this.callSearch(this.districtListFilter, 'facTambolSearch', 'districtName', 'facTambolName');
              break;

            default:
              break;
          }
        },
      });
  }

  callDropdown() {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 500);
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
          this.formTS0107.get('newRegId').patchValue(res.data.newRegId);
          resolve(this.formTS0107.get('newRegId').value);
        } else {
          console.log('error getNewRegId formTS0107');
        }
      });
    });
  }

  onNameChange(event) {
    this.officerModalForm = [];
    this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
    let dataSplit = event.target.value.split(","); // index 0 = edLogin, 1 = edPersonName, 2 = edPositionName
    let dataObj = {
      edLogin: dataSplit[0],
      edPersonName: dataSplit[1],
      edPositionName: dataSplit[2]
    }
    this.formTS0107.get('headOfficerPosition').patchValue(dataSplit[2]);
    // remove data from select out of officerModalForm
    this.personList.forEach(element => {
      if (dataSplit[0] == element.edLogin && dataSplit[1] == element.edPersonName && dataSplit[2] == element.edPositionName) {
        return;
      }
      this.officerModalForm.push({
        edLogin: element.edLogin,
        edPersonName: element.edPersonName,
        edPositionName: element.edPositionName,
        isSelect: false
      })
    });
    let index = this.taFormTS0107DtlVoList.controls.findIndex(x => {
      return x.get('userId').value == dataSplit[0] && x.get('officerFullName').value == dataSplit[1] && x.get('officerPosition').value == dataSplit[2]
    })
    if (index > -1) {
      this.removeTaFormTS0107DtlVoList(index);
    }
  }

  onOfficerModalShow() {
    $('#officerModalForm').modal({
      onShow: () => {
        this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
        let length = this.taFormTS0107DtlVoList.controls.length;

        //check number of officerModalForm is 10 to disable checkbox
        if (length > 9) {
          this.officerModalIsDisabled();
        } else {
          this.setOfficerModalDisabled();
        }
      }
    }).modal('show');
  }

  onConfirmSelectModal() {
    let checkDupl = false
    this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
    this.modalSelectContainer = [];
    this.officerModalForm.filter(e => {
      if (e.isSelect) {
        this.modalSelectContainer.push(e);
      }
    })
    for (let index = 0; index < this.modalSelectContainer.length; index++) {
      const element = this.modalSelectContainer[index];
      let checkDup = (x) => {
        return element.edLogin == x.userId && element.edPersonName == x.officerFullName && element.edPositionName == x.officerPosition;
      }
      if (this.taFormTS0107DtlVoList.value.some(checkDup)) {
        $('#officerModalForm').modal('hide');
        this.messageBar.errorModal("ชื่อ: " + element.edPersonName + ", ตำแหน่ง: " + element.edPositionName + " ซ้ำ!!!!", "", (res) => {
          if (res) {
            this.onOfficerModalShow();
          }
        });
        checkDupl = true;
        return;
      }
    }
    if (!checkDupl) {
      for (let index = 0; index < this.modalSelectContainer.length; index++) {
        const element = this.modalSelectContainer[index];
        this.addTaFormTS0107DtlVoList();
        this.taFormTS0107DtlVoList.at(this.taFormTS0107DtlVoList.controls.length - 1).patchValue({
          userId: element.edLogin,
          officerFullName: element.edPersonName,
          officerPosition: element.edPositionName
        });
      }
      this.setOfficerModalDisabled();
      $('#officerModalForm').modal('hide');
    }
  }

  onCancelModal() {
    this.modalSelectContainer = [];
    this.setOfficerModalDisabled();
  }

  isSelectChecker(dataObj: any) {
    let i = 0;
    if (dataObj.isSelect) {
      this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
      let length = this.taFormTS0107DtlVoList.controls.length;

      for (let index = 0; index < this.officerModalForm.length; index++) {
        const element = this.officerModalForm[index];
        // sum number of selected
        if (element.isSelect == true) {
          i++;
        }
        //check number of officerModalForm is 10 to disable checkbox
        if (i + length > 9) {
          this.officerModalIsDisabled();
          break;
        }
      }
    } else {
      //set isSelect to false when unselect at officerModalForm;
      this.officerModalForm.filter(element => {
        if (element.edLogin == dataObj.edLogin && element.edPersonName == dataObj.edPersonName && element.edPositionName == dataObj.edPositionName) {
          element.isSelect = false;
        }
      });
      $('.isSelect').attr("disabled", false);
    }
  }

  officerModalIsDisabled() {
    //disable checkbox if number of officerModalForm is 10
    for (let index = 0; index < this.officerModalForm.length; index++) {
      const element = this.officerModalForm[index];
      //disable for unchecked
      if (element.isSelect == false) {
        $(`#isSelect${index}`).attr("disabled", true);
      } else {
        $(`#isSelect${index}`).attr("disabled", false);
      }
    }
  }

  setOfficerModalDisabled() {
    //set all select to unchecked at officerModalForm;
    this.officerModalForm.filter(element => {
      if (element.isSelect) {
        element.isSelect = false;
      }
    });
    $('.isSelect').attr("disabled", false);
  }

  uniq(dataArray: any[]) {
    return dataArray.sort().filter((value, index, array) => {
      return !index || value != array[index - 1];
    })
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
        this.formTS0107.patchValue({
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
        console.log("formTS0107 : ", this.formTS0107.value)
      } else {
        this.messageBar.errorModal(res.message);
        console.log("Error getOperatorDetails : " + res.message)
      }
      this.loading = false;
    });
  }

  save2(e) {
    console.log('save2', e)
    this.messageBar.comfirm(res => {
      if (res) {
      }
    }, "ยืนยันการบันทึก");
  }
  save(e) {
    if (Utils.isNull(this.formTS0107.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        console.log(this.formTS0107.value);

        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {

          this.messageBar.successModal(res.message);

          this.getFromTsNumberList().subscribe(res => {

            this.getFormTs(this.formTS0107.get('formTsNumber').value)
            this.loading = false;
          });
        })
      }
    }, "ยืนยันการบันทึก")
  }
  clear(e) {
    this.formTS0107.reset();
    this.clearTaFormTS0107DtlVoList();
  }
  export(e) {
    if (Utils.isNull(this.formTS0107.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    //add recNo in taFormTS0107DtlVoList
    for (let index = 0; index < this.formTS0107.get('taFormTS0107DtlVoList').value.length; index++) {
      this.formTS0107.get('taFormTS0107DtlVoList').get(index.toString()).get('recNo').patchValue(index + 1);
    }
    this.loading = true;
    this.saveTs().subscribe((res: ResponseData<any>) => {
      this.getFromTsNumberList().subscribe(res => {

        this.getFormTs(this.formTS0107.get('formTsNumber').value)

        //export
        this.loading = false;
        this.submit = true;
        console.log("export", this.formTS0107.value)

        var form = document.createElement("form");
        form.action = URL.EXPORT;
        form.method = "POST";
        form.style.display = "none";
        //  form.target = "_blank";

        var jsonInput = document.createElement("input");
        jsonInput.name = "json";
        jsonInput.value = JSON.stringify(this.formTS0107.value).toString();
        form.appendChild(jsonInput);
        document.body.appendChild(form);
        form.submit();
      });
    });
  }

  getFormTs(formTsNumber: string) {
    console.log('getFormTs formTsNumber=> ', formTsNumber)
    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0107/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formTS0107.patchValue({
          formTsNumber: json.formTsNumber,
          bookNumber1: json.bookNumber1,
          bookNumber2: json.bookNumber2,
          officeName1: json.officeName1,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          officeName2: json.officeName2,
          headOfficerFullName: json.headOfficerFullName,
          headOfficerPosition: json.headOfficerPosition,
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
          auditDate: Utils.isNotNull(json.auditDate) ? converDate(json.auditDate, patternDate.DD_MM_YYYY) : '',
          lawSection: json.lawSection,
          headOfficerPhone: json.headOfficerPhone,
          signOfficerFullName: json.signOfficerFullName,
          signOfficerPosition: json.signOfficerPosition,
          otherText: json.otherText,
          otherPhone: json.otherPhone,
          auditPlanCode: json.auditPlanCode
        })

        this.taFormTS0107DtlVoList = this.formTS0107.get("taFormTS0107DtlVoList") as FormArray;
        this.taFormTS0107DtlVoList.controls = [];

        console.log("json ==> loop", this.taFormTS0107DtlVoList.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0107DtlVoList.length; i++) {
          this.taFormTS0107DtlVoList.push(this.createTaFormTS0107DtlVoList());
          console.log('add taFormTS0107DtlVoList ==> i : ', i);
        }
        let i = 0;
        setTimeout(() => {
          json.taFormTS0107DtlVoList.forEach(element => {
            this.taFormTS0107DtlVoList = this.formTS0107.get('taFormTS0107DtlVoList') as FormArray;
            this.taFormTS0107DtlVoList.at(i).patchValue({
              formTs0107DtlId: `${element.formTs0107DtlId}`,
              recNo: `${element.recNo}`,
              officerFullName: `${element.officerFullName}`,
              officerPosition: `${element.officerPosition}`,
            })
            i++;
          });
          console.log(json.taFormTS0107DtlVoList);

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
            this.formTS0107.get('formTsNumber').patchValue(res.data[0]);
          }
          console.log(" getFromTsNumberList ==> : ", res.data)
          obs.next(res.data);
          this.store.dispatch(new TA0301ACTION.AddListFormTsNumber(this.listFormTsNumber))

          //==== set formTsNumber  to store =======
          setTimeout(() => {
            this.ta0301 = {
              formTsNumber: this.formTS0107.get('formTsNumber').value,
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
        this.formTS0107.patchValue({
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: this.auditStepStatus,
          formTsNumber: this.formNumber
        })
      } else {
        this.formTS0107.patchValue({
          formTsNumber: this.formNumber
        })
      }
      // convert date DD MMMM YYYY to DD/MM/YYYY
      if (Utils.isNotNull(this.formTS0107.get('docDate').value)) {
        let docDate = converDate(this.formTS0107.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0107.get('docDate').patchValue(docDate);
      }
      if (Utils.isNotNull(this.formTS0107.get('auditDate').value)) {
        let auditDate = converDate(this.formTS0107.get('auditDate').value, patternDate.DD_MMMM_YYYY);
        this.formTS0107.get('auditDate').patchValue(auditDate);
      }
      setTimeout(() => {
        console.log('this.formTS0107', this.formTS0107.value);
        this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formTS0107.value).toString() }).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            obs.next(res);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }, 200);


    })
  }

  getPerson() {
    let URL = "person/person-list";
    this.ajax.doGet(URL).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.personList = [];
        this.officerModalForm = [];
        this.personList = this.uniq(res.data);
        //add any data object to officerModalForm
        this.personList.forEach(element => {
          this.officerModalForm.push({
            edLogin: element.edLogin,
            edPersonName: element.edPersonName,
            edPositionName: element.edPositionName,
            isSelect: false
          })
        });
      }
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
        this.formTS0107.get('signOfficerFullName').patchValue(data.personThName + " " + data.personThSurname);
        this.formTS0107.get('signOfficerPosition').patchValue(data.linePosition);
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
    districtList: DistrictList[],
    dataCusTa: DataCusTa
  }
}

interface officerModal {
  edLogin: string,
  edPersonName: string,
  edPositionName: string,
  isSelect: boolean
}