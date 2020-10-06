import { Component, OnInit } from '@angular/core';
import { MessageService } from 'services/index';
import { ResponseData } from 'models/index';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'models/index';
import { ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/index';
import { AjaxService } from 'services/index';
import { AuthService } from 'services/index';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
declare var $: any;
@Component({
  selector: 'app-ta020101',
  templateUrl: './ta020101.component.html',
  styleUrls: ['./ta020101.component.css']
})
export class Ta020101Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b15.label, route: this.b.b15.route },
    { label: this.b.b12.label, route: this.b.b12.route }
  ];

  formPlan: FormGroup;
  submitted: boolean = false;
  yearPlan: any;
  checkPlanMas: boolean = false;
  getPlanData: any[];
  loading: boolean = false;
  budgetYearList: any[];
  budgetYear: string;
  budgetYearNum:number;
  monthYearList: any[];
  selectEdit: any;
  areas: any[];
  sectors: any[];
  formSearch: FormGroup;
  formEdit: FormGroup;
  gbCard: any[];
  officeCode: String;

  sumPlan: number = 0;
  sumAuditPlan: number = 0;
  sumResultPlan: number = 0;

  officecode:string;
  sectorRoute:string;
  areaRoute:string;
  budgetYearRoute:string;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private auth: AuthService,
  ) {

    this.setFormPlan();
    this.setFormSearch();
    this.setFormEdit();
  }

  // ======== Initial Setting ==================================
  ngOnInit() {
    this.formSearch = this.fb.group({
      sector:[''],area:['']
    })
    // this.yearPlan = Number(this.route.snapshot.queryParams["year"]);
    // this.officeCode = this.route.snapshot.queryParams["offcode"];

    this.sectorRoute = this.route.snapshot.queryParams['sector'] || "";
    this.areaRoute = this.route.snapshot.queryParams['area'] || "";
    this.budgetYearRoute = this.route.snapshot.queryParams['budgetyear'] || "";
    if (undefined == this.yearPlan) {

    }
    this.setbgCardColor();
    this.getBudgetYearList();
    this.getSector();
    // this.monthYearList = this.initYearPlan();
  }

  ngAfterViewInit(): void {
    this.formSearch.get("sector").patchValue(this.sectorRoute);
    if (TaUtils.isCentral(this.sectorRoute)) {
      this.getTaxDepartment();
    } else {
      this.getArea(this.sectorRoute);
    }
    this.formSearch.get("area").patchValue(this.areaRoute);

    $("#sector").dropdown('set selected', 0).css('min-width', '3em');
    $("#area").dropdown('set selected', 0).css('min-width', '3em');
  }

  
  getSector() {
    this.ajax.doPost("ta/tax-operator/sector-list", {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.sectors = res.data;
      } else {
        //this.messageBar.errorModal(res.message);
        console.log("getSector Error !!");
      }
    })
  }

  getTaxDepartment() {
    const URL = "preferences/department/dept/central-ta";
    this.ajax.doPost(URL, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      }
    })
  }

  async getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //   this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
      }
    })
  }

  setbgCardColor() {
    this.gbCard = ["#F5CBA7", "#AED6F1", "#82E0AA", "#D7BDE2"];
  }

  setFormEdit() {
    this.formEdit = this.fb.group({
      facNum: ['']
    })
  }

  setFormSearch() {
    this.formSearch = this.fb.group({
      budgetYear: [''],
      area: [''],
      sector: ['']
    })
  }


  setFormPlan() {
    this.formPlan = this.fb.group({
      month1: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month2: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month3: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month4: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month5: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month6: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month7: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month8: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month9: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month10: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month11: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      month12: [null, [Validators.required, Validators.min(0), Validators.max(99)]],
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      numTotal: null
    });
  }


  // ======== Action ==================================================
  validateFormModal(value: string) {
    let num = 0;
    for (let index = 0; index < 12; index++) {
      num = num + Number(this.formPlan.get(`month${index + 1}`).value);
    }
    let quater  = 0;
    [0,3,6,9].forEach(element => {
      let sumQ = 0;
      [0,1,2].forEach(q => {
        sumQ +=  Number(this.formPlan.get(`month${(element + q)+1}`).value);
      })
      this.formPlan.get(`q${quater + 1}`).patchValue(sumQ);
      quater++;
    });
    this.formPlan.get("numTotal").patchValue(num);
    return this.submitted && this.formPlan.get(value).errors;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formEdit.invalid) {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    let data = [{
      budgetYear: this.budgetYear,
    }]
    const URL = "ta/plan-mas/insert/";
    // this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
    //   if (MessageService.MSG.SUCCESS == res.status) {
    //     this.msg.successModal(res.message);
    //     this.getPlanMas()
    //   } else {
    //     this.msg.errorModal(res.message);
    //   }
    //   this.loading = false;
    // })

    this.msg.comfirm(confirm => {
      if (confirm) {
        this.loading = true;
        const URL = "ta/plan-mas/insert/";

        let data = this.initYearPlan();
        // this.previewData(data);
        this.monthYearList.forEach(element => {
          let check = data.findIndex(x => x.month == element.month);
          this.sumPlan = this.sumPlan + Number(element.facNum);
          if (check > -1) {
            data[check].planMasId = element.planMasId;
          }
        });
        // console.log("data save ",data)
        // if (this.checkPlanMas) {
        //   for (let index = 0; index < this.getPlanData.length; index++) {
        //     const element = this.getPlanData[index].planMasId;
        //     data[index].planMasId = element;
        //   }
        // }
        this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
          if (MessageService.MSG.SUCCESS == res.status) {
            this.msg.successModal(res.message);
          } else {
            this.msg.errorModal(res.message);
          }
          this.loading = false;
        })
      }
    }, "ยืนยันการบันทึกข้อมูล");
  }

  // ========== Call Backend ==========================================

  getPlanMas() {
    const URL = "ta/plan-mas/getplan/";
    // const URL = "ta/plan-mas/getplanmas";
    let data = null;
    if (this.officeCode) {
      data = {
        budgetYear: this.budgetYear,
        officeCode: this.officeCode
      }
    } else {
      data = {
        budgetYear: this.budgetYear
      }
    }

    this.loading = true;
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.previewData(res.data);
        const checkNull = null;
        let num = 0;
        if (checkNull != res.data) {
          this.checkPlanMas = true;
          this.getPlanData = res.data;
          this.getPlanData.sort(function (a, b) {
            if (Number(a.month) < Number(b.month)) {
              return -1;
            } else if (Number(b.month) < Number(a.month)) {
              return 1;
            } else {
              return 0;
            }
          })
          let num = 3;
          // for (let index = num; index > 0; index--) {
          //   const element = this.getPlanData[this.getPlanData.length - 1];
          //   this.getPlanData.splice(0, 0, element);
          //   this.getPlanData.pop();
          // }
          // for (let index = 0; index < this.getPlanData.length; index++) {
          //   const element = this.getPlanData[index];
          //   this.formPlan.get(`month${index + 1}`).patchValue(element.facNum);
          //   num = num + element.facNum;
          // }


          this.formPlan.get("numTotal").patchValue(num);
        }
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    });
  }

  previewData(resp: any) {
    resp.forEach(element => {
      let check = this.monthYearList.findIndex(x => x.month == element.month);
      this.sumPlan = this.sumPlan + Number(element.facNum);
      if (check > -1) {
        this.monthYearList[check].planMasId = element.planMasId;
        this.formPlan.get(`month${check + 1}`).patchValue(element.facNum);
      }
    });

  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.budgetYear = this.budgetYearList[0];
          this.budgetYearNum = +this.budgetYear;
          this.monthYearList = this.initYearPlan();
          // console.log("get budget year", this.budgetYear);
          $("#budgetYear").dropdown('set selected', this.budgetYear);
          this.getPlanMas();
        } else {
          this.budgetYearList = [];
          this.budgetYear = null;
        }
      } else {
      }
    });
  }

  budgerYearChange(event) {
    this.budgetYear = event.target.value;
    this.budgetYearNum = +this.budgetYear
  }

  initYearPlan(){
    return [
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 10,
        facNum: this.formPlan.get("month1").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 11,
        facNum: this.formPlan.get("month2").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 12,
        facNum: this.formPlan.get("month3").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 1,
        facNum: this.formPlan.get("month4").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 2,
        facNum: this.formPlan.get("month5").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 3,
        facNum: this.formPlan.get("month6").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 4,
        facNum: this.formPlan.get("month7").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 5,
        facNum: this.formPlan.get("month8").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 6,
        facNum: this.formPlan.get("month9").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 7,
        facNum: this.formPlan.get("month10").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 8,
        facNum: this.formPlan.get("month11").value
      },
      {
        planMasId: null,
        budgetYear: this.budgetYear,
        month: 9,
        facNum: this.formPlan.get("month12").value
      }
    ]
  }
  get isCentral(){
    return TaUtils.isCentral(this.auth.getUserDetails().officeCode);
  }

  get isSector(){
    return TaUtils.isSector(this.auth.getUserDetails().officeCode);
  }

  get isArea(){
    return TaUtils.isArea(this.auth.getUserDetails().officeCode);
  }

}
