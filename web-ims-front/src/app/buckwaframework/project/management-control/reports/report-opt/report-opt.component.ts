import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../../common/helper/datepicker";
import { AuthService } from "app/buckwaframework/common/services";

declare var $: any;
@Component({
  selector: "app-report-opt",
  templateUrl: "./report-opt.component.html",
  styleUrls: ["./report-opt.component.css"]
})
export class ReportOptComponent implements OnInit {
  target: any;
  year: any;
  toggled: boolean;
  constructor(  private authService: AuthService) {}
  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-04020');
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
    this.target = e.target.target.value;
    e.target.target.value = "";
  }

  onCancel() {
    this.toggled = false;
  }
}
