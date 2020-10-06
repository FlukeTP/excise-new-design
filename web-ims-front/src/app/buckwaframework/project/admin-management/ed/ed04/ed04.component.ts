import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DepartmentDropdownService } from 'services/department-dropdown.service';
import { MessageService } from 'services/message.service';
import { DecimalFormat } from 'helpers/decimalformat';
import { Utils } from 'helpers/utils';
import { IsEmptyPipe } from 'app/buckwaframework/common/pipes/empty.pipe';
import thaibath from 'helpers/thaibath';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';

declare var $: any;
const URLS = {
  GET_DATA_HEAD: "ed/ed04/data-head",
  SAVE_DATA: "ed/ed04/save",
  SAVE_EDIT: "ed/ed04/edit",
  DELET: "ia/int15/03/delete",
  GET_LIST_CHILD: "ed/ed04/list-child",
  GET_DEPARTMENT: "ia/int15/04/get-department",
  GET_PERSON_TYPE: "preferences/parameter/IA_PERSON_TYPE",
}

@Component({
  selector: 'app-ed04',
  templateUrl: './ed04.component.html',
  styleUrls: ['./ed04.component.css']
})
export class Ed04Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ข้อมูลรายละเอียดพนักงาน", route: "#" }
  ];
  load: boolean = false;
  formsave: FormGroup;
  excisePersonInfo1: FormArray = new FormArray([]);
  personType: any[] = [];
  deletedash: any;
  provinceList: any[] = [];
  amphurList: any[] = [];
  amphurListFilter: any[] = [];
  districtList: any[] = [];
  districtListFilter: any[] = [];
  listTitle: any[] = [];
  provinceStore: any;
  amphurStore: any;
  districtStore: any;
  formSaveToapi: any;
  formEditToapi: any;
  username: any;
  provinceListedit: any[] = [];
  provincoedto: any;
  amphurListedit: any[] = [];
  districtListedit: any[] = [];
  personAmphurCode: any;
  personAmphurCodeto: any;
  personTabbolCodeto: any;
  dataTo: any;
  checkButton: boolean = false;
  constructor(
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private authService: AuthService,
    private fb: FormBuilder,
    private department: DepartmentDropdownService,
    private formBuilder: FormBuilder
  ) {
    this.formsave = this.formBuilder.group({
      id: [''],
      personLogin: [''],
      personId: [''],
      personType: [''],
      personThTitle: [''],
      personThName: [''],
      personThSurname: [''],
      personEnTitle: [''],
      personEnName: [''],
      personEnSurname: [''],
      underOffcode: [''],
      underOffname: [''],
      underDeptcode: [''],
      underDeptname: [''],
      workOffcode: [''],
      workOffname: [''],
      workDeptcode: [''],
      workDeptname: [''],
      linePositionCode: [''],
      linePositionLevel: [''],
      linePosition: [''],
      excPositionCode: [''],
      excPosition: [''],
      actingExcpositionCode: [''],
      actingExcposition: [''],
      emailAddress: [''],
      deptPhoneNo: [''],
      personStatus: [''],
      coupleThTitle: [''],
      coupleName: [''],
      coupleSurnameName: [''],
      couplePid: [''],
      fatherThTitle: [''],
      fatherName: [''],
      fatherSurnameName: [''],
      fatherPid: [''],
      motherThTitle: [''],
      motherName: [''],
      motherSurnameName: [''],
      motherPid: [''],
      personAddrno: [''],
      personMoono: [''],
      personVillagename: [''],
      personSoiname: [''],
      personRoadname: [''],
      personTabbolCode: [''],
      personTabbolName: [''],
      personAmphurCode: [''],
      personAmphurName: [''],
      personProvinceCode: [''],
      personProvinceName: [''],
      zipCode: [''],
      excisePersonInfo1: this.fb.array([])
    })
  }

  ngOnInit() {
    this.getProvinceList();
    this.getAmphurList();
    this.getDistrictList();
    this.formSaveData();
    this.getProfile();
    this.getDorpdownCoa();
    this.getDorpdownTitle();
    this.formEditData();
  }

  ngAfterViewInit() {
    $('.ui.dropdown').dropdown().css('width', '100%')
    $('#personId').mask('0-0000-00000-00-0');
    $('#couplePid').mask('0-0000-00000-00-0');
    $('#fatherPid').mask('0-0000-00000-00-0');
    $('#motherPid').mask('0-0000-00000-00-0');
    $('#childPid').mask('0-0000-00000-00-0');
    setTimeout(() => {
      this.getDataHeadEdit();
    }, 150);
    this.getDataDetailEdit();
  }

  getProfile() {
    const URL = "ed/ed01/userProfile"
    this.ajax.doPost(URL, {}).subscribe((res: any) => {
      console.log("loginontop : ", res.data);
      this.username = res.data.username
      this.formsave.patchValue({
        personThName: res.data.userThaiName,
        personThSurname: res.data.userThaiSurname,
        linePosition: res.data.title,
        workOffname: res.data.departmentName,
        personLogin: res.data.username,
        workOffcode: res.data.officeCode
      })
    });

  }

  calendar(lengthdata: any) {
    let datalenght = lengthdata - 1;
    $(`#dateCalendar${datalenght}`).calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.excisePersonInfo1.at(datalenght).get('childBirthDate').patchValue(text);
      }
    });
  }

  validateThaiCitizenID(e) {
    this.deletedash = e.target.value
    this.deletedash = this.deletedash.replace(/-/g, "");
    if (this.deletedash.length != 13 || this.deletedash.charAt(0).match(/[09]/)) {
      this.messageBar.errorModal("กรุณากรอกเลขบัตรประชาชนให้ครบถ้วน")
    }
    var sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(this.deletedash.charAt(i)) * (13 - i);
    }
    if ((11 - sum % 11) % 10 != parseInt(this.deletedash.charAt(12))) {
      this.messageBar.errorModal("เลขบัตรประชาชนไม่ถูกต้อง")
    } else {

    }
  }

  getDorpdownTitle() {
    const URL = "ed/ed04/listPersonThTitle";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      this.listTitle = res.data;
    })
  }

  getDorpdownCoa() {
    this.ajax.doPost(`${URLS.GET_PERSON_TYPE}`, {}).subscribe((res: ResponseData<any>) => {
      this.personType = res.data;
    });
  }

  addCreds() {
    let couplePid = this.formsave.value.couplePid.replace(/-/g, "")
    this.excisePersonInfo1 = this.formsave.controls.excisePersonInfo1 as FormArray;
    this.excisePersonInfo1.push(this.fb.group({
      personLogin: this.username,
      childNo: this.excisePersonInfo1.value.length + 1,
      childThTitle: '',
      childName: '',
      childSurnameName: '',
      childPid: couplePid,
      childBirthDate: '',
      instituteDesc: '',
      instituteAmphurCode: '',
      instituteProvinceCode: ''
    }));
    setTimeout(() => {
      $('.ui.dropdown').dropdown().css('width', '100%')
      $('#childPid').mask('0-0000-00000-00-0');
      this.calendar(this.excisePersonInfo1.value.length);
    }, 50);
  }

  deleteCreds = (idx) => {
    console.log("testetstestes", idx);
    let index = idx;
    this.excisePersonInfo1.removeAt(index);
  }

  formSaveData() {
    this.formSaveToapi = {
      excisePersonInfoVo: {
        personLogin: '',
        personId: '',
        personType: '',
        personThTitle: '',
        personThName: '',
        personThSurname: '',
        workOffcode: '',
        workOffname: '',
        linePosition: '',
        coupleThTitle: '',
        coupleName: '',
        coupleSurnameName: '',
        couplePid: '',
        fatherThTitle: '',
        fatherName: '',
        fatherSurnameName: '',
        fatherPid: '',
        motherThTitle: '',
        motherName: '',
        motherSurnameName: '',
        motherPid: '',
        personAddrno: '',
        personMoono: '',
        personVillagename: '',
        personSoiname: '',
        personRoadname: '',
        personTabbolCode: '',
        personTabbolName: '',
        personAmphurCode: '',
        personAmphurName: '',
        personProvinceCode: '',
        personProvinceName: '',
        zipCode: ''
        // excPositionCode: '',
        // excPosition: '',
        // personEnTitle: '',
        // personEnName: '',
        // personEnSurname: '',
        // underOffcode: '',
        // underOffname: '',
        // underDeptcode: '',
        // underDeptname: '',
        // actingExcpositionCode: '',
        // actingExcposition: '',
        // emailAddress: '',
        // deptPhoneNo: '',
        // personStatus: '',
        // workDeptcode: '',
        // workDeptname: '',
        // linePositionCode: '',
        // linePositionLevel: '',
      },
      excisePersonInfo1Vos: []
    }
  }

  formEditData() {
    this.formEditToapi = {
      excisePersonInfoVo: {
        id: '',
        personLogin: '',
        personId: '',
        personType: '',
        personThTitle: '',
        personThName: '',
        personThSurname: '',
        workOffcode: '',
        workOffname: '',
        linePosition: '',
        coupleThTitle: '',
        coupleName: '',
        coupleSurnameName: '',
        couplePid: '',
        fatherThTitle: '',
        fatherName: '',
        fatherSurnameName: '',
        fatherPid: '',
        motherThTitle: '',
        motherName: '',
        motherSurnameName: '',
        motherPid: '',
        personAddrno: '',
        personMoono: '',
        personVillagename: '',
        personSoiname: '',
        personRoadname: '',
        personTabbolCode: '',
        personTabbolName: '',
        personAmphurCode: '',
        personAmphurName: '',
        personProvinceCode: '',
        personProvinceName: '',
        zipCode: ''
        // excPositionCode: '',
        // excPosition: '',
        // personEnTitle: '',
        // personEnName: '',
        // personEnSurname: '',
        // underOffcode: '',
        // underOffname: '',
        // underDeptcode: '',
        // underDeptname: '',
        // actingExcpositionCode: '',
        // actingExcposition: '',
        // emailAddress: '',
        // deptPhoneNo: '',
        // personStatus: '',
        // workDeptcode: '',
        // workDeptname: '',
        // linePositionCode: '',
        // linePositionLevel: '',
      },
      excisePersonInfo1Vos: []
    }
  }

  saveTwoData() {
    console.log(this.formsave.value);
    this.formSaveToapi.excisePersonInfoVo.personThTitle = this.formsave.get('personThTitle').value;
    this.formSaveToapi.excisePersonInfoVo.personThName = this.formsave.get('personThName').value;
    this.formSaveToapi.excisePersonInfoVo.personThSurname = this.formsave.get('personThSurname').value;
    this.formSaveToapi.excisePersonInfoVo.personLogin = this.formsave.get('personLogin').value;
    this.formSaveToapi.excisePersonInfoVo.personId = this.formsave.get('personId').value;
    this.formSaveToapi.excisePersonInfoVo.personType = this.formsave.get('personType').value;
    this.formSaveToapi.excisePersonInfoVo.linePosition = this.formsave.get('linePosition').value;
    this.formSaveToapi.excisePersonInfoVo.workOffname = this.formsave.get('workOffname').value;
    this.formSaveToapi.excisePersonInfoVo.workOffcode = this.formsave.get('workOffcode').value;
    this.formSaveToapi.excisePersonInfoVo.personAddrno = this.formsave.get('personAddrno').value;
    this.formSaveToapi.excisePersonInfoVo.personMoono = this.formsave.get('personMoono').value;
    this.formSaveToapi.excisePersonInfoVo.personVillagename = this.formsave.get('personVillagename').value;
    this.formSaveToapi.excisePersonInfoVo.personSoiname = this.formsave.get('personSoiname').value;
    this.formSaveToapi.excisePersonInfoVo.personRoadname = this.formsave.get('personRoadname').value;
    this.formSaveToapi.excisePersonInfoVo.personTabbolName = this.formsave.get('personTabbolName').value;
    this.formSaveToapi.excisePersonInfoVo.personTabbolCode = this.formsave.get('personTabbolCode').value;
    this.formSaveToapi.excisePersonInfoVo.personAmphurName = this.formsave.get('personAmphurName').value;
    this.formSaveToapi.excisePersonInfoVo.personAmphurCode = this.formsave.get('personAmphurCode').value;
    this.formSaveToapi.excisePersonInfoVo.personProvinceName = this.formsave.get('personProvinceName').value;
    this.formSaveToapi.excisePersonInfoVo.personProvinceCode = this.formsave.get('personProvinceCode').value;
    this.formSaveToapi.excisePersonInfoVo.coupleThTitle = this.formsave.get('coupleThTitle').value;
    this.formSaveToapi.excisePersonInfoVo.coupleName = this.formsave.get('coupleName').value;
    this.formSaveToapi.excisePersonInfoVo.coupleSurnameName = this.formsave.get('coupleSurnameName').value;
    this.formSaveToapi.excisePersonInfoVo.couplePid = this.formsave.get('couplePid').value;
    this.formSaveToapi.excisePersonInfoVo.fatherThTitle = this.formsave.get('fatherThTitle').value;
    this.formSaveToapi.excisePersonInfoVo.fatherName = this.formsave.get('fatherName').value;
    this.formSaveToapi.excisePersonInfoVo.fatherSurnameName = this.formsave.get('fatherSurnameName').value;
    this.formSaveToapi.excisePersonInfoVo.fatherPid = this.formsave.get('fatherPid').value;
    this.formSaveToapi.excisePersonInfoVo.motherThTitle = this.formsave.get('motherThTitle').value;
    this.formSaveToapi.excisePersonInfoVo.motherName = this.formsave.get('motherName').value;
    this.formSaveToapi.excisePersonInfoVo.motherSurnameName = this.formsave.get('motherSurnameName').value;
    this.formSaveToapi.excisePersonInfoVo.motherPid = this.formsave.get('motherPid').value;
    this.formSaveToapi.excisePersonInfoVo.zipCode = this.formsave.get('zipCode').value;
    this.formSaveToapi.excisePersonInfo1Vos = this.formsave.get('excisePersonInfo1').value;
    console.log(this.formSaveToapi);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.formSaveToapi).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }


  listDataTab1(): FormGroup {
    return this.fb.group({
      id: [''],
      personLogin: this.username,
      childNo: this.excisePersonInfo1.value.length + 1,
      childThTitle: [''],
      childName: [''],
      childSurnameName: [''],
      childBirthDate: [''],
      instituteDesc: [''],
      childPid: [''],
      instituteAmphurCode: [''],
      instituteProvinceCode: ['']
    });
  }

  callSearch(data: any[], className: string, fieldName: string, formName: string) {
    const FAC_PROVINCE_SEARCH = "personProvinceName";
    const FAC_AMPHUR_SEARCH = "personAmphurName";
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
          if (Utils.isNotNull(result.provinceCode)) {
            console.log("provinceCode : ", result.provinceCode);
            this.formsave.patchValue({
              personProvinceCode: result.provinceCode
            })
          } else if (Utils.isNotNull(result.amphurCode)) {
            console.log("amphurCode : ", result.amphurCode);
            this.formsave.patchValue({
              personAmphurCode: result.amphurCode
            })
          } else if (Utils.isNotNull(result.districtCode)) {
            console.log("districtCode : ", result.districtCode);
            this.formsave.patchValue({
              personTabbolCode: result.districtCode
            })
          }
          this.formsave.get(`${formName}`).patchValue(result[`${fieldName}`]);
          switch (className) {
            // province search TODO filter amphur
            case FAC_PROVINCE_SEARCH:
              this.amphurListFilter = [];
              var regex = /^\d{2}/g;
              this.amphurListFilter = this.amphurList.filter(({ amphurCode }) => {
                return amphurCode.match(regex)[0] == result.provinceCode;
              });
              // reset amphur and tambol when province new select
              this.formsave.get('personAmphurName').reset();
              this.formsave.get('personTabbolName').reset();

              this.callSearch(this.amphurListFilter, 'personAmphurName', 'amphurName', 'personAmphurName');
              break;
            // amphur search TODO filter district
            case FAC_AMPHUR_SEARCH:
              this.districtListFilter = [];
              var regex = /^\d{4}/g;
              this.districtListFilter = this.districtList.filter(({ districtCode }) => {
                return districtCode.match(regex)[0] == result.amphurCode;
              });
              // reset tambol when amphur new select
              this.formsave.get('personTabbolName').reset();
              this.callSearch(this.districtListFilter, 'personTabbolName', 'districtName', 'personTabbolName');
              break;
            default:
              break;
          }
        },
      });
  }

  getProvinceList() {
    const URL = "preferences/geography/provice-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.provinceList = [];
        this.provinceList = res.data;
        this.callSearch(this.provinceList, 'personProvinceName', 'provinceName', 'personProvinceName');
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getAmphurList() {
    const URL = "preferences/geography/amphur-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.amphurList = [];
        this.amphurList = res.data;
        this.callSearch(this.amphurList, 'personAmphurName', 'amphurName', 'personAmphurName');
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getDistrictList() {
    const URL = "preferences/geography/district-list";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.districtList = [];
        this.districtList = res.data;
        this.callSearch(this.districtList, 'personTabbolName', 'districtName', 'personTabbolName');
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }


  getDataHeadEdit() {
    this.ajax.doPost(URLS.GET_DATA_HEAD, {
      "personLogin": this.authService.getUserDetails().username
    }).subscribe((res: ResponseData<any>) => {
      console.log("dataList : ", res.data);
      this.dataTo = res.data
      if (this.dataTo.id != null) {
        this.checkButton = true;
        this.load = true;
      }
      setTimeout(() => {
        $("#personThTitle").dropdown('set selected', res.data.personThTitle);
        $("#coupleThTitle").dropdown('set selected', res.data.coupleThTitle);
        $("#fatherThTitle").dropdown('set selected', res.data.fatherThTitle);
        $("#motherThTitle").dropdown('set selected', res.data.motherThTitle);
        $("#personType").dropdown('set selected', res.data.personType);
        $('#personId').val(this.dataTo.personId).trigger('input');
        $('#couplePid').val(this.dataTo.couplePid).trigger('input');
        $('#fatherPid').val(this.dataTo.fatherPid).trigger('input');
        $('#motherPid').val(this.dataTo.motherPid).trigger('input');
        this.provincoedto = res.data.personProvinceCode
        this.personAmphurCodeto = res.data.personAmphurCode
        this.personTabbolCodeto = res.data.personTabbolCode
        if (this.provincoedto != null) {
          this.provinceListedit = this.provinceList.filter((data) => {
            return data.provinceCode === this.provincoedto.trim();
          });
          this.amphurListedit = this.amphurList.filter((data) => {
            return data.amphurCode === this.personAmphurCodeto.trim();
          });
          this.districtListedit = this.districtList.filter((data) => {
            return data.districtCode === this.personTabbolCodeto.trim();
          });
        }
        console.log(" this.provincoedto  this.provincoedto ", this.provincoedto);
        this.setDataToEdit();
      }, 500);

    })

  }

  getDataDetailEdit() {
    this.ajax.doPost(URLS.GET_LIST_CHILD, {
      "personLogin": this.authService.getUserDetails().username
    }).subscribe((res: ResponseData<any>) => {
      console.log("dataList", res);
      setTimeout(() => {
        $('.ui.dropdown').dropdown().css('width', '100%')
      }, 50)
      this.excisePersonInfo1 = this.formsave.get('excisePersonInfo1') as FormArray;
      if (res.data.length > 0) {
        //set show button save
        this.excisePersonInfo1.controls.splice(0, this.excisePersonInfo1.controls.length);
        this.excisePersonInfo1.patchValue([]);
        res.data.forEach((e, index) => {
          this.excisePersonInfo1.push(this.listDataTab1());
          this.excisePersonInfo1.at(index).get('id').patchValue(e.id);
          this.excisePersonInfo1.at(index).get('childThTitle').patchValue(e.childThTitle);
          this.excisePersonInfo1.at(index).get('childName').patchValue(e.childName);
          this.excisePersonInfo1.at(index).get('childSurnameName').patchValue(e.childSurnameName);
          this.excisePersonInfo1.at(index).get('childBirthDate').patchValue(new DateStringPipe().transform(e.childBirthDate));
          this.excisePersonInfo1.at(index).get('instituteDesc').patchValue(e.instituteDesc);
          this.excisePersonInfo1.at(index).get('childPid').patchValue(e.childPid);
          this.excisePersonInfo1.at(index).get('instituteAmphurCode').patchValue(e.instituteAmphurCode);
          this.excisePersonInfo1.at(index).get('instituteProvinceCode').patchValue(e.instituteProvinceCode);
          setTimeout(() => {
            $(`#childPid${index}`).mask('0-0000-00000-00-0');
          }, 100);

        });

      } else {
        this.excisePersonInfo1.controls.splice(0, this.excisePersonInfo1.controls.length);
        this.excisePersonInfo1.patchValue([]);
      }
    })
  }

  setDataToEdit() {
    console.log("this.districtListedit : ", this.districtListedit);
    if (this.provincoedto != null) {
      console.log("sdsdsdsdsdsds");
      
      var provin = this.provinceListedit[0].provinceName
      var district = this.districtListedit[0].districtName
      var amphur = this.amphurListedit[0].amphurName
    }
    this.formsave.patchValue({
      id: this.dataTo.id,
      // personId: this.dataTo.personId,
      // couplePid: this.dataTo.couplePid,
      // fatherPid: this.dataTo.fatherPid,
      // motherPid: this.dataTo.motherPid,
      personProvinceName: provin,
      personTabbolName: district,
      personAmphurName: amphur,
      personThName: this.dataTo.personThName,
      personThSurname: this.dataTo.personThSurname,
      personLogin: this.dataTo.personLogin,
      linePosition: this.dataTo.linePosition,
      workOffname: this.dataTo.workOffname,
      personAddrno: this.dataTo.personAddrno,
      personMoono: this.dataTo.personMoono,
      personVillagename: this.dataTo.personVillagename,
      personSoiname: this.dataTo.personSoiname,
      personRoadname: this.dataTo.personRoadname,
      personProvinceCode: this.dataTo.personProvinceCode,
      personAmphurCode: this.dataTo.personAmphurCode,
      personTabbolCode: this.dataTo.personTabbolCode,
      coupleThTitle: this.dataTo.coupleThTitle,
      coupleName: this.dataTo.coupleName,
      coupleSurnameName: this.dataTo.coupleSurnameName,
      fatherThTitle: this.dataTo.fatherThTitle,
      fatherName: this.dataTo.fatherName,
      fatherSurnameName: this.dataTo.fatherSurnameName,
      motherThTitle: this.dataTo.motherThTitle,
      motherName: this.dataTo.motherName,
      motherSurnameName: this.dataTo.motherSurnameName,
      zipCode: this.dataTo.zipCode
    })

    this.load = false;
  }

  editToData() {
    console.log("formsave !! : ", this.formsave.value);
    this.formEditToapi.excisePersonInfoVo.id = this.formsave.get('id').value;
    this.formEditToapi.excisePersonInfoVo.personThTitle = this.formsave.get('personThTitle').value;
    this.formEditToapi.excisePersonInfoVo.personThName = this.formsave.get('personThName').value;
    this.formEditToapi.excisePersonInfoVo.personThSurname = this.formsave.get('personThSurname').value;
    this.formEditToapi.excisePersonInfoVo.personLogin = this.formsave.get('personLogin').value;
    this.formEditToapi.excisePersonInfoVo.personId = (<HTMLInputElement>document.getElementById('personId')).value.replace(/-/g, "")
    this.formEditToapi.excisePersonInfoVo.personType = this.formsave.get('personType').value;
    this.formEditToapi.excisePersonInfoVo.linePosition = this.formsave.get('linePosition').value;
    this.formEditToapi.excisePersonInfoVo.workOffname = this.formsave.get('workOffname').value;
    this.formEditToapi.excisePersonInfoVo.workOffcode = this.formsave.get('workOffcode').value;
    this.formEditToapi.excisePersonInfoVo.personAddrno = this.formsave.get('personAddrno').value;
    this.formEditToapi.excisePersonInfoVo.personMoono = this.formsave.get('personMoono').value;
    this.formEditToapi.excisePersonInfoVo.personVillagename = this.formsave.get('personVillagename').value;
    this.formEditToapi.excisePersonInfoVo.personSoiname = this.formsave.get('personSoiname').value;
    this.formEditToapi.excisePersonInfoVo.personRoadname = this.formsave.get('personRoadname').value;
    this.formEditToapi.excisePersonInfoVo.personTabbolName = this.formsave.get('personTabbolName').value;
    this.formEditToapi.excisePersonInfoVo.personTabbolCode = this.formsave.get('personTabbolCode').value;
    this.formEditToapi.excisePersonInfoVo.personAmphurName = this.formsave.get('personAmphurName').value;
    this.formEditToapi.excisePersonInfoVo.personAmphurCode = this.formsave.get('personAmphurCode').value;
    this.formEditToapi.excisePersonInfoVo.personProvinceName = this.formsave.get('personProvinceName').value;
    this.formEditToapi.excisePersonInfoVo.personProvinceCode = this.formsave.get('personProvinceCode').value;
    this.formEditToapi.excisePersonInfoVo.coupleThTitle = this.formsave.get('coupleThTitle').value;
    this.formEditToapi.excisePersonInfoVo.coupleName = this.formsave.get('coupleName').value;
    this.formEditToapi.excisePersonInfoVo.coupleSurnameName = this.formsave.get('coupleSurnameName').value;
    this.formEditToapi.excisePersonInfoVo.couplePid = (<HTMLInputElement>document.getElementById('couplePid')).value.replace(/-/g, "")
    this.formEditToapi.excisePersonInfoVo.fatherThTitle = this.formsave.get('fatherThTitle').value;
    this.formEditToapi.excisePersonInfoVo.fatherName = this.formsave.get('fatherName').value;
    this.formEditToapi.excisePersonInfoVo.fatherSurnameName = this.formsave.get('fatherSurnameName').value;
    this.formEditToapi.excisePersonInfoVo.fatherPid = (<HTMLInputElement>document.getElementById('fatherPid')).value.replace(/-/g, "")
    this.formEditToapi.excisePersonInfoVo.motherThTitle = this.formsave.get('motherThTitle').value;
    this.formEditToapi.excisePersonInfoVo.motherName = this.formsave.get('motherName').value;
    this.formEditToapi.excisePersonInfoVo.motherSurnameName = this.formsave.get('motherSurnameName').value;
    this.formEditToapi.excisePersonInfoVo.motherPid = (<HTMLInputElement>document.getElementById('motherPid')).value.replace(/-/g, "")
    this.formEditToapi.excisePersonInfoVo.zipCode = this.formsave.get('zipCode').value;
    this.formEditToapi.excisePersonInfo1Vos = this.formsave.get('excisePersonInfo1').value;
    console.log("Cilck !! Edit  : ", this.formEditToapi);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_EDIT, this.formEditToapi).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการแก้ไขข้อมูล")
  }
}





