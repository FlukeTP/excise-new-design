import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Int12040101Service } from './int12040101.service';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { BreadCrumb } from 'models/breadcrumb.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { UserModel } from 'models/user.model';
import { AuthService } from 'services/auth.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { async } from 'rxjs/internal/scheduler/async';
import { log } from 'util';
import { ResponseData } from 'models/response-data.model';

declare let $: any;
@Component({
  selector: 'app-int12040101',
  templateUrl: './int12040101.component.html',
  styleUrls: ['./int12040101.component.css'],
  providers: [Int12040101Service]
})

// tslint:disable:max-line-length

export class Int12040101Component implements OnInit, AfterViewInit, AfterViewChecked {
  submitted = false;
  breadcrumb: BreadCrumb[];
  loading = false;
  chartOfAccList: any;
  formSave: FormGroup = new FormGroup({});
  iaExpensesD1: FormArray = new FormArray([]);
  id: string;
  userProfile: UserModel;
  sector: any;
  sectorSelect: string;
  areaSelect: string;
  sectorList: any;
  araeList: any;
  officeCode: String;
  delete: number[] = [];
  constructor(
    // tslint:disable-next-line: no-shadowed-variable
    private selfService: Int12040101Service,
    private iaService: IaService,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageBarService,
    private ajax: AjaxService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.userProfile = this.authService.getUserDetails();
    // this.breadcrumb = [
    //   { label: 'ตรวจสอบภายใน', route: '#' },
    //   { label: 'บันทึกข้อมูล', route: '#' },
    //   { label: 'ค่าใช้จ่าย', route: '#' },
    //   { label: 'ข้อมูลค่าใช้จ่าย', route: '#' },
    //   { label: 'เพิ่มข้อมูลค่าใช้จ่าย', route: '#' },
    // ];
    this.formSave = this.fb.group({
      id: [null],
      accountId: ['', Validators.required],
      accountName: ['', Validators.required],

      serviceReceive: [0, Validators.required],
      serviceWithdraw: [0, Validators.required],
      serviceBalance: [0, Validators.required],
      suppressReceive: [0, Validators.required],
      suppressWithdraw: [0, Validators.required],
      suppressBalance: [0, Validators.required],
      budgetReceive: [0, Validators.required],
      budgetWithdraw: [0, Validators.required],
      budgetBalance: [0, Validators.required],
      sumReceive: [0, Validators.required],
      sumWithdraw: [0, Validators.required],
      sumBalance: [0, Validators.required],
      moneyBudget: [0, Validators.required],
      moneyOut: [0, Validators.required],
      averageCost: [0],
      averageGive: [],
      averageFrom: [0],
      averageComeCost: [],
      note: [],

      officeCode: [, Validators.required],
      officeDesc: [, Validators.required],


      averageCostOut: [0],
      averageGiveOut: [],
      averageFromOut: [0],
      averageComeCostOut: [],
      expenseDateStr: [, Validators.required],

      area: [, Validators.required],
      iaExpensesD1: this.fb.array([])
    });
  }

  ngOnInit() {
    let status = 'เพิ่มข้อมูลค่าใช้จ่าย';
    this.id = this.route.snapshot.queryParams['id'];
    if (this.id) {
      this.findExpensesById(this.id);
      status = 'แก้ไขข้อมูลค่าใช้จ่าย';
    } else {
      this.addDetail();
    }

    this.breadcrumb = [
      { label: 'ตรวจสอบภายใน', route: '#' },
      { label: 'ตรวจสอบเบิกจ่าย', route: '#' },
      { label: 'ตรวจสอบค่าใช้จ่าย', route: '#' },
      { label: status, route: '#' },
    ];

    this.getChartOfAcc();
    this.getSectorDtl();
    this.getSector();
  }

  ngAfterViewInit(): void {
    $('.ui.dropdown').dropdown();
    $('.ui.dropdown.ia').css('width', '100%');
    this.calendar();
    if (this.userProfile.officeCode.substring(0, 2) !== '00' && this.userProfile.officeCode.substr(0, 2) !== '99') {
      this.formSave.patchValue({
        officeCode: this.userProfile.officeCode.substr(0, 2) + '0000',
        area: this.userProfile.officeCode
      });
    }

  }

  ngAfterViewChecked(): void {
    // const date = new Date(this.formSave.value.expenseDateStr)
    // this.addDetail();
  }

