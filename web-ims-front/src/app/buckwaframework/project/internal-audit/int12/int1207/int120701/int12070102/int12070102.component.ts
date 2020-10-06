import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter, ThDateToEnDate } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { UserModel } from 'models/user.model';
import * as moment from 'moment';
import { ResponseData } from 'models/response-data.model';
import thaibath from 'helpers/thaibath';
import { MessageService } from 'services/message.service';
import { Int12070102Service } from './int12070102.service';

const URLS = {
  GET_TITLE: 'ed/ed04/listPersonThTitle',
  FIND_ID: 'ia/int12/07/01/02/findById/',
};

declare var $: any;
@Component({
  selector: 'app-int12070102',
  templateUrl: './int12070102.component.html',
  styleUrls: ['./int12070102.component.css'],
  providers: [Int12070102Service]
})
export class Int12070102Component implements OnInit, AfterViewInit {
  breadcrumb: BreadCrumb[];
  medicalWelfareForm: FormGroup = new FormGroup({});
  profileUser: UserModel;
  flag = true;
  arrayUpload: any = [];
  fileArray: any = [];
  delFlag = false;
  submittedFlag = false;
  user: any;
  titleList: any[] = [];
  hospitalList: any[] = [];
  receipts: FormArray = new FormArray([], Validators.required);
  textShow: string;
  textShow2: string;
  familyData: string;
  id: any;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private ajax: AjaxService,
    private message: MessageBarService,
    private router: Router,
    private route: ActivatedRoute,
    private selfService: Int12070102Service
  ) {
    this.profileUser = this.authService.getUserDetails();
    this.breadcrumb = [
      { label: 'ตรวจสอบภายใน', route: '#' },
      { label: 'บันทึกข้อมูล', route: '#' },
      { label: 'คำขอเบิก', route: '#' },
      { label: 'ข้อมูลคำขอเบิก', route: '#' },
      { label: 'บันทึกคำขอเบิกเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล (แบบ 7131)', route: '#' }
    ];
    this.medicalWelfareForm = this.fb.group({
      // Self
      fullName: [`${this.profileUser.userThaiName} ${this.profileUser.userThaiSurname}`, Validators.required],
      position: [this.profileUser.title, Validators.required],
      affiliation: [this.profileUser.departmentName, Validators.required],
      phoneNumber: [''],
      self: ['', Validators.required],

      // Couple
      couple: ['', Validators.required], // CheckBox
      titleCouple: [{ value: '' }],
      firstNameCouple: [{ value: '', disabled: true }],
      lastNameCouple: [{ value: '', disabled: true }],
      citizenIdCouple: [{ value: '', disabled: true }],

      // Father
      father: ['', Validators.required], // CheckBox
      titleFather: [{ value: '' }],
      firstNameFather: [{ value: '', disabled: true }],
      lastNameFather: [{ value: '', disabled: true }],
      citizenIdFather: [{ value: '', disabled: true }],

      // Mother
      mother: ['', Validators.required], // CheckBox
      titleMother: [{ value: '' }],
      firstNameMother: [{ value: '', disabled: true }],
      lastNameMother: [{ value: '', disabled: true }],
      citizenIdMother: [{ value: '', disabled: true }],

      // Children
      // Child 1
      child1: ['', Validators.required], // CheckBox
      titleChild1: [{ value: '' }],
      firstNameChild1: [{ value: '', disabled: true }],
      lastNameChild1: [{ value: '', disabled: true }],
      citizenIdChild1: [{ value: '', disabled: true }],
      birthDateChild1: [{ value: '', disabled: true }],
      numberOfChild1: [{ value: '', disabled: true }],
      statusChild1: [{ value: '', disabled: true }],

      // Child 2
      child2: ['', Validators.required], // CheckBox
      titleChild2: [{ value: '' }],
      firstNameChild2: [{ value: '', disabled: true }],
      lastNameChild2: [{ value: '', disabled: true }],
      citizenIdChild2: [{ value: '', disabled: true }],
      birthDateChild2: [{ value: '', disabled: true }],
      numberOfChild2: [{ value: '', disabled: true }],
      statusChild2: [{ value: '', disabled: true }],

      // Child 3
      child3: ['', Validators.required], // CheckBox
      titleChild3: [{ value: '' }],
      firstNameChild3: [{ value: '', disabled: true }],
      lastNameChild3: [{ value: '', disabled: true }],
      citizenIdChild3: [{ value: '', disabled: true }],
      birthDateChild3: [{ value: '', disabled: true }],
      numberOfChild3: [{ value: '', disabled: true }],
      statusChild3: [{ value: '', disabled: true }],

      // Reason
      disease: ['', Validators.required],
      hospitalName: ['', Validators.required],
      hospitalOwner: ['', Validators.required],
      treatedDateFrom: ['', Validators.required],
      treatedDateTo: ['', Validators.required],
      totalMoney: ['', Validators.required],
      receiptQuantity: [{ value: 0, disabled: false }, Validators.required],
      claimStatus: ['', Validators.required],
      claimMoney: ['', Validators.required],
      ownerClaim: [''],
      ownerClaim1: [''],
      ownerClaim2: [''],
      ownerClaim3: [''],
      ownerClaim4: [''],
      otherClaim: [''],
      otherClaim1: [''],
      otherClaim2: [''],
      otherClaim3: [''],
      otherClaim4: [''],
      files: [],
      type: [''],
      receipts: this.fb.array([], Validators.required)
    });
    const id = this.route.snapshot.queryParams['id'];
    if (id) {
      this.id = id;
      this.findById(id);
    }
  }

  async ngOnInit() {
    this.titleList = await this.title(); // query list of dropdown from backend
    this.hospitalList = await this.hospital(); // query list of dropdown from backend
    $('.ui.dropdown.ai').dropdown().css('width', '100%');
  }

  ngAfterViewInit() {
    this.calendar();
    console.clear();
    console.log(this.profileUser, this.medicalWelfareForm.value);
    $('#phoneNumber').mask('000-0000000');
    $('.citizenId').mask('0 0000 00000 00 0');
    this.disableCkeck();
  }

  findById(id: any) {
    this.ajax.doGet(URLS.FIND_ID + id).subscribe(
      (res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.message) {
          // this.dataFind = res.data;
          this.medicalWelfareForm.patchValue(this.selfService.setValueFind(res.data));
          this.disableCkeck();
        } else {
          this.message.errorModal(res.message);
        }
      },
      (err) => {
        this.message.errorModal(err);
      }
    );
  }

  calendar = () => {
    const date = new Date();
    $('#dateFrom').calendar({
      type: 'date',
      text: TextDateTH,
      endCalendar: $('#dateTo'),
      maxDate: new Date(),
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('treatedDateFrom').setValue(text);
      }
    });
    $('#dateTo').calendar({
      type: 'date',
      text: TextDateTH,
      startCalendar: $('#dateFrom'),
      formatter: formatter('day-month-year'),
      maxDate: new Date(),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('treatedDateTo').setValue(text);
      }
    });
    $('#birthDate1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild1').setValue(text);
      }
    });
    $('#birthDate2').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild2').setValue(text);
      }
    });
    $('#birthDate3').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('day-month-year'),
      onChange: (date, text) => {
        this.medicalWelfareForm.get('birthDateChild3').setValue(text);
      }
    });
  }

  addReceipt() {
    this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
    const form = this.medicalWelfareForm.get('receiptQuantity');
    form.patchValue(parseInt(form.value) + 1);
    const index = this.receipts.controls.length;
    this.receipts.push(this.fb.group({
      receiptNo: ['', Validators.required],
      receiptAmount: ['', Validators.required],
      receiptDate: ['', Validators.required]
    }, Validators.required));
    setTimeout(() => {
      $(`#receiptD${index}`).calendar({
        type: 'date',
        text: TextDateTH,
        formatter: formatter('day-month-year'),
        onChange: (date, text) => {
          this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
          this.receipts.at(index).get(`receiptDate`).setValue(text);
        }
      });
    }, 400);
  }

  removeReceipt(index) {
    this.receipts = this.medicalWelfareForm.get('receipts') as FormArray;
    const form = this.medicalWelfareForm.get('receiptQuantity');
    form.patchValue(parseInt(form.value) - 1);
    this.receipts.removeAt(index);
  }

  onFilesAdded() {
    this.flag = false;
  }

  onUpload(e) {
    e.preventDefault();
    if ($('#files').val() === '') {
      this.message.errorModal('กรุณาเลือกไฟล์อัพโหลด');
    } else {
      this.fileUpload().then(res => {
        this.arrayUpload = res;
      });
    }
  }

  fileUpload() {
    const inputFile = `<input type='file' name='files' id='files' accept='.pdf, image/*, text/plain, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                        application/vnd.ms-excel,.doc,.docx'>`;

    const f = $('.upload-panel > input')[0];
    $('.upload-panel').html(inputFile);

    const lastText = f.value.split('\\').length;
    const u = {
      name: f.value.split('\\')[lastText - 1],
      date: new Date().toLocaleDateString(),
      typePage: 'RH',
      inputFile: f
    };

    this.fileArray.push(u);

    return new Promise<any>((resolve, reject) => {
      resolve(this.fileArray);
    });
  }

  onDeleteRow(index: number) {
    this.message.comfirm(e => {
      if (e) {
        this.delFlag = true;
        this.fileArray.splice(index, 1);
        setTimeout(() => {
          this.delFlag = false;
        }, 300);
      }
    }, 'ต้องการเปลี่ยนแปลงข้อมูลหรือไม่?');
  }

  changedCheckData(data: any) {
    console.log(data, data == 'true', data === 'true');
    if (data) {
      return 'Y';
    }
    return '';
  }

  onSubmit() {
    this.delFlag = true;
    this.submittedFlag = true;
    if (this.medicalWelfareForm.invalid || this.medicalWelfareForm.get('receiptQuantity').value == 0) {
      for (const key in this.medicalWelfareForm.controls) {
        if (this.medicalWelfareForm.get(key).invalid) {
          if (AjaxService.isDebug) {
            console.error('REQUIRED : ' + key);
          }
          this.message.errorModal('กรุณากรอกข้อมูลให้ครบ');
          return;
        }
      }
    }
    this.message.comfirm(confirm => {
      const form = this.medicalWelfareForm;
      if (confirm) {
        for (let i = 1; i <= 3; i++) {
          if (form.get(`statusChild${i}`).value == '0') {
            const date = moment(ThDateToEnDate(form.get(`birthDateChild${i}`).value), 'DD/MM/YYYY');
            if (moment().diff(date, 'years') > 20) {
              this.message.errorModal('กรุณากรอกข้อมูลอายุให้ถูกต้อง');
              return;
            }
          }
        }
        this.medicalWelfareForm.enable();
        const {
          fullName, position, affiliation, phoneNumber, disease, hospitalName, hospitalOwner,
          treatedDateFrom, treatedDateTo, totalMoney, receiptQuantity, claimStatus, claimMoney,
          citizenIdCouple, firstNameCouple, lastNameCouple, titleCouple, firstNameFather, lastNameFather,
          titleFather, citizenIdFather, firstNameMother, lastNameMother, titleMother, citizenIdMother,
          firstNameChild1, lastNameChild1, titleChild1, citizenIdChild1, citizenIdChild2, citizenIdChild3, statusChild1, statusChild2,
          statusChild3, birthDate1, birthDate2, birthDate3, numberOfChild1, numberOfChild2, numberOfChild3,
          ownerClaim1, ownerClaim2, ownerClaim3, ownerClaim4, otherClaim1, otherClaim2, otherClaim3, otherClaim4,
          receipts, father, self, couple, mother, child1, child2, child3
        } = this.medicalWelfareForm.value;
        const mateName = `${titleCouple} ${firstNameCouple} ${lastNameCouple}`;
        const fatherName = `${titleFather} ${firstNameFather} ${lastNameFather}`;
        const motherName = `${titleMother} ${firstNameMother} ${lastNameMother}`;
        const childName = `${titleChild1} ${firstNameChild1} ${lastNameChild1}`;
        for (let i = 0; i < receipts.length; i++) {
          receipts[i].receiptAmount = this.convertToNumber(receipts[i].receiptAmount);
        }
        const data = {
          fullName, position, affiliation, phoneNumber: phoneNumber.replace('-', ''), disease, hospitalName, hospitalOwner,
          treatedDateFrom, treatedDateTo, totalMoney: this.convertToNumber(totalMoney), receiptQt: receiptQuantity, claimStatus,
          claimMoney: this.convertToNumber(claimMoney), mateName, mateCitizenId: this.replaceAll(citizenIdCouple, /\s/g, ''),
          fatherName, fatherCitizenId: this.replaceAll(citizenIdFather, /\s/g, ''), motherName,
          motherCitizenId: citizenIdMother.replace(' ', ''), childName, childCitizenId: this.replaceAll(citizenIdChild1, /\s/g, ''),
          childCitizenId2: this.replaceAll(citizenIdChild2, /\s/g, ''), childCitizenId3: this.replaceAll(citizenIdChild3, /\s/g, ''),
          status: statusChild1, status2: statusChild2, status3: statusChild3,
          gender: '', birthDate: birthDate1, birthDate2, birthDate3, siblingsOrder: numberOfChild1,
          siblingsOrder2: numberOfChild2, siblingsOrder3: numberOfChild3,
          otherClaim1: this.changedCheckData(otherClaim1),
          otherClaim2: this.changedCheckData(otherClaim2),
          otherClaim3: this.changedCheckData(otherClaim3),
          otherClaim4: this.changedCheckData(otherClaim4),
          ownerClaim1: this.changedCheckData(ownerClaim1),
          ownerClaim2: this.changedCheckData(ownerClaim2),
          ownerClaim3: this.changedCheckData(ownerClaim3),
          ownerClaim4: this.changedCheckData(ownerClaim4),
          father, self, couple, mother, child1, child2, child3,
          receipts
        };
        this.ajax.doPost('ia/int12/07/01/02/save', data).subscribe(
          (res: ResponseData<any>) => {
            if (MessageService.MSG.SUCCESS === res.status) {
              this.message.successModal(res.message);
              this.router.navigate(['int12/07/01'], {
                queryParams: {
                  page: '2',
                }
              });
            } else {
              this.message.errorModal(res.message);
            }
            console.log(res);
          }
        );
      }
    }, 'ยืนยันการบันทึกข้อมูล');

  }

  replaceAll(data, search: RegExp, replacement) {
    return data.replace(new RegExp(search), replacement);
  }

  numToText(e) {
    this.textShow = thaibath.ArabicNumberToText(e);
  }
  numToText2(e) {
    this.textShow2 = thaibath.ArabicNumberToText(e);
  }

  disableCkeck() {
    setTimeout(() => {
      if (
        this.medicalWelfareForm.value.couple
        || this.medicalWelfareForm.value.father
        || this.medicalWelfareForm.value.mother
        || this.medicalWelfareForm.value.child1
        || this.medicalWelfareForm.value.child2
        || this.medicalWelfareForm.value.child3
      ) {
        $('.ui.checkbox.other')
          .checkbox('enable');
      } else {
        $('.ui.checkbox.other')
          .checkbox('set disabled');
        // return true;
      }
      let data = '';
      if (this.medicalWelfareForm.value.couple) {
        data += 'คู่สมรส, ';
      }
      if (this.medicalWelfareForm.value.father) {
        data += 'บิดา, ';
      }
      if (this.medicalWelfareForm.value.mother) {
        data += 'มารดา, ';
      }
      if (this.medicalWelfareForm.value.child1) {
        data += 'บุตร, ';
      } else if (this.medicalWelfareForm.value.child2) {
        data += 'บุตร, ';
      } else if (this.medicalWelfareForm.value.child3) {
        data += 'บุตร, ';
      }
      console.log(data.substring(0, data.length - 2));
      this.familyData = data.substring(0, data.length - 2) + ' ';
    }, 200);
  }

  handleCheckBox() {
    let count = 0;
    const form = this.medicalWelfareForm;
    if (form.get('self').value) { count++; }
    if (form.get('couple').value) { count++; }
    if (form.get('father').value) { count++; }
    if (form.get('mother').value) { count++; }
    if (form.get('child1').value) { count++; }
    if (form.get('child2').value) { count++; }
    if (form.get('child3').value) { count++; }
    if (count > 0) {
      form.get('self').clearValidators(); form.get('self').updateValueAndValidity();
      form.get('couple').clearValidators(); form.get('couple').updateValueAndValidity();
      form.get('father').clearValidators(); form.get('father').updateValueAndValidity();
      form.get('mother').clearValidators(); form.get('mother').updateValueAndValidity();
      form.get('child1').clearValidators(); form.get('child1').updateValueAndValidity();
      form.get('child2').clearValidators(); form.get('child2').updateValueAndValidity();
      form.get('child3').clearValidators(); form.get('child3').updateValueAndValidity();
    } else {
      form.get('self').setValidators([Validators.required]); form.get('self').updateValueAndValidity();
      form.get('couple').setValidators([Validators.required]); form.get('couple').updateValueAndValidity();
      form.get('father').setValidators([Validators.required]); form.get('father').updateValueAndValidity();
      form.get('mother').setValidators([Validators.required]); form.get('mother').updateValueAndValidity();
      form.get('child1').setValidators([Validators.required]); form.get('child1').updateValueAndValidity();
      form.get('child2').setValidators([Validators.required]); form.get('child2').updateValueAndValidity();
      form.get('child3').setValidators([Validators.required]); form.get('child3').updateValueAndValidity();
    }
  }

  // Ajax Dropdown
  title() {
    return this.ajax.post(URLS.GET_TITLE, {}, res => {
      // this.titleList = res.json().data;
      return res.json().data;
    });
  }

  // Ajax Dropdown
  hospital = () => {
    const url = 'ia/int12/07/01/02/hospital';
    return this.ajax.get(url, res => {
      // this.hospitalList = res.json();
      return res.json().data;
    });
  }

  error(control) {
    return this.medicalWelfareForm.get(control).invalid && this.submittedFlag;
  }

  errorReceipt(index, control) {
    return this.receipts.at(index).get(control).invalid && this.submittedFlag;
  }

  canDisabled(ref, control) {
    if (this.medicalWelfareForm.get(ref).value) {
      this.medicalWelfareForm.get(control).enable();
      this.medicalWelfareForm.get(control).setValidators([Validators.required]);
      this.medicalWelfareForm.get(control).updateValueAndValidity();
      return false;
    }
    return true;
  }

  goLocation() {
    this.router.navigate(['/int12/07/01'], {
      queryParams: {
        page: '2',
      }
    });
  }

  convertToNumber(strNumber: any) {
    if (!strNumber) {
      return strNumber;
    }
    return Number(strNumber.toString().replace(/\,/g, ''));
  }

}

class MedicalReceipt {
  receiptId: number;
  receiptNo: string;
  receiptAmount: number;
  receiptType: string;
  receiptDate: Date;
  id: number;
}
