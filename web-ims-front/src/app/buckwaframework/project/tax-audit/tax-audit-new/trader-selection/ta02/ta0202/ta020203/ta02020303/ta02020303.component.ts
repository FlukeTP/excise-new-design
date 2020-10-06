import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as TAACTION from '../../../../ta03/ta0301/ta0301.action';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';

declare var $: any;
@Component({
  selector: 'app-ta02020303',
  templateUrl: './ta02020303.component.html',
  styleUrls: ['./ta02020303.component.css']
})
export class Ta02020303Component implements OnInit {
  action: any;
  actionD: any;
  actionC: any;
  actionB: any;
  budgetYear: any;
  auditPlanCode: any;
  planNumber: any;
  auditStepList: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private store: Store<any>
  ) {
    // create auditStepList for check step icon
    this.setAuditStepList();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.getAuditStepList();
    this.hiddenAction(2);
  }

  ngAfterViewInit(): void {
    // set initial show form
    $('#docType2').prop('checked', true);
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0119', '3021');
    this.addAuditStepList('TS0117', '3022');
    this.addAuditStepList('TS0119', '3031');
    this.addAuditStepList('TS0118', '3032');
    this.addAuditStepList('TS0119', '3041');
    this.addAuditStepList('TS0119', '3050');
  }

  addAuditStepList(formTsCode: string, auditStepStatus: string) {
    this.auditStepList.push({
      formTsCode: formTsCode,
      auditStepStatus: auditStepStatus,
      iconName: 'yellow sticky note',
      formTsNumber: ''
    })
  }

  goTo(link: string) {
    this.router.navigate([link], {
      queryParams: {
        auditPlanCode: this.auditPlanCode,
      }
    });
  }
  hiddenAction(v) {
    this.action = v;
    this.actionD = 0;
    this.actionC = 0;
    this.actionB = 0;
  }
  hiddenActionD(v) {
    this.actionD = v;
    this.actionC = 0;
    this.actionB = 0;
  }
  hiddenActionC(v) {
    this.actionC = v;
    this.actionB = 0;
  }
  hiddenActionB(v) {
    this.actionB = v;
  }

  gotoTS17() {
    console.log('gotoTS17');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_17"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0117"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '3022');
    });
  }
  gotoTS18() {
    console.log('gotoTS18');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_18"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0118"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '3032');
    });
  }
  gotoTS19(auditStepStatus: any) {
    console.log('gotoTS19');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_19"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0119"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, auditStepStatus);
    });
  }

  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TAACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TAACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

  }

  linkHeaderTS(auditPlanCode, Step) {
    this.router.navigate(['/tax-audit-new/ta03/01'], {
      queryParams: {
        auditPlanCode: auditPlanCode,
        auditStepStatus: Step
      }
    });
  }
  // ===================== call back-end ============
  getAuditStepList() {
    const URL = "ta/tax-audit/audit-step-list";
    let data = {
      auditPlanCode: this.auditPlanCode
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (Utils.isNotNull(res.data) && res.data.length > 0) {
          this.setAuditStepList();
          for (let index = 0; index < this.auditStepList.length; index++) {
            let element = this.auditStepList[index];
            let auditCheck = (e) => {
              let bool = false;
              if (e.formTsCode == element.formTsCode && e.auditStepStatus == element.auditStepStatus) {
                this.auditStepList[index].formTsNumber = e.formTsNumber;
                bool = true;
              }
              return bool;
            }
            if (res.data.some(auditCheck)) {
              this.auditStepList[index].iconName = 'green check';
            }
          }
        }
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }
}

