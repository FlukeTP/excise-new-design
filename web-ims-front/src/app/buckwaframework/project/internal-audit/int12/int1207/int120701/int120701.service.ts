import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComboBox } from './../../../../../common/models/combobox.model';
import { AjaxService } from 'services/ajax.service';
import { Utils } from 'helpers/utils';

declare var $: any;
export interface Lov {
  value: string;
  label: string;
}

const _bills: Lov[] = [
  { value: '1', label: 'แบบขอเบิกเงินค่าเช่าบ้าน (แบบ 6006)' },
  {
    value: '2',
    label: 'ใบเบิกเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล (แบบ 7131)'
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
  { value: '0', label: 'อนุบาลหรือเทียบเท่า' },
  { value: '0', label: 'ประถมศึกษาหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนต้นหรือเทียบเท่า' },
  {
    value: '0',
    label: 'มัธยมศึกษาตอนปลายหรือหลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.)'
  },
  { value: '0', label: 'อนุปริญญาหรือเทียบเท่า' },
  { value: '0', label: 'ปริญญาตรี' },
  { value: '0', label: 'อนุบาลหรือเทียบเท่า' },
  { value: '0', label: 'ประถมศึกษาหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนต้นหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนปลายหรือเทียบเท่า' },
  { value: '0', label: 'หลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.) หรือเทียบเท่า' },
  {
    value: '0',
    label: 'หลักสูตรประกาศณียบัตรวิชาชีพชั้นสูง (ปวส.) หรือเทียบเท่า'
  },
  {
    value: '0',
    label: 'หลักสูตรประกาศนียบัตรวิชาชีพเทคนิค (ปวท.) หรือเทียบเท่า'
  }
];

const _majorChilds: Lov[] = [
  { value: '0', label: 'อนุบาลหรือเทียบเท่า' },
  { value: '0', label: 'ประถมศึกษาหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนต้นหรือเทียบเท่า' },
  {
    value: '0',
    label: 'มัธยมศึกษาตอนปลายหรือหลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.)'
  },
  { value: '0', label: 'อนุปริญญาหรือเทียบเท่า' },
  { value: '0', label: 'ปริญญาตรี' },
  { value: '0', label: 'อนุบาลหรือเทียบเท่า' },
  { value: '0', label: 'ประถมศึกษาหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนต้นหรือเทียบเท่า' },
  { value: '0', label: 'มัธยมศึกษาตอนปลายหรือเทียบเท่า' },
  { value: '0', label: 'หลักสูตรประกาศนียบัตรวิชาชีพ(ปวช.) หรือเทียบเท่า' },
  {
    value: '0',
    label: 'หลักสูตรประกาศณียบัตรวิชาชีพชั้นสูง (ปวส.) หรือเทียบเท่า'
  },
  {
    value: '0',
    label: 'หลักสูตรประกาศนียบัตรวิชาชีพเทคนิค (ปวท.) หรือเทียบเท่า'
  }
];

const _typeEduChilds: Lov[] = [
  { value: '0', label: 'ประเภทสามัญศึกษา' },
  { value: '0', label: 'ประเภทอาชีวศึกษา' }
];

const URL = {
  DROPDOWN: 'combobox/controller/getDropByTypeAndParentId'
};

@Injectable()
export class Int120701Service {
  constructor(private ajax: AjaxService) { }

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

  dataTable6006Service() {
    return $('#table1').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: false,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          'data': 'createDateStr',
          'className': 'ui left aligned'
        }, {
          'data': 'period',
          'className': 'ui left aligned',
        }, {
          'data': 'name',
          'className': 'ui left aligned',
        }, {
          'data': 'ranking',
          'className': 'ui left aligned',
        }, {
          'data': 'sector',
          'className': 'ui left aligned',
        }, {
          'data': 'typeUse',
          'className': 'ui left aligned',
        }, {
          'data': 'totalMonth',
          'className': 'ui right aligned',
        }, {
          'data': 'totalReceipt',
          'className': 'ui right aligned',
        }, {
          'data': 'totalMoney',
          'className': 'ui right aligned',
          render(data) {
            return Utils.moneyFormat(data)
          }
        }
      ],
    });
  }

  dataTable7131ervice() {
    const renderNumber = function (data, type, row, meta) {
      return Utils.isNull($.trim(data))
        ? '-'
        : $.fn.dataTable.render.number(',', '.', 2, '').display(data);
    };
    return $('#table2').DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: false,
      columns: [
        {
          className: 'ui center aligned',
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          'data': 'createdDate',
          'className': 'ui center aligned'
        },
        // {
        //   'data': 'id',
        //   'className': 'ui left aligned',
        // },
        {
          'data': 'fullName',
          'className': 'ui left aligned',
        }, {
          'data': 'position',
          'className': 'ui left aligned',
        }, {
          'data': 'affiliation',
          'className': 'ui left aligned',
        }, {
          'data': 'disease',
          'className': 'ui left aligned',
        }, {
          'data': 'hospitalName',
          'className': 'ui left aligned',
        }, {
          'data': 'hospitalOwner',
          'className': 'ui left aligned',
          render(data) {
            if (data === 'GOVERNMENT') {
              return 'ทางราชการ';
            } else if (data === 'INDIVIDUAL') {
              return 'เอกชน';
            } else {
              return 'ไม่ทราบ';
            }
          }
        }, {
          'data': 'treatedDateFrom',
          'className': 'ui center aligned'
        }, {
          'data': 'treatedDateTo',
          'className': 'ui center aligned',
        }, {
          'data': 'totalMoney',
          'className': 'ui right aligned', render: renderNumber
        }, {
          'data': 'claimStatus',
          'className': 'ui left aligned',
          render(data) {
            if (data === '0') {
              return 'ตามสิทธิ';
            } else if (data === '1') {
              return 'เฉพาะส่วนที่ขาดอยู่จากสิทธิที่ได้รับจากหน่วยงานอื่น';
            } else if (data === '2') {
              return 'เฉพาะส่วนที่ขาดอยู่จากสัญญาประกันภัย';
            }
          }
        }, {
          'data': 'claimMoney',
          'className': 'ui right aligned', render: renderNumber
        },
        // {
        //   'data': 'id',
        //   'className': 'ui center aligned',
        //   render(data) {
        //     return '-';
        //   }
        // }
      ],
    });
  }
}
