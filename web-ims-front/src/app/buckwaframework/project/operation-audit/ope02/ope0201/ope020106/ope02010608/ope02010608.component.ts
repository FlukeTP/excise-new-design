import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope02010603Vo } from '../ope02010603/ope02010603vo.model';
import { Ope020106ButtonVo, Ope020106Vo } from '../ope020106vo.model';

const URL = {
  GET_DETAILS: "oa/02/01/06/08/detail",
  PUT_UPDATE: "oa/02/01/06/08/save",
  GET_BUTTONS: "oa/02/01/06/detail",
  GET_FIND_CUSTOMER: "oa/02/01/06/customers",
}

@Component({
  selector: 'app-ope02010608',
  templateUrl: './ope02010608.component.html',
  styleUrls: ['./ope02010608.component.css']
})
export class Ope02010608Component implements OnInit {

  id: string = "";
  lubrID: string = "";
  loading: boolean = false;
  submitted: boolean = false;
  ope02010608: Ope020106Vo = null;
  form: FormGroup = new FormGroup({});
  data: Ope02010603Vo = null;
  buttons: Ope020106ButtonVo = null;
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
    this.id = this.route.snapshot.queryParams["oaLubricantsDtlId"] || "";
    this.lubrID = this.route.snapshot.queryParams["id"] || "";
    if (this.id && this.lubrID) {
      this.loadingDetail();
      this.getButtonId();
    }
  }

  save() {
    this.submitted = true;
    if (this.form.valid) {
      this.ope02010608.materail = this.form.value.meterialProduct;
      this.ope02010608.document = this.form.value.docCount;
      this.ope02010608.productProcess = this.form.value.methodProduct;
      this.ope02010608.productNextime = this.form.value.resultProduct;
      const data: Ope020106Vo = this.ope02010608;
      this.ajax.doPut(`${URL.PUT_UPDATE}/${this.id}`, data).subscribe((response: ResponseData<Ope020106Vo>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.ope02010608 = response.data;
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
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.lubrID}`).subscribe((response: ResponseData<Ope020106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.loading = false;
      } else {
        this.msg.errorModal(response.message);
      }
    })
  }

  loadingDetail() {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.id}`).subscribe((response: ResponseData<Ope020106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.ope02010608 = response.data;
        this.form.patchValue({
          meterialProduct: this.ope02010608.materail,
          docCount: this.ope02010608.document,
          methodProduct: this.ope02010608.productProcess,
          resultProduct: this.ope02010608.productNextime,
        });
      } else {
        this.msg.errorModal(response.message);
      }
      this.loading = false;
    })
  }

}
