import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formatter, TextDateTH } from "helpers/datepicker";
import { BreadCrumb, Cart, ResponseData } from "models/index";
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Int0401HeaderVo, Int0401Vo } from './int0401vo.model';

declare var $: any;

const URL = {
  GET_SELECT_CASE: "ia/int04/01/by",
  GET_SELECT_CASE_HEAD: "ia/int04/01/head/by",
  GET_SELECT_CASE_STATUS: "ia/int04/01/status/by",
  UPDATE_SELECT_CASE: "ia/int04/01/update/status"
}

@Component({
  selector: "app-int0401",
  templateUrl: "./int0401.component.html",
  styleUrls: ["./int0401.component.css"]
})
export class Int0401Component implements OnInit {
  // BreadCrumb
  breadcrumb: BreadCrumb[] = [];
  searchForm: FormGroup;
  dropdownRisk: any[] = [];
  riskTypeTab: number = 3;
  int0401Data: Int0401Vo[] = [];
  int0401Header: Int0401HeaderVo[] = [];
  int0401Ids: number[] = [];
  _type3: boolean = false;
  _type4: boolean = false;
  _type5: boolean = false;
  _year: string = "";
  submitted: boolean = false;
  selectNum: number = 0;
  loading: boolean = false;
  cart: Cart = {
    title: "จำนวนรายการที่ถูกเลือกจากการคัดเลือกราย",
    subtitle: `จำนวน ${this.selectNum} ราย`,
    route: "/int04/02"
  };

  constructor(
    private fb: FormBuilder,
    private msg: MessageBarService,
    private router: Router,
    private ajax: AjaxService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "คัดเลือกราย", route: "#" }
    ];
    this.dropdownRisk = [
      { id: "3", riskType: "ความเสี่ยงโครงการยุทธศาสตร์ของกรมสรรพสามิต", iconName: 'clipboard' },
      { id: "4", riskType: "ความเสี่ยงระบบสารสนเทศฯของกรมสรรพสามิต", iconName: 'laptop' },
      { id: "5", riskType: "ความเสี่ยงสำนักงานสรรพสามิตภาคพื้นที่", iconName: 'globe' },
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

  calendar() {
    $("#budgetyearCld")
      .calendar({
        type: "year",
        text: TextDateTH,
        formatter: formatter("ป"),
        onChange: (date, text) => {
          this.searchForm.get("budgetYear").patchValue(text);
          setTimeout(() => {
            this.handleSearch({ preventDefault: () => console.log("Searching..") });
          }, 200);
        }
      })
      .calendar("set date", new Date());
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
    e.preventDefault();
    // console.log("e",e);

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
      this.getSelectNum();
    }

  }


  getData() {
    $('.segment').dimmer('show');
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.GET_SELECT_CASE}/${budgetYear}/${riskType}/C`).subscribe((result: ResponseData<Int0401Vo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (AjaxService.isDebug) {
          console.log("getInt0401 => ", result);
        }
        this.int0401Data = result.data;
        setTimeout(() => {
          this.setScrollable(`_type${this.searchForm.get("riskType").value}`);
        }, 500);
      } else {
        this.int0401Data = [];
        this.msg.errorModal(result.message);
      }
      $('.segment').dimmer('hide');
    });
  }

  getHead() {
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.GET_SELECT_CASE_HEAD}/${budgetYear}/${riskType}`).subscribe((result: ResponseData<Int0401HeaderVo[]>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (AjaxService.isDebug) {
          console.log("getHeadInt0401 => ", result);
        }
        this.int0401Header = result.data;
        setTimeout(() => {
          this.setScrollable(`_type${this.searchForm.get("riskType").value}`);
        }, 500);
      } else {
        this.msg.errorModal(result.message);
      }
    });
  }

  getSelectNum() {
    const { budgetYear, riskType } = this.searchForm.value;
    this.ajax.doGet(`${URL.GET_SELECT_CASE_STATUS}/${budgetYear}/${riskType}/S`).subscribe((result: ResponseData<number>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        // GET DATA HERE
        if (AjaxService.isDebug) {
          console.log("getSelectNumInt0401 => ", result);
        }
        this.selectNum = result.data;
        this.cart = {
          title: "จำนวนรายการที่ถูกเลือกจากการคัดเลือกราย",
          subtitle: `จำนวน ${this.selectNum} ราย`,
          route: "/int04/02"
        };
      } else {
        this.msg.errorModal(result.message);
      }
    });
  }

  updateData() {
    this.msg.comfirm(event => {
      if (event) {
        $('.segment').dimmer('show');
        this.ajax.doPut(`${URL.UPDATE_SELECT_CASE}/S`, this.int0401Ids).subscribe((result: ResponseData<Int0401Vo[]>) => {
          if (MessageService.MSG.SUCCESS == result.status) {
            // GET DATA HERE
            if (AjaxService.isDebug) {
              console.log("updateInt0401 => ", result);
            }
            this.int0401Data = result.data;
            $(`#chkAll`).prop('checked', false);
            this.getSelectNum();
            setTimeout(() => {
              this.msg.successModal(result.message);
            }, 500);
          } else {
            setTimeout(() => {
              this.msg.errorModal(result.message);
            }, 500);
          }
          $('.segment').dimmer('hide');
        });
      }
    }, "ต้องการเลือกข้อมูลจริงหรือไม่ ?");
  }

  setScrollable(id: string) {
    if (id=="_type3") {
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 3, 'z-index': 0 });
    } else if (id=="_type4"){
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 3, 'z-index': 0 });
    }else if (id=="_type5") {
      $(`#${id}`).tableHeadFixer({ "head": true, "left": 4, 'z-index': 0 });
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

  onCheckAll(event) {
    if (event.target.checked) {
      this.int0401Ids = [];
      for (let i = 0; i < this.int0401Data.length; i++) {
        this.int0401Ids.push(this.int0401Data[i].id);
        $(`#chk${i}`).prop('checked', true);
      }
    } else {
      this.int0401Ids = [];
      for (let i = 0; i < this.int0401Data.length; i++) {
        $(`#chk${i}`).prop('checked', false);
      }
    }
  }

  onCheck(event, index) {
    if (event.target.checked) {
      this.int0401Ids.push(this.int0401Data[index].id);
      if (this.int0401Ids.length == this.int0401Data.length) {
        $(`#chkAll`).prop('checked', true);
      }
    } else {
      const indexId = this.int0401Ids.findIndex(id => id == this.int0401Data[index].id);
      if (indexId != -1) {
        this.int0401Ids.splice(indexId, 1);
      }
      if (this.int0401Ids.length != this.int0401Data.length) {
        $(`#chkAll`).prop('checked', false);
      }
    }
  }
}
