import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AjaxService } from "../../../../../common/services";
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-10-1',
  templateUrl: './ts01-10-1.component.html',
  styleUrls: ['./ts01-10-1.component.css']
})
export class Ts01101Component implements OnInit {
  obj: Ts011001;
  @Output() discard = new EventEmitter<any>();

  constructor(private ajax: AjaxService) {
    this.obj = new Ts011001();
  }

  ngOnInit() {
   
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };
  
  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_10_1";
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_10_1/file");
      }
    });
  };

}
class Ts011001 {
  [x: string]: any;
  number: string;
  item: string;
}