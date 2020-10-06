import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as TAACTION from '../../../../ta03/ta0301/ta0301.action';
import { Ta0301Service } from 'projects/tax-audit/tax-audit-new/trader-selection/ta03/ta0301/ts0301.service';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';

declare var $: any;
@Component({
  selector: 'app-ta02020403',
  templateUrl: './ta02020403.component.html',
  styleUrls: ['./ta02020403.component.css']
})
export class Ta02020403Component implements OnInit {

  action: any;
  actionD: any;
  actiontotal: boolean[] = [false, false, false, false, false];
  actionB: any;
  auditPlanCode: any;
  panelNum: any;
  auditStepList: any[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService,
    private ta0301Serice: Ta0301Service,
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
    this.hedenActiontotal(2);
    $('#docType2').prop('checked', true);
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0114', '3021');
    this.addAuditStepList('TS01141', '3022');
    this.addAuditStepList('TS0119', '3023');
    this.addAuditStepList('TS0114', '3051');
    this.addAuditStepList('TS01141', '3052');
    this.addAuditStepList('TS01142', '3053');
    this.addAuditStepList('TS0110', '3061');
    this.addAuditStepList('TS0115', '3062');
    this.addAuditStepList('TS0116', '3063');
    this.addAuditStepList('TS0118', '3064');
    this.addAuditStepList('TS0119', '3065');
    this.addAuditStepList('TS01171', '3071');
    this.addAuditStepList('TS0119', '3072');
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
      }
    });
  }


  hedenActiontotal(n) {
    this.panelNum = n;
    this.setAuditStepList();
    if (n == 1) {
      this.actiontotal = [true, false, false, false, false];
      this.auditStepList[0].auditStepStatus = '3021';
      this.auditStepList[1].auditStepStatus = '3022';
      this.auditStepList[2].auditStepStatus = '3023';
      // check audit step for new status
      this.getAuditStepList();
    } else if (n == 2) {
      this.actiontotal = [false, true, false, false, false];
    } else if (n == 3) {
      this.actiontotal = [true, true, false, false, false];
      this.auditStepList[0].auditStepStatus = '3041';
      this.auditStepList[1].auditStepStatus = '3042';
      this.auditStepList[2].auditStepStatus = '3043';
      // check audit step for new status
      this.getAuditStepList();
    } else if (n == 4) {
      this.actiontotal = [false, true, true, false, false];
    } else if (n == 5) {
      this.actiontotal = [false, true, true, true, false];
    } else if (n == 6) {
      this.actiontotal = [false, true, true, false, true];
    }

  }

  // ============ go to formTs ===========
  goToTs(codeName: string, status: string) {
    let path = this.ta0301Serice.getPathTs(codeName);
    let formTS = {
      docType: "2",
      topic: codeName
    }
    let pathTs = path;
    if (path.indexOf("/") != -1) {
      pathTs = path.split('/')[0] + path.split('/')[1];
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: pathTs
    }
    let newStatus = status;
    if (this.panelNum == 3) {
      newStatus = this.getAuditStepStatusByCodeFormTS(codeName);
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode, newStatus);
    });
  }

  getAuditStepStatusByCodeFormTS(codeName: string) {
    let status = '';
    switch (codeName) {
      case 'FORM_TS01_14':
        status = '3041';
        break;
      case 'FORM_TS01_14_1':
        status = '3042';
        break;
      case 'FORM_TS01_19':
        status = '3043';
        break;
      default:
        status = '3041';
        break;
    }
    return status;
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
