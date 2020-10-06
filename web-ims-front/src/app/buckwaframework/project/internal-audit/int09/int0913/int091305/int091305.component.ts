import { Component, OnInit } from '@angular/core';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Utils } from 'helpers/utils';
import { ResponseData } from 'models/response-data.model';

const URL = {
  GET_BY_TYPE: "ia/int091305/get/by-ubillType",
}

declare var $: any;
@Component({
  selector: 'app-int091305',
  templateUrl: './int091305.component.html',
  styleUrls: ['./int091305.component.css']
})
export class Int091305Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];
  formHead: FormGroup = new FormGroup({});
  loading: boolean = false;
  quarterFlag: string = 'A';
  data: any = { quarter: [] }

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initVariable();
    let _ubillType = this.route.snapshot.queryParams["param1"] || null;
    let _budgetYear = this.route.snapshot.queryParams["param2"] || null;
    if (Utils.isNotNull(_ubillType) && Utils.isNotNull(_budgetYear)) {
      this.getDataByUbillType(_ubillType, _budgetYear);
    }
  }

  getDataByUbillType(ubillType: string, budgetYear: string) {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_BY_TYPE}/${ubillType}/${budgetYear}/${this.quarterFlag}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.data = response.data;
        this.formHead.get('budgetYear').patchValue(response.data.budgetYear);
        this.formHead.get('ubillType').patchValue(response.data.ubillType);
        this.formHead.get('ubillTypeStr').patchValue(response.data.ubillTypeStr);
        this.stopLoading();
      } else {
        this.msg.errorModal(response.message);
        this.stopLoading();
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
      this.stopLoading();
    });
  }

  changeFlagBtn(flg: string) {
    this.quarterFlag = flg;
    if (Utils.isNotNull(this.formHead.get('ubillType').value) && Utils.isNotNull(this.formHead.get('budgetYear').value)) {
      this.getDataByUbillType(this.formHead.get('ubillType').value, this.formHead.get('budgetYear').value);
    }
  }

  stopLoading() {
    this.loading = false;
  }

  /* _________________ initVariable _________________ */
  initVariable() {
    this.formHead = this.fb.group({
      budgetYear: [""],
      ubillType: [""],
      ubillTypeStr: [""],
    });
  }

}
