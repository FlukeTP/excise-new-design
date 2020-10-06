import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
declare var $: any;
@Component({
  selector: "int030101",
  templateUrl: "./int030101.component.html",
  styleUrls: ["./int030101.component.css"]
})
export class Int030101Component implements OnInit {
  submitted: boolean = false;
  sideList: any[] = []
  riskUnitList: any[] = []
  dataFactors: FormGroup
  dataFactorsData: FormGroup
  dataTable: any
  dataList: any
  // [{ riskFactorsMaster: "", side: "55555", dateFrom: "", dateTo: "", riskUnit: "", infoUsedRiskDesc: "", riskIndicators: "" }]
  hideData: boolean = false
  $form: any;
  datas: any = [];
  fileExel: File[];
  private inspectionWork: number
  private budgetYear: any
  private idFactors: number
  showDataTable: boolean = false
  showDataTableCode4: boolean = false;
  showDataTableCode5: boolean = false;
  factorId: any
  showCalendar: boolean = false
  // BreadCrumb
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "การประเมินความเสี่ยง", route: "#" },
    { label: "เพิ่มข้อมูลปัจจัยเสี่ยง", route: "#" },
  ];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ajaxService: AjaxService,
    private messageBar: MessageBarService,
    private router: Router,
  ) {
    this.dataFactors = this.formBuilder.group({
      riskFactorsMaster: ["", Validators.required],
      // dataName: [""],
      dateFrom: ["", Validators.required],
      dateTo: ["", Validators.required],
      infoUsedRiskDesc: ["", Validators.required],
      riskIndicators: ["", Validators.required],
      side: ["", Validators.required],
      riskUnit: ["", Validators.required],
      inspectionWork: ["", Validators.required],
      budgetYear: ["", Validators.required],
    });

    this.dataFactorsData = this.formBuilder.group({
      riskFactorsMaster: [""],
      // dataName: ["", Validators.required],
      dateFrom: [""],
      dateTo: [""],
      side: [""],
      iaRiskFactorsDataList: ["", Validators.required],
      riskUnit: [""],
      inspectionWork: [""],
      budgetYear: [""],
      idFactors: [""],
      dataEvaluate: [],
      infoUsedRiskDesc: [],
      riskIndicators: [],
    });

  }

  ngOnInit() {
    this.sideDropdown()
    this.riskUnitDropDown()
    this.checkShowDataTable()
    this.$form = $('#assetBalanceForm');
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"]
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"]
    this.idFactors = this.route.snapshot.queryParams["factorId"]
    if (this.idFactors != undefined && this.budgetYear != undefined && this.inspectionWork != undefined) {
      this.newUpload()
    }
  }

  ngAfterViewInit() {
    this.initDatatable()
    this.calendar()
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")
  }

  newUpload() {
    const URL = "ia/int03/01/01/configFactorsDataList"
    this.ajaxService.doPost(URL, {
      "idFactors": this.idFactors
    }).subscribe((res: any) => {
      this.dataFactors.patchValue({
        side: res.data.int030101FormVo.side,
        dateFrom: res.data.int030101FormVo.dateFrom,
        dateTo: res.data.int030101FormVo.dateTo,
        infoUsedRiskDesc: res.data.int030101FormVo.infoUsedRiskDesc,
        inspectionWork: res.data.int030101FormVo.inspectionWork,
        riskFactorsMaster: res.data.int030101FormVo.riskFactorsMaster,
        riskIndicators: res.data.int030101FormVo.riskIndicators,
        riskUnit: res.data.int030101FormVo.riskUnit
      })
      this.dataList = this.dataFactors.value
      this.hideData = true
      this.showCalendar = true
      setTimeout(() => {
        this.initDatatable()
        this.calendar()
      }, 200);
    });
  }

  checkShowDataTable() {
    this.inspectionWork = this.route.snapshot.queryParams["inspectionWork"]
    if (this.inspectionWork == 3) {
      this.showDataTable = true;
      this.showDataTableCode4 = false;
      this.showDataTableCode5 = false;
    } else if (this.inspectionWork == 4) {
      this.showDataTable = false;
      this.showDataTableCode4 = true;
      this.showDataTableCode5 = false;
    } else if (this.inspectionWork == 5) {
      this.showDataTable = false;
      this.showDataTableCode5 = true;
      this.showDataTableCode4 = false;
    }
  }
  initDatatable() {
    if (this.inspectionWork == 3) {
      this.dataTable = $("#dataTable").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: true,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "project", className: "text-left"
          }, {
            data: "riskCost", className: "text-center"
          }
        ],
      })
    } else if (this.inspectionWork == 4) {
      this.dataTable = $("#dataTableCode4").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: true,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "systemCode", className: "text-center"
          }, {
            data: "systemName", className: "text-left"
          }, {
            data: "riskCost", className: "text-center"
          }
        ],
      })
    } else if (this.inspectionWork == 5) {
      this.dataTable = $("#dataTableCode5").DataTableTh({
        processing: true,
        serverSide: false,
        paging: false,
        scrollX: true,
        data: this.datas,
        columns: [
          {
            className: "ui center aligned",
            render: function (data, type, row, meta) {
              return meta.row + meta.settings._iDisplayStart + 1;
            }
          }, {
            data: "exciseCode", className: "text-center"
          }, {
            data: "sector", className: "text-left"
          }, {
            data: "area", className: "text-left"
          }, {
            data: "riskCost", className: "text-center"
          }
        ],
      })
    }
  }
  sideDropdown = () => {

    const URL = "api/preferences/parameter-info";
    this.sideList = [
      { value: 'S', data: 'ด้านกลยุทธ์(Startegy - S)' },
      { value: 'O', data: 'ด้านการดำเนินงาน(Operation - O)' },
      { value: 'P', data: 'ด้านผลการปฎิบัติงานหรือผลการดำเนินการ(Performance - P)' },
      { value: 'F', data: 'ด้านการเงิน(Financial - F)' },
      { value: 'C', data: 'ด้านการปฏิบัติตามกฎหมายและระเบียบ(Compliance - C)' },
      { value: 'Technology', data: 'ด้านเทคโนโลยีสารสนเทศ(Information Technology)' },
      { value: 'I', data: 'ด้านการควบคุมภายใน(Internal Control - I)' },
    ]
  }
  riskUnitDropDown = () => {
    this.riskUnitList = [
      { value: 'หน่วย', data: 'หน่วย' },
      { value: 'ครั้ง', data: 'ครั้ง' },
      { value: 'ปี', data: 'ปี' },
      { value: 'เปอร์เซ็นต์', data: 'เปอร์เซ็นต์' },
      { value: 'บาท', data: 'บาท' },
      { value: 'คดี', data: 'คดี' },
      { value: 'ตำแหน่ง', data: 'ตำแหน่ง' },
    ]
  }

  calendar() {
    let dateFrom = new Date();
    let dateTo = new Date();

    $("#dateCalendarFrom").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFactors.patchValue({
          dateFrom: text
        });
      }
    });

    $("#dateCalendarTo").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFactors.patchValue({
          dateTo: text
        })
      }
    })

    $("#dateCalendarFromNew").calendar({
      type: "date",
      endCalendar: $('#dateCalendarToNew'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFactorsData.patchValue({
          dateFrom: text
        });
      }
    });

    $("#dateCalendarToNew").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFromNew'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.dataFactorsData.patchValue({
          dateTo: text
        })
      }
    })
  }

  onSubmit(e) {
    this.dataFactors.patchValue({
      inspectionWork: this.route.snapshot.queryParams["inspectionWork"],
      budgetYear: this.route.snapshot.queryParams["budgetYear"],
    })
    this.submitted = true
    if (this.dataFactors.invalid) {
      // this.messageBar.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
      return;
    }

    console.log("side value", this.dataFactors.value.side);

    this.messageBar.comfirm(confirm => {
      if (confirm) {
        let side = this.dataFactors.value.side.toString()
        this.dataFactors.patchValue({
          side: side
        })
        const URL = "ia/int03/01/01/saveFactors"
        this.ajaxService.doPost(URL, this.dataFactors.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            console.log("res.data.idFactors : ", res.data.idFactors);

            this.idFactors = res.data.idFactors
            this.dataList = res.data.int030101FormVo
            this.hideData = true
            this.messageBar.successModal(res.message)
            setTimeout(() => {
              this.initDatatable()
            }, 200);
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
        console.log(this.dataFactors.value)
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  dowloadTemplate = () => {
    let formExcel = $("#form-data-excel").get(0)
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int03/01/01/dowloadTemplate"
    formExcel.dataJson.value = JSON.stringify(this.dataFactors.value)
    formExcel.submit()
  }

  dowloadTemplate2 = () => {
    let formExcel = $("#form-data-excel").get(0)
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int03/01/01/dowloadTemplate2"
    formExcel.dataJson.value = JSON.stringify(this.dataFactors.value)
    formExcel.submit()
  }

  dowloadTemplate3 = () => {
    let formExcel = $("#form-data-excel").get(0)
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int03/01/01/dowloadTemplate3"
    formExcel.dataJson.value = JSON.stringify(this.dataFactors.value)
    formExcel.submit()
  }

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

  onUpload = (event: any) => {
    console.log($('#file').val());

    if ($('#file').val() == "") {
      this.messageBar.errorModal("กรุณาเลือกไฟล์ที่จะอัพโหลด")
      return
    }
    event.preventDefault();
    this.$form.addClass("loading");
    const form = $("#assetBalanceForm")[0];
    let formBody = new FormData(form);
    formBody.append("inspectionWork", this.inspectionWork.toString())
    const url = "ia/int03/01/01/upload";
    this.datas = [];
    this.ajaxService.upload(
      url,
      formBody,
      res => {
        let resBody = res.json()
        console.log("Res Upload", resBody)
        if (resBody.errorMessage) {
          this.messageBar.errorModal(resBody.errorMessage)
          this.$form.removeClass("loading")
          return
        }

        this.datas = resBody.data
        console.log(this.datas);

        this.dataTable.clear().draw()
        this.dataTable.rows.add(this.datas).draw()
        this.dataTable.columns.adjust().draw();
        this.$form.removeClass("loading");
      }, err => {
        console.log("Error Upload", err)
        let body: any = err.json()
        this.messageBar.errorModal(body.error)
        this.$form.removeClass("loading")
      }
    )
  }

  onSave(e) {
    console.log("this.idFactors", this.idFactors);

    this.dataFactorsData.patchValue({
      inspectionWork: this.route.snapshot.queryParams["inspectionWork"],
      budgetYear: this.route.snapshot.queryParams["budgetYear"],
      iaRiskFactorsDataList: this.datas,
      side: this.dataFactors.value.side,
      idFactors: this.idFactors,

      dataEvaluate: 'NEW',
      riskUnit: this.dataList.riskUnit,
      infoUsedRiskDesc:this.dataList.infoUsedRiskDesc,
      riskFactorsMaster:this.dataList.riskFactorsMaster,
      riskIndicators:this.dataList.riskIndicators
    })
    console.log(this.dataFactorsData.value);
    console.log(this.dataList);

    // return
    if (this.dataFactorsData.invalid) {
      this.messageBar.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
      return;
    }

    if (this.showCalendar) {
      let from = $('#startDateNew').val()
      let to = $('#endDateNew').val()
      if (!from || !to) {
        this.messageBar.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
        return;
      }
    }
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        const URL = "ia/int03/01/01/saveFactorsData"
        this.ajaxService.doPost(URL, this.dataFactorsData.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.loacationBack()
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }

        })
        console.log(this.dataFactorsData.value)
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  loacationBack() {
    this.router.navigate(['/int03/06'], {
      queryParams: {
        inspectionWork: this.inspectionWork,
        budgetYear: this.budgetYear
      }
    });
  }

  invalidControl(control: string) {
    return this.dataFactors.get(control).invalid && (this.dataFactors.get(control).touched || this.submitted);
  }
}

class File {
  [x: string]: any
  name: string
  type: string
  value: any
}
