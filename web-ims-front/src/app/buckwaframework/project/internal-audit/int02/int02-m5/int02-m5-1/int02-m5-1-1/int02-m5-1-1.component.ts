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
    selector: "app-int02-m5-1-1",
    templateUrl: "./int02-m5-1-1.component.html",
    styleUrls: ["./int02-m5-1-1.component.css"]
})
export class Int02M511Component implements OnInit {

    datatable: any;
    breadcrumb: BreadCrumb[];
    officeCode: any;
    budgetYear: any;
    assessment: any;
    code1: string = "";
    code2: string = "";
    code3: string = "";
    travelTo1List: any[] = [];
    travelTo2List: any[] = [];
    travelTo3List: any[] = [];
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
        // this.assessment.data.forEach(element => {
        //     for (let i = 0; i < element.topicDetail.length; i++) {
        //         const content = element.topicDetail[i];

        //         //console.log(content.topicLevel);
        //         if (content.topicLevel == 1) {
        //             trData += '<tr><td>' + index + '.' + content.topicName.trim() + '</td><td></td><td></td></tr>';
        //             index++;
        //         } else if (content.topicLevel == 2) {
        //             trData += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;' + content.topicName.trim() + '</td><td>' + element.topicDetail[++i].topicName.trim() + '</td><td></td></tr>';
        //         }
        //     };
        // });
        $("#tr").html(trData);
        this.datatable = $("#dataTable").DataTable({
            ordering: false,
            searching: false
        });



    }

    save() {
        alert("บันทึกละ เอาไงต่อ");
    }

    travelTo2Dropdown(event) { }
    travelTo3Dropdown(event) { }

    searchWs() { }
}