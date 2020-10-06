import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { Message } from "../models";
import { AjaxService } from ".";

@Injectable()
export class TranslateService {
  private currentLang: string;
  readonly url = "preferences/message";
  private headers = new Headers({ "Content-Type": "application/json" });
  private messages: Message[] = new Array();

  constructor(private http: Http, private ajax: AjaxService) {
    // load messages
    this.getMessages().then(messages => (this.messages = messages));
  }

  // "messageTh": "ระบบบริหารจัดการการตรวจปฏิบัติการแบบบูรณาการ",
  getMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({
        "TA": {
          "messageId": 1,
          "messageCode": "APP_NAME",
          "messageEn": "IMS",
          "messageTh": "ระบบบริหารจัดการตรวจสอบภาษี",
          "messageType": "I",
          "isDeleted": "N",
          "version": 2,
          "createdBy": "SYSTEM",
          "createdDate": "2018-06-06T00:00:00",
          "updatedBy": "admin",
          "updatedDate": "2018-12-11T14:13:08"
        },"IA": {
          "messageId": 1,
          "messageCode": "APP_NAME",
          "messageEn": "IMS",
          "messageTh": "ระบบการตรวจสอบภายใน",
          "messageType": "I",
          "isDeleted": "N",
          "version": 2,
          "createdBy": "SYSTEM",
          "createdDate": "2018-06-06T00:00:00",
          "updatedBy": "admin",
          "updatedDate": "2018-12-11T14:13:08"
        },"OA": {
          "messageId": 1,
          "messageCode": "APP_NAME",
          "messageEn": "IMS",
          "messageTh": "ระบบตรวจปฎิบัติการ",
          "messageType": "I",
          "isDeleted": "N",
          "version": 2,
          "createdBy": "SYSTEM",
          "createdDate": "2018-06-06T00:00:00",
          "updatedBy": "admin",
          "updatedDate": "2018-12-11T14:13:08"
        }
      });
    });
  }

  pullMessage(): void {
    this.getMessages().then(messages => (this.messages = messages));
  }

  public use(lang: string): void {
    this.currentLang = lang;
  }

  private translate(key: string): string {
    let translation = key;

    if (this.messages[key]) {
      switch (this.currentLang.toUpperCase()) {
        case "TH": {
          translation = this.messages[key].messageTh;
          break;
        }
        default: {
          translation = this.messages[key].messageEn;
          break;
        }
      }
    }

    return translation;
  }

  public instant(key: string) {
    return this.translate(key);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
