import { Component, OnInit, Output, EventEmitter } from "@angular/core";

import { TextDateTH, formatter } from "../../../../../common/helper/datepicker";
import { AjaxService } from "../../../../../common/services";
import { ThaiNumber } from "../../../../../common/helper";
declare var $: any;

@Component({
  selector: "app-ts01-05",
  templateUrl: "./ts01-05.component.html",
  styleUrls: ["./ts01-05.component.css"]
})
export class Ts0105Component implements OnInit {
  @Output() discard = new EventEmitter<any>();

  obj: Ts0105;
  numbers: any[] = [];

  constructor(private ajax: AjaxService) {
    this.obj = new Ts0105();
  }

  ngOnInit() {
    $("#time1").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา')
    });
    $("#time2").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา')
    });
    $("#date").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $("#date1").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $("#date2").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $("#date3").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_05";
    // Date
    let date = $("#date .ui input").val().split(" ");
    this.obj.day = date[0];
    this.obj.month = date[1];
    this.obj.year = date[2];
    // Dates
    this.obj.date1 = $("#date1 .ui input").val();
    this.obj.date2 = $("#date2 .ui input").val();
    this.obj.date3 = $("#date3 .ui input").val();
    // Times
    this.obj.time1 = $("#time1 .ui input").val();
    this.obj.time2 = $("#time2 .ui input").val();
    // Monitor
    console.log(this.obj);
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_05/file");
      }
    });
  };
}

class Ts0105 {
  [x: string]: any;
  logo: string = "logo1.jpg";
  at1: string;
  at2: string;
  office: string;
  topic: string;
  day: string;
  month: string;
  year: string;
  sendTo: string;
  date1: string;
  date2: string;
  date3: string;
  time1: string;
  time2: string;
  item1: string;
  item2: string;
  item3: string;
  checker: string;
  position: string;
}
