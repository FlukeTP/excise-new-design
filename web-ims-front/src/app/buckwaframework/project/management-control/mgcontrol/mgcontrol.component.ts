import { Component, OnInit } from "@angular/core";
import { TextDateTH, formatter } from "../../../common/helper";
import { AuthService } from "services/auth.service";
import { BreadCrumb } from "models/index";

declare var $: any;
@Component({
  selector: "app-mgcontrol",
  templateUrl: "./mgcontrol.component.html",
  styleUrls: ["./mgcontrol.component.css"]
})
export class MgcontrolComponent implements OnInit {
  public topic: string;

  breadcrumb: BreadCrumb[] = [
    { label: 'หน้าแรก', route: '#' },
    { label: 'ระบบบริหารและควบคุม', route: '#' },
    { label: 'ข้อมูลทางสารสนเทศ', route: '#' }    
  ]

  
  constructor(private authService: AuthService) {
    this.topic = "";
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('REP-03010');
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
    // context
    $("#context .menu .item").tab({
      context: $("#context")
    });
    // checkbox
    $(".ui.checkbox").checkbox();
    // dropdown
    $(".tag.example .ui.dropdown").dropdown({
      allowAdditions: true
    });
    // calendar
    $("#year").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("year")
    });
  }
}
