import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AjaxService } from "../../../../../common/services";
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-10',
  templateUrl: './ts01-10.component.html',
  styleUrls: ['./ts01-10.component.css']
})
export class Ts0110Component implements OnInit {

  @Output() discard = new EventEmitter<any>();
  obj: Ts0110;

  numbers:number[];

  constructor(
    private ajax: AjaxService
  ) {
    this.obj = new Ts0110();
    this.numbers = [1,2,3];
  }

  ngOnInit() {
    $('#date1').calendar({
      type: 'date',
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
    const url = "report/pdf/ts/mis_t_s_01_10";

    // Date
    let date = $("#date1 .ui input").val().split(" ");
    this.obj.day = date[0];
    this.obj.month = date[1];
    this.obj.year = date[2];
   
    if (this.obj.agreeBox == "ssn") {
      this.obj.ssn = true;
      this.obj.passport = false;
      this.obj.other = false;
    } else if (this.obj.agreeBox == "passport") {
      this.obj.ssn = false;
      this.obj.passport = true;
      this.obj.other = false;
    } else if (this.obj.agreeBox == "other") {
      this.obj.ssn = false;
      this.obj.passport = false;
      this.obj.other = true;
    }
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_10/file");
      }
    });
  };

}

class Ts0110 {
  logo: string = "logo1.jpg";
  [x: string]: any;
  name1: string;
  subject: string;
  day: string;
  month: string;
  year: string;
  item1: string;
  position: string;
  name2: string;
  age: string;
  nationality: string;
  race: string;

  homeNumber: string;
  building: string;
  roomNumber: string;
  level: string;
  byWay: string;
  street: string;
  tambol: string;
  district: string;
  province: string;
  zipCode: string;
  phoneNumber: string;
  agreeBox: string;
  ssn: boolean;
  passport: boolean;
  other: boolean;
  otherTxt: string;
  number: string;
  location: string;
  country: string;
  relationship: string;
  item2: string;
  exciseId: string;
  item3: string;
}