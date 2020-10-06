import { Component, OnInit } from "@angular/core";
import { TaxHomeService } from "projects/pages/tax-home/tax-home.service";

import { BreadCrumb } from "models/index";

import { MessageBarService } from "services/message-bar.service";

@Component({
  selector: "app-risk-group",
  templateUrl: "./risk-group.component.html",
  styleUrls: ["./risk-group.component.css"],
  providers: [TaxHomeService]
})
export class RiskGroupComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "การส่งออก", route: "#" },
    { label: "กลุ่มเสี่ยง", route: "#" }
  ];
  cardStyle1: string = "#e0e1e2";
  cardStyle2: string = "";
  showType: boolean;
  constructor(
    private taxHomeService: TaxHomeService,
    private msg: MessageBarService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onClickType = (type: any) => {
    this.showType = false;
    if (type == 1) {
      this.showType = false;
      this.cardStyle1 = "#e0e1e2";
      this.cardStyle2 = "white";
    } else if (type == 2) {
      this.showType = true;
      this.cardStyle1 = "white";
      this.cardStyle2 = "#e0e1e2";
    } else {
      this.showType = false;
      this.cardStyle1 = "white";
      this.cardStyle2 = "#e0e1e2";
    }
  };
}
