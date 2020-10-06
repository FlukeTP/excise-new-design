import { Component, OnInit } from '@angular/core';
import { Int12080101Service } from './int12080101.service';
import { IaService } from 'services/ia.service';
import { MessageBarService } from 'services/message-bar.service';
import { AjaxService } from 'services/ajax.service';
import { AuthService } from 'services/auth.service';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'services/message.service';
import { TextDateTH, formatter } from 'helpers/datepicker';


declare let $: any

const URL = {
  // export: "ia/int120101/exportFile",
  // DATATABLE: AjaxService.CONTEXT_PATH + 'ia/int120101/findAll',
  DROPDOWN_UTILITY: "ia/int12080101/get-utility-type",
  SAVE_UTILITY: "ia/int12080101/save-utility"
}

@Component({
  selector: 'app-int12080101',
  templateUrl: './int12080101.component.html',
  styleUrls: ['./int12080101.component.css'],
  providers: [Int12080101Service]
})
export class Int12080101Component implements OnInit {
  submitted: boolean = false
  breadcrumb: BreadCrumb[]
  loading: boolean = false
  chartOfAccList: any
  formSave: FormGroup
  utilityTypeList: any;
  utilityId: string
  constructor(
    private Int12080101Service: Int12080101Service,
    private iaService: IaService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private message: MessageBarService,
    private ajax: AjaxService,
    private fb: FormBuilder,
  ) {

    this.formSave = this.fb.group({
      utilityId: [null],
      utilityType: ['', Validators.required],
      invoiceNum: ['', Validators.required],
      invoiceMonth: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      requestNum: ['', Validators.required],
      requestDate: ['', Validators.required],
      amount: [0, Validators.required],

      officeCode: [, Validators.required],
      officeDesc: [, Validators.required],
    })
  }

  ngOnInit() {
    let status: string = 'เพิ่มข้อมูลค่าสาธารณูปโภค'
    this.utilityId = this.route.snapshot.queryParams["utilityId"]
    if (this.utilityId) {
      console.log("Have ID naja");
      this.findUtilityById(this.utilityId)
      status = 'แก้ไขข้อมูลค่าสาธารณูปโภค'
    }

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลค่าสาธารณูปโภค", route: "#" },
      { label: status, route: "#" },
    ];

    this.utilityTypeDropdown();

    // $("#year").dropdown();
  }

  ngAfterViewInit(): void {
    $(".ui.dropdown").dropdown()
    $(".ui.dropdown.ia").css("width", "100%")

    this.calendarmonth()
    this.calendardate()
    this.calendarwithdraw()

  }

  findUtilityById(utilityId: string) {
    this.Int12080101Service.findExpensesById(utilityId).then((res: any) => {
      console.log("Have Id ==>", res);
      this.formSave.patchValue({
        utilityId: this.utilityId,
        utilityType: res.utilityType,
        invoiceNum: res.invoiceNum,
        invoiceMonth: res.invoiceMonth,
        invoiceDate: res.invoiceDate,
        requestNum: res.requestNum,
        requestDate: res.requestDate,
        amount: res.amount,
      })
    })
  }

  onSave() {
    this.submitted = true
    this.formSave.patchValue({
      officeCode: this.authService.getUserDetails().officeCode,
      officeDesc: this.authService.getUserDetails().departmentName
    })
    if (this.formSave.invalid) {
      console.log(this.formSave.value);
      this.message.errorModal("กรุณากรอกข้อมูลให้ครบ")
      return
    }
    this.message.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URL.SAVE_UTILITY, this.formSave.value).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.message.successModal(res.message);
            this.goLocation()
          } else {
            this.message.errorModal(res.message);
          }
          this.submitted = false
        })
        // this.Int12080101Service.onSave(this.formSave.value).then((res: any) => {

        // });
      }
    }, "ยืนยันการบันทึก")
  }

  goLocation() {
    this.router.navigate(["/int12/08/01"], {
      // queryParams: {
      //   inspectionWork: this.inspectionWork.value,
      //   budgetYear: this.budgetYear
      // }
    })
  }

  invalidSaveControl(control: string) {
    return this.formSave.get(control).invalid && (this.formSave.get(control).touched || this.submitted);
  }

  // changeReceive() {
  //   this.formSave.patchValue({
  //     sumReceive: this.formSave.value.serviceReceive + this.formSave.value.suppressReceive + this.formSave.value.budgetReceive,
  //     sumWithdraw: this.formSave.value.serviceWithdraw + this.formSave.value.suppressWithdraw + this.formSave.value.budgetWithdraw,
  //     serviceBalance: this.formSave.value.serviceReceive - this.formSave.value.serviceWithdraw,
  //     suppressBalance: this.formSave.value.suppressReceive - this.formSave.value.suppressWithdraw,
  //     budgetBalance: this.formSave.value.budgetReceive - this.formSave.value.budgetWithdraw,
  //   })
  //   this.formSave.patchValue({
  //     moneyBudget: this.formSave.value.serviceBalance + this.formSave.value.suppressBalance,
  //     moneyOut: this.formSave.value.budgetBalance,
  //     sumBalance: this.formSave.value.serviceBalance + this.formSave.value.suppressBalance + this.formSave.value.budgetBalance
  //   })
  //   this.formSave.patchValue({
  //     moneyBudget: this.formSave.value.serviceBalance + this.formSave.value.suppressBalance - this.formSave.value.averageCost + this.formSave.value.averageFrom,
  //     moneyOut: this.formSave.value.budgetBalance - this.formSave.value.averageCost + this.formSave.value.averageFrom,
  //     moneyOut: this.formSave.value.budgetBalance - this.formSave.value.averageCostOut + this.formSave.value.averageFromOut,
  //   })
  // }

  utilityTypeDropdown() {
    this.ajax.doGet(`${URL.DROPDOWN_UTILITY}`).subscribe((response: ResponseData<any>) => {
      if (response.status === 'SUCCESS') {
        this.utilityTypeList = response.data;
      } else {
        this.message.errorModal(response.message);
      }
    }), error => {
      this.message.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
    };
  }

  calendarmonth() {
    $("#month").calendar({
      type: "month",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter("ด"),
      onChange: (date, text) => {
        this.formSave.patchValue({
          invoiceMonth: text
        })
      }
    });
  }

  calendardate() {
    $("#date").calendar({
      type: "date",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSave.patchValue({
          invoiceDate: text
        })
      }
    });
  }

  calendarwithdraw() {
    $("#requestDate").calendar({
      type: "date",
      initialDate: new Date(),
      text: TextDateTH,
      formatter: formatter(),
      onChange: (date, text) => {
        this.formSave.patchValue({
          requestDate: text
        })
      }
    });
  }

}