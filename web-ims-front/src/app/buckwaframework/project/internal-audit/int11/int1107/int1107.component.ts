import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';


declare var $: any;

@Component({
  selector: 'app-int1107',
  templateUrl: './int1107.component.html',
  styleUrls: ['./int1107.component.css']
})
export class Int1107Component implements OnInit {

  inspectionWorkList: any[] = [];
  searchForm: FormGroup;
  submitted: any;
  inspectionWork: any;
  budgetYearCa: any;
  dataTable: any;
  datacheckEmty: any;
  datas: any = [];
  table: boolean = false;
  table2: boolean = false;
  table3: boolean = false;
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตามอธิบดี", route: "#" }
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageBar: MessageBarService,
    private ajaxService: AjaxService,
  ) { }

  ngOnInit() {
    this.initVariable();
    this.inspectionWorkDropdown();
  }

  ngAfterViewInit() {
    this.calendar();
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")
    setTimeout(() => {
      $('#inspectionWork').dropdown('set selected', this.inspectionWorkList[0].paramCode)
    }, 200)
    // this.initDatatable();
  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      inspectionWork: ["", Validators.required]
    });
  }

  calendar() {
    $("#budgetyearCld").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.budgetYearCa = text
        this.getDataList();
      }
    }).calendar("set date", '2561')
  }

  inspectionWorkDropdown = () => {
    // const URL = "api/preferences/parameter-info";
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่' }]
  }


  search(e) {
    console.log(this.searchForm.value.inspectionWork);
    if (this.searchForm.value.inspectionWork == 3) {
      this.table = true
      this.table2 = false
      this.table3 = false

    } else if (this.searchForm.value.inspectionWork == 4) {
      this.table = false
      this.table2 = true
      this.table3 = false
    } else if (this.searchForm.value.inspectionWork == 5) {
      this.table = false
      this.table2 = false
      this.table3 = true
    }
    this.getDataList();
  }


  // getlistConfigAll = () => {
  //   var URL = "ia/int11/iaConcludeFollowHdrList";
  //   this.ajaxService.post(URL, this.searchForm.value, res => {
  //     this.datas = res.json();
  //     console.log(this.datas  );

  //   })
  // }

  getDataList() {
    this.searchForm.patchValue({
      budgetYear: this.budgetYearCa
    })
    const url = "ia/int11/07/iaConcludeFollowHdrList07"
    this.ajaxService.doPost(url, this.searchForm.value).subscribe((res: ResponseData<any>) => {
      console.log("getDataTableList", res);
      this.datas = res.data;
      this.datacheckEmty = this.datas.length;

      // this.dataTable.clear().draw()
      // this.dataTable.rows.add(this.datas).draw()
      // this.dataTable.columns.adjust().draw();
    })
  }



  // initDatatable () {
  //   this.dataTable = $("#dataTable").DataTableTh({
  //     lengthChange: false,
  //     searching: false,
  //     processing: true,
  //     ordering: false,
  //     scrollX: true,
  //     data : this.datas,
  //     columns: [
  //       {
  //         className: "ui center aligned",
  //         render: function (data, type, row, meta) {
  //           return meta.row + meta.settings._iDisplayStart + 1;
  //         }
  //       }, {
  //         data: "projectName",
  //         className: "ui",
  //       }, {
  //         data: "budgetYear",
  //         className: "ui",
  //       },
  //       {
  //         data: "checkType",
  //         className: "ui",
  //       },
  //       {
  //         data: "dateFrom",
  //         className: "ui",
  //         render(data){
  //           return new DateStringPipe().transform(data , false)
  //         }
  //       },
  //       {
  //         data: "dateTo",
  //         className: "ui",
  //         render(data){
  //           return new DateStringPipe().transform(data , false)
  //         }
  //       },
  //       {
  //         data: "approvers",
  //         className: "ui",
  //       },
  //       {
  //         data: "checkStatus",
  //         className: "ui",
  //       },
  //       {
  //         data: "approveDateString",
  //         className: "ui"
  //       },
  //       {
  //         data: "notation",
  //         className: "ui",
  //       },    
  //       {
  //         className: "ui center aligned",
  //         render: function (data) {
  //           var button = '';
  //           button += '<button type="button" class="ui mini blue button description-button">รายละเอียดรายงานผล</button> ';
  //           return button
  //         }
  //       },
  //     ],
  //   });
  //   this.dataTable.on("click", "td > button.description-button", (event) => {
  //     var data = this.dataTable.row($(event.currentTarget).closest("tr")).data();
  //     this.router.navigate(['/int11/02'], {
  //       queryParams: {
  //         idHdr: data.id
  //       }
  //     });
  //   })
  // }

  routeTo(parth: string, fontDetailId: number) {
    this.router.navigate([parth], {
      queryParams: {
        idHdr: fontDetailId
      }
    })
  }
}
