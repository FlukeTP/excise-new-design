import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from '../../../../../common/services';

import { ActivatedRoute } from "@angular/router";
import { Utils } from 'helpers/utils';
declare var $: any;
@Component({
  selector: 'app-ts01-18',
  templateUrl: './ts01-18.component.html',
  styleUrls: ['./ts01-18.component.css']
})
export class Ts0118Component implements OnInit {
  beans: Bean[];

  @Output() discard = new EventEmitter<any>();

  obj: ts18;
  numbers: number[];
  constructor(private ajax: AjaxService, private route: ActivatedRoute, ) {
    this.beans = [new Bean];
    this.obj = new ts18();
    this.numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
    $('#date').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChanges: (date, text) => {
        $("#to1").val(text);
      }
    });

  }

  onDiscard() { }


  onAddField = () => {
    this.beans.push(new Bean());

  };
  onDelField = index => {
    this.beans.splice(index, 1);
  };
  // optionAddress = () => {
  //   const optionURL = "excise/detail/objectAddressByExciseId";
  //   this.ajax.post(optionURL, {
  //     exciseId: this.obj.exciseId
  //   }, res => {
  //     console.log(res.json());
  //     var dat = res.json();

  //   });
  // };

  optionAddress = () => {
    const optionURL = "excise/detail/objectAddressByExciseId";
    this.ajax.post(optionURL, {
    }, res => {
      console.log(res.json());
      var dat = res.json();
      this.obj.atNumber1 = dat.atNumber1;
      this.obj.atNumber2 = dat.atNumber2;
      this.obj.date = dat.date;
      this.obj.nameOfTax = dat.nameOfTax;
      this.obj.name = dat.name;
      this.obj.exciseRegistration = dat.exciseRegistration;
      this.obj.islocated = dat.islocated;
      this.obj.byProvisions = dat.byProvisions;
      this.obj.group = dat.group;
      this.obj.periodFrom = dat.periodFrom;
      this.obj.taxBreak = dat.taxBreak;
      this.obj.reasons = dat.reasons;
    });
  };



  onSubmit = e => {
    let date1 = $("#date .ui input").val().split(" ");
    this.obj.day = date1[0];
    this.obj.month = date1[1];
    this.obj.year = date1[2];

    this.obj.periodFrom = $("#periodFrom").val();
    this.obj.Bean = this.beans;
    e.preventDefault();

    console.log(Utils.thaiBaht(this.obj.amount));

    const url = "report/pdf/ts/mis_t_s_01_18-1";
    if (this.obj.agreeBox1 == "factory") {
      this.obj.factory = true;
      this.obj.service = false;
      this.obj.company = false;
    } else if (this.obj.agreeBox1 == "service") {
      this.obj.factory = false;
      this.obj.service = true;
      this.obj.company = false;
    } else if (this.obj.agreeBox1 == "company") {
      this.obj.factory = false;
      this.obj.service = false;
      this.obj.company = true;
    } else {
      this.obj.factory = false;
      this.obj.service = false;
      this.obj.company = false;
    }

    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_18-1/file");
      }
    });
  };


}
class ts18 {
  day: string;
  month: string;
  year: string;
  [x: string]: any;
  atNumber1: string;
  atNumber2: string;
  date: string;
  nameOfTax: string;
  name: string;
  agreeBox1: string;
  agreeBox2: string;
  agreeBox3: string;
  amount: string;
  exciseRegistration: string;
  islocated: string;
  byProvisions: string;
  group: string;
  periodFrom: string;
  taxBreak: string;
  reasons: string;
  addresc: string;
  factory: boolean;
  service: boolean;
  company: boolean;
}
class Bean {
  [x: string]: any;

  coordinates: string;
  number: string;
  expectedValue: string;
  brand: string;
  tax: string;
  fine: string;
  extraMoney: string;
  included1: string;
  sss: string;
  sst: string;
  sat: string;
  other: string;
  included2: string;
  government: string;
  includetax: string;
  o: string;
  p: string;
  q: string;
  r: string;

}
