import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/index';
import { Utils } from 'helpers/utils';

declare var $: any;

const URL = {
  FIND_BY_AUDIT_PLAN_CODE: "ta/tax-audit/get-operator-details-by-audit-plan-code",
  SAVE: "ta/tax-audit/update-plan-ws-dtl",
  AUDIT_TYPE: "preferences/parameter/TA_AUDIT_TYPE"
}

@Component({
  selector: 'app-ta020206',
  templateUrl: './ta020206.component.html',
  styleUrls: ['./ta020206.component.css']
})
export class Ta020206Component implements OnInit {
  colorStep: boolean[] = [true, false, false];
  auditPlanCode: any;
  formGroup: FormGroup
  auditType: any[];
  loading: boolean = false;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.setFormGroup();
    this.getTaAuditType();
  }

  setFormGroup() {
    this.formGroup = this.fb.group({
      auditType: [''],
      auditPlanCode: [''],
      auditStartDate: [''],
      auditEndDate: ['']
    })
  }

  urlActivate(urlMatch: string) {
    return this.router.url && this.router.url.substring(0, 15) == urlMatch;
  }

  ngAfterViewInit(): void {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.formGroup.get('auditPlanCode').patchValue(this.auditPlanCode);
    this.formGroup.get('auditType').patchValue(this.route.snapshot.queryParams['auditType'] || "");
    $('.auditType').dropdown('set selected', this.formGroup.get('auditType').value);
    this.setData(this.auditPlanCode);
    //calendar dropdown
    this.callCalendarDropDown();
  }

  // ============== Action ==========================
  save() {
    // this.loading = true;
    // this.ajax.doPost(URL.SAVE, this.formGroup.value).subscribe((res: ResponseData<any>) => {
    //   if (MessageService.MSG.SUCCESS == res.status) {
    //     this.messageBar.successModal(res.message);
    //   } else {
    //     this.messageBar.errorModal(res.message);
    //   }
    //   setTimeout(() => {
    //     this.loading = false;
    //   }, 1000);
    // })

  }

  goBack() {
    // this.router.navigate(['/tax-audit-new/ta02/'+this.page]);
    this.router.navigate(['/tax-audit-new/ta02/05']);
  }

  onAuditTypeChange() {
    if (this.formGroup.get('auditType').value == 'M') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.formGroup.get('auditType').value
        }
      });
    } else if (this.formGroup.get('auditType').value == 'F') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/03/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.formGroup.get('auditType').value
        }
      });
    } else if (this.formGroup.get('auditType').value == 'D') {

      this.router.navigate(['/tax-audit-new/ta02/02/01/04/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.formGroup.get('auditType').value
        }
      });
    } else if (this.formGroup.get('auditType').value == 'S') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/05/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.formGroup.get('auditType').value
        }
      });
    } else if (this.formGroup.get('auditType').value == 'I') {
      this.router.navigate(['/tax-audit-new/ta02/02/01/06/01'], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          page: "02",
          auditType: this.formGroup.get('auditType').value
        }
      });
    }
  }

  goTo(link: string, num: number) {
    this.colorStep = [false, false, false];
    this.colorStep[num] = true;
    this.router.navigate([link], {
      queryParams: {
        auditPlanCode: this.auditPlanCode,
        auditType: this.formGroup.get('auditType').value
      }
    });

  }

  callCalendarDropDown = () => {
    setTimeout(() => {
      $("#auditStartDate").calendar({
        endCalendar: $("#auditEndDate"),
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          this.formGroup.get("auditStartDate").patchValue(text);
        }
      });
      $("#auditEndDate").calendar({
        startCalendar: $("#auditStartDate"),
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          this.formGroup.get("auditEndDate").patchValue(text);
        }
      });
    }, 500)
  }

  // =================== call back-end ===================
  setData(id: String) {
    if (id) {
      this.loading = true;
      this.ajax.doPost(URL.FIND_BY_AUDIT_PLAN_CODE, { auditPlanCode: id }).subscribe((result: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          // this.formGroup.get('auditType').patchValue(result.data.auditType);
          // $('.auditType').dropdown('set selected', result.data.auditType);
          this.formGroup.get('auditStartDate').patchValue(result.data.auditStartDate);
          this.formGroup.get('auditEndDate').patchValue(result.data.auditEndDate);
        } else {
          this.messageBar.errorModal(result.message);
        }
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      });
    }
  }

  getTaAuditType() {
    this.loading = true;
    this.ajax.doPost(URL.AUDIT_TYPE, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.auditType = [];
        this.auditType = res.data;

        if (Utils.isNull(this.formGroup.get('auditType').value)) {
          $('.auditType').dropdown('set selected', this.auditType[0].paramCode);
          this.formGroup.get('auditType').patchValue(this.auditType[0].paramCode);
        }

      } else {
        this.messageBar.errorModal(res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }
}