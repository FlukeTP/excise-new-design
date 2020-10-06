import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { TextDateTH, formatter } from 'helpers/datepicker';
declare var $: any;
@Component({
  selector: 'app-ope040901',
  templateUrl: './ope040901.component.html',
  styleUrls: ['./ope040901.component.css']
})
export class Ope040901Component implements OnInit, AfterViewInit {


  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "รายการควบคุม", route: "#" },
    { label: "รายละเอียด", route: "#" },
  ];
  constructor() { }

  ngOnInit() {

  }
  ngAfterViewInit(): void {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {

      }
    });
    $("#calendar2").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {

      }
    });
    $("#calendar3").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter('วดป'),
      onChange: (date) => {

      }
    });
  }

}
