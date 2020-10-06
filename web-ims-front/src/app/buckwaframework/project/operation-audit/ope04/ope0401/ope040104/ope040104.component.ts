import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import * as moment from 'moment';
import { MessageBarService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-ope040104',
  templateUrl: './ope040104.component.html',
  styleUrls: ['./ope040104.component.css']
})
export class Ope040104Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "แผนรายเดือน", route: "#" },
  ]
  form: FormGroup = new FormGroup({});
  objSelect: any;
  dataTables1: any = [];
  dataTables2: any = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageBarService: MessageBarService
  ) {
    this.form = this.fb.group({

    });
  }

  ngOnInit() {
    this.dataTables1 = [
      { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 2", progress: 45, dateCk: "01 มกราคม 2562", lengthCk: 1 },
      { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่นนทบุรี", progress: 28, dateCk: "02 มกราคม 2561", lengthCk: 2 },
      { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่สิงห์บุรี", progress: 85, dateCk: "01 มกราคม 2560", lengthCk: 3 },
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 1", progress: 15, dateCk: "03 มกราคม 2559", lengthCk: 4 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ปราจีนบุรี", progress: 50, dateCk: "04 มกราคม 2559", lengthCk: 4 },
    ];
    this.dataTables2 = [
      { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", subArea: "สรรพสามิตพื้นที่อยุธยา 1", progress: 15 },
      { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ปราจีนบุรี", progress: 50 },
      { name: "บริษัท เลาทัน ลูอัส (ประเทศไทย) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", subArea: "สรรพสามิตพื้นที่ฉะเชิงเทรา", progress: 25 },
      { name: "บริษัท ซี.เอ.พาร์ท จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่ร้อยเอ็ด", progress: 100 },
      { name: "บริษัท เกอร์ริ่ง(ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่ชัยภูมิ", progress: 10 },
      { name: "บริษัท อีมาส เอ็นเนอร์ยี่ เซอร์วิสเซส (ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", subArea: "สรรพสามิตพื้นที่อุบลราชธานี", progress: 75 },
    ];
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
      dayNamesShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."],
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
          console.log(eventObj);
          this.objSelect = eventObj;
          $('#ope0401').modal('show');
        }
      },
      eventDrop: (event, delta, revertFunc) => {

        this.messageBarService.comfirm(e => {
          if (!e) {
            revertFunc();
          } else {
            console.log(event, delta);
            const start = moment(event.start._i, "YYYY_MM_DD").add(delta._days, 'days');
            const end = moment(event.end._i, "YYYY_MM_DD").add(-delta._days, 'days');
            $('#calendar').fullCalendar('updateEvent', event);
          }
        }, "ต้องการเปลี่ยนข้อมูลหรือไม่ ?");

      },
      customButtons: {
        // selectFromSelection: {
        //   text: 'เลือกจากการคัดกรอง',
        //   click: function () {
        //     $('#ope0401-select').modal('show');
        //   }
        // },
        // selectFromList: {
        //   text: 'เลือกจากรายชื่อ',
        //   click: function () {
        //     $('#ope0401-list').modal('show');
        //   }
        // }
      },
      header: {
        left: 'title',
        center: '',
        right: 'prev,next',
        // center: 'addEventButton',
        // right: 'today prev,next'
      },
      buttonIcons: false, // show the prev/next text
      // weekNumbers: true,
      navLinks: false, // can click day/week names to navigate views
      editable: true,
      eventLimit: false, // allow "more" link when too many events
      defaultDate: dateStr,
      // defaultDate: '2561-01-15',
      defaultView: 'month',
      events: [
        {
          title: 'หจก.หนองแฝกการสุรา',
          description: 'หจก.หนองแฝกการสุรา',
          start: '2562-02-15',
          end: '2562-02-15',
          status: "APPROVE",
          backgroundColor: "#00bc62"
        },
        {
          title: 'หจก.สาโทลำไยทอง',
          description: 'หจก.สาโทลำไยทอง',
          start: '2562-02-15',
          end: '2562-02-15',
          status: "WAITING",
          backgroundColor: "#f49227"
        },
        // {
        //   title: 'บริษัท เชฟรอน (ไทย) จำกัด',
        //   description: 'บริษัท เชฟรอน (ไทย) จำกัด',
        //   start: '2562-02-21',
        //   end: '2562-02-23',
        //   status: "NEW"
        // },
      ]
    });
  }

  addSelect() {
    const start = moment('2561-01-01');
    const end = moment('2561-01-03');
    $('#calendar').fullCalendar('renderEvent', {
      title: 'จากการคัดกรอง',
      start,
      end,
      status: "NEW",
      allDay: true
    });
  }

  cancelSelect() {

  }

  addList() {
    const start = moment('2561-01-01');
    const end = moment('2561-01-03');
    $('#calendar').fullCalendar('renderEvent', {
      title: 'จากรายชื่อ',
      start,
      end,
      status: "NEW",
      allDay: true
    });
  }

  cancelList() {

  }

  remove() {
    $('#calendar').fullCalendar('removeEvents', [this.objSelect._id]);
  }

  prepare() {
    this.router.navigate(['/ope04/01/05/']);
  }

  checkout() {
    this.router.navigate(['/ope04/01/06/']);
  }

  back() {
    this.router.navigate(['/ope04/']);
  }

}