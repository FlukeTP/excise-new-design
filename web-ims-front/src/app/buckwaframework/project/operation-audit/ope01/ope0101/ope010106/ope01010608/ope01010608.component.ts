import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope01010610Vo } from '../ope01010610/ope01010610vo.model';
import { Ope010106ButtonVo, Ope010106Vo } from '../ope010106vo.model';

const URL = {
  GET_DETAILS: "oa/01/01/06/08/detail",
  PUT_UPDATE: "oa/01/01/06/08/save",
  GET_BUTTONS: "oa/01/01/06/detail",
  GET_FIND_CUSTOMER: "oa/01/01/06/customers",
}

@Component({
  selector: 'app-ope01010608',
  templateUrl: './ope01010608.component.html',
  styleUrls: ['./ope01010608.component.css']
})
export class Ope01010608Component implements OnInit {

  id: string = "";
  lubrID: string = "";
  loading: boolean = false;
  submitted: boolean = false;
  ope01010608: Ope010106Vo = null;
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
      meterialProduct: ['', Validators.required],
      docCount: ['', Validators.required],
      methodProduct: ['', Validators.required],
      resultProduct: ['', Validators.required],
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

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.ope01010608.materail = this.form.value.meterialProduct;
      this.ope01010608.document = this.form.value.docCount;
      this.ope01010608.productProcess = this.form.value.methodProduct;
      this.ope01010608.productNextime = this.form.value.resultProduct;
      const data: Ope010106Vo = this.ope01010608;
      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.id}`, data).subscribe((response: ResponseData<Ope010106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.ope01010608 = response.data;
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
        this.ope01010608 = response.data;
        this.form.patchValue({
          meterialProduct: this.ope01010608.materail,
          docCount: this.ope01010608.document,
          methodProduct: this.ope01010608.productProcess,
          resultProduct: this.ope01010608.productNextime,
        });
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    })
  }

}
