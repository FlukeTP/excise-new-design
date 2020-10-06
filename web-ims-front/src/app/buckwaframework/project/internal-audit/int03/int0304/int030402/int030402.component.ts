import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumb, ResponseData } from "models/index";
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Int030407Vo } from '../int030407/int030407vo.model';
import { Int030402HeaderVo, Int030402InfoVo, Int030402SummaryVo } from './int030402vo.model';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { revertCondition } from 'helpers/convertCondition';
declare var $: any;

const URL = {
  GET_HEADER: "ia/int02/03/01/header",
  GET_INFO: "ia/int02/03/01/info/config",
  GET_EXPORT: "ia/int02/03/01/export/excel/config",
  GET_SECTOR: "preferences/department/sector-list",
}
const URLS = {
  GET_INCOME_YEAR: "ia/int03/04/07/year"
}

@Component({
  selector: 'app-int030402',
  templateUrl: './int030402.component.html',
  styleUrls: ['./int030402.component.css']
})
export class Int030402Component implements OnInit {
  breadcrumb: BreadCrumb[];
  _idHead: number = null;
  _budgetYear: string = "";

  headers: Int030402HeaderVo[] = [];
  details: Int030402InfoVo[] = [];
  summary: Int030402SummaryVo = {
    draftQuantity: 0,
    failValue: 0,
    finishQuantity: 0,
    listQuantity: 0,
    passValue: 0,
    riskQuantity: 0
  };
  dataSessionList0302: any;
  idConfig: any;
  inspectionWork: any;
  budgetYear: any;
  projectYear: any;
  projecttypecode: any;
  riskFactors: any;
  infoUsedRiskDesc: any;
  startDate: any;
  endDate: any;
  dataTable: any;
  datas: any = [];
  datalist: any;
  veryhighthai: any;
  highthai: any;
  mediumthai: any;
  lowthai: any;
  verylowthai: any;

  veryhighthai2: any;
  highthai2: any;
  mediumthai2: any;
  lowthai2: any;
  verylowthai2: any;
  
  showDataTable: boolean = false;
  showDataTableCode: boolean = false;
  showBody: boolean = false;
  dataopen1: boolean = false;
  dataopen2: boolean = false;
  loading: boolean = false;
  toggleButtonTxt: string = 'แสดง รายละเอียดเงื่อนไขความเสี่ยง';

