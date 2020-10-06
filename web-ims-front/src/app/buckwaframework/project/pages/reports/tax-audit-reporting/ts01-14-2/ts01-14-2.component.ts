import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { AjaxService } from '../../../../../common/services';
import { ThaiNumber } from '../../../../../common/helper';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-14-2',
  templateUrl: './ts01-14-2.component.html',
  styleUrls: ['./ts01-14-2.component.css']
})
export class Ts01142Component implements OnInit {

  @Output() discard = new EventEmitter<any>();

  obj: Ts01142;
  beans: Bean[];

  constructor(private ajax: AjaxService) {
    this.obj = new Ts01142();
    this.beans = [new Bean];
  }

  ngOnInit() {
    $('#begin_date').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
    $('#end_date').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
    $('#nut_date').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
    $('#nut1_date').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter()
    });
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    this.beans.push(new Bean());
  };
  
  onDelField = index => {
    this.beans.splice(index, 1);
  };
  
  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_14_2";
    this.obj.Bean = this.beans;
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_14_2/file");
      }
    });
  };
  
  onKeyUp = (e: any, str: string) => {
    e.preventDefault();
    this.obj[str] = ThaiNumber(e.target.value.toString());
  };

  onKeyUpBean = (e: any, str: string, index) => {
    e.preventDefault();
    this.beans[index][str] = ThaiNumber(e.target.value.toString());
  };
}

class Ts01142 {
  [x: string]: any;
  logo: string = "logo.jpg";
  taxPayer: string;
  department: string;
  dateFrom: string;
  productType: string;
  exicseId: string;
  taxChecker: string;
  day: string;
  month: string;
  year: string;
  chk1: boolean = false;
  chk2: boolean = false;
  chk3: boolean = false;
  Bean: Bean[];
}

class Bean {
  [x: string]: any;
  date: string;
  locateAt: string;
  valueFromChk: string;
  taxRate: string;
  taxExcise: string;
  taxPaid: string;
  tax: string;
  chip: string;
  extra: string;
  total: string;
  taxLocal: string;
  taxTotal: string;
  month: string;
}