import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AjaxService } from "../../../../../common/services";
import { ThaiNumber, TextDateTH, formatter } from "../../../../../common/helper";
declare var $: any;
@Component({
  selector: "app-ts01-07",
  templateUrl: "./ts01-07.component.html",
  styleUrls: ["./ts01-07.component.css"]
})
export class Ts0107Component implements OnInit {
  @Output() discard = new EventEmitter<any>();

  add: number;

  obj: Ts0107;

  constructor(private ajax: AjaxService) {
    this.add = 0;
    this.obj = new Ts0107();
  }

  ngOnInit() {
    $("#date").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $("#outDate").calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
    });
  }

  onDiscard() { }

  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_07";
    // Date
    this.obj.day = $("#date .ui input").val().split(" ")[0];
    this.obj.month = $("#date .ui input").val().split(" ")[1];
    this.obj.year = $("#date .ui input").val().split(" ")[2];
    this.obj.outDate = $("#outDate .ui input").val();

    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_07/file");
      }
    });
  };
}

class Ts0107 {
  [x: string]: any;
  logo: string = "logo1.jpg";

  at1: string;
  at2: string;

  office: string;

  day: string;
  month: string;
  year: string;

  giveTo: string;
  giveTo1: string;
  giveTo2: string;
  giveTo3: string;
  giveTo4: string;
  giveTo5: string;

  position: string;
  position1: string;
  position2: string;
  position3: string;
  position4: string;
  position5: string;

  department: string;
  name: string;

  exciseId: string;
  homeNumber: string;
  moo: string;
  byWay: string;
  street: string;
  tambol: string;
  district: string;
  province: string;
  zipCode: string;

  outDate: string;
  section: string;
  cName: string;
  cPoition: string;

  chk1: boolean = false;
  chk2: boolean = false;
  chk3: boolean = false;
}