  dataExport: FormGroup
  dropdownSectors: any[] = [];
  dropdownSector = new FormControl('');

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "สรุปผลแบบสอบถามระบบการควบคุมภายใน", route: "#" }
    ];
    this.dataExport = this.formBuilder.group({
      riskHrdPaperName: ["", Validators.required],
      budgetYear: ["", Validators.required],
      createUserName: ["", Validators.required],
      createLastName: ["", Validators.required],
      createPosition: ["", Validators.required],
      checkUserName: ["", Validators.required],
      checkLastName: ["", Validators.required],
      checkPosition: ["", Validators.required]
    });
  }

  ngOnInit() {
    // this.getList();
    this.dropdown();
    this._idHead = this.route.snapshot.queryParams['id'] || null;
    this._budgetYear = this.route.snapshot.queryParams['budgetYear'] || "";
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
    this.idConfig = this.route.snapshot.queryParams["idConfig"];
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];
  }

  ngAfterViewInit() {
    this.scrollTable();
    $(".ui.dropdown.ai").dropdown().css("width", "100%");
  }

  scrollTable() {
    setTimeout(() => {
      $(`#table`).tableHeadFixer();
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
    }, 200);
  }

  // Request
  getHeaders(idHead: number, budgetYear: string) {
    this.ajax.doGet(`${URL.GET_HEADER}/${idHead}/${budgetYear}`).subscribe((response: ResponseData<Int030402HeaderVo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        // GET DATA HERE
        this.headers = response.data;
      } else {
        this.messageBar.errorModal(response.message);
      }
    })
  }

  getInfos = (idHead: number, budgetYear: string, idConfig: string) => {
    console.log("this.dropdownSector.value: ", this.dropdownSector.value);
    this.ajax.doGet(`${URL.GET_INFO}/${idHead}/${budgetYear}/${idConfig}/${this.dropdownSector.value}`).subscribe((response: ResponseData<Int030402InfoVo[]>) => {
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
          if (this.details[i].status == "FINISH") {
            this.summary.finishQuantity++;
          } else {
            this.summary.draftQuantity++;
          }
          // listQuantity
          this.summary.listQuantity++;
        }
        this.scrollTable();
      } else {
        this.messageBar.errorModal(response.message);
      }
    });
  }

  toggleBody() { }

  showModal1() {
    $("#modal1").modal("show");
    var ricktest = this.riskFactors.split('ปัจจัยเสี่ยง');
    var subrick = this.riskFactors.substring(0, 12);
    var riskHrdPaperName1;

    console.log(this.authService.getUserDetails().userThaiName);

    if (subrick == 'ปัจจัยเสี่ยง') {
      var materick = "กระดาษทำการประเมินความเสี่ยง" + ricktest[1]
      riskHrdPaperName1 = materick
    } else {
      riskHrdPaperName1 = "กระดาษทำการประเมินความเสี่ยง" + this.riskFactors
    }
    this.dataExport.patchValue({
      riskHrdPaperName: riskHrdPaperName1,
      budgetYear: this.budgetYear,
      createUserName: this.authService.getUserDetails().userThaiName,
      createLastName: this.authService.getUserDetails().userThaiSurname,
      createPosition: this.authService.getUserDetails().title
    });
  }

  showModal2() {
    if (this.showBody) {
      this.showBody = false;
      this.toggleButtonTxt = 'แสดง รายละเอียดเงื่อนไขความเสี่ยง'
    } else {
      this.showBody = true;
      this.toggleButtonTxt = 'ซ่อน รายละเอียดเงื่อนไขความเสี่ยง'
    }
    this.datalist = this.dataSessionList0302.iaRiskFactorsConfig;
    console.log("datalist : ", this.datalist);
    let checkrick = this.datalist.factorsLevel;
    if (checkrick == 3) {

      this.dataopen1 = true;
      this.dataopen2 = false;

      this.highthai = revertCondition(this.datalist.highCondition.split("|")[0]);
      this.highthai2 = revertCondition(this.datalist.highCondition.split("|")[1]);

      this.mediumthai = revertCondition(this.datalist.mediumCondition.split("|")[0]);
      this.mediumthai2 = revertCondition(this.datalist.mediumCondition.split("|")[1]);

      this.lowthai = revertCondition(this.datalist.lowCondition.split("|")[0]);
      this.lowthai2 = revertCondition(this.datalist.lowCondition.split("|")[1]);


    } else {
      this.dataopen1 = false;
      this.dataopen2 = true;

      this.veryhighthai = revertCondition(this.datalist.veryhighCondition.split("|")[0]);
      this.veryhighthai2 = revertCondition(this.datalist.veryhighCondition.split("|")[1]);

      this.highthai = revertCondition(this.datalist.highCondition.split("|")[0]);
      this.highthai2 = revertCondition(this.datalist.highCondition.split("|")[1]);

      this.mediumthai = revertCondition(this.datalist.mediumCondition.split("|")[0]);
      this.mediumthai2 = revertCondition(this.datalist.mediumCondition.split("|")[1]);

      this.lowthai = revertCondition(this.datalist.lowCondition.split("|")[0]);
      this.lowthai2 = revertCondition(this.datalist.lowCondition.split("|")[1]);

      this.verylowthai = revertCondition(this.datalist.verylowCondition.split("|")[0]);
      this.verylowthai2 = revertCondition(this.datalist.verylowCondition.split("|")[1]);

    }
  }

  export() {
    // TODO
    let riskHrdPaperName = this.dataExport.value.riskHrdPaperName;
    var createUserName = this.dataExport.value.createUserName;
    var createLastName = this.dataExport.value.createLastName;
    var createPosition = this.dataExport.value.createPosition;
    var checkUserName = this.dataExport.value.checkUserName;
    var checkLastName = this.dataExport.value.checkLastName;
    var checkPosition = this.dataExport.value.checkPosition;
    this.ajax.download(`${URL.GET_EXPORT}/${this.dataSessionList0302.iaRiskFactorsConfig.infoUsedRisk}/${this._budgetYear}/${this.idConfig}/${riskHrdPaperName}/${createUserName}/${createLastName}/${createPosition}/${checkUserName}/${checkLastName}/${checkPosition}`);
  }

  back() {
    this.location.back();
  }

  getDataList() {
    this.loading = true;
    this.ajax.doGet(`${URLS.GET_INCOME_YEAR}/${this.budgetYear}/${this.idConfig}`).subscribe((response: ResponseData<Int030407Vo[]>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        console.log("response.data", response.data);
        console.log("response", response);
        this.loading = false;
      } else {

      }
    });
  }

  getList = () => {
    this.loading = true;
    const URL = "ia/int03/04/05/getForm0304"
    this.ajax.doPost(URL, {
      "budgetYear": this.budgetYear,
      "inspectionWork": this.inspectionWork,
      "idConfig": this.idConfig
    }).subscribe((res: ResponseData<any>) => {
      console.log("resData", res);
      this.dataSessionList0302 = res;
      this.riskFactors = this.dataSessionList0302.iaRiskFactors.riskFactors;
      this.infoUsedRiskDesc = this.dataSessionList0302.iaRiskFactorsConfig.infoUsedRiskDesc;
      this.startDate = this.dataSessionList0302.iaRiskFactorsConfig.startDate;
      this.endDate = this.dataSessionList0302.iaRiskFactorsConfig.endDate;
      // this.getDataList();
      $("#dateCalendarStartDate").calendar('set date', this.startDate);
      $("#dateCalendarEndDate").calendar('set date', this.endDate);
      this.getHeaders(this.dataSessionList0302.iaRiskFactorsConfig.infoUsedRisk, this.budgetYear);
      this.getInfos(this.dataSessionList0302.iaRiskFactorsConfig.infoUsedRisk, this.budgetYear, this.idConfig);
      setTimeout(() => {
        this.loading = false;
      }, 200);
    })
  }

  dropdown() {
    this.ajax.doPost(`${URL.GET_SECTOR}`, {}).subscribe((response) => {
      this.dropdownSectors = response.data
      $("#secter").dropdown('set selected', "all");
    }, err => {
      this.messageBar.errorModal("กรุณาติดต่อผู้ดูแลระบบ")
    });
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
