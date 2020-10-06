import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ComboBox } from "models/index";
import { AjaxService } from "services/ajax.service";

export interface Lov {
  value: string;
  label: string;
}

const _bills: Lov[] = [
  { value: "1", label: "แบบขอเบิกเงินค่าเช่าบ้าน (แบบ 6006)" },
  {
    value: "2",
    label: "ใบเบิกเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล (แบบ 7131)"
  },
  // { value: "3", label: "ใบเบิกเงินสวัสดิการเกี่ยวกับการศึกษาบุตร (แบบ 7223)" }
  // { value: "4", label: "ใบเบิกค่าใช้จ่ายในการเดินทางไปราชการ (แบบ 8708)" }
];

// const _types: Lov[] = [
//   { value: "1", label: "ทั่วไป" },
//   { value: "2", label: "วิชาการ" },
//   { value: "3", label: "อำนวยการ" },
//   { value: "4", label: "บริหาร" }
// ];

// const _levels: Lov[] = [
//   { value: "1", label: "ปฏิบัติการ" },
//   { value: "2", label: "ชำนาญการ" },
//   { value: "3", label: "ชำนาญการพิเศษ" },
//   { value: "4", label: "เชี่ยวชาญ" }
// ];

const _levelChilds: Lov[] = [
  { value: "0", label: "อนุบาลหรือเทียบเท่า" },
  { value: "0", label: "ประถมศึกษาหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนต้นหรือเทียบเท่า" },
  {
    value: "0",
    label: "มัธยมศึกษาตอนปลายหรือหลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.)"
  },
  { value: "0", label: "อนุปริญญาหรือเทียบเท่า" },
  { value: "0", label: "ปริญญาตรี" },
  { value: "0", label: "อนุบาลหรือเทียบเท่า" },
  { value: "0", label: "ประถมศึกษาหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนต้นหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนปลายหรือเทียบเท่า" },
  { value: "0", label: "หลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.) หรือเทียบเท่า" },
  {
    value: "0",
    label: "หลักสูตรประกาศณียบัตรวิชาชีพชั้นสูง (ปวส.) หรือเทียบเท่า"
  },
  {
    value: "0",
    label: "หลักสูตรประกาศนียบัตรวิชาชีพเทคนิค (ปวท.) หรือเทียบเท่า"
  }
];

const _majorChilds: Lov[] = [
  { value: "0", label: "อนุบาลหรือเทียบเท่า" },
  { value: "0", label: "ประถมศึกษาหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนต้นหรือเทียบเท่า" },
  {
    value: "0",
    label: "มัธยมศึกษาตอนปลายหรือหลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.)"
  },
  { value: "0", label: "อนุปริญญาหรือเทียบเท่า" },
  { value: "0", label: "ปริญญาตรี" },
  { value: "0", label: "อนุบาลหรือเทียบเท่า" },
  { value: "0", label: "ประถมศึกษาหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนต้นหรือเทียบเท่า" },
  { value: "0", label: "มัธยมศึกษาตอนปลายหรือเทียบเท่า" },
  { value: "0", label: "หลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.) หรือเทียบเท่า" },
  {
    value: "0",
    label: "หลักสูตรประกาศณียบัตรวิชาชีพชั้นสูง (ปวส.) หรือเทียบเท่า"
  },
  {
    value: "0",
    label: "หลักสูตรประกาศนียบัตรวิชาชีพเทคนิค (ปวท.) หรือเทียบเท่า"
  }
];

const _typeEduChilds: Lov[] = [
  { value: "0", label: "ประเภทสามัญศึกษา" },
  { value: "0", label: "ประเภทอาชีวศึกษา" }
];

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId"
};

@Injectable()
export class Int06052Service {
  constructor(private ajax: AjaxService) {}

  dropdown = (type: string, id?: number): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      this.ajax
        .post(URL.DROPDOWN, DATA, res => {
          this[type] = res.json();
        })
        .then(() => {
          obs.next(this[type]);
        });
    });
  };

  getBills() {
    return new Promise<Lov[]>(resolve => {
      resolve(_bills);
    });
  }

  //   getTypes() {
  //     return new Promise<Lov[]>(resolve => {
  //       resolve(_types);
  //     });
  //   }

  // getLevels() {
  //   return new Promise<Lov[]>(resolve => {
  //     resolve(_levels);
  //   });
  // }

  getLevelChilds() {
    return new Promise<Lov[]>(resolve => {
      resolve(_levelChilds);
    });
  }

  getMajorChilds() {
    return new Promise<Lov[]>(resolve => {
      resolve(_majorChilds);
    });
  }

  getTypeEduChilds() {
    return new Promise<Lov[]>(resolve => {
      resolve(_typeEduChilds);
    });
  }
}
