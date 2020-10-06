import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { Result, _Result } from "./int02-m4-2.mock";
import { AjaxService } from "../../../../../common/services";

declare var $: any;

const URL = {
  RESULT: "ia/int02m2/result",
  MOCK: "ia/int02m2/result/mock"
};

@Component({
  selector: "app-int02-m4-2",
  templateUrl: "./int02-m4-2.component.html",
  styleUrls: ["./int02-m4-2.component.css"]
})
export class Int02M42Component implements OnInit {

  @Output() showList = new EventEmitter<any>();
  @Input() year: string;

  total: number = 0;
  result: Result[] = [];

  constructor(private ajax: AjaxService) {
  }

  ngOnInit() {
    $(".ui.accordion").accordion();
    this.ajax.post(URL.RESULT, this.year, res => {
      console.log(res.json());
      this.result = res.json();
    });
    // this.ajax.post(URL.MOCK, {result: _Result}, res => {
    //   this.result = res.json();
    // });
  }

  calcTotal() {
    this.total = 0;
    this.result.forEach(obj => {
      this.total += obj.detail.length;
    });
    return this.total;
  }

  show() {
    this.showList.emit("step2");
  }

  back() {
    this.showList.emit("");
  }
}
