import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { formatter, TextDateTH } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-ts0101',
  templateUrl: './ts0101.component.html',
  styleUrls: ['./ts0101.component.css']
})

export class Ts0101Component implements OnInit {
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
    this.calenda();
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    let num = this.numbers.length;
    if (num < 5) {
      this.numbers.push(num + 1);
    } else {
      this.messageBarService.errorModal(
        "ไม่สามารถทำรายการได้",
        "เกิดข้อผิดพลาด"
      );
    }
  };
  calenda = () => {
    $("#date1").calendar({
      endCalendar: $("#date1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChanges: (date, text) => {
        $("#from").val(text);
      }

    });
    $("#date2").calendar({
      startCalendar: $("#date1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChanges: (date, text) => {
        $("#to").val(text);
      }
    });
    $("#date3").calendar({
      startCalendar: $("#date3"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')

    });
  }
  onDelField = index => {
    this.obj["analys" + (index + 1)] = "";
    this.numbers.splice(index, 1);
  };

  onSubmit = e => {
    e.preventDefault();
    this.obj.date = $("#from").val();
    this.obj.date = $("#to").val();
    const url = "report/pdf/ts/mis_t_s_01_01";
    if (this.obj.agreeBox == "accept") {
      this.obj.accept = true;
      this.obj.other = false;
    } else {
      this.obj.accept = false;
      this.obj.other = true;
    }
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        // var byteArray = new Uint8Array(res.json());
        // var blob = new Blob([byteArray], { type: "application/pdf" });
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   window.navigator.msSaveOrOpenBlob(blob);
        // } else {
        //   var objectUrl = URL.createObjectURL(blob);
        //   window.open(objectUrl);
        // }
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_01/file");
      }
    });
  };
}

class Ts0101 {
  logo: string = "logo.jpg";
  [x: string]: any;
  item: string;
  workType: string;
  exciseId: string;
  address: string;
  sendTo: string;
  reasonTxt: string;
  agreeBox: string;
  accept: boolean;
  other: boolean;
  otherTxt: string;
  analysName: string;
  analysControl: string;

  // From To
  to: string;
  from: string;
  // analys
  analys1: string;
  analys2: string;
  analys3: string;
  analys4: string;
  analys5: string;
}
