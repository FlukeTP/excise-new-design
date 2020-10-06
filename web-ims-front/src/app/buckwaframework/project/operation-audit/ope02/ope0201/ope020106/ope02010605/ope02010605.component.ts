import { Component, OnInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/index';

declare var $: any;

@Component({
  selector: 'app-ope02010605',
  templateUrl: './ope02010605.component.html',
  styleUrls: ['./ope02010605.component.css']
})
export class Ope02010605Component implements OnInit {

  constructor() { }

  ngOnInit() {
    this.calendar();
  }

  calendar() {
    $("#startCld").calendar({
      endCalendar: $('#endCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter("ด"),
      onChange: (date, text) => {
        // this.searchForm.get('budgetYear').patchValue(text);
      }
    });

    $("#endCld").calendar({
      startCalendar: $('#startCld'),
      type: "month",
      text: TextDateTH,
      formatter: formatter("ด"),
      onChange: (date, text) => {
        // this.searchForm.get('budgetYear').patchValue(text);
      }
    });
  }

}
