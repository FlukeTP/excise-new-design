import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
import { FormGroup } from '@angular/forms';
import { reject } from 'q';

const URLS = {
  GROUP_CODE: 'preferences/parameter',
  SECTOR_LIST: 'preferences/department/sector-list',
  AREA_LIST: 'preferences/department/area-list',
  BRANCH_LIST: 'preferences/department/branch-list',
  DATA_LIST: 'ia/int09/12/01/getList',
  SAVE_AUD_W: 'ia/int09/12/01/saveAuditWorking',
  EDIT_AUD_W: 'ia/int09/12/01/editAuditWorking',
  GET_AUDIT_WORKING_NO: 'ia/int09/12/01/getAuditWorkingNo',
  GET_DTL: 'ia/int09/12/01/getDtl',
}
@Injectable()
export class Int091201Service {

  constructor(
    private ajax: AjaxService,
    private route: ActivatedRoute,
    private router: Router,
    private messageBar: MessageBarService,
  ) { }

  getSectorService() {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.SECTOR_LIST}`, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  getAreaService(officeCode) {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.AREA_LIST}/${officeCode}`, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          // this.messageBar.errorModal(res.message)
          console.log(res.message);
        }
      })
    })
    return promise
  }

  getBranchService(officeCode) {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.BRANCH_LIST}/${officeCode}`, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          // this.messageBar.errorModal(res.message)
          console.log(res.message);
        }
      })
    })
    return promise
  }

  getDataList(dataSearch: any) {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.DATA_LIST}`, dataSearch).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
          reject()
        }
      }, () => {
        this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK)
        reject()
      })
    })
    return promise
  }

  searchDataList(dataSearch) {
    const promise = new Promise((resolve) => {
      this.ajax.doGet(`${URLS.SAVE_AUD_W}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  getMonthService() {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GROUP_CODE}/MONTH_LIST`, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          console.log('monthList Service => ', res.data);
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  saveIaAuditWorkingService(dataSave) {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.SAVE_AUD_W}`, dataSave).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.messageBar.successModal(res.message)
          resolve()
        } else {
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  editIaAuditWorkingService(dataSave) {
    const promise = new Promise((resolve) => {
      this.ajax.doPut(`${URLS.EDIT_AUD_W}`, dataSave).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.messageBar.successModal(res.message)
          resolve()
        } else {
          reject()
          this.messageBar.errorModal(res.message)
        }
      })
    })
    return promise
  }

  getAuditWorkingNoService() {
    const promise = new Promise((resolve) => {
      this.ajax.doGet(`${URLS.GET_AUDIT_WORKING_NO}`).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          // this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          this.messageBar.errorModal(res.message)
        }
      }, () => {
        reject()
        this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK)
      })
    })
    return promise
  }

  getDtlService(dataSearch) {
    const promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GET_DTL}`, { 'auditWorkingNo': dataSearch }).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          // this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          reject()
          this.messageBar.errorModal(res.message)
        }
      }, () => {
        reject()
        this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK)
      })
    })
    return promise
  }
}
