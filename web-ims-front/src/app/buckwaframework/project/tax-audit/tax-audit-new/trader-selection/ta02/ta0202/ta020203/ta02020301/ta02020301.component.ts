import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { Store } from '@ngrx/store';
import * as TA0301ACTION from '../../../../ta03/ta0301/ta0301.action';
import { Observable } from 'rxjs';
import { ResponseData } from 'models/index';
import { MessageService } from 'services/message.service';
import { Utils } from 'helpers/index';
declare var $: any;
@Component({
  selector: 'app-ta02020301',
  templateUrl: './ta02020301.component.html',
  styleUrls: ['./ta02020301.component.css']
})
export class Ta02020301Component implements OnInit {
  icon1: any;
  icon2: any;
  icon3: any;
  status1: string = "รอดำเนินการ";
  status2: string = "กำลังดำเนินการ";
  status3: string = "สำเร็จ";
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
    this.auditPlanCode = this.route.snapshot.queryParams['auditPlanCode'] || "";
    this.getAuditStepList();
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0107', '1030');
    this.addAuditStepList('TS0108', '1040');
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
  selectIcon() {
    let btn = '';
    if (this.icon1 == 'A') {
      btn = ' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    } else if (this.icon2 == 'B') {
      btn = ' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    } else if (this.icon3 == 'C') {
      btn = ' <div [attr.data-tooltip]="status3"> <i class="small circular inverted green check icon" style="font-size: 1em;" ></i></div>'
    }
    return btn;

  }
  //==================== Go to formTs
  gotoTS07() {
    console.log('gotoTS07');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_07",
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0107"
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode,'1030');
    });
  }
  gotoTS08() {
    console.log('gotoTS08');
    let formTS = {
      docType: "2",
      topic: "FORM_TS01_08"
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: "ta-form-ts0108"
    }

    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.linkHeaderTS(this.auditPlanCode,'1040');
    });
  }

  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TA0301ACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TA0301ACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

  }

  linkHeaderTS(auditPlanCode,Step){
    this.router.navigate(['/tax-audit-new/ta03/01'], {
      queryParams: {
        auditPlanCode: auditPlanCode,
        auditStepStatus: Step
      }
    });
  }

  //==================== Go to formTs end
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

