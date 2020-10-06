import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { threadId } from 'worker_threads';
declare var $: any;
@Component({
  selector: 'app-se05',
  templateUrl: './se05.component.html',
  styleUrls: ['./se05.component.css'],
  providers: []
})
export class Se05Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'ดาวน์โหลดเอกสาร', route: '#' }
  ];

  constructor(
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.calenda();
  }

  calenda = () => {
    $("#calendar").calendar({
      endCalendar: $("#calendar1"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
    $("#calendar1").calendar({
      startCalendar: $("#calendar"),   
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });

    $("#calendar2").calendar({
      endCalendar: $("#calendar3"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
    $("#calendar3").calendar({
      startCalendar: $("#calendar2"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });

    $("#calendar4").calendar({
      endCalendar: $("#calendar5"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
    $("#calendar5").calendar({
      startCalendar: $("#calendar4"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });

    $("#calendar6").calendar({
      endCalendar: $("#calendar7"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
    $("#calendar7").calendar({
      startCalendar: $("#calendar6"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });

    $("#calendar8").calendar({
      endCalendar: $("#calendar9"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
    $("#calendar9").calendar({
      startCalendar: $("#calendar8"),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {
      }
    });
  }

}
