import { Component, OnInit, OnDestroy } from "@angular/core";

var jQuery: any;
declare var $: any;

@Component({
  selector: "app-int02-m4",
  templateUrl: "./int02-m4.component.html",
  styleUrls: ["./int02-m4.component.css"]
})
export class Int02M4Component implements OnInit, OnDestroy {
  topics: any[][];
  province: any[];

  year: string;
  step: any;

  constructor() {
    this.topics = [
      ["ด้านการเงิน", "2", "6", "1"],
      ["ด้านเจ้าหนี้", "2", "4", "3"],
      ["ด้านระบบ e-payment", "4", "1", "7"],
      ["ด้านระบบ GFMIS", "1", "3", "10"]
    ];
    this.step = '';
    this.province = ["สสพ.แม่ฮ่องสอน", "สสพ.นนทบุรี", "สสพ.ลำปาง"];
  }

  ngOnDestroy() {
    $(".ui.modal.show").remove();
  }

  ngOnInit() {
    $(".ui.accordion").accordion({
      selector: {
        trigger: ".title"
      }
    });

    $("#showList").click(function() {
      $(".ui.modal.show").modal("show");
    });

    $("#closeList").click(function() {
      $(".ui.modal.show").modal("hide");
    });
  }

  getStep(event) {
    this.step = event;
  }

  getYear(event) {
    this.year = event;
  }
  
}
