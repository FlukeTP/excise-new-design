import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';

const URLS = {
  FIND_INSPECTION_PLAN: "ia/int10/find/ins-plan-params",
}

@Injectable()
export class Int0613Service {

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
  ) {}

  getDataInspectionPlan(idinspec: string) {
    let promise = new Promise((resolve) => {
      this.ajax.doGet(`${URLS.FIND_INSPECTION_PLAN}/${idinspec}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

}
