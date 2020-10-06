import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-ta0302',
  templateUrl: './ta0302.component.html',
  styleUrls: ['./ta0302.component.css']
})
export class Ta0302Component implements OnInit {

  loadingHeader: boolean = false;
  docTypeList: any[];

  constructor(
    private router: Router
  ) {
    this.docTypeList = [
      {
        value: "ขอส่งกระดาษทำการคัดเลือกราย",
        code: "01"
      }, {
        value: "แจ้งจัดทำแผนการตรวจสอบภาษี",
        code: "02"
      }, {
        value: "ขอรายงานผลการตรวจสอบภาษี",
        code: "03"
      },
    ]
  }
  //  ========================= Initial setting ===================
  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.callDropdown();
  }

  ngOnDestroy(): void {
  }

  callDropdown() {
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
    }, 50);
  }
  // =========================== Action ==========================
  goToPage(e) {
    this.router.navigate([`/tax-audit-new/ta03/02/${e.target.value}`]);
  }
  // ============== call back-end ================

}