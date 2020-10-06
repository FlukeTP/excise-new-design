import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { $ } from 'protractor';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';

const URL = {
  create: "preferences/parameter/IA_STAMP_STATUS"
}

@Injectable()
export class Int12010101Service {

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService
  ) { }

  status = (): Promise<any> => {
    let promise = new Promise((resolve, reject) => {
      this.ajax.doPost(URL.create, {}).subscribe((result: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == result.status) {
          resolve(result)
        } else {
          this.messageBar.errorModal(result.message);
        }
      });
      // this.ajax.(`${URL.create}`, res => {
      //   resolve(res.json())
      //   console.log("service : ",res.json());
      // })
    });
    return promise;
  }

  changeStatus = (value) => { //,statusReceive : boolean, statusSendBack : boolean, statusPay : boolean
    // if (value == "รับ"){
    //     statusReceive = true;
    //     $(".statusReceive").addClass('custom-readonly');
    // }
    // if(value == "ส่งคืน"){

    // } 
    // if(value == "จ่าย")   {

  }
}
