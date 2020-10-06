import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb, ResponseData } from 'models/index';
import * as moment from 'moment';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';
import { Ope01010610Vo } from '../ope01010610/ope01010610vo.model';

declare var $: any;
const URL = {
  GET_DETAILS: "oa/01/01/06/02/detail",
  PUT_UPDATE: "oa/01/01/06/02/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope01010602',
  templateUrl: './ope01010602.component.html',
  styleUrls: ['./ope01010602.component.css']
})

export class Ope01010602Component implements OnInit {
  submitted: boolean = false;
  forms: FormGroup;
  form: FormControl;
  flagOtherPaymentType: boolean = false;
  data: Ope01010610Vo = null;
  details: FormArray = new FormArray([]);
  breadcrumb: BreadCrumb[] = [];
  fromData: Ope010106Vo = null;
  lubrID: string;
  id:string;
  buttons: Ope010106ButtonVo = null;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.initVariable();
    this.addDetail();
    this.lubrID = this.route.snapshot.queryParams["oaHydrocarbDtlId"] || "";
    this.id = this.route.snapshot.queryParams["id"] || "";

    this.getLubricantsDetail();
    this.forms = new FormGroup({
      // dateFrom:new FormControl(null, Validators.required),
      // dateto:new FormControl(null, Validators.required),
      employeeTemporary: new FormControl(null, Validators.required),
      employeePermanent: new FormControl(null, Validators.required),
      workingStartDate: new FormControl(null, Validators.required),
      workingEndDate: new FormControl(null, Validators.required),
      officeRentAmount: new FormControl(null),
      officePlaceOwner: new FormControl('Y'),
      orderType: new FormControl('M'),
      orderPayMethod: new FormControl('C'),
      workdayPermonth: new FormControl(null, Validators.required),
      numberOfTank: new FormControl(null, Validators.required),
      tankCapacity: new FormControl(null, Validators.required),
      numberUtility: new FormControl(null, Validators.required),
      payMethodOther: new FormControl(null)
    });

    this.getButtonId();

  }
  ngAfterViewInit(): void {
    this.calendar();
  }

  calendar() {
    $('#startCld').calendar({
      endCalendar: $('#endCld'),
      type: 'date',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.forms.get('workingStartDate').patchValue(date);
      }
    }).calendar("set date", this.forms.value.workingStartDate);

    $("#endCld").calendar({
      startCalendar: $('#startCld'),
      type: 'date',
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date, text) => {
        this.forms.get('workingEndDate').patchValue(date);
      }
    }).calendar("set date", this.forms.value.workingEndDate);

  }

  initVariable = () => {
    this.forms = this.fb.group({
      details: this.fb.array([])
    });
  }

  addDetail() {
    this.details = this.forms.get('details') as FormArray;
    this.details.push(this.fb.group({
      placeKeepHC: ['']
    }));
  }

  getLubricantsDetail() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.lubrID}`).subscribe((response: ResponseData<Ope010106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.fromData = response.data;
        this.forms.patchValue({
          employeeTemporary: response.data.employeeTemporary,
          employeePermanent: response.data.employeePermanent,
          workingStartDate: response.data.workingStartDate,
          workingEndDate: response.data.workingEndDate,
          officeRentAmount: response.data.officeRentAmount,
          officePlaceOwner: response.data.officePlaceOwner,
          orderType: response.data.orderType,
          orderPayMethod: response.data.orderPayMethod,
          workdayPermonth: response.data.workdayPermonth,
          numberOfTank: response.data.numberOfTank,
          tankCapacity: response.data.tankCapacity,
          numberUtility: response.data.numberUtility,
          payMethodOther: response.data.payMethodOther
        });
        setTimeout(() => {
          const dateS: Date = this.forms.value.workingStartDate ? new Date(this.forms.value.workingStartDate) : new Date();
          $('#startCld').calendar('set date', moment(dateS).toDate());
          const dateE: Date = this.forms.value.workingEndDate ? new Date(this.forms.value.workingEndDate) : new Date();
          $('#endCld').calendar('set date', moment(dateE).toDate());
        }, 200);
        this.loading = false;
      } else {
        this.loading = false;
      }

    })
  }

  getButtonId() {
    // this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope01010610Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.data = res.data;
          } else {
            this.msg.errorModal(res.message);
          }
        });
        // this.loading = false;
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    })
  }

  deleteDetail(index: number) {
    this.details = this.forms.get('details') as FormArray;
    this.details.removeAt(index);
  }

  //function check validator
  validateField(value: string) {
    return this.forms.get(value).invalid && (this.forms.get(value).touched || this.submitted);
  }

  save() {
    this.submitted = true;
    if (this.forms.valid) {
      this.fromData.officePlaceOwner = this.forms.value.officePlaceOwner;
      this.fromData.employeeTemporary = this.forms.value.employeeTemporary;
      this.fromData.employeePermanent = this.forms.value.employeePermanent;
      this.fromData.workingStartDate = this.forms.value.workingStartDate;
      this.fromData.workingEndDate = this.forms.value.workingEndDate;
      this.fromData.officeRentAmount = this.forms.value.officeRentAmount;
      this.fromData.orderType = this.forms.value.orderType;
      this.fromData.orderPayMethod = this.forms.value.orderPayMethod;
      this.fromData.workdayPermonth = this.forms.value.workdayPermonth;
      this.fromData.numberOfTank = this.forms.value.numberOfTank;
      this.fromData.tankCapacity = this.forms.value.tankCapacity;
      this.fromData.numberUtility = this.forms.value.numberUtility;
      this.fromData.payMethodOther = this.forms.value.payMethodOther;
      // this.fromData.officePlaceOwner  = this.forms.value.officePlaceOwner;

      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.lubrID}`, this.fromData).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    }
  }


  changePaymentOther(flag: number) {
    if (flag == 1) {
      this.flagOtherPaymentType = true;
    } else {
      this.flagOtherPaymentType = false;
    }

  }

}
