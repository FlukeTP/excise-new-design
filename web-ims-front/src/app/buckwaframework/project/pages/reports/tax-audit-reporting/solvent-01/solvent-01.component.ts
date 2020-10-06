import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { AjaxService } from "../../../../../common/services";
declare var $: any;
@Component({
  selector: 'app-solvent-01',
  templateUrl: './solvent-01.component.html',
  styleUrls: ['./solvent-01.component.css']
})
export class Solvent01Component implements OnInit {
  @Output() discard = new EventEmitter<any>();
  numbers: number[];
  obj: Ts0101;
  constructor(
    private messageBarService: MessageBarService,
    private ajax: AjaxService
  ) {
    this.numbers = [1, 2, 3];
    this.obj = new Ts0101();
  }

  ngOnInit() {

    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChanges: (date, text) => {
        $("#periodFrom").val(text);
      }
    });

    $("#time").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา'),
      onChanges: (date, text) => {
        $("#dateTime").val(text);
      }
    });
    $("#time1").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา'),
      onChanges: (date, text) => {
        $("#dateTime1").val(text);
      }
    });
  }
  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    let num = this.numbers.length;
    if (num < 4) {
      this.numbers.push(num + 1);
    } else {
      this.messageBarService.errorModal(
        "ไม่สามารถทำรายการได้",
        "เกิดข้อผิดพลาด"
      );
    }
  };
  onDelField = index => {
    this.obj["analys" + (index + 1)] = "";
    this.obj["psition" + (index + 1)] = "";
    this.numbers.splice(index, 1);
  };

  onSubmit = e => {
    e.preventDefault();
    let date1 = $("#date1 .ui input").val().split(" ");
    this.obj.day = date1[0];
    this.obj.month = date1[1];
    this.obj.year = date1[2];
    this.obj.periodFrom =   $("#periodFrom").val();
    this.obj.dateTime1 = $("#dateTime1 .ui input").val();
    this.obj.dateTime = $("#dateTime .ui input").val();
  
    this.obj.date = $("#from").val();
    this.obj.date = $("#to").val();
    const url = "report/pdf/ts/Solvent-01";
    if (this.obj.agreeBox1 == "factory") {
      this.obj.factory = true;
      this.obj.service = false;  
    } else if (this.obj.agreeBox1 == "service") {
      this.obj.factory = false;
      this.obj.service = true;     
    }else{
      this.obj.factory = false;
      this.obj.service = false;

    }
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/Solvent-01/file");
      }
    });
  };
}



class Ts0101 {
  logo: string = "logo.jpg";
  [x: string]: any;
phone: string;
  writeAt: string;
  date: string;
  dateTime: string;
  dateTime1: string;
  me: string;
  with: string;
  psitionopen: string;
  under: string;
  name : string;
  address :string;  
  which: string; //ซึ่งมี
  status :string;
  idCode : string;
  me1 : string;
  moo : string;
  factory: boolean;
  service: boolean;

  analys1: string;
  analys2: string;
  analys3: string;
  analys4: string;
  analys5: string;

 //  psition
  psition1: string;
  psition2: string;
  psition3: string;
  psition4: string;
  psition5: string;

  
  homeNumber1: string;
  byWay1: string;
  street1: string;
  tambol1: string;
  district1: string;
  province1: string;
  zipCode1: string;
}
