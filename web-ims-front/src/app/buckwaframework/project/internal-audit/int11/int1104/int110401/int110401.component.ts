import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';
import { DateStringPipe } from 'app/buckwaframework/common/pipes/date-string.pipe';
import * as moment from 'moment';

/* _______________ URL _______________ */
const URL = {
  FIND_BY_ID_HDR: "ia/int11/04/01/find-by/id-hdr",
  SAVE_DTL: "ia/int11/04/01/save/follow-recommend-dtl"
}

declare var $: any;
@Component({
  selector: 'app-int110401',
  templateUrl: './int110401.component.html',
  styleUrls: ['./int110401.component.css']
})
export class Int110401Component implements OnInit {
  breadcrumb: BreadCrumb[];
  idHdr: number
  dataHdr: FormGroup = new FormGroup({});
  dataDtl: FormGroup = new FormGroup({});
  details: FormArray = new FormArray([]);
  submitted: boolean = false;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) {

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "สรุปผลการตรวจและติดตาม", route: "#" },
      { label: "ติตตามผลการปฏิบัติตามข้อเสนอแนะ", route: "#" },
      { label: "รายละเอียดการติดตามผลการปฏิบัติตามข้อเสนอแนะ", route: "#" }
    ];

  }

  initVariable() {
    this.dataHdr = this.fb.group({
      budgetYear: ["", Validators.required],
      checkType: ["", Validators.required],
      projectName: ["", Validators.required],
      area: ["", Validators.required],
      notifyNo: ["", Validators.required],
      approveDate: ["", Validators.required],
    });

    this.dataDtl = this.fb.group({
      details: this.fb.array([])
    })
  }

  ngOnInit() {
    this.initVariable();
    this.idHdr = this.route.snapshot.queryParams["idHdr"] || null;
    if (this.idHdr != null) {
      this.getDataHdr();
    }
  }

  ngAfterViewInit(): void {
    // this.calendar();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  getDataHdr() {
    this.ajax.doGet(`${URL.FIND_BY_ID_HDR}/${this.idHdr}`).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        let data = response.data;
        this.dataHdr.patchValue({
          budgetYear: data["budgetYear"],
          checkType: data["checkType"],
          projectName: data["projectName"],
          area: data["area"],
          notifyNo: data["notifyNo"],
          approveDate: new DateStringPipe().transform(data["approveDate"], false),
        })
        /* _____ details _____ */
        if (data.details.length > 0) {
          for (let i = 0; i < data.details.length; i++) {
            this.details = this.dataDtl.get('details') as FormArray;
            this.details.push(
              this.fb.group({
                id: [data.details[i]["id"]],
                idFollowRecommendHdr: [this.idHdr],
                followNotifyBookNumber: [{ value: data.details[i]["followNotifyBookNumber"], disabled: true }, Validators.required],
                followNotifyDateStr: [{ value: data.details[i]["followNotifyDateStr"], disabled: true }, Validators.required],
                daedlinesStartStr: [{ value: data.details[i]["daedlinesStartStr"], disabled: true }, Validators.required],
                daedlinesEndStr: [{ value: data.details[i]["daedlinesEndStr"], disabled: true }, Validators.required],
                resultNotifyBookNumber: [{ value: data.details[i]["resultNotifyBookNumber"], disabled: true }, Validators.required],
                resultNotifyDateStr: [{ value: data.details[i]["resultNotifyDateStr"], disabled: true }, Validators.required],
                followReportBookNumber: [{ value: data.details[i]["followReportBookNumber"], disabled: true }, Validators.required],
                followReportDateStr: [{ value: data.details[i]["followReportDateStr"], disabled: true }, Validators.required],
                timeNotify: [data.details[i]["timeNotify"]],
                daedlinesIDiff: [this.calDiffDate(new DateStringPipe().transform(data["approveDate"], false), data.details[i]["daedlinesStartStr"])],
                daedlinesIIDiff: [this.calDiffDate(new DateStringPipe().transform(data["approveDate"], false), data.details[i]["daedlinesEndStr"])],
                flagUpdate: [data.details[i]["flagUpdate"]]
              })
            );
            /* ____ calendar ____ */
            this.calendar(this.details.controls.length - 1);
          }
        } else {
          /*____ Inintial details ____*/
          this.addDetails()
        }
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  /* ______________ Push formbuilder to form array _____________ */
  addDetails() {
    this.details = this.dataDtl.get('details') as FormArray;
    this.details.push(
      this.fb.group({
        id: [""],
        idFollowRecommendHdr: [this.idHdr],
        followNotifyBookNumber: ["", Validators.required],
        followNotifyDateStr: ["", Validators.required],
        daedlinesStartStr: ["", Validators.required],
        daedlinesEndStr: ["", Validators.required],
        resultNotifyBookNumber: ["", Validators.required],
        resultNotifyDateStr: ["", Validators.required],
        followReportBookNumber: ["", Validators.required],
        followReportDateStr: ["", Validators.required],
        timeNotify: [this.details.length + 1],
        daedlinesIDiff: [0],
        daedlinesIIDiff: [0],
        flagUpdate: [false]
      })
    )
    /* ____ calendar ____ */
    this.calendar(this.details.controls.length - 1);
  }

  /* _________________ Remove Form from FormArray _________________ */
  deleteDetail(index: number): void {
    this.msg.comfirm(c => {
      if (c) {
        this.details.removeAt(index);
      }
    }, "ยืนยันการลบข้อมูล")
  }

  /* _________________ save details _________________ */
  saveDetails(e) {
    e.preventDefault();
    this.submitted = true;
    if (this.details.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    this.ajax.doPost(URL.SAVE_DTL, this.details.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message)
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  /* _________________ validate field details _________________ */
  validateFieldDtl(index, control) {
    return this.submitted && this.details.at(index).get(control).invalid;
  }

  /* _________________ calculate diff date _________________ */
  calDiffDate(startDate: string, endDate: string) {
    return moment(endDate, "DD/MM/YYYY").diff(moment(startDate, "DD/MM/YYYY"), 'days')
  }

  /* _________________ calendar _________________ */
  calendar(index: number) {
    setTimeout(() => {
      /* ______________________ initial variable ______________________________ */
      let year = (this.dataHdr.get('approveDate').value).split('/')[2];
      let month = ((this.dataHdr.get('approveDate').value).split('/')[1]) - 1;
      let day = (this.dataHdr.get('approveDate').value).split('/')[0];
      /* ______________________________________________________________________ */

      $(`#followNotifyDateCld${index}`).calendar({
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          // this.details = this.dataDtl.get('details') as FormArray;
          this.details.at(index).get('followNotifyDateStr').patchValue(text);
        }
      });

      if (index == 0) {
        $(`#daedlinesICld${index}`).calendar({
          type: "date",
          text: TextDateTH,
          endCalendar: $(`#daedlinesIICld${index}`),
          formatter: formatter(),
          minDate: new Date(year, month, day),
          onChange: (date, text) => {
            this.details.at(index).get('daedlinesStartStr').patchValue(text);

            /* __________ cal day from approveDate __________ */
            this.details.at(index).get('daedlinesIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesStartStr').value));

            $(`#daedlinesIICld${index}`).calendar({
              type: "date",
              text: TextDateTH,
              // startCalendar: $(`#daedlinesICld${index}`),
              formatter: formatter(),
              minDate: new Date((this.details.at(index).get('daedlinesStartStr').value).split('/')[2], (this.details.at(index).get('daedlinesStartStr').value).split('/')[1] - 1, parseInt((this.details.at(index).get('daedlinesStartStr').value).split('/')[0]) + 1),
              onChange: (date, text) => {
                this.details.at(index).get('daedlinesEndStr').patchValue(text);

                /* __________ cal day from approveDate __________ */
                this.details.at(index).get('daedlinesIIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesEndStr').value));

                /* __________ index = 0 change __________ */
                if (this.details.length > 1) {
                  $(`#daedlinesICld${index + 1}`).calendar({
                    type: "date",
                    text: TextDateTH,
                    endCalendar: $(`#daedlinesIICld${index + 1}`),
                    formatter: formatter(),
                    minDate: new Date((this.details.at(index).get('daedlinesEndStr').value).split('/')[2], (this.details.at(index).get('daedlinesEndStr').value).split('/')[1] - 1, parseInt((this.details.at(index).get('daedlinesEndStr').value).split('/')[0]) + 1),
                    onChange: (date, text) => {
                      this.details.at(index).get('daedlinesEndStr').patchValue(text);

                      /* __________ cal day from approveDate __________ */
                      this.details.at(index).get('daedlinesIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesStartStr').value));
                    }
                  });
                }
              }
            });
          }
        });

        // $(`#daedlinesIICld${index}`).calendar({
        //   type: "date",
        //   text: TextDateTH,
        //   // startCalendar: $(`#daedlinesICld${index}`),
        //   formatter: formatter(),
        //   // minDate: new Date((this.details.at(index).get('daedlinesStartStr').value).split('/')[2], (this.details.at(index).get('daedlinesStartStr').value).split('/')[1] - 1, parseInt((this.details.at(index).get('daedlinesStartStr').value).split('/')[0]) + 1),
        //   onChange: (date, text) => {
        //     this.details.at(index).get('daedlinesEndStr').patchValue(text);

        //     /* __________ cal day from approveDate __________ */
        //     this.details.at(index).get('daedlinesIIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesEndStr').value));
        //   }
        // });
      } else if (index > 0) {
        $(`#daedlinesICld${index}`).calendar({
          type: "date",
          text: TextDateTH,
          endCalendar: $(`#daedlinesIICld${index}`),
          formatter: formatter(),
          minDate: new Date((this.details.at(index - 1).get('daedlinesEndStr').value).split('/')[2], (this.details.at(index - 1).get('daedlinesEndStr').value).split('/')[1] - 1, parseInt((this.details.at(index - 1).get('daedlinesEndStr').value).split('/')[0]) + 1),
          onChange: (date, text) => {
            this.details.at(index).get('daedlinesStartStr').patchValue(text);

            /* __________ cal day from approveDate __________ */
            this.details.at(index).get('daedlinesIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesStartStr').value));

            $(`#daedlinesIICld${index}`).calendar({
              type: "date",
              text: TextDateTH,
              startCalendar: $(`#daedlinesICld${index}`),
              formatter: formatter(),
              minDate: new Date((this.details.at(index).get('daedlinesStartStr').value).split('/')[2], (this.details.at(index).get('daedlinesStartStr').value).split('/')[1] - 1, parseInt((this.details.at(index).get('daedlinesStartStr').value).split('/')[0]) + 1),
              onChange: (date, text) => {
                this.details.at(index).get('daedlinesEndStr').patchValue(text);

                /* __________ cal day from approveDate __________ */
                this.details.at(index).get('daedlinesIIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesEndStr').value));

                /* ______________ index > 0 change ______________ */
                // $(`#daedlinesICld${index + 1}`).calendar({
                //   type: "date",
                //   text: TextDateTH,
                //   endCalendar: $(`#daedlinesIICld${index + 1}`),
                //   formatter: formatter(),
                //   minDate: new Date((this.details.at(index).get('daedlinesEndStr').value).split('/')[2], (this.details.at(index).get('daedlinesEndStr').value).split('/')[1] - 1, parseInt((this.details.at(index).get('daedlinesEndStr').value).split('/')[0]) + 1),
                //   onChange: (date, text) => {
                //     this.details.at(index).get('daedlinesEndStr').patchValue(text);

                //     /* __________ cal day from approveDate __________ */
                //     this.details.at(index).get('daedlinesIDiff').patchValue(this.calDiffDate(this.dataHdr.get('approveDate').value, this.details.at(index).get('daedlinesStartStr').value));
                //   }
                // });
              }
            });
          }
        });
      }

      $(`#resultNotifyDateCld${index}`).calendar({
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          // this.details = this.dataDtl.get('details') as FormArray;
          this.details.at(index).get('resultNotifyDateStr').patchValue(text);
        }
      });

      $(`#followReportDateCld${index}`).calendar({
        type: "date",
        text: TextDateTH,
        formatter: formatter(),
        onChange: (date, text) => {
          // this.details = this.dataDtl.get('details') as FormArray;
          this.details.at(index).get('followReportDateStr').patchValue(text);
        }
      });
    }, 200);
  }

}
