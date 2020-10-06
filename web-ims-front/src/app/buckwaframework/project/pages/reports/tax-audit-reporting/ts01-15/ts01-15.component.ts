import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { AjaxService } from '../../../../../common/services';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-15',
  templateUrl: './ts01-15.component.html',
})
export class Ts0115Component implements OnInit {
  obj: Ts0115;
  @Output() discard = new EventEmitter<any>();

  numbers: number[];
  beans: Bean[];

  constructor(private ajax: AjaxService) {
    this.numbers = [1, 2, 3];
    this.beans = [new Bean()];
    this.obj = new Ts0115();
  }

  ngOnInit() {
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    let num = this.numbers[this.numbers.length - 1];
    this.numbers.push(num + 1);
    this.numbers.sort();
  };

  onDelField = index => {
    this.numbers.splice(index, 1);
    this.numbers.sort();
  };

  optionAddress = () => {
    const optionURL = "excise/detail/objectAddressByExciseId";
    this.ajax.post(optionURL, {
      exciseId: this.obj.exciseId
    }, res => {
      console.log(res.json());
      var dat = res.json();

    });
  };

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_15";
    this.obj.Bean = this.beans;
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_15/file");
      }
    });
  };



}
class Ts0115 {
  logo: string = "logo.jpg";
  [x: string]: any;
  Bean: Bean[]
}

class Bean {
  office: string;
  date: string;
  month: string;
  year: string;
  ourself: string;
  account: string;
  exciseRegistration : string;
  addressNumber: string;
  consentor: string;
  inspector: string;
  witness1 : string;
  witness2 : string;
}