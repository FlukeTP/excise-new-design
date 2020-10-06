import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
declare var $: any;
const URL = {
  getAssessmentForm1: "ia/int02m51/getAssessmentForm1"
};
@Component({
  selector: 'app-int02-m5-1-3',
  templateUrl: './int02-m5-1-3.component.html',
  styleUrls: ['./int02-m5-1-3.component.css']
})
export class Int02M513Component implements OnInit {

  datatable: any;
  breadcrumb: BreadCrumb[];
  officeCode: any;
  budgetYear: any;
  assessment: any;
  constructor(private authService: AuthService, private router: Router,
    private route: ActivatedRoute,
    private ajax: AjaxService,
    private messageBarService: MessageBarService) {

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ระบบควบคุมภายใน", route: "#" },
      { label: "แบบประเมินระบบควบคุมภายใน", route: "#" },
      { label: "รายการใหม่", route: "#" },
      { label: "ตรวจสอบ", route: "#" },
    ];

  }

  ngOnInit() {
    $('.ui.radio.checkbox').checkbox();
    this.officeCode = this.route.snapshot.queryParams["officeCode"];
    this.budgetYear = this.route.snapshot.queryParams["budgetYear"];

    this.ajax.post(URL.getAssessmentForm1, { officeCode: this.officeCode, budgetYear: this.budgetYear }, res => {
      this.assessment = res.json();
      this.initDatatable();
    });
  }
  initDatatable(): any {
    console.log(this.assessment.data); let index = 1;
    let trData = "";
    this.assessment.data.forEach(element => {
      for (let i = 0; i < element.topicDetail.length; i++) {
        const content = element.topicDetail[i];

        //console.log(content.topicLevel);
        if (content.topicLevel == 1) {
          trData += '<tr><td  valign="top">' + index + '.' + content.topicName.trim() + '</td><td></td><td valign="top">';
          trData += '<div class="field">';
          trData += '<div class="ui radio checkbox">';
          trData += '<input type="radio" name="check" checked="" tabindex="0" class="hidden">';
          trData += '<label>เพียงพอ เหมาะสม</label>';
          trData += '</div>';

          trData += '<div class="ui radio checkbox">';
          trData += '<input type="radio" name="check" checked=""  class="hidden">';
          trData += '<label>ไม่เพียงพอ</label>';
          trData += '</div>';
          trData += '</div>';
          trData += '</td></tr>';
          index++;
        } else if (content.topicLevel == 2) {
          trData += '<tr><td  valign="top">&nbsp;&nbsp;&nbsp;&nbsp;' + content.topicName.trim() + '</td><td  valign="top">' + element.topicDetail[++i].topicName.trim() + '</td><td valign="top"><div class="field"><div class="ui radio checkbox"><input type="radio" name="check" checked="" tabindex="0" class="hidden"><label>เพียงพอ เหมาะสม</label></div><div class="ui radio checkbox"><input type="radio" name="check" checked=""  class="hidden"><label>ไม่เพียงพอ</label></div></div></td></tr>';
        }
      };
    });
    $("#tr").html(trData);
    this.datatable = $("#dataTable").DataTableTh({
      ordering: false,
      searching: false,
      paging: false,
    });



  }

  save() {
    alert("บันทึกละ เอาไงต่อ");
  }



}