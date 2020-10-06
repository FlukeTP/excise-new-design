import { Component, OnInit } from '@angular/core';

import { AjaxService } from 'services/ajax.service';

import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';

import { FactoryVo } from '../factory';

import { ResponseData } from 'models/response-data.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { AuthService } from 'services/auth.service';
declare var $: any;

const URL = {
  FIND_BY_AUDIT_PLAN_CODE: "ta/tax-audit/get-operator-details-by-audit-plan-code"
}

@Component({
  selector: 'app-ta020201',
  templateUrl: './ta020201.component.html',
  styleUrls: ['./ta020201.component.css'],


})
export class Ta020201Component implements OnInit {

  button: boolean = false;
  loader: boolean = false;

  budgetYear: any;
  auditPlanCode: any;
  planNumber: any;
  // form
  dataForm: FormGroup;

  auditType: any[];
  page: string;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private auth: AuthService
  ) { }


  ngOnInit() {
    this.dataForm = new FormGroup({
      newRegId: new FormControl(''),
      cusFullname: new FormControl(''),
      facFullname: new FormControl(''),
      facAddress: new FormControl(''),
      jobResp: new FormControl(''),
      secDesc: new FormControl(''),
      areaDesc: new FormControl(''),
      dutyDesc: new FormControl(''),
      auditType: new FormControl(''),
      auditStartDate: new FormControl(''),
      auditEndDate: new FormControl(''),


    });
    this.page = this.route.snapshot.queryParams['page'] || "";
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.getTaAuditType();
    if (this.auditPlanCode) {
      this.setData(this.auditPlanCode);
    } else {
      this.router.navigate(["/tax-audit-new/ta02/02"]);
    }
  }

  routePage() {
    if (this.dataForm.get('auditType').value == 'M') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.dataForm.get('auditType').value
        }
      });
    } else if (this.dataForm.get('auditType').value == 'F') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.dataForm.get('auditType').value
        }
      });
    } else if (this.dataForm.get('auditType').value == 'D') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/04/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.dataForm.get('auditType').value
        }
      });
    } else if (this.dataForm.get('auditType').value == 'S') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/05/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.dataForm.get('auditType').value
        }
      });
    } else if (this.dataForm.get('auditType').value == 'I') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/06/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.dataForm.get('auditType').value
        }
      });
    }
  }
  ngAfterViewInit(): void {

    this.calenda();
  }

  calenda = () => {
    $("#auditStartDate").calendar({
      endCalendar: $("#auditEndDate"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.dataForm.get("auditStartDate").patchValue(text);
      }
    });
    $("#auditEndDate").calendar({
      startCalendar: $("#auditStartDate"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.dataForm.get("auditEndDate").patchValue(text);
      }
    });
  }

  goTo(link: string) {
    this.router.navigate([link], {
      queryParams: {
        auditPlanCode: this.auditPlanCode,
        page: "02"
      }
    });
  }

  // ============== Action ==========================
  save() {
    const URL = "ta/tax-audit/update-plan-ws-dtl";
    this.loader = true;
    this.ajax.doPost(URL, this.dataForm.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.routePage();
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.loader = false;
    })

  }

  detailModal() {
    $('#detailModal').modal('show');
  }

  goBack() {
    // this.router.navigate(['/tax-audit-new/ta02/'+this.page]);
    this.router.navigate(['/tax-audit-new/ta02/05']);
  }

  // =================== call back-end ===================
  getTaAuditType() {
    const URL = "preferences/parameter/TA_AUDIT_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = [];
        this.auditType = res.data;
        $('.auditType').dropdown('set selected', this.auditType[0].paramCode);
        this.dataForm.get('auditType').patchValue(this.auditType[0].paramCode);
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  setData(id: String) {
    if (id) {
      this.loader = true;
      this.ajax.doPost(URL.FIND_BY_AUDIT_PLAN_CODE, { auditPlanCode: id }).subscribe((result: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.dataForm.get('newRegId').patchValue(result.data.newRegId);
          this.dataForm.get('cusFullname').patchValue(result.data.wsRegfri4000Vo.cusFullname);
          this.dataForm.get('facFullname').patchValue(result.data.wsRegfri4000Vo.facFullname);
          this.dataForm.get('facAddress').patchValue(result.data.wsRegfri4000Vo.facAddress);
          this.dataForm.get('dutyDesc').patchValue(result.data.wsRegfri4000Vo.regDutyList[0].groupName);
          this.dataForm.get('auditType').patchValue(Utils.isNotNull(result.data.auditType) ? result.data.auditType : this.dataForm.get('auditType').value);
          $('.auditType').dropdown('set selected', Utils.isNotNull(result.data.auditType) ? result.data.auditType : this.dataForm.get('auditType').value);
          this.dataForm.get('auditStartDate').patchValue(result.data.auditStartDate);
          this.dataForm.get('auditEndDate').patchValue(result.data.auditEndDate);
          this.dataForm.get('secDesc').patchValue(result.data.wsRegfri4000Vo.secDesc);
          this.dataForm.get('areaDesc').patchValue(result.data.wsRegfri4000Vo.areaDesc);

          let jobResp = this.auth.getUserDetails().userThaiName + " " + this.auth.getUserDetails().userThaiSurname;
          this.dataForm.get('jobResp').patchValue(jobResp);
          if (Utils.isNotNull(this.dataForm.get('auditType').value)) {
            this.routePage();
          }
        } else {
          this.messageBar.errorModal(result.message);
        }
        this.loader = false;
      });
    }
  }

  // getOperatorDetails(newRegId: string) {
  //   const URL = "ta/tax-audit/get-operator-details";
  //   this.loader = true;
  //   this.ajax.doPost(URL, { newRegId: newRegId }).subscribe((res: ResponseData<any>) => {
  //     if (MessageService.MSG.SUCCESS == res.status) {
  //       // console.log("getOperatorDetails : ", res.data);
  //       let jobResp = this.auth.getUserDetails().userThaiName + " " + this.auth.getUserDetails().userThaiSurname;
  //       this.dataForm.get('newRegId').patchValue(res.data.newRegId);
  //       this.dataForm.get('cusFullname').patchValue(res.data.cusFullname);
  //       this.dataForm.get('facFullname').patchValue(res.data.facFullname);
  //       this.dataForm.get('facAddress').patchValue(res.data.facAddress);
  //       this.dataForm.get('secDesc').patchValue(res.data.secDesc);
  //       this.dataForm.get('areaDesc').patchValue(res.data.areaDesc);
  //       this.dataForm.get('jobResp').patchValue(jobResp);
  //     } else {
  //       this.messageBar.errorModal(res.message);
  //     }
  //     this.loader = false;
  //   });
  // }

}
