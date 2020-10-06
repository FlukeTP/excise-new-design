import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute } from '@angular/router';
import { Int090201Service } from './int090201.service';

declare var $: any;
@Component({
  selector: 'app-int090201',
  templateUrl: './int090201.component.html',
  styleUrls: ['./int090201.component.css'],
  providers: [Int090201Service]
})
export class Int090201Component implements OnInit {

  breadcrumb: BreadCrumb[] = [];
  budgetDropdown: Promise<any>;
  budgetCodeList: any;
  loadingInit: boolean = true;
  loadingTable: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private selfService: Int090201Service,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบเบิกจ่าย", route: "#" },
      { label: "ตรวจสอบการเบิกและจ่ายเงิน", route: "#" },
      { label: "เปรียบเทียบรายงานสรุปรายการขอเบิก", route: "#" }
    ];
  }

  ngAfterViewInit() {}

  ngOnInit() {
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    this.authService.reRenderVersionProgram("INT-06210");
    const idExcel1 = this.route.snapshot.queryParams["idExcel1"];
    const idExcel2 = this.route.snapshot.queryParams["idExcel2"];
    const idSortsys = this.route.snapshot.queryParams["comboBoxId"];
    this.selfService
      .getBudgetCode(idExcel1)
      .then(data => {
        this.budgetCodeList = data;
        setTimeout(() => {
          $(".ui.dropdown").dropdown();
          $(".ui.dropdown.ai").css("width", "100%");
          this.loadingInit = false;
        }, 30);
      })
      .catch(() => {
        setTimeout(() => {
          this.loadingInit = false;
          this.msg.errorModal("เกิดข้อผิดพลาด");
        }, 100);
      });
    this.selfService.getDropdownT(idExcel2).then(dropdown => {
      this.budgetDropdown = dropdown;
    });
    this.hideData();
  }

  hideData() {
    $("#Int0621").hide();
  }
  showData(e: any) {
    e.preventDefault();
    this.loadingTable = true;
    this.selfService
      .compareDataExcel(e)
      .then(() => {
        setTimeout(() => {
          this.loadingTable = false;
        }, 400);
      })
      .catch(() => {
        setTimeout(() => {
          this.loadingTable = false;
          this.msg.errorModal("เกิดข้อผิดพลาด");
        }, 400);
      });
  }

}
