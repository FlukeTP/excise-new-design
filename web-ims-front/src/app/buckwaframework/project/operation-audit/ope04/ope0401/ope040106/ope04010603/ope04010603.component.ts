import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope04010601Vo } from '../ope04010601/ope04010601vo.model';
import { Ope040106ButtonVo, Ope040106Vo } from '../ope040106vo.model';

declare var $: any;

const URL = {
  GET_FIND_CUSTOMER: "oa/04/01/06/customers",
  GET_BUTTONS: "oa/04/01/06/detail",
  GET_DETAILS: "oa/04/01/06/03/detail",
  PUT_UPDATE: "oa/04/01/06/03/save",
}

@Component({
  selector: 'app-ope04010603',
  templateUrl: './ope04010603.component.html',
  styleUrls: ['./ope04010603.component.css']
})
export class Ope04010603Component implements OnInit {
  loading: boolean = false;
  submitted: boolean = false;
  id: string = "";
  forms: FormGroup;
  buttons: Ope040106ButtonVo = null;
  licenseData: Ope04010601Vo = null;
  Ope040106Vo: Ope040106Vo = null;
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.forms = this.fb.group({
      placeStatus: [''],
      placeStatusRemark: [''],
      eqmTankStatus: [''],
      eqmTank: [''],
      eqmTankNum: [''],
      eqmDistilStatus: [''],
      eqmDistil: [''],
      eqmDistilNum: [''],
      eqmPackingStatus: [''],
      eqmPacking: [''],
      eqmPackingNum: [''],
      audit0701: [''],
      audit0701Remark: [''],
      audit07021: [''],
      audit07021Remark: [''],
      audit07022: [''],
      audit07022Remark: [''],
      equipmentUsed: [''],
      equipmentUsedRemark: [''],
      auditOther: [''],
      auditSuggestion: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.getButtonId();
    }
  }

  getButtonId(): void {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope040106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope04010601Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.licenseData = res.data;
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
        });
        this.getDetail();
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  getDetail(): void {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.buttons.oaAlcoholDtlId}`).subscribe((response: ResponseData<Ope040106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.Ope040106Vo = response.data;
        this.forms.patchValue({
          placeStatus: response.data.placeStatus,
          placeStatusRemark: response.data.placeStatusRemark,
          eqmTankStatus: this.isY(response.data.eqmTankStatus),
          eqmTank: response.data.eqmTank,
          eqmTankNum: response.data.eqmTankNum,
          eqmDistilStatus: this.isY(response.data.eqmDistilStatus),
          eqmDistil: response.data.eqmDistil,
          eqmDistilNum: response.data.eqmDistilNum,
          eqmPackingStatus: this.isY(response.data.eqmPackingStatus),
          eqmPacking: response.data.eqmPacking,
          eqmPackingNum: response.data.eqmPackingNum,
          audit0701: response.data.audit0701,
          audit0701Remark: response.data.audit0701Remark,
          audit07021: response.data.audit07021,
          audit07021Remark: response.data.audit07021Remark,
          audit07022: response.data.audit07022,
          audit07022Remark: response.data.audit07022Remark,
          equipmentUsed: response.data.equipmentUsed,
          equipmentUsedRemark: response.data.equipmentUsedRemark,
          auditOther: response.data.auditOther,
          auditSuggestion: response.data.auditSuggestion
        });
        this.loading = false;
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  eqmChange(control1: string, control2: string) {
    this.forms.get(control1).reset();
    this.forms.get(control2).reset();
  }

  statusChange(control: string) {
    this.forms.get(control).reset();
  }

  submit(): void {
    this.Ope040106Vo = this.forms.value as Ope040106Vo;
    this.Ope040106Vo.eqmTankStatus = this.isTrue(this.forms.get('eqmTankStatus').value);
    this.Ope040106Vo.eqmDistilStatus = this.isTrue(this.forms.get('eqmDistilStatus').value);
    this.Ope040106Vo.eqmPackingStatus = this.isTrue(this.forms.get('eqmPackingStatus').value);
    if (this.forms.valid) {
      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.buttons.oaAlcoholDtlId}`, this.Ope040106Vo).subscribe((response: ResponseData<Ope040106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    }
  }

  validateField(value: string): boolean {
    return this.forms.get(value) && (this.forms.get(value).touched || this.submitted) && this.forms.get(value).invalid;
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
