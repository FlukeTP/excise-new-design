import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

// services
import { MessageBarService } from "../../../common/services/message-bar.service";

// models
import { Message, BreadCrumb } from "../../../common/models";
import { AjaxService } from "../../../common/services";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "select-form",
  templateUrl: "select-from-2.component.html",
  styleUrls: ["select-form.component.css"]
})
export class SelectFormComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [    
    { label: 'ตรวจสอบภาษี', route: '#' },
    { label: 'การตรวจสอบภาษี', route: '#' },
    { label: 'สร้างกระดาษทำการตรวจสอบภาษี', route: '#' },
  ]

  private showSubMenuMat: boolean = false;
  private showSubMenuIns: boolean = false;
  private showSubMenuTax: boolean = false;
  private coordinate: String;
  private routerOpe051: String;
  constructor(
    private messageBarService: MessageBarService,
    private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService
  ) {}
  ngOnInit(): void {
    this.coordinate = this.route.snapshot.params["coordinate"];
    if (this.coordinate == "สนามกอล์ฟ") {
      this.routerOpe051 = "/ope05-1-1";
    } else {
      this.routerOpe051 = "/ope05-1";
    }
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ope04-1").css("width", "100%");
  }
  ngAfterViewInit(): void {
    $("#showData").hide();
  }

  clickMenuMat() {
    this.showSubMenuMat = true;
    this.showSubMenuIns = false;
    this.showSubMenuTax = false;
  }
  clickMenuIns() {
    this.showSubMenuMat = false;
    this.showSubMenuIns = true;
    this.showSubMenuTax = false;
  }
  clickMenuTax() {
    this.showSubMenuMat = false;
    this.showSubMenuIns = false;
    this.showSubMenuTax = true;
  }
}
