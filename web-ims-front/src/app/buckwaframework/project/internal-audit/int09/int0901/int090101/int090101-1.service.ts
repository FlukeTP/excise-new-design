import { Injectable } from '@angular/core';

@Injectable()
export class Int0901011Service {

  dataBudget: any = null;
  dataLedger: any = null;
  constructor() { }

  setDataBudget(data: any) {
    this.dataBudget = data;
  }

  getDataBudget(): any {
    return this.dataBudget;
  }

  setDataLedger(data: any) {
    this.dataLedger = data;
  }

  getDataLedger(): any {
    return this.dataLedger;
  }

}
