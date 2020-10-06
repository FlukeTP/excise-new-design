import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import { Message } from "../../common/models";
import { EnYearToThYear } from 'helpers/index';

@Injectable()
export class MessageService {
  readonly url = "preferences/message";
  private headers = new Headers({ "Content-Type": "application/json" });

  public static MSG_CONFIRM = {
    SAVE: "ยืนยันการบันทึก",
    CONTINUE: "ยืนยันการทำรายการ",
    DELETE: "ยืนยันการลบ"
  }

  public static MSG = {
    SUCCESS: "SUCCESS",
    FAILED: "FAILED",
    FAILED_CALLBACK: "กรุณาติดต่อผู้ดูแลระบบ",
    REQUIRE_FIELD: "กรุณากรอกข้อมูลให้ถูกต้อง"
  }
  constructor(private http: Http) { }

  create(message: Message): Promise<Message> {
    return this.http
      .post(this.url, message, { headers: this.headers })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as Message)
      .catch(this.handleError);
  }

  delete(message: string): Promise<Message> {
    return this.http
      .delete(this.url + "/" + message, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  update(message: Message): Promise<Message> {
    return this.http
      .put(this.url, message, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  read(message: Message): Promise<Message> {
    return this.http
      .get(this.url + "/" + message.messageId, { headers: this.headers })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as Message)

      .catch(this.handleError);
  }

  public static budgetYear(): string {
    // Hard Code
    // return "2562";
    // Calculate
    return EnYearToThYear(this.calculateBudgetYear().toString());
  }

  private static calculateBudgetYear(): number {
    let year = 0;
    const date: Date = new Date();
    const budgetYear = [
      { month: 10, year: -1 },
      { month: 11, year: -1 },
      { month: 12, year: -1 },
      { month: 1, year: 0 },
      { month: 2, year: 0 },
      { month: 3, year: 0 },
      { month: 4, year: 0 },
      { month: 5, year: 0 },
      { month: 6, year: 0 },
      { month: 7, year: 0 },
      { month: 8, year: 0 },
      { month: 9, year: 0 },
    ];
    for (let i = 0; i < budgetYear.length; i++) {
      if (date.getMonth() + 1 == budgetYear[i].month) {
        year = date.getFullYear() + budgetYear[i].year;
      }
    }
    return year;
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}