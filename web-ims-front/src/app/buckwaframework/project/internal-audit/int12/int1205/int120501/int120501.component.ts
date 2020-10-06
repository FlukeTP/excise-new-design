import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "helpers/datepicker";
import { AjaxService } from "services/ajax.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { Int120501Service } from "./in120501.service";
import { BreadCrumb } from 'models/breadcrumb.model';
import { ComboBox } from 'models/combobox.model';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';

declare var $: any;
@Component({
  selector: "app-int120501",
  templateUrl: "./int120501.component.html",
  styleUrls: ["./int120501.component.css"],
  providers: [Int120501Service]
})
export class Int120501Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  comboBox1: Observable<ComboBox[]>;
  comboBox2: Observable<ComboBox[]>;
  comboBox3: Observable<ComboBox[]>;
  combo1: any;
  combo2: any;
  combo3: any;
  endDate: any;
  startDate: any;

  constructor(
    private selfService: Int120501Service,
    private ajax: AjaxService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService 
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูล รับ - โอนเงิน", route: "#" }
    ];
  }

  async ngOnInit() {
    this.authService.reRenderVersionProgram("INT-120501");
    this.comboBox1 = await this.selfService.dropdown("TRANSFER");
    this.comboBox2 = await this.selfService.dropdown("BUDGET_TYPE");
    this.comboBox3 = await this.selfService.dropdown("ACTIVITY");
    $(".ui.dropdown.ai")
      .dropdown()
      .css("width", "100%");

    this.hidedata();

    $("#calendar1").calendar({
      // maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (a, b) => {
        this.startDate = b;
      }
    });
    $("#calendar2").calendar({
      // maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (a, b) => {
        this.endDate = b;
      }
    });
  }

  ngAfterViewInit(): void {
    this.selfService.DATATABLE();
  }

  onFilter = () => {
    // $("#int069").show();
    let DATA = {
      transferList: this.combo1,
      budgetType: this.combo2,
      activities: this.combo3,
      start: this.startDate,
      end: this.endDate
    };
    this.selfService.filterDropdrown(DATA);
  };

  hidedata() {
    // $("#int069").hide();
    $("#combo1").dropdown("restore defaults");
    $("#combo2").dropdown("restore defaults");
    $("#combo3").dropdown("restore defaults");
    this.startDate = "";
    this.endDate = "";
  }

  popupEditData() {
    $("#int0699").modal("show");
  }

  closePopupEdit() {
    $("#int0699").modal("hide");
  }

  // export
  export = () => {
    let data = this.selfService.getDataExcel();
    let formExcel = $("#form-data-excel").get(0);
    formExcel.action = AjaxService.CONTEXT_PATH + "ia/int069/export";
    formExcel.dataJson.value = JSON.stringify({ int069ExcelList: data });
    formExcel.submit();
  };
}
