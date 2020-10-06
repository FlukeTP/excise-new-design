import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { FormGroup } from '@angular/forms';
import { reject } from 'q';

const URLS = {
  GET_FILLTER_DATE: "ia/int06/05/01/fillterDate",
  GET_FILLTER_DATA: "ia/int06/05/01/fillterData",
}

@Injectable()
export class Int060501Service {
  [x: string]: any;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private messageBar: MessageBarService,
  ) { }

  dateFillter(dateFillterForm: FormGroup) {
    let promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GET_FILLTER_DATE}`, dateFillterForm.value).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resolve(res.data)
        } else {
          reject()
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  dataFillter(dataFillterForm: FormGroup) {
    let promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GET_FILLTER_DATA}`, dataFillterForm.value).subscribe((res: ResponseData<any>) => {
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
