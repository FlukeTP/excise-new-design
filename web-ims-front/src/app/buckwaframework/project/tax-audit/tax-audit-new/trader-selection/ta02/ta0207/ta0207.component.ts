import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TextDateTH, formatter } from 'helpers/datepicker';
declare var $: any;

@Component({
  selector: 'app-ta0207',
  templateUrl: './ta0207.component.html',
  styleUrls: ['./ta0207.component.css']
})
export class Ta0207Component implements OnInit, AfterViewInit {

  loading: boolean = false;
  tableItems: any[];

  constructor(
  ) {
    this.tableItems = [
      {
        docName: "ข้อมูลคำขอจดทะเบียนสรรพสามิต (ภส.๐๑-๐๑)"
      }, {
        docName: "แบบรายการภาษีสรรพสามิต (ภส.๐๓-๐๗, ภส.๐๓-๐๘)"
      }, {
        docName: "ข้อมูลแบบแจ้งราคาขาย (ภส.๐๒-๐๒)"
      }, {
        docName: "ข้อมูลแบบงบเดือน (ภส.๐๗-๐๔, ภส.๐๗-๐๖)"
      }, {
        docName: "ข้อมูลบัญชีประจำเดือน (ภส.๐๗-๐๑)"
      }
    ]
  }

  // ================ set Initial ==============
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    $('.ui.checkbox').checkbox();
    this.callDropdown();
    for (let index = 0; index < this.tableItems.length; index++) {
      this.calendar(index);
    }
  }

  callDropdown() {
    setTimeout(() => {
      $(".dropdown").dropdown();
    }, 100);
  }

  calendar(id: number) {
    $(`#startDate${id}`).calendar({
      endCalendar: $(`#endDate${id}`),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
      }
    });
    $(`#endDate${id}`).calendar({
      startCalendar: $(`#startDate${id}`),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
      }
    });
  }
}
