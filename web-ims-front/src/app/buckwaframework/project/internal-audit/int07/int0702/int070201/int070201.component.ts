import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AjaxService } from "../../../../../common/services/ajax.service";
import { MessageBarService } from "../../../../../common/services/message-bar.service";
import { Headers, Http } from "@angular/http";

import { formatter, TextDateTH } from 'helpers/index';
import { BreadCrumb } from 'models/index';
declare var $: any;

@Component({
  selector: "app-int070201",
  templateUrl: "./int070201.component.html",
  styleUrls: ["./int070201.component.css"]
})
export class Int070201Component implements OnInit {
  $form: any;
  $header: Headers;
  fileExel: File[];
  datatable: any;
  datas: AssetWorkSheet[];
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบพัสดุ", route: "#" },
    { label: "ตรวจสอบสินทรัพย์", route: "#" },
    { label: "ตรวจสอบสินทรัพย์แบบอัพโหลด", route: "#" }
  ];

  constructor(
    private ajaxService: AjaxService,
    private messageBarService: MessageBarService
  ) {
    this.fileExel = new Array<File>();
    this.datas = [];
  }

  ngOnInit() {
    this.$form = $('#assetBalanceForm');
    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $('#date2').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
  }

  ngAfterViewInit() {
    this.initDatatable();
  }

  clearFile() {
    $("#file").val("");
    this.datas = [];
    this.datatable.clear().draw();
    this.datatable.rows.add(this.datas).draw();
    this.datatable.columns.adjust().draw();
  }

  onUpload = (event: any) => {
    event.preventDefault();
    this.$form.addClass("loading");

    const form = $("#assetBalanceForm")[0];
    let formBody = new FormData(form);

    let url = "ia/int053/upload";
    this.datas = [];
    this.ajaxService.upload(
      url,
      formBody,
      res => {
        let resBody = res.json();
        if (resBody.errorMessage) {
          this.messageBarService.errorModal(resBody.errorMessage);
          this.$form.removeClass("loading");
          return;
        }
        this.datas = resBody.assetWorkSheets as AssetWorkSheet[];
        this.datatable.clear().draw();
        this.datatable.rows.add(this.datas).draw();
        this.datatable.columns.adjust().draw();
        this.$form.removeClass("loading");
      },
      err => {
        let body: any = err.json();
        this.messageBarService.errorModal(body.error);
        this.$form.removeClass("loading");
      }
    );
  };

  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.fileExel = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  initDatatable(): void {
    this.datatable = $("#dataTable").DataTable({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: false,
      columns: [
        {
          data: "assetNumber",
          className: "right aglined"
        },
        {
          data: "assetSubNumber",
          className: "right aglined"
        },
        {
          data: "fundTransferDate",
          className: "center aglined"
        },
        {
          data: "assetDescription"
        },
        {
          data: "acquisitionValue",
          className: "right aglined"
        },
        {
          data: "accumulatedDepreciation",
          className: "right aglined"
        },
        {
          data: "bookValue",
          className: "right aglined"
        }
      ]
    });
  }

  processCheckData() {
    if (this.datatable.data().count() == 0) {
      this.messageBarService.alert(
        "กรุณาอัพโหลดไฟล์ก่อนเลือกตรวจสอบข้อมูล",
        "แจ้งเตือน"
      );
      return;
    }
  }
}

class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}

class AssetWorkSheet {
  assetWorkSheetId: string;
  accumulatedDepreciation: string;
  acquisitionValue: string;
  assetDescription: string;
  assetNumber: string;
  assetSubNumber: string;
  bookValue: string;
  fundTransferDate: any;
  indexValue: any;
}
