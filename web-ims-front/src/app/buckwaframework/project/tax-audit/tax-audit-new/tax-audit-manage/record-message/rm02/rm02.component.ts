import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AjaxService } from 'services/ajax.service';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-rm02',
  templateUrl: './rm02.component.html',
  styleUrls: ['./rm02.component.css']
})
export class Rm02Component implements OnInit {
  @Output() discard = new EventEmitter<any>();
  obj: followSupervision;

  constructor(private route: ActivatedRoute,
    private ajax: AjaxService) {
    this.obj = new followSupervision();

  }


  ngOnInit() {
    this.calenda();

  }

  calenda = () => {
    $("#date1").calendar({
      endCalendar: $("#date1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป')
      ,
      onChanges: (date, text) => {
        $("#date").val(text);
      }

    });
  }

  onSubmit = e => {
    console.log(this.obj);
    this.obj.date = $("#date").val();
    var form = document.createElement("form");
    form.method = "POST";
    form.action = AjaxService.CONTEXT_PATH + "report/pdf/oa/ask-for-money-report";
    form.style.display = "none";
    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.obj);
    form.appendChild(jsonInput);

    document.body.appendChild(form);
    form.submit();

    // const url = "report/pdf/oa/ask-for-money-report";   
    // this.ajax.post(url,`'${JSON.stringify(this.obj).toString()}'`, res => {
    //   if (res.status == 200 && res.statusText == "OK") {
    //     window.open("/ims-webapp/api/report/pdf/oa/ask-for-money-report/file");
    //   }
    // });

  };
  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };
}
class followSupervision {
  governmentService: string;
  date: string;
  subject: string;
  study: string;
  actionMonitoring: string;
  resultsAre: string;
  fromOperation: string;
}
