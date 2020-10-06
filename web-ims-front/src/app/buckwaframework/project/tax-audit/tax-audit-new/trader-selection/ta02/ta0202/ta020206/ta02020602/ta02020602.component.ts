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
  selector: 'app-ta02020602',
  templateUrl: './ta02020602.component.html',
  styleUrls: ['./ta02020602.component.css']
})
export class Ta02020602Component implements OnInit {

  showForm: boolean[] = [false, false];

  auditPlanCode: any;
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
    this.onShowForm(0);
    $('#docType1').prop('checked', true);
  }

  setAuditStepList() {
    this.auditStepList = []
    //push audit step for number of TS
    this.addAuditStepList('TS0109', '1010');
    this.addAuditStepList('TS0107', '1020');
    this.addAuditStepList('TS0108', '1030');
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

  onShowForm(num: number) {
    this.showForm = [false, false];
    switch (num) {
      case 0:
        this.showForm[num] = true;
        break;
      case 1:
        this.showForm[num] = true;
        break;
      default:
        this.showForm[num] = true;
        break;
    }
  }

  // ============ go to formTs ===========
  goToTs(codeName: string, status: string) {
    let path = this.ta0301Serice.getPathTs(codeName);
    let formTS = {
      docType: "2",
      topic: codeName
    }
    let pathTS = {
      formTsNumber: "",
      pathTs: path
    }
    this.dispatchData(formTS, pathTS).subscribe(res => {
      this.router.navigate([`/tax-audit-new/ta03/01/${path}`], {
        queryParams: {
          auditPlanCode: this.auditPlanCode,
          auditStepStatus: status
        }
      })
    });
  }

  dispatchData(formTS, pathTS): Observable<any> {
    return new Observable(obs => {
      this.store.dispatch(new TAACTION.AddPathTsSelect(formTS))
      this.store.dispatch(new TAACTION.AddFormTsNumber(pathTS))
      obs.next("Dispatch...")
    })

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
