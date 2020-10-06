import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';

declare var $: any;
@Component({
  selector: 'app-ope0613',
  templateUrl: './ope0613.component.html',
  styleUrls: ['./ope0613.component.css']
})
export class Ope0613Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];

  constructor() {
    this.breadcrumb = [
      { label: "ตรวจปฏิบัติการ", route: "#" },
      { label: "แผนงานการออกตรวจ", route: "#" }
    ];
  }

  ngOnInit() {
    $(".ui.checkbox").checkbox();
    $(".ui.dropdown").dropdown();
  }

  clickCheckAll = event => {
    if (event.target.checked) {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", true);
      });
    } else {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", false);
      });
    }
  };
}
