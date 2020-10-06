import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import datepicker, { TextDateTH, formatter } from 'helpers/datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

const URLS = {
  GET_DATA: "ia/int11/iaConcludeFollowHdrList"
}

@Component({
  selector: 'app-int11',
  templateUrl: './int11.component.html',
  styleUrls: ['./int11.component.css']
})
export class Int11Component implements OnInit {

  dropdownRisk: any[] = [];
  tableMock: any = [];
  tableMock2: any = [];
  tableMock3: any = [];
  inspectionWorkList: any[] = [];
  searchForm: FormGroup;
  submitted: any;
  budgetYear: any;
  datas: any = [];
  datacheckEmty: any;
  dataTable: any;
  inspecworkto: any;
  table: boolean = false;
  table2: boolean = false;
  table3: boolean = false;

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "สรุปผลการตรวจและติดตาม", route: "#" }
  ];
  constructor(
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.dropdown()
    this.initVariable()
    this.inspectionWorkDropdown()
    this.budgetYear = new Date().getFullYear() + 543
  }

  ngAfterViewInit(): void {
    this.calendar();

    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ai").css("width", "100%")
    setTimeout(() => {
      $('#risk').dropdown('set selected', this.inspectionWorkList[0].paramCode)
    }, 200)
    // this.indataTable()
  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      inspectionWork: ["", Validators.required]
    });
  }

  inspectionWorkDropdown = () => {
    this.inspectionWorkList = [
      { paramInfoId: 3, paramGroupId: 10, paramCode: '3', value1: 'งานตรวจสอบโครงการยุทธศาสตร์ของกรมสรรพสามิต' },
      { paramInfoId: 4, paramGroupId: 10, paramCode: '4', value1: 'งานตรวจสอบระบบสารสนเทศฯ ของกรมสรรพสามิต' },
      { paramInfoId: 5, paramGroupId: 10, paramCode: '5', value1: 'งานตรวจสอบสำนักงานสรรพสามิตภาคพื้นที่' }]
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  calendar() {
    $("#budgetyearCld").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.budgetYear = text
        this.getDataList()
      }
    })
  }

  dropdown() {
    this.dropdownRisk = [
      { id: "1", riskType: "รูปแบบโครงการยุทธศาสตร์ของกรมสรรพสามิต" },
      { id: "2", riskType: "รูปแบบระบบสารสนเทศฯของกรมสรรพสามิต" },
      { id: "3", riskType: "รูปแบบสำนักงานสรรพสามิตภาคพื้นที่" }
    ];
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

  getDataList() {
    this.searchForm.patchValue({
      budgetYear: this.budgetYear
    })
    this.ajax.doPost(URLS.GET_DATA, this.searchForm.value).subscribe((result: any) => {
      this.datas = result.data
      console.log("datas : ", this.datas);
      this.datacheckEmty = this.datas.length;
      this.inspecworkto = this.datas[0].inspectionWork
    })
  }


  // indataTable() {
  //   this.dataTable = $("#dataTable").DataTableTh({
  //     processing: true,
  //     serverSide: false,
  //     paging: false,
  //     scrollX: true,
  //     data: this.datas,
  //     columns: [
  //       {
  //         className: "ui center aligned",
  //         render: function (data, type, row, meta) {
  //           return meta.row + meta.settings._iDisplayStart + 1;
  //         }
  //       }, {
  //         data: "projectName", className: "text-center"
  //       }, {
  //         data: "budgetYear", className: "text-left"
  //       }, {
  //         data: "checkType", className: "text-center"
  //       }, {
  //         data: "dateFromString", className: "text-center"
  //       }, {
  //         data: "dateToString", className: "text-center"
  //       }, {
  //         data: "approvers", className: "text-center"
  //       }, {
  //         data: "checkStatus", className: "text-center"
  //       }, {
  //         data: "approveDateString", className: "text-center"
  //       }, {
  //         data: "notation", className: "text-center"
  //       }, {
  //         data: "id", className: "text-center",
  //         render: function (data) {
  //           return `<button class="ui mini primary button detail-button">
  //                     <i class="eye icon"></i>
  //                     รายระเอียดการสรุปผล
  //                   </button>`;
  //         }
  //       }
  //     ],
  //   })

  //   this.dataTable.on("click", "td > button.detail-button", (event) => {
  //     let data = this.dataTable.row($(event.currentTarget).closest("tr")).data().id;
  //     this.goLocation(data)
  //   });

  // }

  goLocation(id: string) {
    console.log("aaa");
    this.router.navigate(['/int11/01'], {
      queryParams: {
        id: id
      }
    });
  }

  routeTo(parth: string, fontDetailId: number) {
    this.router.navigate([parth], {
      queryParams: {
        detailId: fontDetailId
      }
    })
  }

}
