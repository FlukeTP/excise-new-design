import { Component, OnInit } from "@angular/core";
import { formatter, TextDateTH } from "../../../common/helper/datepicker";
import { AuthService } from "services/auth.service";
declare var $: any;
@Component({
  selector: "app-mgReportResult",
  templateUrl: "./mgReportResult.component.html"
})
export class MgReportResultComponent implements OnInit {
  year: any;

  typeDocs: String[];

  selectDoc: String;

  selectedDoc: String;

  sent: boolean;

  constructor(  private authService: AuthService) {
    // Mock Data
    this.typeDocs = [
      "ระบบการตรวจภาษี",
      "ระบบการตรวจวัตถุดิบคงเหลือ",
      "ระบบตรวจสอบภายในและการตรวจส่งออก"
    ];

    this.sent = false; // false
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-02000');
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    // calendar
    $("#year").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("year")
    });
  }

  onSelectDoc = event => {
    this.selectDoc = this.typeDocs[event.target.value];
  };

  onSubmit = event => {
    // show form generate pdf
    this.year = event.target["year"].value;
    this.sent = true;
    this.selectedDoc = this.selectDoc;
  };

  onDiscard = event => {
    // hide form generate pdf
    this.sent = event;
  };
}
