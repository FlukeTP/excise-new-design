import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatter, TextDateTH } from 'helpers/datepicker';
import { BreadCrumb, ResponseData } from 'models/index';
import { AjaxService, MessageService } from 'services/index';
import { MessageBarService } from 'services/message-bar.service';
import { Int0402HeaderVo, Int0402Vo } from './int0402vo.model';

declare var $: any;

const URL = {
  GET_SELECT_CASE: "ia/int04/01/by",
  GET_SELECT_CASE_HEAD: "ia/int04/01/head/by",
  GET_SELECT_CASE_STATUS: "ia/int04/01/status/by",
  UPDATE_SELECT_CASE: "ia/int04/01/update/status",
  SAVE_INSPECTION_PLAN: "ia/int04/01/save/inspection-plan"
}

@Component({
  selector: 'app-int0402',
  templateUrl: './int0402.component.html',
  styleUrls: ['./int0402.component.css']
})
export class Int0402Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  searchForm: FormGroup;
  dropdownRisk: any[] = [];
  riskTypeTab: number = 3;
  _type3: boolean = false;
  _type4: boolean = false;
  _type5: boolean = false;
  _year: string = "";
  submitted: boolean = false;
  int0402Data: Int0402Vo[] = [];
  int0402Header: Int0402HeaderVo[] = [];
  int0402Ids: number[] = [];

  constructor(
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ผลการคัดเลือกราย", route: "#" },
    ];
    this.dropdownRisk = [
      { id: 3, riskType: "ความเสี่ยงโครงการยุทธศาสตร์ของกรมสรรพสามิต", iconName: 'clipboard' },
      { id: 4, riskType: "ความเสี่ยงระบบสารสนเทศฯของกรมสรรพสามิต", iconName: 'laptop' },
      { id: 5, riskType: "ความเสี่ยงสำนักงานสรรพสามิตภาคพื้นที่", iconName: 'globe' },
    ];
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      riskType: [3, Validators.required]
    });
  }

  ngOnInit() {
    this._type3 = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calendar();
      $(".ui.dropdown").dropdown();
      $(".ui.dropdown.ai").css("width", "100%");
      $("#risk").dropdown("set selected", "3");

      // Query Data
      setTimeout(() => {
        this.handleSearch({ preventDefault: () => console.log("Searching..") });
      }, 500);
    }, 200);
  }

  add(e) {
    $('.ui.dropdown.ai').dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    if (this.searchForm.get('riskType').value == 1) {
      $('#detail').modal('show');
    } else if (this.searchForm.get('riskType').value == 2 || this.searchForm.get('riskType').value == 3) {
      $('#detail23').modal('show');
    }
    console.log();
  }

  calendar() {
    $("#budgetyearCld").calendar({
      type: "year",
      text: TextDateTH,
      formatter: formatter("ป"),
      onChange: (date, text) => {
        this.searchForm.get('budgetYear').patchValue(text);
        setTimeout(() => {
          this.handleSearch({ preventDefault: () => console.log("Searching..") });
        }, 200);
      }
    }).calendar("set date", new Date())
  }

  getData() {
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.GET_SELECT_CASE}/${budgetYear}/${riskType}/S`).subscribe((result: ResponseData<Int0402Vo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (AjaxService.isDebug) {
          console.log("getInt0402 => ", result);
        }
        this.int0402Data = result.data;
        setTimeout(() => {
          this.setScrollable(`_type${this.searchForm.get("riskType").value}`);
          $('.segment').dimmer('hide');
        }, 500);
      } else {
        setTimeout(() => {
          $('.segment').dimmer('hide');
          this.msg.errorModal(result.message);
        }, 500);
      }
    });
  }

  getHead() {
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.GET_SELECT_CASE_HEAD}/${budgetYear}/${riskType}`).subscribe((result: ResponseData<Int0402HeaderVo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (AjaxService.isDebug) {
          console.log("getHeadInt0402 => ", result);
        }
        this.int0402Header = result.data;
      } else {
        this.msg.errorModal(result.message);
      }
    });
  }

  deleteData(id: number) {
    this.msg.comfirm(event => {
      if (event) {
    $('.segment').dimmer('show');
        this.ajax.doPut(`${URL.UPDATE_SELECT_CASE}/C`, [id]).subscribe((result: ResponseData<Int0402Vo[]>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            if (AjaxService.isDebug) {
              console.log("updateInt0402 => ", result);
            }
            this.int0402Data = result.data;
            setTimeout(() => {
              $('.segment').dimmer('hide');
              this.msg.successModal(result.message)
            }, 500);
          } else {
            setTimeout(() => {
              $('.segment').dimmer('hide');
              this.msg.errorModal(result.message);
            }, 500);
          }
        });
      }
    }, "ลบข้อมูลจริงหรือไม่ ?");
  }

  setScrollable(id: string) {

    if (id=="_type3") {
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 2, 'z-index': 0 });
    } else if (id=="_type4"){
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 2, 'z-index': 0 });
    }else if (id=="_type5") {
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 3, 'z-index': 0 });
    }

    $(function () {
      let curDown: boolean = false;
      let curYPos: number = 0;
      let curXPos: number = 0;
      $(`#${id}_scroll`).mousemove(function (m) {
        if (curDown === true) {
          $(`#${id}_scroll`).scrollTop($(`#${id}_scroll`).scrollTop() + (curYPos - m.pageY));
          $(`#${id}_scroll`).scrollLeft($(`#${id}_scroll`).scrollLeft() + (curXPos - m.pageX));
        }
      });
      $(`#${id}_scroll`).mousedown(function (m) {
        curDown = true;
        curYPos = m.pageY;
        curXPos = m.pageX;
      });
      $(`#${id}_scroll`).mouseup(function () {
        curDown = false;
      });
    });
  }

  initVariable() {
    this.searchForm = this.fb.group({
      budgetYear: ["", Validators.required],
      riskType: ["", Validators.required]
    });
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.searchForm.get(value).errors;
  }

  riskTypeClick(event: any, id: number) {
    this.riskTypeTab = id;
    this.searchForm.get('riskType').patchValue(id);
    this.handleSearch(event);
  }

  handleSearch(e) {
    $('.segment').dimmer('show');
    e.preventDefault();
    this.submitted = true;
    //set type defaults
    this._type3 = false;
    this._type4 = false;
    this._type5 = false;
    // stop here if form is invalid
    if (this.searchForm.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (this.searchForm.get("riskType").value) {
      this[`_type${this.searchForm.get("riskType").value}`] = true;

      this.getData();
      this.getHead();
    }
  }

  saveInspectionPlan(e) {
    e.preventDefault();
    let REQUEST = [];
    console.log("this.int0402Data: ", this.int0402Data);
    this.int0402Data.forEach(obj => {
      REQUEST.push({
        id: obj.id,
        project: obj.projectName,
        budgetYear: obj.budgetYear,
        inspectionWork: obj.inspectionWork,
        exciseCode: obj.exciseCode,
        status: "",
        sector: obj.sectorName,
        area: obj.areaName
      });
    });
    this.ajax.doPost(URL.SAVE_INSPECTION_PLAN, REQUEST).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.msg.successModal(response.message);
        // setTimeout(() => {
        //   this.router.navigate(["/int02/02"]);
        // }, 200);
      } else {
        this.msg.successModal(response.message);
      }
    }), error => {
      this.msg.successModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }

}
