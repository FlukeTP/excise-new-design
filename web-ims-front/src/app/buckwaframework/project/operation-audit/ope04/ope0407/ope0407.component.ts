import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/index';
import * as moment from 'moment';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0407',
  templateUrl: './ope0407.component.html',
  styleUrls: ['./ope0407.component.css']
})
export class Ope0407Component implements OnInit {
  form: FormGroup = new FormGroup({});
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "การตรวจควบคุม", route: "#" },
    { label: "รอบการผลิต", route: "/ope04/08/" },
    { label: "ปฏิทินรอบการผลิต", route: "#" }
  ];
  companyName: string = "ห้างหุ้นส่วนสามัญ แสงจันทร์ เอกมัย - รามอินทรา";
  detail: any;
  month: any[]
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService
  ) {
    this.form = this.fb.group({});
    if (this.route.snapshot.queryParams["companyName"]) {
      this.companyName = this.route.snapshot.queryParams["companyName"];
      this.detail = this.route.snapshot.queryParams["detail"];
      let month = this.detail.split(' ');
      this.month = month;
    } else {
      this.router.navigate(["/ope04/08"]);
      this.month = [" ", " ", " "];
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const dateStr = moment("256202", "YYYYMM").format('YYYY-MM-DD');
    $('#calendar').fullCalendar({
      height: 600,
      locale: 'th',
      monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
      dayNames: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"],
      buttonText: {
        month: "เดือน",
        week: "สัปดาห์",
        day: "วัน",
        list: "แผนงาน"
      },
      closeText: "ปิด",
      dayNamesShort: ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"],
      allDayText: "ตลอดวัน",
      eventLimitText: "เพิ่มเติม",
      noEventsMessage: "ไม่มีกิจกรรมที่จะแสดง",
      longDateFormat: {
        LT: "H:mm",
        LTS: "H:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY เวลา H:mm",
        LLLL: "วันddddที่ D MMMM YYYY เวลา H:mm"
      },
      eventClick: (eventObj) => {
        if (eventObj) {
          // data click
          this.router.navigate(['/ope04/07/01/']);
        }
      },
      eventDrop: (event, delta, revertFunc) => {

        this.messageBarService.comfirm(e => {
          if (!e) {
            revertFunc();
          } else {
            $('#calendar').fullCalendar('updateEvent', event);
          }
        }, "ต้องการเปลี่ยนข้อมูลหรือไม่ ?");

      },
      customButtons: {
        add: {
          text: `เพิ่ม`,
          click: () => {
            this.router.navigate(['/ope04/07/01/'], {
              queryParams: {
                companyName: this.companyName,
                detail: this.detail
              }
            });
          }
        }
      },
      header: {
        left: 'title',
        center: '',
        right: 'add',
        // center: 'addEventButton',
        // right: 'prev,next'
      },
      buttonIcons: false, // show the prev/next text
      // weekNumbers: true,
      navLinks: false, // can click day/week names to navigate views
      editable: false,
      eventLimit: false, // allow "more" link when too many events
      defaultDate: dateStr,
      // defaultDate: '2561-01-15',
      defaultView: 'month',
      eventAfterAllRender: (view) => {
        $('#calendar .fc-toolbar.fc-header-toolbar .fc-left h2').html(`${this.companyName} (${this.month[1]} ${this.month[2]})`);
      },
      events: [
        {
          title: `รอบการผลิตประจำวันที่ ${this.month[0]}`,
          description: `รอบการผลิตประจำวันที่ ${this.month[0]}`,
          start: '2562-02-01',
          end: '2562-02-11',
          status: "NEW",
          backgroundColor: "grey"
        },
        {
          title: 'รอบการผลิตประจำวันที่ 12',
          description: 'รอบการผลิตประจำวันที่ 12',
          start: '2562-02-12',
          end: '2562-02-19',
          status: "NEW",
          backgroundColor: "grey"
        }
      ]
    });
  }

}