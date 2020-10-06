import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextDateTH, formatter, Utils } from 'helpers/index';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';


const URL = {
  SAVE: "ia/int0101/save",
  FIND_DATA: "ia/int0101/find/by-id-dtl"
}

declare var $: any;

@Component({
  selector: 'app-int01-details-main',
  templateUrl: './int01-details-main.component.html',
  styleUrls: ['./int01-details-main.component.css']
})

export class Int01DetailsMainComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "แผนการตรวจสอบภายใน", route: "#" },
    { label: "กำหนดรายละเอียดการออกตรวจ", route: "#" }
  ];

  setDetail: FormGroup;
  planDtlId: number;
  submitted = false;
  dateUpdate: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _location: Location,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private route: ActivatedRoute
  ) {

  }

  initialVariable() {
    this.setDetail = this.fb.group({
      responsiblePerson: ['', Validators.required],
      position: ['', Validators.required],
      EngagementFrom: ['', Validators.required],
      EngagementTo: ['', Validators.required],
      AuditFrom: ['', Validators.required],
      AuditTo: ['', Validators.required],
      ReportFrom: ['', Validators.required],
      ReportTo: ['', Validators.required],
      MonitoringFrom: ['', Validators.required],
      MonitoringTo: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.planDtlId = this.route.snapshot.queryParams["planDtlId"] || null;
    this.initialVariable();
    if (Utils.isNotNull(this.planDtlId)) {
      this.initialData(this.planDtlId);
    }
  }

  ngAfterViewInit() {
    this.calendar();
  }

  initialData(idDtl: number) {
    this.ajax.doGet(`${URL.FIND_DATA}/${idDtl}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.dateUpdate = response.data;
        this.dateUpdate.forEach(ele => {
          this.setDetail.get('responsiblePerson').patchValue(ele.responsiblePerson);
          this.setDetail.get('position').patchValue(ele.position);
          if (ele.activity === 'REPORT') {
            this.setDetail.get('ReportFrom').patchValue(ele.dateStartActivityStr);
            this.setDetail.get('ReportTo').patchValue(ele.dateEndActivityStr);
          } else if (ele.activity === 'MONITORING') {
            this.setDetail.get('MonitoringFrom').patchValue(ele.dateStartActivityStr);
            this.setDetail.get('MonitoringTo').patchValue(ele.dateEndActivityStr);
          } else if (ele.activity === 'ENGAGEMENT') {
            this.setDetail.get('EngagementFrom').patchValue(ele.dateStartActivityStr);
            this.setDetail.get('EngagementTo').patchValue(ele.dateEndActivityStr);
          } else if (ele.activity === 'AUDIT') {
            this.setDetail.get('AuditFrom').patchValue(ele.dateStartActivityStr);
            this.setDetail.get('AuditTo').patchValue(ele.dateEndActivityStr);
          }
        });
      } else {
        this.msg.errorModal(response.message);
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }

  calendar() {
    $("#dateCalendarFrom").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.setDetail.get('EngagementFrom').patchValue(text);
      }
    });

    $("#dateCalendarTo").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.setDetail.get('EngagementTo').patchValue(text);
      }
    });

    $("#dateCalendarFrom1").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo2'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.setDetail.get('AuditFrom').patchValue(text);
      }
    });

    $("#dateCalendarTo2").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom1'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {

        this.setDetail.get('AuditTo').patchValue(text);
      }
    });

    $("#dateCalendarFrom3").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo4'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {

        this.setDetail.get('ReportFrom').patchValue(text);
      }
    });

    $("#dateCalendarTo4").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom3'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.setDetail.get('ReportTo').patchValue(text);
      }
    });

    $("#dateCalendarFrom5").calendar({
      type: "date",
      endCalendar: $('#dateCalendarTo6'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {

        this.setDetail.get('MonitoringFrom').patchValue(text);
      }
    });

    $("#dateCalendarTo6").calendar({
      type: "date",
      startCalendar: $('#dateCalendarFrom5'),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text, mode) => {
        this.setDetail.get('MonitoringTo').patchValue(text);
      }
    });
  }

  goBack() {
    this._location.back();
  }

  save(e) {
    e.preventDefault();
    this.submitted = true
    if (this.setDetail.invalid) {
      return this.msg.errorModal(`กรุณากรอกข้อมูลให้ครบ`);
    }

    let request = this.setRequest();
    this.ajax.doPost(URL.SAVE, request).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message);
        this._location.back();
      } else {
        this.msg.errorModal(response.message);
      }
    }), error => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
    this.submitted = false;
  }

  setRequest() {
    let requestList = [];

    /* Engagement */
    let data1 = {};
    data1 = {
      dateStartActivityStr: this.setDetail.get('EngagementFrom').value,
      dateEndActivityStr: this.setDetail.get('EngagementTo').value,
      activity: 'ENGAGEMENT',
    }
    requestList.push(data1);

    /* Audit */
    let data2 = {};
    data2 = {
      dateStartActivityStr: this.setDetail.get('AuditFrom').value,
      dateEndActivityStr: this.setDetail.get('AuditTo').value,
      activity: 'AUDIT'
    }
    requestList.push(data2);

    /* Report */
    let data3 = {};
    data3 = {
      dateStartActivityStr: this.setDetail.get('ReportFrom').value,
      dateEndActivityStr: this.setDetail.get('ReportTo').value,
      activity: 'REPORT'
    }
    requestList.push(data3);

    /* Monitoring */
    let data4 = {};
    data4 = {
      dateStartActivityStr: this.setDetail.get('MonitoringFrom').value,
      dateEndActivityStr: this.setDetail.get('MonitoringTo').value,
      activity: 'MONITORING'
    }
    requestList.push(data4);

    /* map request */
    let request = {
      planDtlId: this.planDtlId,
      responsiblePerson: this.setDetail.get('responsiblePerson').value,
      position: this.setDetail.get('position').value,
      planVo: requestList,
      flagUpdate: this.dateUpdate.length > 0 ? true : false
    };
    return request;
  }

  //function check validator
  validateField(value: string) {
    return this.submitted && this.setDetail.get(value).errors;
  }

}
