import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Observable } from 'rxjs/internal/Observable';
import { ComboBox } from 'models/combobox.model';
import { Int12070101Service } from './int12070101.service';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
// import moment = require('moment');
import * as moment from 'moment';

import { Utils } from 'helpers/utils';
import { UserModel } from 'models/user.model';
import thaibath from 'helpers/thaibath';

declare var $: any;
@Component({
  selector: 'app-int12070101',
  templateUrl: './int12070101.component.html',
  styleUrls: ['./int12070101.component.css'],
  providers: [Int12070101Service]
})
export class Int12070101Component implements OnInit, AfterViewInit {


  userProfile: UserModel;
  rentHouseForm: FormGroup;
  breadcrumb: BreadCrumb[];
  submitted = false;
  titles: Observable<ComboBox>;
  auth: any;
  loadingUL = false;
  tableUpload: any = [];
  flgOnLoad = true;
  monthStart: any;
  receiptsRH: FormArray = new FormArray([]);
  rentHouseId: any;
  text0: string;
  text1: string;
  text2: string;
  id: any;
  constructor(
    private selfService: Int12070101Service,
    private authService: AuthService,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.setVariable();
    this.breadcrumb = [
      { label: 'ตรวจสอบภายใน', route: '#' },
      { label: 'บันทึกข้อมูล', route: '#' },
      { label: 'คำขอเบิก', route: '#' },
      { label: 'ข้อมูลคำขอเบิก', route: '#' },
      { label: 'บันทึกคำขอเบิกเงินค่าเช่าบ้าน (แบบ 6006)', route: '#' }
    ];
  }

  ngOnInit() {

    // this.authService.reRenderVersionProgram('INT-06111').then(obj => {
    //   // this.rentHouseForm.patchValue({
    //   //   name: obj.fullName,
    //   //   position: obj.title,
    //   //   affiliation: '-'
    //   // });
    // });
    this.rentHouseId = this.route.snapshot.queryParams['id'];
    if (this.rentHouseId) {
      this.setvValueFormSearch();
      this.id = this.rentHouseId;
    }
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown ai').css('width', '100%');

  }

  ngAfterViewInit(): void {
    this.calendar();
    console.log('this.rentHouseForm.value', this.rentHouseForm.value);
  }

  async setvValueFormSearch() {
    console.log('data res from search');
    const data: any = await this.selfService.onSerchById(this.rentHouseId);
    this.rentHouseForm.patchValue(data);
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    data.receiptsRH.forEach(() => {
      this.removeReceiptRH(0);
    });
    data.receiptsRH.forEach(element => {
      this.addReceiptRH(element);
    });
    this.typeNumber0(this.rentHouseForm.value.billAmount);
    this.typeNumber(this.rentHouseForm.value.salary);
    this.showSalary(this.rentHouseForm.value.notOver);
    // this.rentHouseForm.patchValue({ totalWithdraw: data.})
  }

  setVariable() {
    this.userProfile = this.authService.getUserDetails();
    this.rentHouseForm = this.fb.group({
      name: [`${this.userProfile.userThaiName} ${this.userProfile.userThaiSurname}`, Validators.required],
      position: [this.userProfile.title, Validators.required],
      affiliation: [this.userProfile.departmentName, Validators.required],
      paymentCost: ['', Validators.required],
      paymentFor: ['', Validators.required],
      period: ['', Validators.required],
      refReceipts: ['', Validators.required],
      billAmount: ['', Validators.required],
      salary: ['', Validators.required],
      // requestNo: ['', Validators.required],
      notOver: ['', Validators.required],
      periodWithdraw: ['', Validators.required],
      periodWithdrawTo: ['', Validators.required],
      totalMonth: ['', Validators.required],
      totalWithdraw: ['', Validators.required],
      receipts: [0, Validators.required],
      form6005no: [, Validators.maxLength(150)],
      receiptsRH: this.fb.array([])
    });
  }

