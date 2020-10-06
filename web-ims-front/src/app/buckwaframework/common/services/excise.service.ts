import { Injectable } from "@angular/core";
import { Excise, File } from "../models";
import { AjaxService } from "./ajax.service";

@Injectable()
export class ExciseService {
  private data: any;
  private excise: Excise[];
  private before: string;
  private last: string;
  private num1: number[];
  private num2: number[];
  private percent1: number[];
  private percent2: number[];
  private from: any;
  private analysNumber: any;
  private month: any;
  private currYear: number;
  private prevYear: number;
  private workSheetNumber: number;
  private analysSelectedNum: any;

  constructor(private ajax: AjaxService) {
    this.excise = new Array<Excise>();
  }

  setData(data: any) { // ExciseService.setData({ eiei: "555" });
    console.log("data : ", data);
    this.data = data;
  }
  getData() { // const data = ExciseService.getData();
    return this.data;
  }

  add(data: Excise): void {
    this.excise.push(data);
  }

  get(id: string): Excise {
    const index = this.excise.findIndex(obj => obj.exciseId == id);
    if (index > -1) {
      return this.excise[index];
    } else {
      return null;
    }
  }

  update(data: Excise): boolean {
    const index = this.excise.findIndex(obj => obj.exciseId == data.exciseId);
    if (index > -1) {
      this.excise[index] = data;
      const url = `excise/detail/list/${data.analysNumber}/${data.exciseId}`;
      const new_data: File[] = data.file;
      this.ajax.put(url, new_data, null).then(res => {
        var new_file = [];
        var old_file = this.excise[index].file;
        for (let i = 0; i < old_file.length; i++) {
          if (old_file[i].uploadPath === undefined) {
            const d = {
              name: old_file[i].name,
              value: old_file[i].value,
              type: old_file[i].type,
              taExciseFileUploadId: null,
              uploadPath: `///${old_file[i].name}`
            };
            new_file.push(d);
          } else {
            new_file.push(old_file[i]);
          }
        }
        this.excise[index].file = new_file;
      });
      return true;
    } else {
      return false;
    }
  }

  setformValues(before, last, from, month, currYear, prevYear) {
    this.before = before;
    this.last = last;
    this.from = from;
    this.month = month;
    this.currYear = currYear;
    this.prevYear = prevYear;
  }

  getformValues() {
    return {
      before: this.before,
      last: this.last,
      from: this.from,
      month: this.month,
      currYear: this.currYear,
      prevYear: this.prevYear
    };
  }

  setformNumber(num1, num2, percent1, percent2, analysNumber) {
    this.num1 = num1;
    this.num2 = num2;
    this.percent1 = percent1;
    this.percent2 = percent2;
    this.analysNumber = analysNumber;
  }

  getformNumber() {
    return {
      num1: this.num1,
      num2: this.num2,
      percent1: this.percent1,
      percent2: this.percent2,
      analysNumber: this.analysNumber
    };
  }

  setToSendlineUser(
    before,
    last,
    analysNumber,
    workSheetNumber,
    from,
    month,
    currYear
  ) {
    this.before = before;
    this.last = last;
    this.analysNumber = analysNumber;
    this.workSheetNumber = workSheetNumber;
    this.from = from;
    this.month = month;
    this.currYear = currYear;
  }

  getToSendlineUser() {
    return {
      before: this.before,
      last: this.last,
      analysNumber: this.analysNumber,
      workSheetNumber: this.workSheetNumber,
      from: this.from,
      month: this.month,
      currYear: this.currYear
    };
  }

  setSelectedAnalyNum(analysSelectedNum) {
    this.analysSelectedNum = analysSelectedNum;
  }

  getSelectedAnalyNum() {
    return this.analysSelectedNum;
  }
}
