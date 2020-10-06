import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { Ope020703Vo } from 'projects/operation-audit/ope02/ope0207/ope020703/ope020703vo.model';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope01010610Vo } from '../ope01010610/ope01010610vo.model';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';

const URL = {
  GET_DETAILS: "oa/01/01/06/06/detail",
  PUT_UPDATE: "oa/01/01/06/06/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope01010606',
  templateUrl: './ope01010606.component.html',
  styleUrls: ['./ope01010606.component.css']
})
export class Ope01010606Component implements OnInit {
  forms: FormGroup;
  submitted: boolean = false;
  lubrID: string;
  id:string;
  fromData: Ope010106Vo = null;
  buttons: Ope010106ButtonVo = null;
  data: Ope020703Vo = null;
  loading: boolean = false;

  constructor(private ajax: AjaxService, private route: ActivatedRoute, private msg: MessageBarService) { }

  ngOnInit() {

    this.lubrID = this.route.snapshot.queryParams["oaHydrocarbDtlId"] || "";
    this.id = this.route.snapshot.queryParams["id"] || "";
    this.forms = new FormGroup({

      dailyAcc: new FormControl('Y', Validators.required),
      dailyAccDoc: new FormControl('Y', Validators.required),
      dailyAuditRemark: new FormControl('', Validators.required),
      monthlyAcc: new FormControl('Y', Validators.required),
      monthlyAccDoc: new FormControl('Y', Validators.required),
      monthlyAuditRemark: new FormControl('', Validators.required),
      monthlyAcc04: new FormControl('Y', Validators.required),
      monthlyAccDoc04: new FormControl('Y', Validators.required),
      monthlyAuditRemark04: new FormControl('', Validators.required),

    });

    this.getLubricantsDetail();
    this.getButtonId();
  }

  validateField(value: string) {
    return this.forms.get(value).invalid && (this.forms.get(value).touched || this.submitted);
  }

  getLubricantsDetail() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.lubrID}`).subscribe((response: ResponseData<Ope010106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.fromData = response.data;
        this.forms.patchValue({
          dailyAcc: response.data.dailyAcc,
          dailyAccDoc: response.data.dailyAccDoc,
          dailyAuditRemark: response.data.dailyAuditRemark,
          monthlyAcc: response.data.monthlyAcc,
          monthlyAccDoc: response.data.monthlyAccDoc,
          monthlyAuditRemark: response.data.monthlyAuditRemark,
          monthlyAcc04: response.data.monthlyAcc04,
          monthlyAccDoc04: response.data.monthlyAccDoc04,
          monthlyAuditRemark04: response.data.monthlyAuditRemark04,

        });
      } else {

      }
      this.loading = false;

    })
  }
  getButtonId() {
    // this.loading = true;
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        // this.loading = false;
      } else {
        this.msg.errorModal(response.message);
        // this.loading = false;
      }
    })
  }

  save() {
    this.submitted = true;
    if (this.forms.valid) {
      this.fromData.dailyAcc = this.forms.value.dailyAcc;
      this.fromData.dailyAccDoc = this.forms.value.dailyAccDoc;
      this.fromData.dailyAuditRemark = this.forms.value.dailyAuditRemark;
      this.fromData.monthlyAcc = this.forms.value.monthlyAcc;
      this.fromData.monthlyAccDoc = this.forms.value.monthlyAccDoc;
      this.fromData.monthlyAuditRemark = this.forms.value.monthlyAuditRemark;
      this.fromData.monthlyAcc04 = this.forms.value.monthlyAcc04;
      this.fromData.monthlyAccDoc04 = this.forms.value.monthlyAccDoc04;
      this.fromData.monthlyAuditRemark04 = this.forms.value.monthlyAuditRemark04;

      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.lubrID}`, this.fromData).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.msg.successModal(response.message);
        } else {
          this.msg.errorModal(response.message);
        }
      });
    }
  }

}