  changeValidate() {
    if (this.formSave.get('accountId').valid && this.formSave.get('area').valid && this.formSave.get('expenseDateStr').valid) {
      const dataReq = {
        accountId: this.formSave.value.accountId,
        area: this.formSave.value.area,
        expenseDateStr: this.formSave.value.expenseDateStr
      };
      this.loading = true;
      this.selfService.findValidate(dataReq)
        .then((res: ResponseData<any>) => {
          if (res.data.id) {
            const data = this.selfService.setFindValue(res.data, res.data.id);
            this.formSave.patchValue(data);
            this.iaExpensesD1 = this.formSave.get('iaExpensesD1') as FormArray;
            // res.data.iaExpensesD1.forEach(element => {
            //   this.iaExpensesD1.pop();
            // });
            for (let i = 0; i < this.iaExpensesD1.value.length; i++) {
              this.iaExpensesD1.removeAt(0);
            }
            res.data.iaExpensesD1.forEach(element => {
              this.iaExpensesD1.push(this.createDetail(element));
            });
          } else if (this.id) {

          } else {
            this.formSave.patchValue(this.selfService.clearForm());
            this.iaExpensesD1 = this.formSave.get('iaExpensesD1') as FormArray;
            for (let i = 0; i <= this.iaExpensesD1.value.length; i++) {
              this.iaExpensesD1.removeAt(0);
            }
            this.addDetail();
          }

          this.loading = false;
        })
        .catch(() => { this.loading = false; });
      // .finally(() => { this.loading = false })

    }
  }

  async setFromPath() {
    const areaPath = this.route.snapshot.queryParams['area'];
    const officeCode = this.route.snapshot.queryParams['officeCode'];
    if (officeCode) {
      this.formSave.patchValue({ officeCode: officeCode });
      await this.changeSector(this.formSave.value.officeCode);
      $('#sector').dropdown('set selected', this.formSave.value.officeCode);
      if (areaPath) {
        this.formSave.patchValue({ area: areaPath });
        $('#area').dropdown('set selected', areaPath);
      }

    }
  }

  setChartofAcc() {
    const chartOfAcc = this.route.snapshot.queryParams['chartOfAcc'];
    if (chartOfAcc) {
      this.changeChartOfAcc(chartOfAcc, '1');
    }
  }

  async checkOff() {
    if (this.id) {
      const officeCode = this.userProfile.officeCode;
      if (officeCode.substring(0, 2) === '00' || officeCode.substring(0, 2) === '99') {
        const area = this.formSave.value.officeCode;
        if (this.formSave.value.officeCode.substring(0, 2) === '99') {
          this.formSave.patchValue({ officeCode: this.formSave.value.officeCode.substring(0, 2) + '9999' });
        } else if (this.formSave.value.officeCode.substring(0, 2) !== '00') {
          this.formSave.patchValue({ officeCode: this.formSave.value.officeCode.substring(0, 2) + '0000' });
        }
        await this.changeSector(this.formSave.value.officeCode);
        $('#sector').dropdown('set selected', this.formSave.value.officeCode);
        this.formSave.patchValue({ area: area });
        $('#area').dropdown('set selected', area);

      }
    }
  }

  getSector = () => {
    $('#area').dropdown('restore defaults');
    // this.loading = true
    // this.compareForm.patchValue({
    //   sector: null, area: null
    // })
    this.sectorSelect = null;
    this.areaSelect = null;
    this.selfService.sector()
      .then((sectorList) => {
        this.sectorList = sectorList;
        // this.loading = false
        this.setFromPath();
      })
      .catch(() => {
        // this.loading = false
      });
  }

