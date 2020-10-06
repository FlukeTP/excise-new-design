import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { Router } from "@angular/router";
import { MessageService } from 'services/message.service';
declare var $: any;

const URLS = {
  GET_CHART_OF_ACC: "ia/int12/08/01/01/getChartOfAcc",
  GET_DATA_BY_ID: "ia/int12/08/01/01/findExpensesById",
  ON_SAVE: "ia/int12/08/01/01/saveExpenses"
}
@Injectable()
export class Int12080101Service {

  constructor(
    private ajax: AjaxService,
    private message: MessageBarService,
    private router: Router
  ) {}

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
    let promise = new Promise((resolve) => {
      this.ajax.post(URLS.ON_SAVE, JSON.stringify(data),
        success => {
          this.message.successModal(success.json().message);
          resolve(success.json())
        }, error => {
          this.message.errorModal(error.json().message);
        })
    })
    return promise
  }
}

