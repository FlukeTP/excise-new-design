import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/breadcrumb.model';
import * as moment from 'moment';
import { digit, TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { AjaxService } from 'services/ajax.service';
import { ResponseData } from 'models/index';
import { AuthService } from 'services/auth.service';
import { UserModel } from 'models/user.model';

declare var $: any;
const URL = {
  EXPORT: AjaxService.CONTEXT_PATH + "ia/int090102/pdf/emp-working"
}
@Component({
  selector: 'app-int090102',
  templateUrl: './int090102.component.html',
  styleUrls: ['./int090102.component.css']
})
export class Int090102Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    // { label: this.b.b00.label, route: this.b.b00.route },
    // { label: this.b.b15.label, route: this.b.b15.route },
    // { label: this.b.b16.label, route: this.b.b16.route }
  ];

  userProfile: UserModel;

  events: any[] = [];
  eventDate: any;
  calendarDate: any;
  clientEvents: any;
  calModalForm: FormGroup;
  empWorkingHdrForm: FormGroup;
  loading: boolean = false;
  empWorkingHdr: any;
  empWorkingHdrBackup: any;
  holiday: any[] = [];

  constructor(
    private fb: FormBuilder,
    private messageBar: MessageBarService,
    private ajax: AjaxService,
    private auth: AuthService
  ) {
    this.userProfile = this.auth.getUserDetails();
  }

  ngOnInit() {
    this.setEmpWorkingHdrForm();
    this.setCalModalForm();
    this.getHoliday();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.calendarDate = moment();
    this.callCalendar();
    this.getDetailHdr();
  }

  callCalendar() {
    // $("#workingDate").calendar({
    //   type: "date",
    //   text: TextDateTH,
    //   formatter: formatter(),
    //   onChange: (date, text) => {
    //     this.calModalForm.get('workingDate').patchValue(text);
    //   }
    // });
  }

  // ===================== Initial setting ============
  setEmpWorkingHdrForm() {
    this.empWorkingHdrForm = this.fb.group({
      iaEmpWorkingHSeq: [""],
      userLogin: [""],
      userName: [""],
      userPosition: [""],
      userOffcode: [""],
      workingMonth: [""],
      ownerCaseSpirits: [0],
      asstCaseSpirits: [0],
      remarkCaseSpirits: [""],
      ownerCaseTobacco: [0],
      asstCaseTobacco: [0],
      remarkCaseTobacco: [""],
      ownerCaseCard: [0],
      asstCaseCard: [0],
      remarkCaseCard: [""],
      ownerCaseEdtax: [0],
      asstCaseEdtax: [0],
      remarkCaseEdtax: [""],
      ownerCaseSpiritsFw: [0],
      asstCaseSpiritsFw: [0],
      ownerCaseTobaccoFw: [0],
      asstCaseTobaccoFw: [0],
      ownerCaseCardFw: [0],
      asstCaseCardFw: [0],
      ownerCaseEdtaxFw: [0],
      asstCaseEdtaxFw: [0],
      ownerTotal: [0],
      asstTotal: [0],
      ownerEdtaxTotal: [0],
      asstEdtaxTotal: [0]
    })
  }
  setCalModalForm() {
    this.calModalForm = this.fb.group({
      iaEmpWorkingDtlSeq: [""],
      workingDate: [""],
      workingFlag: [""],
      workingDesc: [""],
      workingRemark: [""],
      reimburseExpFlag: [""]
    })
  }

  callFullCalendar = (event) => {
    var dateStr = moment(this.calendarDate);
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
      },
      dayRender: (date, cell) => {
        let holiday = (element) => {
          let holidayDate = moment(element.holidayDate).clone().add(1, 'y');
          let dates = moment(date);
          let checkMonth = dates.format('MM') == holidayDate.format('MM');
          let checkDay = dates.format('DD') == holidayDate.format('DD');
          return checkMonth && checkDay;
        }
        if (this.holiday.some(holiday)) {
          $(`.fc-day-top[data-date="${moment(date).format("YYYY-MM-DD")}"]`).children().css('color', 'red')
          // cell.css('background-color', 'rgba(255, 203,0,0.6)');
        }
      },
      eventRender: (event, element) => {
        if (event.workingFlag) {
          element.find('.fc-title').prepend("<i class='large " + event.workingFlag + " icon' style='color: " + this.changeFlagToStyle(event.workingFlag) + ";'></i>")
        }
      },
      eventClick: (eventObj) => {
        if (eventObj) {
          this.eventDate = moment(eventObj.start).format('YYYY-MM-DD HH:mm:ss');
          this.clientEvents = $('#calendar').fullCalendar('clientEvents');
          this.calModalForm.get('iaEmpWorkingDtlSeq').patchValue(eventObj.iaEmpWorkingDtlSeq);
          var workingDate = moment(eventObj.start).clone().add(543, 'y');
          this.calModalForm.get('workingDate').patchValue(workingDate.format("DD/MM/YYYY"));
          this.calModalForm.get('workingFlag').patchValue(eventObj.workingFlag);
          this.calModalForm.get('workingDesc').patchValue(eventObj.workingDesc);
          this.calModalForm.get('workingRemark').patchValue(eventObj.workingRemark);
          this.calModalForm.get('reimburseExpFlag').patchValue(eventObj.reimburseExpFlag);
          ///check reimburseExpFlag
          if ("Y" == this.calModalForm.get('reimburseExpFlag').value) {
            $('#reimburseExpFlag').prop("checked", true);
          } else {
            $('#reimburseExpFlag').prop("checked", false);
          }
          ///check workingFlag
          $(`#workingFlag${this.changeIconToFlag(this.calModalForm.get('workingFlag').value)}`).prop("checked", true);
          $("#calModalEvent").modal({
            autofocus: false,
            onShow: () => {
            }
          }).modal('show');
        }
      },
      dayClick: (date, jsEvent, view) => {
        this.eventDate = date;
        let addMoment = moment(date).clone().add(543, 'y');
        this.calModalForm.get('workingDate').patchValue(addMoment.clone().format("DD/MM/YYYY"));
        this.clientEvents = $('#calendar').fullCalendar('clientEvents');
        var momentDate = moment(date).clone().format("YYYY-MM-DD");
        var clientEvent = this.clientEvents.find(e => {
          var event = moment(e.start).clone().format("YYYY-MM-DD");
          return moment(momentDate).clone().isSame(event, 'day');
        });
        if (Utils.isNotNull(clientEvent)) {
          this.calModalForm.get('iaEmpWorkingDtlSeq').patchValue(clientEvent.iaEmpWorkingDtlSeq);
          var workingDate = moment(clientEvent.start).clone().add(543, 'y');
          this.calModalForm.get('workingDate').patchValue(workingDate.format("DD/MM/YYYY"));
          this.calModalForm.get('workingFlag').patchValue(clientEvent.workingFlag);
          this.calModalForm.get('workingDesc').patchValue(clientEvent.workingDesc);
          this.calModalForm.get('workingRemark').patchValue(clientEvent.workingRemark);
          this.calModalForm.get('reimburseExpFlag').patchValue(clientEvent.reimburseExpFlag);
          ///check reimburseExpFlag
          if ("Y" == this.calModalForm.get('reimburseExpFlag').value) {
            $('#reimburseExpFlag').prop("checked", true);
          } else {
            $('#reimburseExpFlag').prop("checked", false);
          }
          ///check workingFlag
          $(`#workingFlag${this.changeIconToFlag(this.calModalForm.get('workingFlag').value)}`).prop("checked", true);
        } else {
          this.calModalForm.get('iaEmpWorkingDtlSeq').reset();
          this.calModalForm.get('workingFlag').reset();
          this.calModalForm.get('workingDesc').reset();
          this.calModalForm.get('workingRemark').reset();
          this.calModalForm.get('reimburseExpFlag').reset();
          ///check reimburseExpFlag
          $('#reimburseExpFlag').prop("checked", false);
          ///check workingFlag
          $(`input[name="workingFlag"]`).prop("checked", false);
        }
        // console.log("clientEvents => ",this.clientEvents);
        // console.log("dayClick date => ",date);
        // console.log("clientEvent => ",clientEvent);
        $("#calModalEvent").modal({
          autofocus: false,
          onShow: () => {
          }
        }).modal('show');
      },
      customButtons: {
        //add button on calendar
        toMonth: {
          text: `เดือนปัจจุบัน`,
          click: () => {
            //this.router.navigate(['/plan02/']);
            let date = moment();
            $('#calendar').fullCalendar(
              'gotoDate', date,
            );
            this.calendarDate = date.clone();
            this.getHoliday();
            this.getDetailHdr();
          }
        },
        nextMonth: {
          text: `ก่อนหน้า >`,
          click: () => {
            this.calendarDate = moment($('#calendar').fullCalendar('getDate')).add(1, 'month');
            this.getHoliday();
            this.getDetailHdr();
          }
        },
        prevMonth: {
          text: `< ย้อนกลับ`,
          click: () => {
            this.calendarDate = moment($('#calendar').fullCalendar('getDate')).add(-1, 'month');
            this.getHoliday();
            this.getDetailHdr();
          }
        }
      },
      header: {
        left: 'title',
        center: 'prevMonth,toMonth,nextMonth',
        right: 'calendarYear,planYear',
      },
      buttonIcons: false, // show the prev/next text
      // weekNumbers: true,
      navLinks: false, // can click day/week names to navigate views
      // editable: true,  //Dragging
      eventLimit: false, // allow "more" link when too many events
      defaultDate: dateStr,
      displayEventTime: false,
      // defaultDate: '2561-01-15',
      defaultView: 'month',
      events: event,
      eventColor: '#3892ec',
      height: 650
    });
  }

  // ================ Action =================
  addEvent() {
    var date = new Date(this.eventDate); // will be in local time
    var momentDate = moment(this.eventDate).clone().format("YYYY-MM-DD");
    var clientEvent = this.clientEvents.find(e => {
      var event = moment(e.start).clone().format("YYYY-MM-DD");
      return moment(momentDate).isSame(event, 'day');
    });
    if (this.calModalForm.get('workingDate').invalid) {
      return;
    }
    if (Utils.isNull(this.calModalForm.get('workingDesc').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      return;
    }
    if (Utils.isNull(this.calModalForm.get('workingFlag').value)) {
      this.messageBar.errorModal(MessageBarService.VALIDATE_INCOMPLETE);
      return;
    }
    this.messageBar.comfirm(res => {
      if (res) {
        this.modalSave();
      }
    }, MessageService.MSG_CONFIRM.SAVE);
  }

  setType(id: number) {
    this.calModalForm.get('workingFlag').patchValue(id);
  }

  onBlurModalDate() {
    setTimeout(() => {
      $("input[formcontrolname='workingDate']")[0].value = this.calModalForm.get('workingDate').value;
    }, 50);
  }

  changeVarNameEvent(obj: any[]) {
    var data;
    var dataAll = [];
    for (let index = 0; index < obj.length; index++) {
      const element = obj[index];
      data = {
        iaEmpWorkingDtlSeq: element.iaEmpWorkingDtlSeq,
        reimburseExpFlag: element.reimburseExpFlag,
        userLogin: element.userLogin,
        userName: element.userName,
        userOffcode: element.userOffcode,
        userPosition: element.userPosition,
        start: element.workingDate,
        title: this.changeToShortName(element.workingFlag),
        workingDesc: element.workingDesc,
        workingFlag: this.changeFlagToIcon(element.workingFlag),
        workingRemark: element.workingRemark,
      }
      dataAll.push(data);
    }
    return dataAll;
  }

  changeFlagToIcon(num: string) {
    switch (num) {
      case "1":
        return "clock"
      case "4":
        return "clipboard"
      case "2":
        return "car"
      case "5":
        return "building"
      case "3":
        return "bed"
      case "6":
        return "address card"
      default:
        return num
    }
  }

  changeIconToFlag(text: string) {
    switch (text) {
      case "clock":
        return 1
      case "clipboard":
        return 4
      case "car":
        return 2
      case "building":
        return 5
      case "bed":
        return 3
      case "address card":
        return 6
      default:
        return text
    }
  }

  changeFlagToStyle(text: string) {
    switch (text) {
      case "clock":
        return "#ff0000"
      case "clipboard":
        return "#ffbe00"
      case "car":
        return "#0eff00"
      case "building":
        return "#00e7dd"
      case "bed":
        return "#0035ff"
      case "address card":
        return "#ff0090"
      default:
        return "white"
    }
  }

  changeToShortName(num: string) {
    switch (num) {
      case "1":
        return "นอกเวลา"
      case "4":
        return "อยู่เวร"
      case "2":
        return "นอกสถานที่"
      case "5":
        return "ไปราชการ"
      case "3":
        return "ลา"
      case "6":
        return "ประจำ"
      default:
        return num
    }
  }

  leftPad(str: string, len: number, ch = '0'): string {
    len = len - str.length + 1;
    return len > 0 ?
      new Array(len).join(ch) + str : str;
  }

  autoAddVal(name: string) {
    // สุรา
    let ownerCaseSpirits = Number(this.empWorkingHdrForm.get('ownerCaseSpirits').value);
    let asstCaseSpirits = Number(this.empWorkingHdrForm.get('asstCaseSpirits').value);
    let ownerCaseSpiritsFw = Number(this.empWorkingHdrBackup.ownerCaseSpiritsFw);
    let asstCaseSpiritsFw = Number(this.empWorkingHdrBackup.asstCaseSpiritsFw);
    // ยาสูบ
    let ownerCaseTobacco = Number(this.empWorkingHdrForm.get('ownerCaseTobacco').value);
    let asstCaseTobacco = Number(this.empWorkingHdrForm.get('asstCaseTobacco').value);
    let ownerCaseTobaccoFw = Number(this.empWorkingHdrBackup.ownerCaseTobaccoFw);
    let asstCaseTobaccoFw = Number(this.empWorkingHdrBackup.asstCaseTobaccoFw);
    // ไพ่
    let ownerCaseCard = Number(this.empWorkingHdrForm.get('ownerCaseCard').value);
    let asstCaseCard = Number(this.empWorkingHdrForm.get('asstCaseCard').value);
    let ownerCaseCardFw = Number(this.empWorkingHdrBackup.ownerCaseCardFw);
    let asstCaseCardFw = Number(this.empWorkingHdrBackup.asstCaseCardFw);
    // ภาษีสรรพสามิต
    let ownerCaseEdtax = Number(this.empWorkingHdrForm.get('ownerCaseEdtax').value);
    let asstCaseEdtax = Number(this.empWorkingHdrForm.get('asstCaseEdtax').value);
    let ownerCaseEdtaxFw = Number(this.empWorkingHdrBackup.ownerCaseEdtaxFw);
    let asstCaseEdtaxFw = Number(this.empWorkingHdrBackup.asstCaseEdtaxFw);
    // รวม
    let ownerTotal = Number(this.empWorkingHdrBackup.ownerTotal);
    let asstTotal = Number(this.empWorkingHdrBackup.asstTotal);

    switch (name) {
      case 'ownerCaseSpirits':
        this.empWorkingHdrForm.get('ownerCaseSpiritsFw').patchValue(ownerCaseSpirits + ownerCaseSpiritsFw - this.empWorkingHdrBackup.ownerCaseSpirits);
        break;
      case 'asstCaseSpirits':
        this.empWorkingHdrForm.get('asstCaseSpiritsFw').patchValue(asstCaseSpirits + asstCaseSpiritsFw - this.empWorkingHdrBackup.asstCaseSpirits);
        break;
      case 'ownerCaseTobacco':
        this.empWorkingHdrForm.get('ownerCaseTobaccoFw').patchValue(ownerCaseTobacco + ownerCaseTobaccoFw - this.empWorkingHdrBackup.ownerCaseTobacco);
        break;
      case 'asstCaseTobacco':
        this.empWorkingHdrForm.get('asstCaseTobaccoFw').patchValue(asstCaseTobacco + asstCaseTobaccoFw - this.empWorkingHdrBackup.asstCaseTobacco);
        break;
      case 'ownerCaseCard':
        this.empWorkingHdrForm.get('ownerCaseCardFw').patchValue(ownerCaseCard + ownerCaseCardFw - this.empWorkingHdrBackup.ownerCaseCard);
        break;
      case 'asstCaseCard':
        this.empWorkingHdrForm.get('asstCaseCardFw').patchValue(asstCaseCard + asstCaseCardFw - this.empWorkingHdrBackup.asstCaseCard);
        break;
      case 'ownerCaseEdtax':
        this.empWorkingHdrForm.get('ownerCaseEdtaxFw').patchValue(ownerCaseEdtax + ownerCaseEdtaxFw - this.empWorkingHdrBackup.ownerCaseEdtax);
        break;
      case 'asstCaseEdtax':
        this.empWorkingHdrForm.get('asstCaseEdtaxFw').patchValue(asstCaseEdtax + asstCaseEdtaxFw - this.empWorkingHdrBackup.asstCaseEdtax);
        break;

      default:
        break;
    }

    this.empWorkingHdrForm.get('ownerTotal').patchValue(ownerTotal + ownerCaseSpirits + ownerCaseTobacco + ownerCaseCard + ownerCaseEdtax - this.empWorkingHdrBackup.ownerTotal);
    this.empWorkingHdrForm.get('ownerEdtaxTotal').patchValue(this.empWorkingHdrForm.get('ownerCaseSpiritsFw').value + this.empWorkingHdrForm.get('ownerCaseTobaccoFw').value + this.empWorkingHdrForm.get('ownerCaseCardFw').value + this.empWorkingHdrForm.get('ownerCaseEdtaxFw').value);
    this.empWorkingHdrForm.get('asstTotal').patchValue(asstTotal + asstCaseSpirits + asstCaseTobacco + asstCaseCard + asstCaseEdtax - this.empWorkingHdrBackup.asstTotal);
    this.empWorkingHdrForm.get('asstEdtaxTotal').patchValue(this.empWorkingHdrForm.get('asstCaseSpiritsFw').value + this.empWorkingHdrForm.get('asstCaseTobaccoFw').value + this.empWorkingHdrForm.get('asstCaseCardFw').value + this.empWorkingHdrForm.get('asstCaseEdtaxFw').value);
  }

  export = e => {
    this.empWorkingHdrForm.get('workingMonth').patchValue(this.calendarDate.clone().format("DD/MM/YYYY"));
    //export
    var form = document.createElement("form");
    form.method = "POST";
    // form.target = "_blank";
    form.action = URL.EXPORT;

    form.style.display = "none";
    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.empWorkingHdrForm.value).toString();
    form.appendChild(jsonInput);

    document.body.appendChild(form);
    form.submit();
  }

  setZeroNumber(number: number) {
    let num = Number(number);
    let zero = 0;
    if (null == num || undefined == num) {
      return zero;
    } else {
      return num;
    }
  }

  // =================== call back-end ==============
  modalSave() {
    this.loading = true;
    const URL = "ia/int090102/save";
    // change workingFlag
    this.calModalForm.get('workingFlag').patchValue(this.changeIconToFlag(this.calModalForm.get('workingFlag').value));
    /// change reimburseExpFlag (true, false) -> (Y, N)
    let reimburseExpFlag = this.calModalForm.get('reimburseExpFlag').value;
    if (reimburseExpFlag) {
      this.calModalForm.get('reimburseExpFlag').patchValue("Y");
    } else {
      this.calModalForm.get('reimburseExpFlag').patchValue("N");
    }
    this.ajax.doPost(URL, this.calModalForm.value).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.getHoliday();
        this.calModalForm.reset();
      } else {
        this.messageBar.successModal(res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }

  saveEmpWorkingHdr() {
    this.messageBar.comfirm(res => {
      if (res) {
        this.loading = true;
        const URL = "ia/int090102/saveHdr";
        // set workingMonth yyyyMM
        let curYear = this.calendarDate.clone();
        let workingMonth = (curYear.clone().add(543, 'y').format('YYYY')).toLocaleString() + this.leftPad((this.calendarDate.month() + 1).toLocaleString(), 2)
        this.empWorkingHdrForm.get('workingMonth').patchValue(workingMonth);
        this.ajax.doPost(URL, this.empWorkingHdrForm.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS) {
            this.messageBar.successModal(res.message);
            this.getDetailHdr();
          } else {
            this.messageBar.errorModal(res.message);
          }
          this.loading = false;
        })
      }
    }, MessageService.MSG_CONFIRM.SAVE);
  }

  getEvent() {
    this.loading = true;
    const URL = "ia/int090102/get-by-month";
    var calendarDate = moment(this.calendarDate).format("DD/MM/YYYY");
    this.ajax.doPost(URL, { workingDate: calendarDate }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.events = [];
        this.events = this.changeVarNameEvent(res.data);
        $('#calendar').fullCalendar('destroy');
      } else {
        this.messageBar.errorModal(res.message);
        this.events = [];
        $('#calendar').fullCalendar('destroy');
      }
      this.callFullCalendar(this.events);
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }

  modalDelete() {
    this.loading = true;
    const URL = "ia/int090102/delete";
    this.ajax.doPost(URL, { iaEmpWorkingDtlSeq: this.calModalForm.get('iaEmpWorkingDtlSeq').value }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.messageBar.successModal(res.message);
        this.getHoliday();
        this.calModalForm.reset();
      } else {
        this.messageBar.errorModal(res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }

  getDetailHdr() {
    this.loading = true;
    const URL = "ia/int090102/get-by-month-hdr";
    let curYear = this.calendarDate.clone();
    let data = {
      workingMonth: (curYear.clone().add(543, 'y').format('YYYY')).toLocaleString() + "01",
      workingMonth2: (curYear.clone().add(543, 'y').format('YYYY')).toLocaleString() + this.leftPad((this.calendarDate.month() + 1).toLocaleString(), 2)
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.empWorkingHdrBackup = res.data;
        this.empWorkingHdrForm.get('iaEmpWorkingHSeq').patchValue(res.data.iaEmpWorkingHSeq);
        this.empWorkingHdrForm.get('userLogin').patchValue(res.data.userLogin);
        this.empWorkingHdrForm.get('userName').patchValue(res.data.userName);
        this.empWorkingHdrForm.get('userPosition').patchValue(res.data.userPosition);
        this.empWorkingHdrForm.get('userOffcode').patchValue(res.data.userOffcode);
        this.empWorkingHdrForm.get('workingMonth').patchValue(res.data.workingMonth);
        this.empWorkingHdrForm.get('ownerCaseSpirits').patchValue(this.setZeroNumber(res.data.ownerCaseSpirits));
        this.empWorkingHdrForm.get('asstCaseSpirits').patchValue(this.setZeroNumber(res.data.asstCaseSpirits));
        this.empWorkingHdrForm.get('remarkCaseSpirits').patchValue(res.data.remarkCaseSpirits);
        this.empWorkingHdrForm.get('ownerCaseTobacco').patchValue(this.setZeroNumber(res.data.ownerCaseTobacco));
        this.empWorkingHdrForm.get('asstCaseTobacco').patchValue(this.setZeroNumber(res.data.asstCaseTobacco));
        this.empWorkingHdrForm.get('remarkCaseTobacco').patchValue(res.data.remarkCaseTobacco);
        this.empWorkingHdrForm.get('ownerCaseCard').patchValue(this.setZeroNumber(res.data.ownerCaseCard));
        this.empWorkingHdrForm.get('asstCaseCard').patchValue(this.setZeroNumber(res.data.asstCaseCard));
        this.empWorkingHdrForm.get('remarkCaseCard').patchValue(res.data.remarkCaseCard);
        this.empWorkingHdrForm.get('ownerCaseEdtax').patchValue(this.setZeroNumber(res.data.ownerCaseEdtax));
        this.empWorkingHdrForm.get('asstCaseEdtax').patchValue(this.setZeroNumber(res.data.asstCaseEdtax));
        this.empWorkingHdrForm.get('remarkCaseEdtax').patchValue(res.data.remarkCaseEdtax);
        this.empWorkingHdrForm.get('ownerCaseSpiritsFw').patchValue(this.setZeroNumber(res.data.ownerCaseSpiritsFw));
        this.empWorkingHdrForm.get('asstCaseSpiritsFw').patchValue(this.setZeroNumber(res.data.asstCaseSpiritsFw));
        this.empWorkingHdrForm.get('ownerCaseTobaccoFw').patchValue(this.setZeroNumber(res.data.ownerCaseTobaccoFw));
        this.empWorkingHdrForm.get('asstCaseTobaccoFw').patchValue(this.setZeroNumber(res.data.asstCaseTobaccoFw));
        this.empWorkingHdrForm.get('ownerCaseCardFw').patchValue(this.setZeroNumber(res.data.ownerCaseCardFw));
        this.empWorkingHdrForm.get('asstCaseCardFw').patchValue(this.setZeroNumber(res.data.asstCaseCardFw));
        this.empWorkingHdrForm.get('ownerCaseEdtaxFw').patchValue(this.setZeroNumber(res.data.ownerCaseEdtaxFw));
        this.empWorkingHdrForm.get('asstCaseEdtaxFw').patchValue(this.setZeroNumber(res.data.asstCaseEdtaxFw));
        this.empWorkingHdrForm.get('ownerTotal').patchValue(this.setZeroNumber(res.data.ownerTotal));
        this.empWorkingHdrForm.get('asstTotal').patchValue(this.setZeroNumber(res.data.asstTotal));
        this.empWorkingHdrForm.get('ownerEdtaxTotal').patchValue(this.setZeroNumber(res.data.ownerEdtaxTotal));
        this.empWorkingHdrForm.get('asstEdtaxTotal').patchValue(this.setZeroNumber(res.data.asstEdtaxTotal));
      } else {
        this.messageBar.errorModal(res.message);
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    })
  }

  getHoliday() {
    this.loading = true;
    const URL = "ia/int090102/get-holiday";
    let data = {
      workingDate: '01/05/2018'
      // workingDate: this.calendarDate.clone().format("DD/MM/YYYY")
    }
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.holiday = res.data;
      } else {
        this.messageBar.errorModal(res.message);
      }
      this.getEvent();
      this.loading = false;
    });
  }

}

export interface events {
  iaEmpWorkingDtlSeq: number;
  reimburseExpFlag: string;
  userLogin: string;
  userName: string;
  userOffcode: string;
  userPosition: string;
  start: string;
  workingDesc: string;
  workingFlag: string;
  workingRemark: string;
}
