import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { AjaxService } from '../../../../../common/services';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-19',
  templateUrl: './ts01-19.component.html',
})
export class Ts0119Component implements OnInit {
  obj: Ts0119;
  @Output() discard = new EventEmitter<any>();
  constructor(private ajax: AjaxService) {
    this.obj = new Ts0119();
  }

  ngOnInit() {
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
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
    const url = "report/pdf/ts/mis_t_s_01_19";
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_19/file");
      }
    });
  };
}
class Ts0119 {
  logo: string = "logo.jpg";
  [x: string]: any;

}