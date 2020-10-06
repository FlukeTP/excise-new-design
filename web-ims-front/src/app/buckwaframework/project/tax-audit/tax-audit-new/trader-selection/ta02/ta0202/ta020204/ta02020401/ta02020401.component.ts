import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import * as TAACTION from '../../../../../trader-selection/ta03/ta0301/ta0301.action';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';

@Component({
  selector: 'app-ta02020401',
  templateUrl: './ta02020401.component.html',
  styleUrls: ['./ta02020401.component.css']
})
export class Ta02020401Component implements OnInit {

  auditPlanCode: string = "";
  auditStepList: any[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private store: Store<any>
  ) {
    // create auditStepList for check step icon
    this.setAuditStepList();
  }

  ngOnInit() {
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";

    this.getAuditStepList();
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0101', '1020');
    this.addAuditStepList('TS0102', '1030');
    this.addAuditStepList('TS0103', '1050');
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
    //console.log(this.newRegId);
    this.router.navigate([link], {
      // queryParams: {
      //   newRegId: this.newRegId
      // }
    });
  }

  gotoTS01() {
    console.log('gotoTS01');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_01"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0101"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '1020');
    });
  }
  gotoTS02() {
    console.log('gotoTS02');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_02"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0102"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '1030');
    });
  }
  gotoTS03() {
    console.log('gotoTS03');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_03"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0103"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '1050');
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
