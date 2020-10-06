import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { MessageService } from 'services/message.service';
import { ResponseData } from 'models/response-data.model';
declare var $: any;

const URLS = {
  GET_CHART_OF_ACC: 'ia/int02/04/01/01/getChartOfAcc',
  GET_DATA_BY_ID: 'ia/int02/04/01/01/findExpensesById',
  ON_SAVE: 'ia/int02/04/01/01/saveExpenses',
  GET_SECTOR_DTL: '/preferences/department/dept-dtl',
  GET_AREA: 'preferences/department/area-list/',
  GET_SECTOR: 'preferences/department/sector-list',
  FIND_DATA: 'ia/int02/04/01/01/findValidate'
}
@Injectable()
export class Int12040101Service {
  delete?
  constructor(
    private ajax: AjaxService,
    private message: MessageBarService,
    private router: Router
  ) { }

  getChartOfAcc = () => {
    let promise = new Promise((resolve) => {
      this.ajax.get(URLS.GET_CHART_OF_ACC,
        success => {
          resolve(success.json())
        }, error => {
          this.message.errorModal(error.json());
        })
    })
    return promise
  }

  findExpensesById(id: string) {
    let promise = new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GET_DATA_BY_ID}/${id}`, {}).subscribe((res: any) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          resolve(res.data)
        } else {
          this.message.errorModal(res.message)
        }
      })
    })
    return promise
  }

  onSave = (data: any) => {
    const promise = new Promise((resolve, reject) => {
      this.ajax.post(URLS.ON_SAVE, JSON.stringify(data),
        success => {
          if (MessageService.MSG.SUCCESS === success.json().status) {
            this.message.successModal(success.json().message)
            resolve(success.json())
          } else {
            this.message.errorModal(success.json().message)
            reject()
          }
        }, error => {
          this.message.errorModal(error.json().message);
          reject()
        })
    })
    return promise
  }

  findValidate(dataReq) {
    return new Promise((resolve, reject) => {
      this.ajax.post(URLS.FIND_DATA, JSON.stringify(dataReq),
        success => {
          // this.message.successModal(success.json().message);
          // resolve(success.json())
          if (MessageService.MSG.SUCCESS === success.json().status) {
            // this.messageBar.successModal(res.message)
            resolve(success.json())
          } else {
            this.message.errorModal(success.json().message)
            reject()
          }
        }, error => {
          this.message.errorModal(error.json().message);
          reject()
        })
    })
  }

  getSectorDtl(sector: string) {
    let otherSetor = '0000'
    if (sector === '99') {
      otherSetor = '9999'
    }
    return new Promise((resolve) => {
      this.ajax.doPost(`${URLS.GET_SECTOR_DTL}/${sector}${otherSetor}`, {}).subscribe((res: any) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          resolve(res.data.deptName)
        } else {
          this.message.errorModal(res.message)
        }
      })
    })
  }

  sector() {
    return new Promise((resolve, reject) => {
      this.ajax.doPost(URLS.GET_SECTOR, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          // this.messageBar.successModal(res.message)
          resolve(res.data)
        } else {
          this.message.errorModal(res.message)
          reject()
        }
      })
    })
  }

  area(sector: string) {
    return new Promise((resolve, reject) => {
      this.ajax.doPost(URLS.GET_AREA + sector, {}).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          // this.message.successModal(res.message)
          resolve(res.data)
        } else {
          this.message.errorModal(res.message)
          reject()
        }
      })
    })
  }
  convertToNumber(strNumber: any) {
    if (!strNumber) {
      return strNumber
    }
    return Number(strNumber.toString().replace(/\,/g, ''))
  }

  setFindValue(data, id) {
    return {
      id: id,
      accountId: data.accountId,
      accountName: data.accountName,
      serviceReceive: data.serviceReceive,
      serviceWithdraw: data.serviceWithdraw,
      serviceBalance: data.serviceBalance,
      suppressReceive: data.suppressReceive,
      suppressWithdraw: data.suppressWithdraw,
      suppressBalance: data.suppressBalance,
      budgetReceive: data.budgetReceive,
      budgetWithdraw: data.budgetWithdraw,
      budgetBalance: data.budgetBalance,
      sumReceive: data.sumReceive,
      sumWithdraw: data.sumWithdraw,
      sumBalance: data.sumBalance,
      moneyBudget: data.moneyBudget,
      moneyOut: data.moneyOut,
      averageCost: data.averageCost,
      averageGive: data.averageGive,
      averageFrom: data.averageFrom,
      averageComeCost: data.averageComeCost,
      note: data.note,

      averageCostOut: data.averageCostOut,
      averageGiveOut: data.averageGiveOut,
      averageFromOut: data.averageFromOut,
      averageComeCostOut: data.averageComeCostOut,
      officeCode: data.officeCode,
      expenseDateStr: `${data.expenseMonth}/${Number(data.expenseYear) + 543}`
    }
  }

  setValueSave(dataInput, deleteId?) {
    // let detailList: [object]
    // const detail = dataInput.iaExpensesD1.forEach(element => {
    //   element.averageCost = element.averageCost;
    //   detailList.push(element);
    // });
    for (let i = 0; i < dataInput.iaExpensesD1.length; i++) {
      dataInput.iaExpensesD1[i].averageCost = Number(this.convertToNumber(dataInput.iaExpensesD1[i].averageCost))
      dataInput.iaExpensesD1[i].averageFrom = Number(this.convertToNumber(dataInput.iaExpensesD1[i].averageFrom))
    }
    return {
      officeCode: dataInput.officeCode,
      officeDesc: dataInput.officeDesc,
      id: dataInput.id,
      accountId: dataInput.accountId,
      accountName: dataInput.accountName,
      serviceReceive: this.convertToNumber(dataInput.serviceReceive),
      serviceWithdraw: this.convertToNumber(dataInput.serviceWithdraw),
      serviceBalance: this.convertToNumber(dataInput.serviceBalance),
      suppressReceive: this.convertToNumber(dataInput.suppressReceive),
      suppressWithdraw: this.convertToNumber(dataInput.suppressWithdraw),
      suppressBalance: this.convertToNumber(dataInput.suppressBalance),
      budgetReceive: this.convertToNumber(dataInput.budgetReceive),
      budgetWithdraw: this.convertToNumber(dataInput.budgetWithdraw),
      budgetBalance: this.convertToNumber(dataInput.budgetBalance),
      sumReceive: this.convertToNumber(dataInput.sumReceive),
      sumWithdraw: this.convertToNumber(dataInput.sumWithdraw),
      sumBalance: this.convertToNumber(dataInput.sumBalance),
      moneyBudget: this.convertToNumber(dataInput.moneyBudget),
      moneyOut: this.convertToNumber(dataInput.moneyOut),
      averageCost: this.convertToNumber(dataInput.averageCost),
      averageComeCost: dataInput.averageComeCost,
      averageFrom: this.convertToNumber(dataInput.averageFrom),
      averageGive: dataInput.averageGive,
      note: dataInput.note,
      averageCostOut: this.convertToNumber(dataInput.averageCostOut),
      averageGiveOut: dataInput.averageGiveOut,
      averageFromOut: this.convertToNumber(dataInput.averageFromOut),
      averageComeCostOut: dataInput.averageComeCostOut,
      expenseDateStr: dataInput.expenseDateStr,
      iaExpensesD1: dataInput.iaExpensesD1,
      deleteId: deleteId
    }
  }

  clearForm() {
    return {
      id: null,
      serviceReceive: 0,
      serviceWithdraw: 0,
      serviceBalance: 0,
      suppressReceive: 0,
      suppressWithdraw: 0,
      suppressBalance: 0,
      budgetReceive: 0,
      budgetWithdraw: 0,
      budgetBalance: 0,
      sumReceive: 0,
      sumWithdraw: 0,
      sumBalance: 0,
      moneyBudget: 0,
      moneyOut: 0,
      averageCost: 0,
      averageGive: '',
      averageFrom: 0,
      averageComeCost: '',
      note: '',
      averageCostOut: 0,
      averageGiveOut: '',
      averageFromOut: 0,
    }
  }
}

