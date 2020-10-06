import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { formatter, TextDateTH } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-rm01',
  templateUrl: './rm01.component.html',
  styleUrls: ['./rm01.component.css']
})
export class Rm01Component implements OnInit {
  @Output() discard = new EventEmitter<any>();

  obj: getAdd;
  constructor(private route: ActivatedRoute,
    private ajax: AjaxService) {
    this.obj = new getAdd();
  }

  ngOnInit() {
    this.calenda();
  }

  onSubmit = e => {
    console.log(this.obj);
    this.obj.date = $("#date").val();
    this.obj.accordingToPlan1 = $("#accordingToPlan1").val();
    this.obj.accordingToPlan2 = $("#accordingToPlan2").val();
    const url = "report/pdf/ts/ApprovedToGoToWork";
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/ApprovedToGoToWork/file");
      }
    });
  };

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };


  calenda = () => {
    $("#date1").calendar({
      endCalendar: $("#date1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChanges: (date, text) => {
        $("#date").val(text);
      }

    });
    $("#date2").calendar({
      startCalendar: $("#date2"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
      ,
      onChanges: (date, text) => {
        $("#accordingToPlan1").val(text);
      }

    });
    $("#date3").calendar({
      startCalendar: $("#date3"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
      ,
      onChanges: (date, text) => {
        $("#accordingToPlan2").val(text);
      }

    });
  }
}

class getAdd {
  logo: string = "logo1.jpg";
  governmentService: string;
  date: string;
  subject: string;
  study: string;
  travelToWork: string;
  travelToWork1: string;
  travelToWork2: string;
  travelToWork3: string;
  travelToWork4: string;
  travelToWork5: string;
  accordingToPlan1: string;
  accordingToPlan2: string;
  companyAccount1: string;
  companyAccount2: string;
  companyAccount3: string;
  companyAccount4: string;
  companyAccount5: string;
  budget: string;
} 