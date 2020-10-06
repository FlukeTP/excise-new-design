import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

declare var $: any;
@Component({
  selector: 'app-tax-audit-manage',
  templateUrl: './tax-audit-manage.component.html',
  styleUrls: ['./tax-audit-manage.component.css']
})

export class TaxAuditManageComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'บันทึกข้อความ หนังสือราชการ', route: '#' },
  ];

  typeDocs: String[];
  topics: String[][];
  topic: String[];

  selectDoc: String;
  selectTop: String;

  selectedDoc: String;
  selectedTop: String;

  sent: boolean;

  constructor() {
    // Mock Data
    this.typeDocs = ["บันทึกข้อความ", "แบบ ตส."];
    this.topics = [
      [
        "ขออนุมัติเดินทางไปปฏิบัติราชการ",
        "รายงานผลการตรวจติดตามแนะกำกับดูแล"

      ],

      [
        "ตส. 01-01",
        "ตส. 01-02",
        "ตส. 01-03",
        "ตส. 01-04",
        "ตส. 01-05",
        "ตส. 01-07",
        "ตส. 01-08",
        "ตส. 01-10",
        "ตส. 01-10/1",
        "ตส. 01-11",
        "ตส. 01-13",
        "ตส. 01-14",
        "ตส. 01-14/1",
        "ตส. 01-14/2",
        "ตส. 01-15",
        "ตส. 01-16",
        "ตส. 01-17/1",
        "ตส. 01-18",
        "ตส. 01-19"
      ]
    ];
    this.topic = [];
    this.sent = false; // false
    this.selectedTop = ""; // ''
  }

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  onSelectDoc = event => {
    this.topic = this.topics[event.target.value];
    this.selectDoc = this.typeDocs[event.target.value];
  };

  onSelectTop = event => {
    this.selectTop = this.topic[event.target.value];
  };

  onSubmit = e => {
    e.preventDefault();
    // show form generate pdf
    this.sent = true;
    this.selectedTop = this.selectTop;
  };

  onDiscard = event => {
    // hide form generate pdf
    this.sent = event;
    $('#doc').dropdown('restore defaults');
    $('#topic').dropdown('restore defaults');
  };

}
