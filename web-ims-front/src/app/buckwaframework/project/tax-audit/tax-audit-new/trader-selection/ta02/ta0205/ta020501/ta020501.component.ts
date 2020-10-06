import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AjaxService, AuthService } from 'services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/index';
import { TextDateTH, Utils } from 'helpers/index';
import { formatter } from 'helpers/index';
import { ResponseData } from 'models/index';
import { FactoryVo } from '../../ta0202/factory';
import { MessageService } from 'services/index';
declare var $: any;

const URL = {
  FIND_BY_AUDIT_PLAN_CODE: "ta/tax-audit/get-operator-details-by-audit-plan-code"
}

@Component({
  selector: 'app-ta020501',
  templateUrl: './ta020501.component.html',
  styleUrls: ['./ta020501.component.css']
})
export class Ta020501Component implements OnInit {

  button: boolean = false;
  loader: boolean = false;

  budgetYear: any;
  auditPlanCode: any;
  planNumber: any;
  // form
  dataForm: FormGroup;

  auditType: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private auth: AuthService
  ) { }


  ngOnInit() {

    this.getTaAuditType();
    this.dataForm = new FormGroup({
      newRegId: new FormControl(''),
      cusFullname: new FormControl(''),
      facFullname: new FormControl(''),
      facAddress: new FormControl(''),
      dutyDesc: new FormControl(''),
      auditType: new FormControl(''),
      auditStartDate: new FormControl(''),
      auditEndDate: new FormControl(''),


    });
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    if (this.auditPlanCode) {
      this.setData(this.auditPlanCode);
    } else {
      this.router.navigate(["/tax-audit-new/ta02/05"]);
    }
  }

  routePage() {
    if (this.dataForm.get('auditType').value == 'M') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'F') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'D') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/04/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'S') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/05/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "05"
        }
      });
    } else if (this.dataForm.get('auditType').value == 'I') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/06/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "05"
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

  setData(id: String) {
    if (id) {
      this.loader = true;
      this.ajax.doPost(URL.FIND_BY_AUDIT_PLAN_CODE, { auditPlanCode: id }).subscribe((result: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          this.dataForm.get('newRegId').patchValue(Utils.isNotNull(result.data.newRegId) ? result.data.newRegId : "");
          this.dataForm.get('cusFullname').patchValue(Utils.isNotNull(result.data.wsRegfri4000Vo.cusFullname) ? result.data.wsRegfri4000Vo.cusFullname : "");
          this.dataForm.get('facFullname').patchValue(Utils.isNotNull(result.data.wsRegfri4000Vo.facFullname) ? result.data.wsRegfri4000Vo.facFullname : "");
          this.dataForm.get('facAddress').patchValue(Utils.isNotNull(result.data.wsRegfri4000Vo.facAddress) ? result.data.wsRegfri4000Vo.facAddress : "");
          this.dataForm.get('dutyDesc').patchValue(Utils.isNotNull(result.data.wsRegfri4000Vo.regDutyList[0].groupName) ? result.data.wsRegfri4000Vo.regDutyList[0].groupName : "");
          this.dataForm.get('auditType').patchValue(Utils.isNotNull(result.data.auditType) ? result.data.auditType : "I");
          $('.auditType').dropdown('set selected', result.data.auditType);
          this.dataForm.get('auditStartDate').patchValue(Utils.isNotNull(result.data.auditStartDate) ? result.data.auditStartDate : "");
          this.dataForm.get('auditEndDate').patchValue(Utils.isNotNull(result.data.auditEndDate) ? result.data.auditEndDate : "");

          this.routePage();
        } else {
          this.messageBar.errorModal(result.message);
        }
        this.loader = false;
      });
    }
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

  // =================== call back-end ===================
  getTaAuditType() {
    const URL = "preferences/parameter/TA_AUDIT_TYPE";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = [];
        this.auditType = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

}