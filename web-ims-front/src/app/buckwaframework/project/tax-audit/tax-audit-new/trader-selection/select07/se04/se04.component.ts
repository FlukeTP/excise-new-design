import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { formatter, TextDateTH } from 'helpers/datepicker';
declare var $: any;
@Component({
  selector: 'app-se04',
  templateUrl: './se04.component.html',
  styleUrls: ['./se04.component.css'],
  providers: []
})
export class Se04Component implements OnInit {
  breadcrumb: BreadCrumb[] = [   
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'สรุปผลการตรวจสอบสอบภาษี', route: '#' }
  ];

  radioCheck: boolean = true;

  constructor(
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.calenda();
  }

  calenda = () => {
    $("#calendar1").calendar({
      endCalendar: $("#calendar2"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date) => {
      }
    });
    $("#calendar2").calendar({
      startCalendar: $("#calendar1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date) => {
      }
    });
  }
  onRadio(num) {
    if (1 == num) {
      this.radioCheck = true;
    } else {
      this.radioCheck = false;
    }
  }

}
