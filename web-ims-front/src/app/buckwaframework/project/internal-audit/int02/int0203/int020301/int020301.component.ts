import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Int020301HeaderVo, Int020301InfoVo, Int020301SummaryVo } from './int020301vo.model';
import { IaQuestionnaireHdr } from '../../int02.models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateStringPipe } from 'app/buckwaframework/common/pipes';

declare var $: any;

const URL = {
  GET_HEADER: "ia/int02/03/01/header",
  GET_INFO: "ia/int02/03/01/info",
  GET_EXPORT: "ia/int02/03/01/export/excel",
  GET_HDR: "ia/int02",
  GET_SECTER: "preferences/department/sector-list",
  SAVE_CONCLUDE: "ia/int02/03/01/saveConclude"
}

@Component({
  selector: 'app-int020301',
  templateUrl: './int020301.component.html',
  styleUrls: ['./int020301.component.css']
})
export class Int020301Component implements OnInit {
  dropdownInput = new FormControl('');
  conclude: any
  formGrop: FormGroup;
  breadcrumb: BreadCrumb[];
  _idHead: number = null;
  _budgetYear: string = "";

  hdr: IaQuestionnaireHdr = null;
  headers: Int020301HeaderVo[] = [];
  details: Int020301InfoVo[] = [];

