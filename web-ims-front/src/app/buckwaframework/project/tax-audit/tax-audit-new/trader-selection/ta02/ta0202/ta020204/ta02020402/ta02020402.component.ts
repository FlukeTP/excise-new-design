import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TAACTION from '../../../../../trader-selection/ta03/ta0301/ta0301.action';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';

declare var $: any;
@Component({
  selector: 'app-ta02020402',
  templateUrl: './ta02020402.component.html',
  styleUrls: ['./ta02020402.component.css']
})
export class Ta02020402Component implements OnInit {
  action: any;
  actionD: any;
  actiontotal: boolean[] = [false, false, false];
  flagAuditPlan: string = "";
  actionB: any;
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
    this.flagAuditPlan = '';
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";

    this.getAuditStepList();
  }

  ngAfterViewInit(): void {
    // set initial show form
    this.hedenActiontotal(1);
    $('#docType1').prop('checked', true);
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0105', '2031');
    this.addAuditStepList('TS0110', '2021');
    this.addAuditStepList('TS0111', '2022');
    this.addAuditStepList('TS0114', '2051');
    this.addAuditStepList('TS01141', '2052');
    this.addAuditStepList('TS01142', '2053');
    this.addAuditStepList('TS01171', '2054');
    this.addAuditStepList('TS0119', '2055');
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
        auditPlanCode: this.auditPlanCode
      }
    });
  }


  hedenActiontotal(n) {
    this.setAuditStepList();
    if (n == 1) {
      this.actiontotal = [true, false, false];
      this.flagAuditPlan = 'Y';
      this.auditStepList[1].auditStepStatus = '2021';
      this.auditStepList[2].auditStepStatus = '2022';
      // check audit step for new status
      this.getAuditStepList();
    } else if (n == 2) {
      this.actiontotal = [false, true, false];
      this.flagAuditPlan = '';
    } else if (n == 0) {
      this.actiontotal = [true, true, false];
      this.flagAuditPlan = 'N';
      this.auditStepList[1].auditStepStatus = '2041';
      this.auditStepList[2].auditStepStatus = '2042';
      // check audit step for new status
      this.getAuditStepList();
    } else if (n == 3) {
      this.actiontotal = [false, true, true];
      this.flagAuditPlan = '';
    }

  }
  gotoTS05() {
    console.log('gotoTS05');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_05"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0105"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2031');
    });
  }

  checkflagAuditTS10() {
    let data: any;
    if (this.flagAuditPlan === 'Y') {
      data = '2021';
    } else if (this.flagAuditPlan === 'N') {
      data = '2041';
    } else {
      data = '';
    }
    return data;
  }

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
      this.linkHeaderTS(this.auditPlanCode, this.checkflagAuditTS10());
    });
  }

  checkflagAuditTS11() {
    let data: any;
    if (this.flagAuditPlan === 'Y') {
      data = '2022';
    } else if (this.flagAuditPlan === 'N') {
      data = '2042';
    } else {
      data = '';
    }
    return data;
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
      this.linkHeaderTS(this.auditPlanCode, this.checkflagAuditTS11());
    });
  }
  gotoTS14() {
    console.log('gotoTS14');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0114"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2051');
    });
  }
  gotoTS141() {
    console.log('gotoTS141');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14_1"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01141"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2052');
    });
  }
  gotoTS142() {
    console.log('gotoTS142');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_14_2"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01142"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2053');
    });
  }
  gotoTS171() {
    console.log('gotoTS171');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_17_1"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts01171"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, '2054');
    });
  }
  gotoTS19() {
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
      this.linkHeaderTS(this.auditPlanCode, '2055');
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
