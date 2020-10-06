import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AjaxService } from "../../../../../common/services";
import { ThaiNumber } from "../../../../../common/helper";

@Component({
  selector: "app-ts01-08",
  templateUrl: "./ts01-08.component.html",
  styleUrls: ["./ts01-08.component.css"]
})
export class Ts0108Component implements OnInit {
  @Output() discard = new EventEmitter<any>();

  add: number;
  obj: Ts0108;
  beans: Bean[];

  constructor(private ajax: AjaxService) {
    this.add = 0;
    this.obj = new Ts0108();
    this.beans = [new Bean()];
  }

  ngOnInit() {
    this.onAddField();
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    this.beans.push(new Bean());
    this.add++;
  };

  removeField = i => {
    this.beans.splice(i, 1);
  };

  onKeyUpBean = (e: any, str: string, index: any) => {
    e.preventDefault();
    this.beans[index][str] = ThaiNumber(e.target.value.toString());
  };
  
  onKeyUp = (e: any, str: string) => {
    e.preventDefault();
    this.obj[str] = ThaiNumber(e.target.value.toString());
  };

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_08";
    this.obj.Bean = this.beans;
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_08/file");
      }
    });
  };
}

class Ts0108 {
  Bean: Bean[];
}

class Bean {
  [x: string]: any;
  numId: string;
  chkDate: string;
  checkName: string;
  position: string;
  chkOutDate: string;
  chkWhere: string;
  chkWhat: string;
  whoToSign: string;
  checkerOk: string;
  dateToSend: string;
  note: string;
}