  dropdownInspection: any[] = [];
  fillter = "all"
  summary: Int020301SummaryVo = {
    draftQuantity: 0,
    failValue: 0,
    finishQuantity: 0,
    listQuantity: 0,
    passValue: 0,
    riskQuantity: 0
  };
  loading: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private formBuilder: FormBuilder
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "สรุปผลแบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "รายละเอียดสรุปผลแบบสอบถามระบบการควบคุมภายใน", route: "#" },
    ];
  }
  ngOnInit() {
    this.formGrop = this.formBuilder.group({
      conclude: ['']
    })
    this.dropdown()
    this.loading = true;
    this._idHead = this.route.snapshot.queryParams['id'] || null;
    this._budgetYear = this.route.snapshot.queryParams['budgetYear'] || "";
    if (this._idHead && this._budgetYear) {
      // Offline
      this.summary = {
        riskQuantity: 2,
        passValue: 0,
        failValue: 2,
        listQuantity: 1,
        finishQuantity: 1,
        draftQuantity: 0
      };

      this.headers = [
        { name: "การเงิน", conclude: "" },
        { name: "การธนาคาร", conclude: "" }
      ];
      // Online
      this.getHeaders(this._idHead, this._budgetYear);
      this.getInfos(this._idHead, this._budgetYear);
      this.findQtnHead(this._idHead.toString());
    } else {
      this.headers = [];
      this.details = [];
      this.summary = {
        draftQuantity: 0,
        failValue: 0,
        finishQuantity: 0,
        listQuantity: 0,
        passValue: 0,
        riskQuantity: 0
      };
    }
  }

  ngAfterViewInit() {
    this.scrollTable();
    this.loading = false;
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    setTimeout(() => {
      $("#secter").dropdown('set selected', "all");
    }, 500);
  }

  saveConclude() {
    this.messageBar.comfirm((res) => {
      if (res) {
        $('.ui.sidebar').sidebar({
          context: '.ui.grid.pushable'
        })
          .sidebar('setting', 'transition', 'push')
          .sidebar('setting', 'dimPage', false)
          .sidebar('hide');

        this.ajax.doPut(`${URL.SAVE_CONCLUDE}/${this._idHead}`, this.formGrop.value).subscribe((response: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == response.status) {
            // GET DATA HERE
            this.messageBar.successModal(response.message);
          } else {
            this.messageBar.errorModal(response.message);
          }
        })
      }
    }, "ยืนยันการบันทกข้อมูล")
  }
  dropdown() {
    this.ajax.doPost(`${URL.GET_SECTER}`, {}).subscribe((response) => {
      this.dropdownInspection = response.data
    }, err => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ")
    });
  }

  filterDropdown() {
    let data = this.dropdownInput.value
    if (this.dropdownInput.value != "all") {
      data = this.dropdownInput.value.substring(0, 2)
    }
    this.fillter = data
    this.getInfos(this._idHead, this._budgetYear)
  }

  scrollTable() {
    this.loading = true;
    setTimeout(() => {
      $(`#table`).tableHeadFixer({ "head": true, "left": 3, 'z-index': 0 });
      $(function () {
        let curDown: boolean = false;
        let curYPos: number = 0;
        let curXPos: number = 0;
        $(`#scroll`).mousemove(function (m) {
          if (curDown === true) {
            $(`#scroll`).scrollTop($(`#scroll`).scrollTop() + (curYPos - m.pageY));
            $(`#scroll`).scrollLeft($(`#scroll`).scrollLeft() + (curXPos - m.pageX));
          }
        });
        $(`#scroll`).mousedown(function (m) {
          curDown = true;
          curYPos = m.pageY;
          curXPos = m.pageX;
        });
        $(`#scroll`).mouseup(function () {
          curDown = false;
        });
      });
      this.loading = false;
    }, 200);
  }

  // Request
  getHeaders(idHead: number, budgetYear: string) {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_HEADER}/${idHead}/${budgetYear}`).subscribe((response: ResponseData<Int020301HeaderVo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        // GET DATA HERE
        console.log("aaaaa", response);

        this.headers = response.data;
        this.formGrop.setValue({
          conclude: response.data[0].conclude
        })
        this.loading = false;
      } else {
        this.messageBar.errorModal(response.message);
      }
    })
  }

  getInfos(idHead: number, budgetYear: string) {
    this.loading = true;
    this.ajax.doGet(`${URL.GET_INFO}/${idHead}/${budgetYear}/${this.fillter}`).subscribe((response: ResponseData<Int020301InfoVo[]>) => {
      console.log(response);
      if (MessageService.MSG.SUCCESS == response.status) {
        // GET DATA HERE
        this.details = response.data;
        // Calculate Summary
        this.summary = {
          draftQuantity: 0,
          failValue: 0,
          finishQuantity: 0,
          listQuantity: 0,
          passValue: 0,
          riskQuantity: 0
        }
        for (let i = 0; i < this.details.length; i++) {
          for (let j = 0; j < this.details[i].sideDtls.length; j++) {
            if (this.details[i].sideDtls[j].risk == "LOW") {
              this.summary.passValue++;
            } else {
              this.summary.failValue++;
            }
            // riskQuantity
            this.summary.riskQuantity++;
          }
          if (this.details[i].status == "3") {
            this.summary.finishQuantity++;
          } else {
            this.summary.draftQuantity++;
          }
          // listQuantity
          this.summary.listQuantity++;
        }
        this.loading = false;
        this.scrollTable();
      } else {
        this.messageBar.errorModal(response.message);
      }
    });
  }

  findQtnHead(idHead: string) {
    this.ajax.doGet(`${URL.GET_HDR}/${idHead}`).subscribe((result: ResponseData<IaQuestionnaireHdr>) => {
      if (MessageService.MSG.SUCCESS == result.status) {
        this.hdr = result.data;
      } else {
        this.messageBar.errorModal(result.message);
      }
    });
  }

  export() {
    // TODO
    this.ajax.download(`${URL.GET_EXPORT}/${this._idHead}/${this._budgetYear}`);
  }

  responseDtl(status, idMadeHdr, sentDate, sentBy) {

    this.router.navigate(['int02/02/01'], {
      queryParams: {
        idMadeHdr: idMadeHdr,
        idHdr: this._idHead,
        updatedBy: sentBy,
        updatedDateStr: new DateStringPipe().transform(sentDate, false),
        budgetYear: this._budgetYear,
        status: status,
        back: "int02.03.01"
      }
    });
  }

  back() {
    this.location.back();
  }

  getColor(color: string) {
    if (color == 'แดง') {
      return 'bg-c-redtable';
    } else if (color == 'ส้ม') {
      return 'bg-c-orangetable';
    } else if (color == 'เหลือง') {
      return 'bg-c-yellowtable';
    } else if (color == 'เขียว') {
      return 'bg-c-greentable';
    } else if (color == 'เขียวเข้ม') {
      return 'bg-c-greenuptable';
    }
  }

  getColorV2(color: string) {
    if (color == 'red') {
      return 'bg-c-redtable';
    } else if (color == 'orange') {
      return 'bg-c-orangetable';
    } else if (color == 'yellow') {
      return 'bg-c-yellowtable';
    } else if (color == 'green') {
      return 'bg-c-greentable';
    } else if (color == 'darkgreen') {
      return 'bg-c-greenuptable';
    }
  }

}
