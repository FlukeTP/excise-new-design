import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { AuthService } from 'services/auth.service';
import { TextDateTH, formatter, converDate, patternDate } from 'helpers/datepicker';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { Store } from '@ngrx/store';
import { Ta0301, ListFormTsNumber, ProvinceList, AmphurList, DistrictList } from '../ta0301.model';
import * as TA0301ACTION from "../ta0301.action";
import { PathTs } from '../path.model';
import { Ta0301Service } from '../ts0301.service';
import { Utils } from 'helpers/utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from 'models/user.model';
declare var $: any;

const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ta/report/form-ts/pdf/ta-form-ts0112",
  OPERATOR_DETAILS: "ta/tax-audit/get-operator-details",
  DATA_TABLE_LIST: 'person-info/person-info-list'
}

@Component({
  selector: 'app-ta030112',
  templateUrl: './ta030112.component.html',
  styleUrls: ['./ta030112.component.css']
})
export class Ta030112Component implements OnInit, AfterViewInit {

  formGroup: FormGroup;
  taFormTS0112DtlVoList: FormArray;
  userProfile: UserModel;
  officerModalForm: officerModal[];

  submit: boolean = false;
  loading: boolean = false;
  dataStore: any;
  pathTs: any;
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
    this.createFrom()
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
      this.formGroup.get('formTsNumber').patchValue(datas.formTsNumber)
      this.pathTs = datas.pathTs;
      const pathModel = new PathTs();
      this.ta0301Service.checkPathFormTs(this.pathTs, pathModel.ts0112)
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
          this.setUserProfileForm();
          this.onSetNewRegId();
        }, 200);
      }
    });

    this.getPerson();
  }
  ngAfterViewInit(): void {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();

    $("#calendarDocDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.formGroup.get("docDate").patchValue(text);
      }
    });
  }

  createFrom() {
    this.formGroup = this.formBuilder.group({
      formTsNumber: [''],
      docPlace: [''],
      docDate: [''],
      headOfficerFullName: [''],
      headOfficerPosition: [''],
      headOfficerOfficeName: [''],
      factoryName: [''],
      newRegId: [''],
      facAddrNo: [''],
      facSoiName: [''],
      facThnName: [''],
      facTambolName: [''],
      facAmphurName: [''],
      facProvinceName: [''],
      facZipCode: [''],
      ownerFullName1: [''],
      ownerPosition: [''],
      ownerOther: [''],
      lawGroup: [''],
      seizeDesc: [''],
      contactDesc: [''],
      ownerFullName2: [''],
      ownerPosition2: [''],
      ownerOther2: [''],
      signAuthFullName: [''],
      signInspectorFullName: [''],
      signWitnessFullName1: [''],
      signWitnessFullName2: [''],
      auditPlanCode: [''],
      auditStepStatus: [''],
      taFormTS0112DtlVoList: this.formBuilder.array([]),
    });
  }

  createTaFormTS0112DtlVoList(): FormGroup {
    return this.formBuilder.group({
      formTs0112DtlId: [""],
      recNo: [""],
      userId: [""],
      officerFullName: [""],
      officerPosition: [""]
    });
  }

  addtaFormTS0112DtlVoList(): void {
    this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
    if (this.taFormTS0112DtlVoList.length <= 9) {
      this.taFormTS0112DtlVoList.push(this.createTaFormTS0112DtlVoList());
    } else {
      // this.messageBar.errorModal("เพิ่มได้ไม่เกิน 10 รายชื่อ", "แจ้งเตือน");
      // console.log('Over Size 10');
    }
  }

  removetaFormTS0112DtlVoList(index: any): void {
    // let index = null;
    this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
    // index = this.taFormTS0112DtlVoList.controls.findIndex(element => {
    //   return element.get('userId').value == dataObj.edLogin
    //     && element.get('officerFullName').value == dataObj.edPersonName
    //     && element.get('officerPosition').value == dataObj.edPositionName
    // })
    this.taFormTS0112DtlVoList.removeAt(index);
  }

  cleartaFormTS0112DtlVoList() {
    this.taFormTS0112DtlVoList = this.formGroup.get('taFormTS0112DtlVoList') as FormArray;
    this.taFormTS0112DtlVoList.controls.splice(0, this.taFormTS0112DtlVoList.controls.length)
  }

  setUserProfileForm() {
    this.formGroup.patchValue({
      headOfficerFullName: this.userProfile.userThaiName + " " + this.userProfile.userThaiSurname,
      headOfficerPosition: this.userProfile.title,
      headOfficerOfficeName: this.userProfile.departmentName
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

  save(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        this.saveTs().subscribe((res: ResponseData<any>) => {
          console.log('save form ==> ', this.formGroup.value)
          this.messageBar.successModal(res.message)

          // ==> get list tsnumber
          this.getFromTsNumberList().subscribe(res => {
            this.getFormTs(this.formGroup.get('formTsNumber').value)
            this.loading = false;
          });
          this.loading = false;
        })
      }
    }, "ยืนยันการบักทึก")
  }
  clear(e) {
    this.formGroup.reset();
    this.cleartaFormTS0112DtlVoList();
  }
  export(e) {
    if (Utils.isNull(this.formGroup.get('newRegId').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_NEW_REG_ID);
      return;
    }
    this.submit = true;
    console.log("export", this.formGroup.value)

    this.loading = true;
    console.log('save form ==> ', this.formGroup.value)
    this.ajax.doPost(`ta/report/save-form-ts/${this.pathTs}`, { json: JSON.stringify(this.formGroup.value).toString() }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        // ==> get list tsnumber
        this.getFromTsNumberList().subscribe(res => {
          this.getFormTs(this.formGroup.get('formTsNumber').value)

          //export
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
      } else {
        this.messageBar.errorModal(res.message)
      }
      this.loading = false;
    })



  }

  getOwnerPosition(position: string): String {
    let result = '';
    if (position == '1') {
      result = 'เจ้าของ';
    } else if (position == '2') {
      result = 'หุ้นส่วน';
    } else if (position == '3') {
      result = 'กรรมการผู้จัดการ';
    } else if (position == '4') {
      result = 'อื่นๆ';
    } else {
      result = '';
    }

    return result;
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
          console.log('error getNewRegId formTS0112');
        }
      });
    });
  }

  onOfficerModalShow() {
    $('#officerModalForm').modal({
      onShow: () => {
        this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
        let length = this.taFormTS0112DtlVoList.controls.length;

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
    this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
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
      if (this.taFormTS0112DtlVoList.value.some(checkDup)) {
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
        this.addtaFormTS0112DtlVoList();
        this.taFormTS0112DtlVoList.at(this.taFormTS0112DtlVoList.controls.length - 1).patchValue({
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
      this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
      let length = this.taFormTS0112DtlVoList.controls.length;
      // this.addtaFormTS0112DtlVoList();
      // this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
      // let length = this.taFormTS0112DtlVoList.length - 1;
      // this.taFormTS0112DtlVoList.at(length).get('userId').patchValue(dataObj.edLogin);
      // this.taFormTS0112DtlVoList.at(length).get('officerFullName').patchValue(dataObj.edPersonName);
      // this.taFormTS0112DtlVoList.at(length).get('officerPosition').patchValue(dataObj.edPositionName);

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
      // this.removetaFormTS0112DtlVoList(dataObj);
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

  //======================== backend =============================

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
          facZipCode: res.data.facZipcode
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

    this.ajax.doPost(`ta/report/get-form-ts/ta-form-ts0112/${formTsNumber}`, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        console.log("getFormTs : ", res.data);
        let json = JSON.parse(res.data)
        this.formGroup.patchValue({
          formTsNumber: json.formTsNumber,
          docPlace: json.docPlace,
          docDate: Utils.isNotNull(json.docDate) ? converDate(json.docDate, patternDate.DD_MM_YYYY) : '',
          headOfficerFullName: json.headOfficerFullName,
          headOfficerPosition: json.headOfficerPosition,
          headOfficerOfficeName: json.headOfficerOfficeName,
          officerFullName1: json.officerFullName1,
          officerPosition1: json.officerPosition1,
          officerFullName2: json.officerFullName2,
          officerPosition2: json.officerPosition2,
          officerFullName3: json.officerFullName3,
          officerPosition3: json.officerPosition3,
          officerFullName4: json.officerFullName4,
          officerPosition4: json.officerPosition4,
          officerFullName5: json.officerFullName5,
          officerPosition5: json.officerPosition5,
          factoryName: json.factoryName,
          newRegId: json.newRegId,
          facAddrNo: json.facAddrNo,
          facSoiName: json.facSoiName,
          facThnName: json.facThnName,
          facTambolName: json.facTambolName,
          facAmphurName: json.facAmphurName,
          facProvinceName: json.facProvinceName,
          facZipCode: json.facZipCode,
          ownerFullName1: json.ownerFullName1,
          ownerPosition: json.ownerPosition,
          ownerOther: json.ownerOther,
          lawGroup: json.lawGroup,
          seizeDesc: json.seizeDesc,
          contactDesc: json.contactDesc,
          ownerFullName2: json.ownerFullName2,
          ownerPosition2: json.ownerPosition2,
          ownerOther2: json.ownerOther2,
          signAuthFullName: json.signAuthFullName,
          signInspectorFullName: json.signInspectorFullName,
          signWitnessFullName1: json.signWitnessFullName1,
          signWitnessFullName2: json.signWitnessFullName2,
          auditPlanCode: json.auditPlanCode
        })

        this.taFormTS0112DtlVoList = this.formGroup.get("taFormTS0112DtlVoList") as FormArray;
        this.taFormTS0112DtlVoList.controls = [];

        console.log("json ==> loop", this.taFormTS0112DtlVoList.value)
        //==> add items
        for (let i = 0; i < json.taFormTS0112DtlVoList.length; i++) {
          this.taFormTS0112DtlVoList.push(this.createTaFormTS0112DtlVoList());
          console.log('add taFormTS0112DtlVoList ==> i : ', i);
        }
        let i = 0;
        setTimeout(() => {
          json.taFormTS0112DtlVoList.forEach(element => {
            this.taFormTS0112DtlVoList = this.formGroup.get('taFormTS0112DtlVoList') as FormArray;
            this.taFormTS0112DtlVoList.at(i).patchValue({
              formTs0112DtlId: `${element.formTs0112DtlId}`,
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
      if (Utils.isNotNull(this.formGroup.get('docDate').value)) {
        let docDate = converDate(this.formGroup.get('docDate').value, patternDate.DD_MMMM_YYYY);
        this.formGroup.get('docDate').patchValue(docDate);
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
        }, {
          data: "workOffname", className: "text-center"
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
        this.formGroup.get('headOfficerOfficeName').patchValue(data.workOffname);
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

interface officerModal {
  edLogin: string,
  edPersonName: string,
  edPositionName: string,
  isSelect: boolean
}