  changeSector = (e) => {
    this.loading = true;
    this.araeList = null;
    // this.compareForm.patchValue({
    //   area: null
    // })
    if (e != null && e !== '') {
      $('#area').dropdown('restore defaults');
      this.selfService.area(e)
        .then((areaList) => {
          this.araeList = areaList;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
  getSectorDtl() {
    this.selfService.getSectorDtl(this.userProfile.officeCode.substring(0, 2)).then((data) => {
      this.sector = data;
    });
  }

  calendar() {
    $('#montBudgetYearCld').calendar({
      type: 'month',
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange: (date, text) => {
        this.formSave.get('expenseDateStr').patchValue(text);
        this.changeValidate();
      }
    }).css('width', '100%');
  }

  findExpensesById(id: string) {
    this.selfService.findExpensesById(id).then((res: any) => {
      this.formSave.patchValue(this.selfService.setFindValue(res, this.id));
      // this.formSave.patchValue({ iaExpensesD1: res.iaExpensesD1 })
      this.iaExpensesD1 = this.formSave.get('iaExpensesD1') as FormArray;
      res.iaExpensesD1.forEach(element => {
        this.iaExpensesD1.push(this.createDetail(element));
      });
      this.officeCode = res.officeCode;
      this.checkOff();
      this.setDate();
    });
  }

  setDate() {
    const dateStr = (this.formSave.value.expenseDateStr).toString().split('/');
    // const dateStr = this.formSave.value.expenseDateStr.replace('/', '-')
    const date = new Date(`${dateStr[0]}-01-${dateStr[1]}`);

    $('#montBudgetYearCld').calendar('set date', date);
    $('#montBudgetYearCld').calendar('refresh');
  }

  onSave() {
    this.submitted = true;
    const offC = this.authService.getUserDetails().officeCode;
    if (offC.substring(0, 2) === '99' || offC.substring(0, 2) === '00') {
      this.formSave.get('officeCode').patchValue(this.formSave.value.area);
      const officeDesc = this.araeList.filter((data) => {
        return data.officeCode === this.formSave.value.officeCode;
      });
      this.formSave.get('officeDesc').patchValue(officeDesc[0].deptName);
    } else if (offC.substring(0, 2) !== '00' && offC.substring(0, 2) !== '99') {
      this.formSave.patchValue({
        officeCode: this.authService.getUserDetails().officeCode,
        officeDesc: this.authService.getUserDetails().departmentName
      });
    }
    if (this.formSave.invalid) {
      this.message.errorModal('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    this.message.comfirm(confirm => {
      if (confirm) {
        this.loading = true;
        const dataSave = this.selfService.setValueSave(this.formSave.value, this.delete);
        this.selfService.onSave(dataSave)
          .then((res: any) => {
            this.submitted = false;
            this.goLocation();
            this.loading = false;
          })
          .catch(() => { this.loading = false; });
      }
    }, 'ยืนยันการบันทึก');
  }

  goLocation() {
    const date = this.formSave.value.expenseDateStr.split('/');
    let year = Number(date[1]);
    if (Number(date[0]) >= 10) {
      --year;
    }
    this.router.navigate(['/int12/04/01'], {
      queryParams: {
        sector: this.formSave.value.officeCode,
        area: this.formSave.value.area,
        accId: this.formSave.value.accountId,
        budgetYear: year
      }
    });
  }

  invalidSaveControl(control: string) {
    return this.formSave.get(control).invalid && (this.formSave.get(control).touched || this.submitted);
  }

  getChartOfAcc() {
    this.loading = true;
    this.selfService.getChartOfAcc().then((res: any) => {
      this.chartOfAccList = res.data;
      this.loading = false;
      this.setChartofAcc();
    });
  }

  changeChartOfAcc(e, flag: string) {
    this.loading = true;
    let data;
    if ('1' === flag) {
      data = this.chartOfAccList.filter(obj => obj.coaCode === e);
    } else if ('2' === flag) {
      data = this.chartOfAccList.filter(obj => obj.coaName === e);
    }

    this.formSave.patchValue({
      accountId: data[0].coaCode,
      accountName: data[0].coaName
    });
    $('#coaCode').dropdown('set selected', data[0].coaCode);
    $('#coaName').dropdown('set selected', data[0].coaName);
    this.loading = false;
    this.changeValidate();
  }

  changeReceive() {
    const sumReceiveto = (((this.convertToNumber(this.formSave.value.serviceReceive)) + (this.convertToNumber(this.formSave.value.suppressReceive)) + (this.convertToNumber(this.formSave.value.budgetReceive))).toFixed(2)).toString();
    const sumReceivefomat = new DecimalFormatPipe().transform(sumReceiveto, '###,###.00');
    const sumWithdrawto = (((this.convertToNumber(this.formSave.value.serviceWithdraw)) + (this.convertToNumber(this.formSave.value.suppressWithdraw)) + (this.convertToNumber(this.formSave.value.budgetWithdraw))).toFixed(2)).toString();
    const sumWithdrawfomat = new DecimalFormatPipe().transform(sumWithdrawto, '###,###.00');
    const serviceBalanceto = (this.convertToNumber(this.formSave.value.serviceReceive) - this.convertToNumber(this.formSave.value.serviceWithdraw)).toFixed(2);
    const serviceBalancefomat = new DecimalFormatPipe().transform(serviceBalanceto.toString(), '###,###.00');
    const suppressBalanceto = (this.convertToNumber(this.formSave.value.suppressReceive) - this.convertToNumber(this.formSave.value.suppressWithdraw)).toFixed(2);
    const suppressBalancefomat = new DecimalFormatPipe().transform(suppressBalanceto.toString(), '###,###.00');
    const budgetBalanceto = (this.convertToNumber(this.formSave.value.budgetReceive) - this.convertToNumber(this.formSave.value.budgetWithdraw)).toFixed(2);
    const budgetBalancefomat = new DecimalFormatPipe().transform(budgetBalanceto.toString(), '###,###.00');

    this.formSave.patchValue({
      sumReceive: sumReceivefomat,
      sumWithdraw: sumWithdrawfomat,
      serviceBalance: serviceBalancefomat,
      suppressBalance: suppressBalancefomat,
      budgetBalance: budgetBalancefomat,
    });

    const sumBalanceto = (this.convertToNumber(serviceBalanceto) + this.convertToNumber(suppressBalanceto) + this.convertToNumber(budgetBalanceto)).toFixed(2);
    const sumBalancefomat = new DecimalFormatPipe().transform(sumBalanceto.toString(), '###,###.00');

    this.formSave.patchValue({
      sumBalance: sumBalancefomat
    });

    const moneyBudgetsum1 = ((this.convertToNumber(serviceBalanceto)) + (this.convertToNumber(suppressBalanceto))).toFixed(2);
    const moneyBudgetsum2 = (this.convertToNumber(this.formSave.value.averageCost) - this.convertToNumber(this.formSave.value.averageFrom)).toFixed(2);
    const moneyBudgetsumAll = (this.convertToNumber(moneyBudgetsum1) - this.convertToNumber(moneyBudgetsum2)).toFixed(2);
    const moneyBudgetsumFomat = new DecimalFormatPipe().transform(moneyBudgetsumAll.toString(), '###,###.00');
    const moneyOutto = ((this.convertToNumber(budgetBalanceto) - this.convertToNumber(this.formSave.value.averageCostOut) + this.convertToNumber(this.formSave.value.averageFromOut)).toFixed(2)).toString();
    const moneyOutFomat = new DecimalFormatPipe().transform(moneyOutto, '###,###.00');

    this.formSave.patchValue({
      moneyBudget: moneyBudgetsumFomat,
      moneyOut: moneyOutFomat
    });
  }

  convertToNumber(strNumber: any) {
    if (!strNumber) {
      return strNumber;
    }
    return Number(strNumber.toString().replace(/\,/g, ''));
  }

  // Add Form to FormArray
  addDetail(): void {
    const index = this.iaExpensesD1.length;
    this.iaExpensesD1 = this.formSave.get('iaExpensesD1') as FormArray;
    this.iaExpensesD1.push(this.createDetail());
  }

  // Initial Form `iaExpensesD1`
  createDetail(obj?): FormGroup {
    const data = obj || {
      id: [],
      averageCost: [0],
      averageGive: ['', [Validators.maxLength(100)]],
      averageFrom: [0],
      averageComeCost: ['', [Validators.maxLength(100)]],
      moneyBudgetType: ['1']
    };
    return this.fb.group(data);
  }

  // Remove Form from FormArray
  delDetail(index: number): void {
    this.iaExpensesD1 = this.formSave.get('iaExpensesD1') as FormArray;
    if (this.id !== '' && this.iaExpensesD1.at(index).get('id').value !== '') {
      this.delete.push(Number(this.iaExpensesD1.at(index).get('id').value));
    }
    this.iaExpensesD1.removeAt(index);
    this.changeCalculate();
  }

  // charge of calculate data
  changeCalculate() {
    // if (e) {e?, i?, flag?
    //   this.iaExpensesD1.at(Number(i)).get(flag).patchValue(e)
    // }
    let sumIn = 0;
    let diffIn = 0;
    let sumOut = 0;
    let diffOut = 0;
    for (let i = 0; i < this.iaExpensesD1.value.length; i++) {
      if (this.iaExpensesD1.value[i].moneyBudgetType === '1') {
        sumIn += Number((this.convertToNumber(this.iaExpensesD1.value[i].averageCost)));
        diffIn += Number((this.convertToNumber(this.iaExpensesD1.value[i].averageFrom)));
      } else if (this.iaExpensesD1.value[i].moneyBudgetType === '2') {
        sumOut += Number((this.convertToNumber(this.iaExpensesD1.value[i].averageCost)));
        diffOut += Number((this.convertToNumber(this.iaExpensesD1.value[i].averageFrom)));
      }

    }
    console.log(sumIn);
    this.formSave.patchValue({
      averageCost: sumIn,
      averageFrom: diffIn,
      averageCostOut: sumOut,
      averageFromOut: diffOut,
    });
    this.changeReceive();
  }
}
