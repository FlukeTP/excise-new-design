import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ope040106ButtonVo, Ope040106Vo } from '../ope040106vo.model';
import { Ope04010601Vo } from './ope04010601vo.model';
import { AjaxService } from 'services/index';
import { MessageBarService } from 'services/index';
import { MessageService } from 'services/index';
import { ResponseData } from 'models/index';

declare var $: any;

const URL = {
  GET_FIND: "oa/02/03/01/01/find/customerLicense",
  GET_DETAILS: "oa/04/01/06/01/detail",
  PUT_UPDATE: "oa/04/01/06/01/save",
  GET_BUTTONS: "oa/04/01/06/detail",
  GET_FIND_CUSTOMER: "oa/04/01/06/customers",
}

@Component({
  selector: 'app-ope04010601',
  templateUrl: './ope04010601.component.html',
  styleUrls: ['./ope04010601.component.css']
})
export class Ope04010601Component implements OnInit {
  overViewForm: FormGroup;
  solventForm: FormGroup;
  textDropdown: any;
  products: any[] = [];
  formData: FormGroup;
  id: string = "";
  buttons: Ope040106ButtonVo = null;
  licenseData: Ope04010601Vo = null;
  Ope040106Vo: Ope040106Vo;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) {
    // this.initialVariable();
    this.formData = this.fb.group({
      licenseMenufac: ['', Validators.required],
      licenseMenufacRemark: [''],
      licenseType2: ['', Validators.required],
      licenseType2Remark: [''],
      achDegree: ['', Validators.required],
      achDegreeRemark: [''],
      achCapacity: ['', Validators.required],
      achCapacityRemark: [''],
      achApprove: ['', Validators.required],
      achApproveRemark: [''],
      achPrice: ['', Validators.required],
      achPriceRemark: [''],
      achStamp: ['', Validators.required],
      achStampRemark: ['']
    });
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.id = this.route.snapshot.queryParams["id"] || "";
    if (this.id) {
      this.getButtonId();
    }
  }

  getButtonId() {
    this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope040106ButtonVo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.buttons = response.data;
        this.ajax.doGet(`${URL.GET_FIND_CUSTOMER}/${this.buttons.oaCuslicenseId}`).subscribe((res: ResponseData<Ope04010601Vo>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.licenseData = res.data;
          } else {
            this.msg.errorModal(res.message);
          }
        });
        this.getDetail();
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  getDetail() {
    this.ajax.doGet(`${URL.GET_DETAILS}/${this.buttons.oaAlcoholDtlId}`).subscribe((response: ResponseData<Ope040106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.Ope040106Vo = response.data;

        this.formData.patchValue({
          licenseMenufac: this.Ope040106Vo.licenseMenufac,
          licenseMenufacRemark: this.Ope040106Vo.licenseMenufacRemark,
          licenseType2: this.Ope040106Vo.licenseType2,
          licenseType2Remark:this.Ope040106Vo.licenseType2Remark,
          achDegree: this.Ope040106Vo.achDegree,
          achDegreeRemark:this.Ope040106Vo.achDegreeRemark,
          achCapacity:this.Ope040106Vo.achCapacity,
          achCapacityRemark: this.Ope040106Vo.achCapacityRemark,
          achApprove: this.Ope040106Vo.achApprove,
          achApproveRemark: this.Ope040106Vo.achApproveRemark,
          achPrice: this.Ope040106Vo.achPrice,
          achPriceRemark: this.Ope040106Vo.achPriceRemark,
          achStamp: this.Ope040106Vo.achStamp,
          achStampRemark: this.Ope040106Vo.achStampRemark
        });
      } else {
        this.msg.errorModal(response.message);
      }
    });
  }

  onSave() {

    this.Ope040106Vo = this.formData.value as Ope040106Vo;

    this.ajax.doPut(`${URL.PUT_UPDATE}/${this.buttons.oaAlcoholDtlId}`, this.Ope040106Vo).subscribe((response: ResponseData<Ope040106Vo>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message);

      } else {
        this.msg.errorModal(response.message);
      }
    });
  }


}

