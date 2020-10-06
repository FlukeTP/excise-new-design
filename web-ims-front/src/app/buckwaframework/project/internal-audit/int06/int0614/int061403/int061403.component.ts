import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Utils, TextDateTH, formatter } from 'helpers/index';
import { ActivatedRoute, Router } from '@angular/router';

const URL = {
  GET_REG_4000: "ia/int06/14/03/get-reg-4000",
  UPDATE: "ia/int06/14/03/update",
  GET_HEADER: "ia/int06/14/03/get-header",
  GET_DETAIL: "ia/int06/14/03/get-detail",
}

declare var $: any;
@Component({
  selector: 'app-int061403',
  templateUrl: './int061403.component.html',
  styleUrls: ['./int061403.component.css']
})
export class Int061403Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" }
    // path something ??
  ];

  loading: boolean = false;
  wsReg4000: FormGroup = new FormGroup({});
  detail: FormGroup = new FormGroup({});
  header: FormGroup = new FormGroup({});

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.createformGroup();

    this.wsReg4000.get('wsReg4000Id').setValue(this.route.snapshot.queryParams["param1"] || null);
    this.header.get('iaAuditTxinsurHId').setValue(this.route.snapshot.queryParams["param2"] || null);
    if (this.wsReg4000.get('wsReg4000Id').value != null) {
      this.getWsReg4000();
    }
    if (this.header.get('iaAuditTxinsurHId').value != null) {
      this.getHeader();
    }
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.calendar();
  }

  //======================================== Form ====================================
  createformGroup() {
    this.wsReg4000 = this.fb.group({
      wsReg4000Id: [''],
      newRegId: [''],
      cusFullname: [''],
      facAddress: [''],
      regDate: [''],
      facFullname: [''],
    });

    this.detail = this.fb.group({
      newRegId: [''],

      bankGuaranteeDateStr: [''],
      bankGuaranteeNo: [''],
      bankGuaranteeAmt: [''],
      bankGuaranteeResultBL: [false],
      cashGuaranteeDateStr: [''],
      cashReceiptNo: [''],
      cashGuaranteeAmt: [''],
      cashGuaranteeResultBL: [false],
    });

    this.header = this.fb.group({
      iaAuditTxinsurHId: [''],
      txinsurAuditFlag: [''],
      txinsurConditionText: [''],
      txinsurCriteriaText: [''],
    });
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#bankGuaranteeDateStrCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.detail.get('bankGuaranteeDateStr').patchValue(text);
      }
    }).css("width", "100%");

    $('#testDate').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        // this.detail.get('bankGuaranteeDateStr').patchValue(text);
      }
    }).css("width", "100%");

    $('#cashGuaranteeDateStrCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.detail.get('cashGuaranteeDateStr').patchValue(text);
      }
    }).css("width", "100%");
  }

  getWsReg4000() {
    this.ajax.doGet(`${URL.GET_REG_4000}/${this.wsReg4000.get('wsReg4000Id').value}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.wsReg4000.get('newRegId').patchValue(response["data"]["newRegId"]);
        this.wsReg4000.get('cusFullname').patchValue(response["data"]["cusFullname"]);
        this.wsReg4000.get('facAddress').patchValue(response["data"]["facAddress"]);
        this.wsReg4000.get('regDate').patchValue(response["data"]["regDate"]);
        this.wsReg4000.get('facFullname').patchValue(response["data"]["facFullname"]);
        this.detail.get('newRegId').patchValue(response["data"]["newRegId"]);

        this.ajax.doGet(`${URL.GET_DETAIL}/${this.detail.get('newRegId').value}/${this.header.get('iaAuditTxinsurHId').value}`).subscribe((response: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS === response.status) {
            this.detail.get('bankGuaranteeDateStr').patchValue(response["data"]["bankGuaranteeDateStr"]);
            this.detail.get('bankGuaranteeNo').patchValue(response["data"]["bankGuaranteeNo"]);
            this.detail.get('bankGuaranteeAmt').patchValue(response["data"]["bankGuaranteeAmt"]);
            this.detail.get('bankGuaranteeResultBL').patchValue(response["data"]["bankGuaranteeResultBL"]);
            this.detail.get('cashGuaranteeDateStr').patchValue(response["data"]["cashGuaranteeDateStr"]);
            this.detail.get('cashGuaranteeAmt').patchValue(response["data"]["cashGuaranteeAmt"]);
            this.detail.get('cashGuaranteeResultBL').patchValue(response["data"]["cashGuaranteeResultBL"]);
            this.detail.get('cashReceiptNo').patchValue(response["data"]["cashReceiptNo"]);
          } else {
            this.msg.errorModal(response.message);
          }
        }, err => {
          this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
        });
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  getHeader() {
    this.ajax.doGet(`${URL.GET_HEADER}/${this.header.get('iaAuditTxinsurHId').value}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.header.get('txinsurAuditFlag').patchValue(response["data"]["txinsurAuditFlag"]);
        this.header.get('txinsurConditionText').patchValue(response["data"]["txinsurConditionText"]);
        this.header.get('txinsurCriteriaText').patchValue(response["data"]["txinsurCriteriaText"]);
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

  routeTo(path: string, value?: any, value2?: any) {
    this.router.navigate([path], {
      queryParams: {
        param1: value,
        param2: value2
      }
    });
  }

  save(e) {
    e.preventDefault();
    let request = {
      header: this.header.value,
      detail: this.detail.value
    }
    console.log("request: ", request);
    this.ajax.doPost(URL.UPDATE, request).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS === response.status) {
        this.msg.successModal(response.message);
        this.routeTo('/int06/14/01')
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal(MessageService.MSG.FAILED_CALLBACK);
    });
  }

}
