import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../../common/helper/datepicker";
import { AuthService } from "services/auth.service";

declare var $: any;
@Component({
  selector: "app-report-tax",
  templateUrl: "./report-tax.component.html",
  styleUrls: ["./report-tax.component.css"]
})
export class ReportTaxComponent implements OnInit {
  year: any;
  toggled: boolean;

  constructor(  private authService: AuthService) {}

  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-04040');
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

  onSubmit(e) {
    e.preventDefault();
    this.year = e.target.year.value;
    e.target.year.value = "";
    this.toggled = true;
  }

  onCancel() {
    this.toggled = false;
  }
}
