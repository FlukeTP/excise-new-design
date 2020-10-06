import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { ResponseData } from 'models/index';
import * as moment from 'moment';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope01010610Vo } from '../ope01010610/ope01010610vo.model';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';

declare var $: any;

const URL = {
  GET_DETAILS: "oa/01/01/06/07/detail",
  PUT_UPDATE: "oa/01/01/06/07/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope01010607',
  templateUrl: './ope01010607.component.html',
  styleUrls: ['./ope01010607.component.css']
})
export class Ope01010607Component implements OnInit {

  id: string = "";
  lubrID: string = "";
  loading: boolean = false;
  submitted: boolean = false;
  ope01010607: Ope010106Vo = null;
  data: Ope01010610Vo = null;
  buttons: Ope010106ButtonVo = null;
  form: FormGroup = new FormGroup({});
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
      buyFromAgent: [false, Validators.required],
      buyFromApproveM: ['Y'],
      buyFromApproveA: [''],

      sellToAgent: [true, Validators.required],
      sellToUser: [false, Validators.required],
      sellToApproveA: ['Y'],
      sellToApproveU: [''],

      sellMethodAgent: [true],
      sellMethodUser: [false],
      hasTransportOil: ['Y'],
      conclusionText: ['']
    });
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

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      this.ope01010607.agentStartDate = moment(this.form.value.monthStart).toDate();
      this.ope01010607.agentEndDate = moment(this.form.value.monthEnd).toDate();
      this.ope01010607.agentOverlimit = this.form.value.moreThanApprove;
      // Buy
      this.ope01010607.abuyFromIndust = this.isTrue(this.form.value.buyFromIndust);
      this.ope01010607.abuyFromAgent = this.isTrue(this.form.value.buyFromAgent);
      this.ope01010607.abuyIndustLicense = this.form.value.buyFromApproveM;
      this.ope01010607.abuyAgentLicense = this.form.value.buyFromApproveA;
      // Sell
      this.ope01010607.asaleToAgent = this.isTrue(this.form.value.sellToAgent);
      this.ope01010607.asaleToUser = this.isTrue(this.form.value.sellToUser);
      this.ope01010607.asaleAgentLicense = this.form.value.sellToApproveA;
      this.ope01010607.asaleUserLicense = this.form.value.sellToApproveU;
      // Sell Method
      this.ope01010607.sentToAgent = this.isTrue(this.form.value.sellMethodAgent);
      this.ope01010607.sentToUser = this.isTrue(this.form.value.sellMethodUser);
      this.ope01010607.aimporterLicense = this.form.value.hasTransportOil;
      this.ope01010607.agentRemark = this.form.value.conclusionText;
      const data: Ope010106Vo = this.ope01010607;
      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.id}`, data).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.ope01010607 = response.data;
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
        this.loading = false;
      });
    }
  }

  invalid(control: string) {
    return this.form.get(control).invalid && (this.form.get(control).touched || this.submitted);
  }

  calendar() {
    const date = { dateStart: { min: new Date(), max: new Date() }, dateEnd: { min: new Date(), max: new Date() } };
    date.dateEnd.min.setMonth(0); date.dateStart.min.setMonth(0);
    date.dateEnd.max.setMonth(11); date.dateStart.max.setMonth(11);
    $("#startCld").calendar({
      endCalendar: $('#endCld'),
      type: "date", text: TextDateTH, formatter: formatter('วดป'),
      onChange: (date: Date, text) => {
        this.form.get('monthStart').patchValue(date);
      }
    }).css('width', '100%');
    $("#endCld").calendar({
      startCalendar: $('#startCld'),
      type: "date", text: TextDateTH, formatter: formatter('วดป'),
      onChange: (date: Date, text) => {
        this.form.get('monthEnd').patchValue(date);
      }
    }).css('width', '100%');
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
  toggleSellToUser(event) {
    if (event.target.checked) {
      this.form.get('sellToApproveU').patchValue('Y');
    } else {
      this.form.get('sellToApproveU').patchValue('');
    }
  }
  toggleSellToAgent(event) {
    if (event.target.checked) {
      this.form.get('sellToApproveA').patchValue('Y');
    } else {
      this.form.get('sellToApproveA').patchValue('');
    }
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
        this.ope01010607 = response.data;
        this.form.patchValue({
          monthStart: this.ope01010607.agentStartDate,
          monthEnd: this.ope01010607.agentEndDate,
          moreThanApprove: this.ope01010607.agentOverlimit,
          // buy
          buyFromIndust: this.isY(this.ope01010607.abuyFromIndust),
          buyFromAgent: this.isY(this.ope01010607.abuyFromAgent),
          buyFromApproveM: this.ope01010607.abuyIndustLicense,
          buyFromApproveA: this.ope01010607.abuyAgentLicense,
          // sell
          sellToAgent: this.isY(this.ope01010607.asaleToAgent),
          sellToUser: this.isY(this.ope01010607.asaleToUser),
          sellToApproveA: this.ope01010607.asaleAgentLicense,
          sellToApproveU: this.ope01010607.asaleUserLicense,
          // sell method
          sellMethodAgent: this.isY(this.ope01010607.sentToAgent),
          sellMethodUser: this.isY(this.ope01010607.sentToUser),
          hasTransportOil: this.ope01010607.aimporterLicense,
          conclusionText: this.ope01010607.agentRemark
        });
        setTimeout(() => {
          const dateS: Date = this.ope01010607.agentStartDate ? new Date(this.ope01010607.agentStartDate) : new Date();
          $('#startCld').calendar('set date', moment(dateS).toDate());
          const dateE: Date = this.ope01010607.agentEndDate ? new Date(this.ope01010607.agentEndDate) : new Date();
          $('#endCld').calendar('set date', moment(dateE).toDate());
        }, 200);
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
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