import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { AjaxService } from '../../../../../common/services';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-16',
  templateUrl: './ts01-16.component.html',
})
export class Ts0116Component implements OnInit {
  obj: Ts0116;
  @Output() discard = new EventEmitter<any>();

  numbers: number[];
  numbers2: number[];

  constructor(private ajax: AjaxService) {
    this.numbers = [1, 2, 3];
    this.numbers2 = [1, 2, 3];
    this.obj = new Ts0116();
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

  onAddField2 = () => {
    let num = this.numbers2[this.numbers2.length - 1];
    this.numbers2.push(num + 1);
    this.numbers2.sort();
  };

  onDelField2 = index => {
    this.numbers2.splice(index, 1);
    this.numbers2.sort();
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
    const url = "report/pdf/ts/mis_t_s_01_16";
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_16/file");
      }
    });
  };

}
class Ts0116 {
  logo: string = "logo.jpg";
  [x: string]: any;
  account: string;
  study: string;
  factory: string;
  brothel: string;
  entrepreneurialImporter: string;
  exciseTaxNumber: string;
  filingDate : string;
  month : string;
  buddhist : string;
  knife : string;
  reduceRequest : string;
  fine : string;
  extraMoney : string;
  
}