  calendar = function () {
    $('#periodCld').calendar({
      // minDate: new Date(),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('monthOnly'),
      onChange: (date, ddmmyyyy) => {
        this.rentHouseForm.patchValue({ period: ddmmyyyy });
      }
    });

    $('#periodWithdrawCldform').calendar({
      // minDate: new Date(),
      endCalendar: $('#periodWithdrawCldto'),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('monthOnly'),
      onChange: (date, ddmmyyyy) => {
        this.monthStart = date;
        this.rentHouseForm.patchValue({
          periodWithdraw: ddmmyyyy
        });
      }
    });

    $('#periodWithdrawCldto').calendar({
      // minDate: new Date(),
      startCalendar: $('#periodWithdrawCldform'),
      type: 'month',
      text: TextDateTH,
      formatter: formatter('monthOnly'),
      onChange: (date, ddmmyyyy) => {
        const amountMonth = Math.round(moment(date).diff(this.monthStart, 'months', true)) + 1;
        this.rentHouseForm.get('totalMonth').setValue(amountMonth);
        this.rentHouseForm.patchValue({
          periodWithdrawTo: ddmmyyyy
        });

        // sum totalWithdraw
        const salary = this.rentHouseForm.get('salary').value;
        // let totalMonth = this.rentHouseForm.get('totalMonth').value;
        this.rentHouseForm.get('totalWithdraw').setValue(Number(salary) * Number(amountMonth));
      }
    });
  };

  // func check validator
  validateField(value: string) {
    return this.submitted && this.rentHouseForm.get(value).errors;
  }

  cbLoading = param => {
    this.loadingUL = param;
  }

  save(e) {
    e.preventDefault();
    this.submitted = true;
    // stop here if form is invalid
    if (this.rentHouseForm.invalid) {
      this.msg.errorModal('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    this.msg.comfirm(confirm => {
      if (confirm) {
        this.loadingUL = true;
        this.selfService.save(this.rentHouseForm.value, this.cbLoading);
      }
    }, 'ยืนยันการบันทึกข้อมูล');
  }

  typeNumber0(e) {
    this.text0 = thaibath.ArabicNumberToText(e);
  }

  typeNumber(e) {
    // return Utils.onlyNumber(e);
    console.log(e);
    this.text1 = thaibath.ArabicNumberToText(e);
  }

  addReceiptRH(dataAdd?) {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    const form = this.rentHouseForm.get('receipts');
    const index = this.receiptsRH.controls.length;
    form.setValue(Number(form.value) + 1);
    if (!dataAdd) {
      this.receiptsRH.push(this.fb.group({
        receiptNo: ['', Validators.required],
        receiptAmount: ['', Validators.required],
        receiptDate: ['', Validators.required],
      }));
    }
    if (dataAdd) {
      this.receiptsRH.push(this.fb.group({
        receiptNo: [dataAdd.receiptNo, Validators.required],
        receiptAmount: [dataAdd.receiptAmount, Validators.required],
        receiptDate: [dataAdd.receiptDate, Validators.required],
      }));
    }
    setTimeout(() => {
      $(`#receiptD${index}`).calendar({
        type: 'date',
        text: TextDateTH,
        formatter: formatter('day-month-year'),
        onChange: (date, text) => {
          this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
          this.receiptsRH.at(index).get(`receiptDate`).setValue(text);
        }
      });
    }, 400);
  }

  removeReceiptRH(index) {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    const form = this.rentHouseForm.get('receipts');
    form.setValue(Number(form.value) - 1);
    this.receiptsRH.removeAt(index);
  }

  errorReceipt(index, control) {
    this.receiptsRH = this.rentHouseForm.get('receiptsRH') as FormArray;
    return this.receiptsRH.at(index).get(control).invalid;
  }

  onUpload(e) {
    e.preventDefault();
    if ($('#files').val() === '') {
      this.msg.errorModal('กรุณาเลือกไฟล์อัปโหลด');
    } else {
      this.selfService.onUpload().then(data => {
        this.tableUpload = data;
      });
    }
  }

  onChangeFile() {
    this.flgOnLoad = false;
  }

  onDel(index: number) {
    this.loadingUL = true;
    this.selfService.onDel(index);
    setTimeout(() => {
      this.loadingUL = false;
    }, 300);
  }

  showSalary(e) {
    this.rentHouseForm.get('notOver').setValue(e);
    this.text2 = thaibath.ArabicNumberToText(e);
  }

  goLocation() {
    this.router.navigate(['/int12/07/01'], {
      queryParams: {
        page: '1',
      }
    });
  }

  export() {
    this.selfService.exportReport(this.id);
  }
}
