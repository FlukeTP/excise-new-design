import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { digit } from 'helpers/index';
import { BreadCrumb } from 'models/index';
import * as moment from 'moment';
import { ExciseService, MessageBarService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-plan0201',
  templateUrl: './plan0201.component.html',
  styleUrls: ['./plan0201.component.css']
})
export class Plan0201Component {
  breadcrumb: BreadCrumb[] = [
    { label: "แผนการออกตรวจ", route: "#" },
    { label: "แผนประจำปี", route: "/plan02/" },
    { label: "แผนประจำเดือน", route: "/plan02/01/" }
  ]
  objSelect: any;
  events: any[] = [];
  notes: any[] = [];
  constructor(
    private router: Router,
    private messageBarService: MessageBarService,
    private exciseService: ExciseService,
    private route: ActivatedRoute
  ) {
    // this.events = [
    //   {
    //     title: 'AU-เชียงราย',
    //     description: 'AU-เชียงราย',
    //     start: '2561-02-15',
    //     end: '2561-02-16',
    //     backgroundColor: "#f49227"
    //   },
    //   {
    //     title: 'AU-เชียงราย',
    //     description: 'AU-เชียงราย',
    //     start: '2561-02-16',
    //     end: '2561-02-17',
    //     backgroundColor: "#f49227"
    //   },
    //   {
    //     title: 'AU-เชียงราย',
    //     description: 'AU-เชียงราย',
    //     start: '2561-02-17',
    //     end: '2561-02-18',
    //     backgroundColor: "#f49227"
    //   },
    // ];
    this.notes = [
      {
        name: "ตรวจสอบภาษี ยังไม่ได้กำหนดวันออกตรวจ",
        quantity: 3,
        children: ["ส่วนกลาง (1)", "สรรพสามิตภาค (2)"]
      },
      {
        name: "ตรวจปฏิบัติการ ยังไม่ได้กำหนดวันออกตรวจ",
        quantity: 3,
        children: ["สำนักมาตรฐาน (1)", "สรรพสามิตภาค (1)", "สรรพสามิตพื้นที่ (1)"]
      },
    ];
  }

  ngAfterViewInit() {
    // Data from service and url params
    const month = this.route.snapshot.queryParams['month'] || '10';
    const year = this.route.snapshot.queryParams['year'] || '2561';
    const data = this.exciseService.getData();
    if (data && data.events) {
      this.events = data.events;
      this.notes = data.notes;
    }
    // Initial data
    const dateStr = moment(`${year}${digit(month)}`, "YYYYMM").format('YYYY-MM-DD');
    this.events = [
      {
        title: 'AU-เชียงราย',
        description: 'AU-เชียงราย',
        start: `${year}-${month}-15`,
        end: `${year}-${month}-16`,
        backgroundColor: "#f49227"
      },
      {
        title: 'AU-เชียงราย',
        description: 'AU-เชียงราย',
        start: `${year}-${month}-16`,
        end: `${year}-${month}-17`,
        backgroundColor: "#f49227"
      },
      {
        title: 'AU-เชียงราย',
        description: 'AU-เชียงราย',
        start: `${year}-${month}-17`,
        end: `${year}-${month}-18`,
        backgroundColor: "#f49227"
      },
    ];
    $('#calendar').fullCalendar({
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
          this.objSelect = eventObj;
        }
      },
      eventDrop: (event, delta, revertFunc) => {
        this.messageBarService.comfirm(e => {
          if (!e) {
            revertFunc();
          } else {
            // const start = moment(event.start._i, "YYYY_MM_DD").add(delta._days, 'days');
            // const end = moment(event.end._i, "YYYY_MM_DD").add(-delta._days, 'days');
            $('#calendar').fullCalendar('updateEvent', event);
          }
        }, "ต้องการเปลี่ยนข้อมูลหรือไม่ ?");
      },
      customButtons: {
        calendarYear: {
          text: 'ปฎิทิน',
          click: () => {
            this.router.navigate(['/plan01/']);
          }
        },
        planYear: {
          text: `แผนประจำปีงบประมาณ ${year}`,
          click: () => {
            this.router.navigate(['/plan02/']);
          }
        }
      },
      header: {
        left: 'title',
        center: '',
        right: 'calendarYear,planYear'
      },
      buttonIcons: false, // show the prev/next text
      // weekNumbers: true,
      navLinks: false, // can click day/week names to navigate views
      editable: true,
      eventLimit: false, // allow "more" link when too many events
      defaultDate: dateStr,
      // defaultDate: '2561-01-15',
      defaultView: 'month',
      events: this.events
    });
  }

  // addSelect() {
  //   const start = moment('2561-02-01');
  //   const end = moment('2561-02-03');
  //   $('#calendar').fullCalendar('renderEvent', {
  //     title: 'จากการคัดกรอง',
  //     start,
  //     end,
  //     status: "NEW",
  //     allDay: true
  //   });
  // }

  // addList() {
  //   const start = moment('2561-01-01');
  //   const end = moment('2561-01-03');
  //   $('#calendar').fullCalendar('renderEvent', {
  //     title: 'จากรายชื่อ',
  //     start,
  //     end,
  //     status: "NEW",
  //     allDay: true
  //   });
  // }

  remove() {
    $('#calendar').fullCalendar('removeEvents', [this.objSelect._id]);
  }

  routeTo() {
    const month = this.route.snapshot.queryParams['month'] || '10';
    const year = this.route.snapshot.queryParams['year'] || '2561';
    this.router.navigate(['/plan03/01'], {
      queryParams: {
        month: month,
        year: year
      }
    });
  }

}
// {
//   title: 'บริษัท ยูนิไทย ชิปยาร์ด แอนด์ เอนจิเนียริ่ง จำกัด',
//   description: 'บริษัท ยูนิไทย ชิปยาร์ด แอนด์ เอนจิเนียริ่ง จำกัด',
//   start: '2561-02-07',
//   end: '2561-02-10',
//   status: "WAITING",
//   backgroundColor: "#f49227"
// },
// {
//   title: 'บริษัท เชฟรอน (ไทย) จำกัด',
//   description: 'บริษัท เชฟรอน (ไทย) จำกัด',
//   start: '2561-02-21',
//   end: '2561-02-23',
//   status: "NEW"
// },
// {
//   title: 'บริษัท ยูนิไทย (ไทย) จำกัด',
//   description: 'บริษัท ยูนิไทย (ไทย) จำกัด',
//   start: '2561-02-18',
//   end: '2561-02-22',
//   status: "NEW"
// },