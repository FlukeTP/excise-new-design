import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Store } from '@ngrx/store';
import * as TAACTION from '../../../../ta03/ta0301/ta0301.action';
import { Observable } from 'rxjs';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';

declare var $: any;
@Component({
  selector: 'app-ta02020302',
  templateUrl: './ta02020302.component.html',
  styleUrls: ['./ta02020302.component.css']
})
export class Ta02020302Component implements OnInit {

  action: any;
  budgetYear: any;
  auditPlanCode: any;
  planNumber: any;
  auditStepList: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private store: Store<any>,
  ) {
    // create auditStepList for check step icon
    this.setAuditStepList();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.getAuditStepList();
  }

  ngAfterViewInit(): void {
    // set initial show form
    this.hedenAction(1);
    $('#docType1').prop('checked', true);
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0111', '2021');
    this.addAuditStepList('TS0110', '2022');
    this.addAuditStepList('TS0113', '2023');
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
  link(link: any) {
    throw new Error("Method not implemented.");
  }
  hedenAction(v) {
    this.action = v;
  }

  // ==================== Go to FormTS
  gotoTS10() {
    console.log('gotoTS10');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_10"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0110"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2022');
    });
  }
  gotoTS11() {
    console.log('gotoTS11');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_11"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0111"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2021');
    });
  }
  gotoTS13() {
    console.log('gotoTS13');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_13"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0113"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2023');
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
  // ==================== Go to FormTS end
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
