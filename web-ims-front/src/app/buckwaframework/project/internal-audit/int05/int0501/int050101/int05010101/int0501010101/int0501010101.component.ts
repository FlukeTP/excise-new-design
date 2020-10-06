import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumb } from 'models/breadcrumb.model';
import { AjaxService } from 'services/ajax.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { ResponseData } from 'models/response-data.model';
import { MessageService } from 'services/message.service';

const URL = {
  SAVE_FORM_DTL: "ia/int05/01/01/01/01/save/travel-estimator-form-dtl"
}

declare var $: any;
@Component({
  selector: 'app-int0501010101',
  templateUrl: './int0501010101.component.html',
  styleUrls: ['./int0501010101.component.css']
})

export class Int0501010101Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ประมาณการค่าใช้จ่ายในการเดินทางไปราชการ", route: "#" },
    { label: "รายละเอียดเอกสาร", route: "#" },
    { label: "สร้างเอกสารประมาณการค่าใช้จ่าย", route: "#" }
  ];

  formDetail: FormGroup = new FormGroup({});
  submitted: boolean;

  constructor(
    private ajax: AjaxService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private router: Router
  ) { }

  initVariable() {
    this.formDetail = this.fb.group({
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      position: [""],
      type: [""],
      grade: [""],
      permissionDate: [""],
      writeDate: [""],
      departureFrom: [""],
      departureDate: [""],
      departureTo: [""],
      returnDate: [""],
      numberDateAllowance: [""],
      numberHoursAllowance: [""],
      allowanceR: [""],
      allowanceTotal: [""],
      numberDateRoost: [""],
      roostR: [""],
      roostTotal: [""],
      passage: [""],
      otherExpenses: [""],
      expensesTotal: [""],
      remarkT: [""],
    });
  }

  ngOnInit() {
    this.initVariable();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    $(".ui.dropdown").dropdown().css("width", "100%");
    this.calendar();
  }

  saveForm(e) {
    e.preventDefault();
    this.submitted = true;
    if (this.formDetail.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    console.log("formDetail: ", this.formDetail.value);

    this.ajax.doPost(URL.SAVE_FORM_DTL, this.formDetail.value).subscribe((response: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == response.status) {
        this.msg.successModal(response.message)
      } else {
        this.msg.errorModal(response.message);
      }
    }, err => {
      this.msg.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    });
  }

  routeTo(path: string, value?: any) {
    this.router.navigate([path]);
  }

  /* _________________ calendar _________________ */
  calendar() {
    $('#permissionDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formDetail.get('permissionDate').patchValue(text);
      }
    }).css("width", "100%");

    $('#writeDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formDetail.get('writeDate').patchValue(text);
      }
    }).css("width", "100%");

    $('#departureDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formDetail.get('departureDate').patchValue(text);
      }
    }).css("width", "100%");

    $('#returnDateCld').calendar({
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formDetail.get('returnDate').patchValue(text);
      }
    }).css("width", "100%");
  }

  /* _________________ validate field _________________ */
  validateField(control) {
    return this.submitted && this.formDetail.get(control).invalid;
  }

}
