import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { digit, TextDateTH, formatter } from 'app/buckwaframework/common/helper/datepicker';
import * as moment from 'moment';
import { ResponseData } from 'app/buckwaframework/common/models/index';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { Utils } from 'app/buckwaframework/common/helper/utils';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface planWsDtl {
  planNumber: string,
  analysisNumber: string,
  officeCode: string,
  newRegId: string,
  systemType: string,
  planType: string,
  auditStatus: string,
  auditType: string,
  auditStartDate: string,
  auditEndDate: string,
}
declare var $: any;
@Component({
  selector: 'app-ta0203',
  templateUrl: './ta0203.component.html',
  styleUrls: ['./ta0203.component.css']
})
export class Ta0203Component implements OnInit, AfterViewInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route },
    { label: this.b.b16.label, route: this.b.b16.route }
  ];
  loading: boolean = false;
  // === > for active link
  activeLinkType: boolean[];
  activeLinkStatus: boolean[];
  // === > value
  events: any[] = [];
  // === > for Type and Status  
  auditType: any[];
  auditStatus: any[];
  // === >  form group
  searchForm: FormGroup;
  auditTypeFormArray: FormArray;
  auditStatusFormArray: FormArray;

  eventDate: any;
  clientEvents: any;
  calendarForm: FormGroup;
  //===> variable for current year 
  currYear: any;
  areaList:any[];
  monthYearList:any[];
  statusList:any[];
  budgetYearList:any[];
  budgetYear:string;
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBudgetYearList();
    this.getCurrYear();
    this.setSearchForm();
    this.getAuditType();
    this.getAuditStatus();
    this.onSearchSubmit();
    this.setCalendarForm();

    this.getCountArea();
    this.getCountPlanMonth();
    this.getCountPlanStatus();
    // this.getHoliday();

    this.monthYearList = this.initailMonthYearList();
  }

  ngAfterViewInit(): void {

    // can use .empty().append() or .html() 
    $(".fc-prev-button").empty().append('<i class="chevron left icon"></i>');
    $(".fc-next-button").empty().append('<i class="chevron right icon"></i>');

    // $(".fc-toolbar.fc-header-toolbar").css({"margin": "0"});
    this.callJQuery();
    //calendar initial
    this.events = [];
    this.callFullCalendar(this.events);
    this.callCalendar();
    $('.ui.accordion').accordion();
    setTimeout(() => {
      $('.dropdown').dropdown();
  }, 200);
  }

  setCalendarForm() {
    this.calendarForm = this.fb.group({
      title: ["", Validators.required],
      modalStartDate: [""],
      modalEndDate: [""],
    })
  }

  callCalendar() {
    let dateFrom = new Date();
    let dateTo = new Date();
    if (this.calendarForm.get('modalEndDate').value && this.calendarForm.get('modalStartDate').value) {
      const dF = this.calendarForm.get('modalStartDate').value.split('/');
      const dT = this.calendarForm.get('modalEndDate').value.split('/');
      dateFrom = new Date(parseInt(dF[2]), parseInt(dF[1]), parseInt(dF[0]));
      dateTo = new Date(parseInt(dT[2]), parseInt(dT[1]), parseInt(dT[0]));
    }
    $("#modalStartDate").calendar({
      type: "date",
      endCalendar: $('#modalEndDate'),
      text: TextDateTH,
      initialDate: dateFrom,
      formatter: formatter(),
      onChange: (date, text, mode) => {
      }
    });
    $("#modalEndDate").calendar({
      type: "date",
      startCalendar: $('#modalStartDate'),
      text: TextDateTH,
      initialDate: dateTo,
      formatter: formatter(),
      onChange: (date, text, mode) => {
      }
    });
  }

  callFullCalendar = (event) => {

    var mock = [{  title: 'event 2', date: new Date() }];
    var date = new Date();
    var dateMoment = moment(date);
    const month = dateMoment.month() + 1;

    const year = this.currYear;
    // const dateStr = moment(`${year}${digit(month)}`, "YYYYMM").format('YYYY-MM-DD');
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
      selectable: true,
      noEventsMessage: "ไม่มีกิจกรรมที่จะแสดง",
      longDateFormat: {
        LT: "H:mm",
        LTS: "H:mm:ss",
        L: "DD/MM/YYYY",
        LL: "D MMMM YYYY",
        LLL: "D MMMM YYYY เวลา H:mm",
        LLLL: "วันddddที่ D MMMM YYYY เวลา H:mm"
      },
      viewRender: (view) => {
        var getYear = view.title.split(" ");
        getYear[1] = Number(getYear[1]) + 543;
        $("#calendar").find('.fc-toolbar > div > h2').empty().append(
          "<div>" + getYear[0] + " " + getYear[1] + "</div>"
        );

        var date = $("#calendar").fullCalendar('getDate');
        var month_int =  date._d.getMonth();
        var year_int = date._d.getFullYear();

        var startDate = new Date(year_int,month_int,1); 
        var endofday = moment(startDate).endOf('month');
       
        this.getHoliday(startDate,endofday.toDate())

        // console.log("render view ", startDate , " -- ",endofday.toDate() );

      },
      eventRender: (event, element) => {
        if (event.icon) {
          element.find('.fc-title').prepend("<i class='" + event.icon + " icon'></i>")
        }
        // element.popup({
        //   on: 'click',
        //   hoverable: false,
        //   html: `
        //   <div class="ui card" style="width: 300px;box-shadow: none;">
        //     <div class="content">
        //       <div class="header">รายละเอียด</div>
        //       <div class="description">
        //         <label>AnalysisNumber: ${event.analysisNumber}</label><br>
        //         <label>FacFullName: ${event.facFullName}</label><br>
        //         <label>Sector: ${event.secDesc}</label><br>
        //         <label>DutyCode: ${event.dutyCode}</label><br>
        //       </div>
        //     </div>
        //     <div class="extra content" style="border-top: none !important;">
        //       <span class="right floated">
        //         <button class="ui mini primary button eventPopup" >เพิ่มเติม</button>
        //       </span>
        //     </div>
        //   </div>
        //   `,
        //   delay: {
        //     show: 100,
        //     hide: 200
        //   },
        //   trigger: 'click',
        //   placement: 'top',
        //   container: 'body',
        //   onShow: (element) => { // load data (it could be called in an external function.)
        //     $(".eventPopup").click(() => {
        //       this.router.navigate(["tax-audit-new/02/02/01"], {
        //         queryParams: {
        //           newRegId: event.newRegId
        //         }
        //       });
        //     })
        //   },
        // })
      },
      eventClick: (eventObj) => {
        if (eventObj) {
          this.eventDate = moment(eventObj.start).format('YYYY-MM-DD HH:mm:ss');
          this.clientEvents = $('#calendar').fullCalendar('clientEvents');
          $("#calendarEvent").modal({
            onShow: () => {
              this.calendarForm.get('title').patchValue(eventObj.title);
            }
          }).modal('show');
        }
      },
      dayClick: (date, jsEvent, view) => {
        this.eventDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
        this.clientEvents = $('#calendar').fullCalendar('clientEvents');
        var momentDate = moment(date).format("YYYY-MM-DD");
        var clientEvent = this.clientEvents.find(e => {
          var event = moment(e.start).clone().format("YYYY-MM-DD");
          return moment(momentDate).isSame(event, 'day');
        });
        // console.log("clientEvents => ",this.clientEvents);
        // console.log("dayClick date => ",date);
        // console.log("clientEvent => ",clientEvent);

        $("#calendarEvent").modal({
          onShow: () => {
            if (Utils.isNotNull(clientEvent)) {
              this.calendarForm.get('title').patchValue(clientEvent.title);
            } else {
              this.calendarForm.get('title').patchValue("");
            }
          }
        }).modal('show');
        // var dateStr = prompt('Enter a date in YYYY-MM-DD format');
        // var date = new Date(dateStr + 'T00:00:00'); // will be in local time

        // if (!isNaN(date.valueOf())) { // valid?
        //   $('#calendar').fullCalendar('renderEvent', {
        //     title: 'dynamic event',
        //     icon: 'download',
        //     start: date,
        //     allDay: true
        //   });
        //   alert('Great. Now, update your database...');
        // } else {
        //   alert('Invalid date.');
        // }
      },
      // eventDrop: (event, delta, revertFunc) => {
      //   this.messageBar.comfirm(e => {
      //     if (!e) {
      //       revertFunc();
      //     } else {
      //       // const start = moment(event.start._i, "YYYY_MM_DD").add(delta._days, 'days');
      //       // const end = moment(event.end._i, "YYYY_MM_DD").add(-delta._days, 'days');
      //       $('#calendar').fullCalendar('updateEvent', event);
      //     }
      //   }, "ต้องการเปลี่ยนข้อมูลหรือไม่ ?");
      // },
      customButtons: {
        calendarYear: {
          text: 'ปฎิทิน',
          click: () => {
            //this.router.navigate(['/plan01/']);
          }
        },
        planYear: {
          text: `รายการออกตรวจภาษี`,
          click: () => {
            // this.router.navigate(['/plan02/']);
            this.goBack();
          }
        },
        toMonth: {
          text: `เดือนปัจจุบัน`,
          click: () => {
            //this.router.navigate(['/plan02/']);
            let date = moment();
            $('#calendar').fullCalendar(
              'gotoDate', date,
            );
          }
        }
      },
      header: {
        left: 'prev,next toMonth title',
        center: '',
        right: 'calendarYear,planYear'
      },
      buttonIcons: false, // show the prev/next text
      // weekNumbers: true,
      navLinks: false, // can click day/week names to navigate views
      // editable: true,  //Dragging
      eventLimit: false, // allow "more" link when too many events
      // defaultDate: dateStr,
      displayEventTime: false,
      // defaultDate: '2561-01-15',
      defaultView: 'month',
      events: event,
      eventColor: '#6dc29a',
      height: 650
    });
  }

  // ============== set Initail Form ===========
  setSearchForm() {
    this.searchForm = this.fb.group({
      auditTypeFormArray: this.fb.array([]),
      auditStatusFormArray: this.fb.array([]),
    })
  }

  createAuditTypeFormArray(): FormGroup {
    return this.fb.group({
      paramGroupCode: [""],
      paramCode: [""],
      codeDesc: [""],
      checkbox: [false]
    });
  }

  createAuditStatusFormArray(): FormGroup {
    return this.fb.group({
      paramGroupCode: [""],
      paramCode: [""],
      codeDesc: [""],
      checkbox: [false]
    });
  }

  addAuditTypeFormArray(): void {
    this.auditTypeFormArray = this.searchForm.get("auditTypeFormArray") as FormArray;
    this.auditTypeFormArray.push(this.createAuditTypeFormArray());
  }

  addAuditStatusFormArray(): void {
    this.auditStatusFormArray = this.searchForm.get("auditStatusFormArray") as FormArray;
    this.auditStatusFormArray.push(this.createAuditStatusFormArray());
  }

  callJQuery() {
    setTimeout(() => {
      $(".ui.checkbox").checkbox();
    }, 1000);
  }

  // ================ Action ===================
  onSearchSubmit() {
    this.loading = true;
    const URL = "ta/tax-audit/get-plan-ws-dtl-person/";
    let data = {
      auditStatus: this.searchForm.get('auditStatusFormArray').value,
      auditType: this.searchForm.get('auditTypeFormArray').value
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        $('#calendar').fullCalendar('destroy');
        this.events = res.data;
        // this.events =[{"planWorksheetDtlId":3019,"budgetYear":null,"planNumber":"001401-2563-000001","analysisNumber":"001401-2563-000001","officeCode":"001402","newRegId":"01075360002691002","systemType":null,"planType":"I","auditStatus":"0401","auditType":"F","auditStartDate":"2019-07-29","auditEndDate":"2019-07-30","auditPlanCode":null,"cusFullName":"บริษัท บางจาก คอร์ปอเรชั่น จำกัด (มหาชน)","facFullName":"บริษัท บางจาก คอร์ปอเรชั่น จำกัด (มหาชน)","officeCodeR4000":"100300","dutyCode":null,"secCode":"100000","secDesc":"สภ.10","areaCode":"100300","areaDesc":"สสพ.กทม.3","title":"บริษัท บางจาก คอร์ปอเรชั่น จำกัด (มหาชน)","start":"2019-07-29T00:00:00","end":"2019-07-30T00:00:00","allDay":true}
        // ,{"planWorksheetDtlId":3017,"budgetYear":null,"planNumber":"001401-2563-000001","analysisNumber":"001401-2563-000001","officeCode":"001402","newRegId":"01075550001551001","systemType":null,"planType":"I","auditStatus":"0401","auditType":"M","auditStartDate":"2019-07-24","auditEndDate":"2019-07-24","auditPlanCode":null,"cusFullName":"บริษัท สตาร์ ปิโตรเลียม รีไฟน์นิ่ง จำกัด (มหาชน)","facFullName":"บริษัท สตาร์ปิโตรเลียม รีไฟน์นิ่ง จำกัด (มหาชน)","officeCodeR4000":"020700","dutyCode":null,"secCode":"020000","secDesc":"สภ.2","areaCode":"020700","areaDesc":"สสพ.ระยอง 1","title":"บริษัท สตาร์ปิโตรเลียม รีไฟน์นิ่ง จำกัด (มหาชน)","start":"2019-07-24 00:00:00","end":"2019-07-24 23:59:00","allDay":true}]
        this.callFullCalendar(this.events);

        $('#calendar').fullCalendar('refetchEvents');
        this.loading = false;
      } else {
        this.messageBar.errorModal(res.message);
        this.loading = false;
      }
    })

  }

  onClickDetails(event) {
    console.log("onClickDetails", event);

  }

  goBack() {
    this.router.navigate(['tax-audit-new/ta02/05']);
  }

  addEvent() {
    var date = new Date(this.eventDate); // will be in local time
    var momentDate = moment(date).format("YYYY-MM-DD");
    var clientEvent = this.clientEvents.find(e => {
      var event = moment(e.start).clone().format("YYYY-MM-DD");
      return moment(momentDate).isSame(event, 'day');
    });
    if (this.calendarForm.get('title').invalid) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      return;
    }
    if (Utils.isNotNull(clientEvent)) {
      clientEvent.title = this.calendarForm.get('title').value;
      $('#calendar').fullCalendar('updateEvent', clientEvent);
      return $("#calendarEvent").modal('hide');
    }
    if (!isNaN(date.valueOf())) { // valid?
      $('#calendar').fullCalendar('renderEvent', {
        title: this.calendarForm.get('title').value,
        icon: 'calendar alternate',
        start: date,
        allDay: true
      });

      $("#calendarEvent").modal('hide');
    } else {
      this.messageBar.errorModal('Invalid date.');
    }
  }

  // =================== call backend ================
  // get TA_AUDIT_TYPE on table SYS_PARAMETER_INFO
  getAuditType() {
    const URL = "ta/tax-audit/get-audit-type/2563";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 < res.data.length) {
          this.activeLinkType = [];
          this.activeLinkType[0] = true;
          this.auditType = res.data;
          for (let index = 0; index < this.auditType.length; index++) {
            const element = this.auditType[index];
            this.addAuditTypeFormArray();
            this.searchForm.get('auditTypeFormArray').get(index.toString()).get('paramGroupCode').patchValue(element.paramGroupCode);
            this.searchForm.get('auditTypeFormArray').get(index.toString()).get('paramCode').patchValue(element.paramCode);
            this.searchForm.get('auditTypeFormArray').get(index.toString()).get('codeDesc').patchValue(element.value1);
          }
          // this.searchForm.get('auditTypeFormArray').get("0").get('check').patchValue(true);
        }
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  // get TA_AUDIT_STATUS on table SYS_PARAMETER_INFO
  getAuditStatus() {
    const URL = "ta/tax-audit/get-audit-status/";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (0 < res.data.length) {
          this.activeLinkStatus = [];
          this.activeLinkStatus[0] = true;
          this.auditStatus = res.data;
          for (let index = 0; index < this.auditStatus.length; index++) {
            const element = this.auditStatus[index];
            this.addAuditStatusFormArray();
            this.searchForm.get('auditStatusFormArray').get(index.toString()).get('paramGroupCode').patchValue(element.paramGroupCode);
            this.searchForm.get('auditStatusFormArray').get(index.toString()).get('paramCode').patchValue(element.paramCode);
            this.searchForm.get('auditStatusFormArray').get(index.toString()).get('codeDesc').patchValue(element.value1);
          }
          // this.searchForm.get('auditStatusFormArray').get("0").get('check').patchValue(true);
        }
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  //get current year 
  getCurrYear() {
    const URL = "preferences/budget-year";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.currYear = res.data
        // console.log("current year >>> ", this.currYear);

      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getCountArea() {
    const URL = "ta/tax-audit/get-audit-area/2563";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areaList = res.data;

      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getCountPlanMonth() {
    const URL = "ta/tax-audit/get-audit-count-month/2563";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        res.data.forEach(element => {
          let check = this.monthYearList.findIndex(x => x.month == element.month);
          if (check > -1) {
            this.monthYearList[check].facNum = element.auditCount;
          }
        });
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }

  getCountPlanStatus() {
    const URL = "ta/tax-audit/get-audit-count-status/2563";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.statusList = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
    })
  }
  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.budgetYear = this.budgetYearList[0];

        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
        }
      } else {
      }
    });
  }

  getHoliday(start:Date,end:Date) {
    // this.loading = true;
    const URL = "ta/tax-audit/get-plan-calendar-holiday";
    var data = {
      start:start,
      end:end
    }
    this.ajax.doPost(URL,data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        res.data.forEach(element => {
          let event = {
            backgroundColor:"#DCDCDC",
            start:element.start,
            end:element.end,
            allDay:true,
            rendering:"background"
          }
          $('#calendar').fullCalendar('renderEvent', event);
        });
        // $('#calendar').fullCalendar('renderEvent', (res.data));
        
        // $('#calendar').fullCalendar().addEvent(res.data);
        // this.events = res.data;
        // $('#calendar').fullCalendar().calendar().addEvent(res.data);
        // $('#calendar').fullCalendar('refetchEvents');
        // this.loading = false;

        // console.log("renderevent")
      } else {
        this.messageBar.errorModal(res.message);
        // this.loading = false;
      }
    })

  }

  budgerYearChange(event) {
    this.budgetYear = event.target.value;
  }

  initailMonthYearList() {
    return [
      {

        month: 10,
        monthName: "ตุลาคม",
        facNum: 0,

      },
      {

        month: 11,
        monthName: "พฤศจิกายน",
        facNum:0,

      },
      {

        month: 12,
        monthName: "ธันวาคม",
        facNum: 0,

      },
      {

        month: 1,
        monthName: "มกราคม",
        facNum: 0,
      },
      {
        month: 2,
        monthName: "กุมภาพันธ์",
        facNum: 0,
      },
      {

        month: 3,
        monthName: "มีนาคม",
        facNum: 0,
      },
      {

        month: 4,
        monthName: "เมษายน",
        facNum:0,
      },
      {

        month: 5,
        monthName: "พฤษภาคม",
        facNum: 0,
      },
      {
        month: 6,
        monthName: "มิถุนายน",
        facNum: 0,
      },
      {
        month: 7,
        monthName: "กรกฎาคม",
        facNum: 0,
      },
      {

        month: 8,
        monthName: "สิงหาคม",
        facNum: 0,
      },
      {

        month: 9,
        monthName: "กันยายน",
        facNum: 0,
      }
    ]
  }

}
