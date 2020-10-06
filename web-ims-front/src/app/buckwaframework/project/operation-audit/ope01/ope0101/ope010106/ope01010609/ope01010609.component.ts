import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { ResponseData } from 'models/index';
import * as moment from 'moment';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope01010610Vo } from '../ope01010610/ope01010610vo.model';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';

declare var $: any;

const URL = {
  GET_DETAILS: "oa/01/01/06/09/detail",
  PUT_UPDATE: "oa/01/01/06/09/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope01010609',
  templateUrl: './ope01010609.component.html',
  styleUrls: ['./ope01010609.component.css']
})
export class Ope01010609Component implements OnInit {

  id: string = "";
  lubrID: string = "";
  loading: boolean = false;
  submitted: boolean = false;
  form: FormGroup = new FormGroup({});
  formArray: FormArray = new FormArray([]);
  deleArray: FormArray = new FormArray([]);
  ope01010609: Ope010106Vo = null;
  data: Ope01010610Vo = null;
  buttons: Ope010106ButtonVo = null;
  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.form = this.fb.group({
      monthStart: ['', Validators.required],
      monthEnd: ['', Validators.required],
      moreThanApprove: ['N', Validators.required],
      buyFromIndust: [true, Validators.required],
      buyFromImporter: [false, Validators.required],
      buyFromAgent: [false, Validators.required],
      buyFromApproveM: ['Y'],
      buyFromApproveA: [''],
      buyFromApproveI: [''],
      usedType: [false],
      usedRemark: [''],
      salerType: [false],
      salerCapacity: [''],
      sellForCount: [0],
      decent: ['Y', Validators.required],
      conclusionText: [''],
      formArray: this.fb.array([]),
      deleArray: this.fb.array([]),
    });
    this.formArray = this.form.get('formArray') as FormArray;
    this.deleArray = this.form.get('deleArray') as FormArray;
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams["oaHydrocarbDtlId"] || "";
    this.lubrID = this.route.snapshot.queryParams["id"] || "";
    if (this.id && this.lubrID) {
      this.loadingDetail();
      this.getButtonId();
    }
  }

  ngAfterViewInit() {
    this.calendar();
  }

  addFormArray() {
    this.formArray = this.form.get('formArray') as FormArray;
    this.formArray.push(this.fb.group({
      oaHydrocarbCustId: [null],
      oaHydrocarbId: [null],
      custName: ['', Validators.required],
      address: ['', Validators.required],
      mobile: ['', Validators.required],
    }));
    const count: number = this.formArray.length;
    this.form.get('sellForCount').patchValue(count);
  }

  usedTypeChange(event) {
    if (event.target.checked) {
      this.form.get('usedRemark').patchValue('');
    } else {
      this.form.get('usedRemark').patchValue('');
    }
  }

  salerTypeChange(event) {
    if (event.target.checked) {
      this.form.get('salerCapacity').patchValue('');
      this.form.get('salerCapacity').setValidators([Validators.required]);
      this.form.get('salerCapacity').updateValueAndValidity();
      this.form.get('sellForCount').patchValue(1);
      this.form.get('sellForCount').setValidators([Validators.required]);
      this.form.get('sellForCount').updateValueAndValidity();
      this.addFormArray();
    } else {
      this.form.get('salerCapacity').patchValue('');
      this.form.get('salerCapacity').clearValidators();
      this.form.get('salerCapacity').updateValueAndValidity();
      this.form.get('sellForCount').patchValue(null);
      this.form.get('sellForCount').clearValidators();
      this.form.get('sellForCount').updateValueAndValidity();
      this.formArray = this.form.get('formArray') as FormArray;
      this.deleArray = this.form.get('deleArray') as FormArray;
      const length: number = this.formArray.length;
      for (let i = length; i >= 0; i--) {
        if (this.formArray.at(i) && this.formArray.at(i).get('oaHydrocarbCustId').value) {
          this.deleArray.push(this.formArray.at(i));
        }
        this.formArray.removeAt(i);
      }
    }
  }

  sellForCountRemove(index: number) {
    if (event) {
      if (index != -1) {
        this.formArray = this.form.get('formArray') as FormArray;
        this.deleArray = this.form.get('deleArray') as FormArray;
        if (this.formArray.at(index).get('oaHydrocarbCustId').value != null) {
          this.deleArray.push(this.formArray.at(index));
        }
        this.formArray.removeAt(index);
        const count: number = this.formArray.length;
        this.form.get('sellForCount').patchValue(count);
      }
    }
  }

  sellForCountKey() {
    const value: number = this.form.get('sellForCount').value;
    if (value) {
      this.formArray = this.form.get('formArray') as FormArray;
      const length: number = this.formArray.length;
      for (let i = length; i >= 0; i--) {
        this.formArray.removeAt(i);
      }
      for (let i = 0; i < value; i++) {
        this.addFormArray();
      }
    } else {
      this.formArray = this.form.get('formArray') as FormArray;
      const length: number = this.formArray.length;
      for (let i = length; i >= 0; i--) {
        this.formArray.removeAt(i);
      }
    }
  }

  save() {
    this.submitted = true;
    console.log(this.form.value);
    if (this.form.valid) {
      this.loading = true;
      this.ope01010609.useStartDate = moment(this.form.value.monthStart).toDate();
      this.ope01010609.useEndDate = moment(this.form.value.monthEnd).toDate();
      this.ope01010609.buyOverlimit = this.form.value.moreThanApprove;
      // Buy
      this.ope01010609.buyFromIndust = this.isTrue(this.form.value.buyFromIndust);
      this.ope01010609.buyFromAgent = this.isTrue(this.form.value.buyFromAgent);
      this.ope01010609.buyFromImporter = this.isTrue(this.form.value.buyFromImporter);
      this.ope01010609.buyIndustLicense = this.form.value.buyFromApproveM;
      this.ope01010609.buyAgentLicense = this.form.value.buyFromApproveA;
      this.ope01010609.buyImporterLicense = this.form.value.buyFromApproveI;
      // Type
      this.ope01010609.usedType = this.isTrue(this.form.value.usedType);
      this.ope01010609.usedRemark = this.form.value.usedRemark;
      this.ope01010609.salerType = this.isTrue(this.form.value.salerType);
      this.ope01010609.salerCapacity = this.form.value.salerCapacity;
      this.ope01010609.numOfCust = this.form.value.sellForCount;
      // Other
      this.ope01010609.otherRemark = this.form.value.conclusionText;
      this.ope01010609.goodQuality = this.form.value.decent;
      // Customers
      this.formArray = this.form.get('formArray') as FormArray;
      this.deleArray = this.form.get('deleArray') as FormArray;
      this.ope01010609.customers = this.formArray.value;
      this.ope01010609.custdeles = this.deleArray.value;
      const data: Ope010106Vo = this.ope01010609;
      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.id}`, data).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.ope01010609 = response.data;
          if (this.ope01010609.customers) {
            const lengthF: number = this.formArray.length;
            for (let i = lengthF; i >= 0; i--) {
              this.formArray.removeAt(i);
            }
            const lengthD: number = this.deleArray.length;
            for (let i = lengthD; i >= 0; i--) {
              this.deleArray.removeAt(i);
            }
            for (let i = 0; i < this.ope01010609.customers.length; i++) {
              this.addFormArray();
              this.formArray = this.form.get('formArray') as FormArray;
              this.formArray.at(this.formArray.length - 1).patchValue(this.ope01010609.customers[i]);
            }
          }
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;
      });
    }
  }

  toggleBuyFromIndust(event) {
    if (event.target.checked) {
      this.form.get('buyFromApproveM').patchValue('Y');
    } else {
      this.form.get('buyFromApproveM').patchValue('');
    }
  }
  toggleBuyFromAgent(event) {
    if (event.target.checked) {
      this.form.get('buyFromApproveA').patchValue('Y');
    } else {
      this.form.get('buyFromApproveA').patchValue('');
    }
  }
  toggleBuyFromImporter(event) {
    if (event.target.checked) {
      this.form.get('buyFromApproveI').patchValue('Y');
    } else {
      this.form.get('buyFromApproveI').patchValue('');
    }
  }

  invalid(control: string) {
    return this.form.get(control).invalid && (this.form.get(control).touched || this.submitted);
  }

  invalidArr(control: string, index: number) {
    this.formArray = this.form.get('formArray') as FormArray;
    if (index != -1) {
      return this.formArray.at(index).get(control).invalid && (this.formArray.at(index).get(control).touched || this.submitted);
    }
    return false;
  }

  calendar = () => {
    const date = { dateStart: { min: new Date(), max: new Date() }, dateEnd: { min: new Date(), max: new Date() } };
    date.dateEnd.min.setMonth(0); date.dateStart.min.setMonth(0);
    date.dateEnd.max.setMonth(11); date.dateStart.max.setMonth(11);
    $("#date1").calendar({
      endCalendar: $('#date2'),
      type: "date", text: TextDateTH, formatter: formatter('วดป'),
      onChange: (date: Date, text) => {
        this.form.get('monthStart').patchValue(date);
      }
    }).css('width', '100%');
    $("#date2").calendar({
      startCalendar: $('#date1'),
      type: "date", text: TextDateTH, formatter: formatter('วดป'),
      onChange: (date: Date, text) => {
        this.form.get('monthEnd').patchValue(date);
      }
    }).css('width', '100%');
  }

  getButtonId() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.lubrID}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        setTimeout(() => { this.loading = false }, 200);
      } else {
        this.msg.errorModal(response.message);
      }
    })
  }

  loadingDetail() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.id}`).subscribe((response: ResponseData<Ope010106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.ope01010609 = response.data;
        this.form.patchValue({
          monthStart: this.ope01010609.useStartDate,
          monthEnd: this.ope01010609.useEndDate,
          moreThanApprove: this.ope01010609.buyOverlimit,
          // Buy
          buyFromAgent: this.isY(this.ope01010609.buyFromAgent),
          buyFromIndust: this.isY(this.ope01010609.buyFromIndust),
          buyFromImporter: this.isY(this.ope01010609.buyFromImporter),
          buyFromApproveA: this.ope01010609.buyAgentLicense,
          buyFromApproveM: this.ope01010609.buyIndustLicense,
          buyFromApproveI: this.ope01010609.buyImporterLicense,
          // UseIn
          usedType: this.isY(this.ope01010609.usedType),
          usedRemark: this.ope01010609.usedRemark,
          salerType: this.isY(this.ope01010609.salerType),
          salerCapacity: this.ope01010609.salerCapacity,
          sellForCount: this.ope01010609.numOfCust,
          // Other
          decent: this.ope01010609.goodQuality,
          conclusionText: this.ope01010609.otherRemark,
        });
        if (this.ope01010609.customers) {
          for (let i = 0; i < this.ope01010609.customers.length; i++) {
            this.addFormArray();
            this.formArray = this.form.get('formArray') as FormArray;
            this.formArray.at(this.formArray.length - 1).patchValue(this.ope01010609.customers[i]);
          }
        }
        setTimeout(() => {
          const dateS: Date = this.ope01010609.useStartDate ? new Date(this.ope01010609.useStartDate) : new Date();
          $('#date1').calendar('set date', moment(dateS).toDate());
          const dateE: Date = this.ope01010609.useEndDate ? new Date(this.ope01010609.useEndDate) : new Date();
          $('#date2').calendar('set date', moment(dateE).toDate());
        }, 200);
      } else {
        this.msg.errorModal(response.message);
      }
      setTimeout(() => { this.loading = false }, 200);
    })
  }

  private isY(value: string): boolean {
    if (value && value == "Y") {
      return true;
    }
    return false;
  }

  private isTrue(value: boolean): string {
    if (value) {
      return "Y";
    }
    return "N";
  }

}
