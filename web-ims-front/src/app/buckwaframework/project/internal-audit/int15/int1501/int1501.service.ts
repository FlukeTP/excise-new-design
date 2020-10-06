import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { MessageBarService } from 'services/message-bar.service';

const URLS = {
  GROUP_CODE: 'preferences/parameter/',
  UPLOAD_FILE: 'ia/int15/01/upload',
  SAVE_FILE: 'ia/int15/01/save/',
  FIND_DISBURSEUNIT: 'preferences/org-gfmis/find/disburseunit-and-name',
}
@Injectable()
export class Int1501Service {

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
  ) { }

  getGroupCode() {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(URLS.GROUP_CODE + 'IA_TYPE_DATA', {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          // this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  onUploadService = (formBody: any, type: string) => {
    return new Promise((resolve, reject) => {
      this.ajax.upload(`${URLS.UPLOAD_FILE}/${type}`, formBody, (res) => {
        if (MessageService.MSG.SUCCESS === res.json().status) {
          console.log(res.json());
          // this.messageBar.successModal(res.json().message)
          resolve(res.json().data)
        } else {
          this.messageBar.errorModal(res.message)
          reject()
        }
      }, (err) => {
        this.messageBar.errorModal(err)
        reject()
      });
    })
  }

  onSave(path, data) {
    const promise = new Promise((resolve, reject) => {
      this.ajax.doPost(URLS.SAVE_FILE + path, data).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
          reject()
        }
      })
    })
    return promise
  }

  findDisburseunit() {
    return new Promise((resolve, reject) => {
      this.ajax.doPost(URLS.FIND_DISBURSEUNIT, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
          reject()
        }
      })
    })
  }

  errModalServie(message) {
    this.messageBar.errorModal(message)
  }

}
