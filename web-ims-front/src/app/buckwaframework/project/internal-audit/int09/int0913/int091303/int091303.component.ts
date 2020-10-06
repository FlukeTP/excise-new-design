import { Component, OnInit } from '@angular/core';
import { BreadCrumb, ResponseData } from 'models/index';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatter, TextDateTH } from "helpers/datepicker";
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'services/message.service';
declare var $: any;

const URLS = {
  GET_DATA: "ia/int091303/find-091303-search",
  SAVE_DATA: "ia/int091303/find-091303-save",
  GET_DEPARTMENT: "ia/int091303/get-department",
}



@Component({
  selector: 'app-int091303',
  templateUrl: './int091303.component.html',
  styleUrls: ['./int091303.component.css']
})
export class Int091303Component implements OnInit {
  datas: any = [];
  numQuarterMatch: any;
  saveFormQuarter: FormGroup
  breadcrumb: BreadCrumb[] = [
    { label: "รายงานค่าสาธารณูปโภค", route: "#" }
  ];

  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.saveFormQuarter = this.formBuilder.group({
      budgetAmt: [""],
      outsideBudgetAmt: [""],
      totalAllocatedFunds: [""],
      exciseOffice: [""],
      budgetYear: [MessageService.budgetYear()]
    });
  }

  ngOnInit() {
    let officeCode = this.route.snapshot.queryParams["param2"] || null;
    let BudgetYear = this.route.snapshot.queryParams["budgetYear"] || null;
    this.saveFormQuarter.patchValue({
      budgetYear: BudgetYear
    })
    if (officeCode != null) {
      this.ajax.doGet(`${URLS.GET_DEPARTMENT}/${officeCode}`).subscribe((response: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == response.status) {
          this.saveFormQuarter.get('exciseOffice').patchValue(response.data.deptName);
          this.searchQuarter(1);
        } else {
          this.messageBar.errorModal(response.message);
        }
      }, err => {
        this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK);
      });
    }
  }

  ngAfterViewInit() {
    this.calendar();
  }

  searchQuarter(numQuarter: any) {
    console.log("numQuarter : ", numQuarter);
    this.numQuarterMatch = numQuarter;
    this.ajax.doPost(URLS.GET_DATA, {
      "budgetYear": this.saveFormQuarter.value.budgetYear,
      "quarter": this.numQuarterMatch,
      "budgetAmt": this.saveFormQuarter.value.budgetAmt,
      "outsideBudgetAmt": this.saveFormQuarter.value.outsideBudgetAmt
    }).subscribe((result: any) => {
      this.datas = result.data
      console.log("datas : ", this.datas);
    })
  }

  quarterActivate(quarterMatch: any) {
    return this.numQuarterMatch == quarterMatch;
  }

  saveQuarter() {
    console.log("saveFormQuarter : ", this.saveFormQuarter.value);
    this.messageBar.comfirm(confirm => {
      if (confirm) {
        this.ajax.doPost(URLS.SAVE_DATA, this.saveFormQuarter.value).subscribe((res: ResponseData<any>) => {
          console.log("dataList", res);
          if (MessageService.MSG.SUCCESS == res.status) {
            this.messageBar.successModal(res.message)
          } else {
            this.messageBar.errorModal(res.message)
          }
        })
      }
    }, "ยืนยันการบันทึกข้อมูล")
  }

  calendar() {
    $("#budgetyearCld")
      .calendar({
        type: "year",
        text: TextDateTH,
        formatter: formatter("ป"),
        onChange: (date, text) => {
          this.saveFormQuarter.get("budgetYear").patchValue(text);
        }
      });
  }

  routeTo(path: string) {
    this.router.navigate([path]);
  }

}
