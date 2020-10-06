import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { $ } from 'protractor';

@Injectable()
export class Int07010101Service {

  constructor(
    private ajax: AjaxService
  ) { }

  status = (): Promise<any> => {
    let url = "ia/int05111/status";

    let promise = new Promise((resolve, reject) => {
      this.ajax.get(url, res => {
        resolve(res.json())
        // console.log("service : ",res.json());
      })
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
