import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AjaxService } from "../../../../../common/services";
import { ThaiNumber } from "../../../../../common/helper";

@Component({
  selector: "app-ts01-14-1",
  templateUrl: "./ts01-14-1.component.html",
  styleUrls: ["./ts01-14-1.component.css"]
})
export class Ts01141Component implements OnInit {
  @Output() discard = new EventEmitter<any>();
  obj: Ts01141;

  constructor(private ajax: AjaxService) {
    this.obj = new Ts01141();
  }

  ngOnInit() {}

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_14_1";
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_14_1/file");
      }
    });
  };
  
  onKeyUp = (e: any, str: string) => {
    e.preventDefault();
    this.obj[str] = ThaiNumber(e.target.value.toString());
  };
}

class Ts01141 {
  [x: string]: any;
  logo: string = "logo.jpg";
  sendTo: string;
  day: string;
  month: string;
  years: string;
  resultFor: string;
  businessType: string;
  exciseId: string;
  dateFrom: string;
  details: string;
}
