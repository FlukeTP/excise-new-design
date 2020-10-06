import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';

import { FactoryVo } from '../../../select07/factory';

import { MessageBarService } from 'services/message-bar.service';
import { IaService } from 'services/ia.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { AuthService } from 'services/auth.service';
import { Store } from '@ngrx/store';
import { OparaterDTL } from './../../ta02.model';
import * as TA02ACTION from "./../../ta02.action";

declare var $: any;

const URL = {
  FIND_BY_AUDIT_PLAN_CODE: "ta/tax-audit/get-operator-details-by-audit-plan-code",
}
@Component({
  selector: 'app-ta020208',
  templateUrl: './ta020208.component.html',
  styleUrls: ['./ta020208.component.css']
})
export class Ta020208Component implements OnInit {

  auditPlanCode: any;
  formGroup: FormGroup;

  loading: boolean = false;
  regDutyList: any[];

  actived: boolean[] = [true, false, false, false, false];

  dataStore: any;
  href: string = "";

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private modelService: IaService,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      newRegId: [''],
      cusFullname: [''],
      facFullname: [''],
      facAddress: [''],
      secDesc: [''],
      areaDesc: [''],
      jobResp: [''],
      dutyGroupId: [''],
      dutyDesc: ['']
    });
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.setData(this.auditPlanCode);
    if (this.auditPlanCode) {
      this.setData(this.auditPlanCode);
      // this.getOperatorDetails(this.newRegId);
    } else {
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
    this.href = this.router.url;
    let page = this.href.split("/");
    this.onActive(Number(page[page.length - 1].substring(0, 2)) - 1);
  }

  ngAfterViewInit(): void {
    this.callDropDown();
  }

  ngOnDestroy(): void {
    this.dataStore.unsubscribe();
  }

  goTo(link: string, linkNumber: number) {
    this.onActive(linkNumber);
    this.router.navigate([link], {
      queryParams: {
        auditPlanCode: this.auditPlanCode
      }
    });
  }

  setData(id: String) {
    if (id) {
      this.ajax.doPost(URL.FIND_BY_AUDIT_PLAN_CODE, { auditPlanCode: id }).subscribe((result: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.formGroup.get('newRegId').patchValue(result.data.wsRegfri4000Vo.newRegId);
          this.formGroup.get('cusFullname').patchValue(result.data.wsRegfri4000Vo.cusFullname);
          this.formGroup.get('facFullname').patchValue(result.data.wsRegfri4000Vo.facFullname);
          this.formGroup.get('facAddress').patchValue(result.data.wsRegfri4000Vo.facAddress);
          this.formGroup.get('secDesc').patchValue(result.data.wsRegfri4000Vo.secDesc);
          this.formGroup.get('areaDesc').patchValue(result.data.wsRegfri4000Vo.areaDesc);
          let jobResp = this.auth.getUserDetails().userThaiName + " " + this.auth.getUserDetails().userThaiSurname;
          this.formGroup.get('jobResp').patchValue(jobResp);
          this.regDutyList = result.data.wsRegfri4000Vo.regDutyList;
          this.formGroup.get('dutyGroupId').patchValue(result.data.wsRegfri4000Vo.regDutyList[0].groupId);
          setTimeout(() => {
            $('.dutyGroupId').dropdown('set selected', result.data.wsRegfri4000Vo.regDutyList[0].groupId);
          }, 150);
          this.onChangeDutyGroup();
          // console.log("formGroup : ", this.formGroup.value);
          this.callDropDown();
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
    }
  }

  // ====================== Action =============================
  onActive(linkNumber: number) {
    this.actived = [false, false, false, false, false];
    this.actived[linkNumber] = true;
  }

  detailModal() {
    $('#detailModal').modal('show');
  }

  callDropDown = () => {
    setTimeout(() => {
      $('.ui.dropdown').dropdown();
    }, 100);
  }

  onChangeDutyGroup() {
    let data;
    this.dataStore = this.store.select(state => state.Ta02.opa_dtl).subscribe(datas => {
      data = datas
    });
    data['dutyGroupId'] = this.formGroup.get("dutyGroupId").value;
    this.store.dispatch(new TA02ACTION.AddOparaterDTL(data));
  }

  // ================= call back-end ==================
  // getOperatorDetails(newRegId: string) {
  //   const URL = "ta/tax-audit/get-operator-details";
  //   this.loading = true;
  //   this.ajax.doPost(URL, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
  //     if (MessageService.MSG.SUCCESS == res.status) {
  //       // console.log("getOperatorDetails : ", res.data);
  //       let jobResp = this.auth.getUserDetails().userThaiName + " " + this.auth.getUserDetails().userThaiSurname;
  //       this.formGroup.get('newRegId').patchValue(res.data.newRegId);
  //       this.formGroup.get('cusFullname').patchValue(res.data.cusFullname);
  //       this.formGroup.get('facFullname').patchValue(res.data.facFullname);
  //       this.formGroup.get('facAddress').patchValue(res.data.facAddress);
  //       this.formGroup.get('secDesc').patchValue(res.data.secDesc);
  //       this.formGroup.get('areaDesc').patchValue(res.data.areaDesc);
  //       this.formGroup.get('jobResp').patchValue(jobResp);
  //       this.regDutyList = res.data.regDutyList;
  //       this.formGroup.get('dutyGroupId').patchValue(res.data.regDutyList[0].groupId);
  //       setTimeout(() => {
  //         $('.dutyGroupId').dropdown('set selected', res.data.regDutyList[0].groupId);
  //       }, 150);
  //       // console.log("formGroup : ", this.formGroup.value);
  //       this.onChangeDutyGroup();
  //       this.callDropDown();
  //     } else {
  //       this.messageBar.errorModal(res.message);
  //     }
  //     this.loading = false;
  //   });
  // }

}

class AppState {
  Ta02: {
    opa_dtl: OparaterDTL
  }
}
