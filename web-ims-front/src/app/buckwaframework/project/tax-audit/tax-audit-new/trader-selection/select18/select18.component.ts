import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;

@Component({
  selector: 'app-select18',
  templateUrl: './select18.component.html',
  styleUrls: ['./select18.component.css']
})
export class Select18Component implements OnInit {
  breadcrumb: BreadCrumb[] = [   
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'แผนการตรวจสอบประจำปี', route: '#' },
    { label: 'กำหนดวันที่ออกตรวจ', route: '#' }
  ];
  constructor() { }

  ngOnInit() {
  }


  ngAfterViewInit(): void {
    this.calenda();
  }

  calenda = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter()     
    });
  }
  
}
