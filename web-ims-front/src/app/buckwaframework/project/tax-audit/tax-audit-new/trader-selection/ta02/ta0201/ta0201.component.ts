import { Component, OnInit } from '@angular/core';
import { BreadcrumbContant } from 'app/buckwaframework/project/tax-audit/tax-audit-new/BreadcrumbContant';
import { BreadCrumb } from 'app/buckwaframework/common/models/breadcrumb.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageBarService } from 'app/buckwaframework/common/services/message-bar.service';
import { AjaxService } from 'app/buckwaframework/common/services/ajax.service';
import { ResponseData } from 'app/buckwaframework/common/models/response-data.model';
import { MessageService } from 'app/buckwaframework/common/services/message.service';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
import { AuthService } from 'services/index';
declare var $: any;
@Component({
  selector: 'app-ta0201',
  templateUrl: './ta0201.component.html',
  styleUrls: ['./ta0201.component.css']
})
export class Ta0201Component implements OnInit {
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
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: MessageBarService,
    private ajax: AjaxService,
    private auth: AuthService,
    private router: Router,
    private messageBar: MessageBarService,
  ) {

    this.setFormPlan();
    this.setFormSearch();
    this.setFormEdit();
    this.monthYearList = this.initailMonthYearList();
  }

  // ======== Initial Setting ==================================
  ngOnInit() {
    this.yearPlan = Number(this.route.snapshot.queryParams["year"]);
    if (undefined == this.yearPlan) {

    }
    this.selectEdit = this.initMonthObj();
    this.setbgCardColor();

    this.getBudgetYearList();
    this.getSector();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.getPlanMas();
    $("#sector").dropdown('set selected', 0).css('min-width', '3em');
    $("#area").dropdown('set selected', 0).css('min-width', '3em');

    let offCode = this.auth.getUserDetails().officeCode
    if (TaUtils.isCentral(offCode)) {
      // ส่วนกลาง

    } else if (TaUtils.isSector(offCode)) {
      // ภาค
      this.formSearch.get("sector").patchValue(offCode);
      this.getArea(offCode);
    } else if (TaUtils.isArea(offCode)) {
      // พื้นที่
      let sector = offCode.substring(0, 2) + "0000";
      this.formSearch.get("sector").patchValue(sector);
      this.getArea(sector);
      this.formSearch.get("area").patchValue(offCode);
    }
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
      numTotal: null
    });
  }


  // ======== Action ==================================================
  validateFormModal(value: string) {
    let num = 0;
    for (let index = 0; index < 12; index++) {
      num = num + Number(this.formPlan.get(`month${index + 1}`).value);
    }
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
      planMasId: this.selectEdit.planMasId,
      budgetYear: this.budgetYear,
      month: this.selectEdit.month,
      facNum: this.formEdit.get("facNum").value
    }]
    const URL = "ta/plan-mas/insert/";
    this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.msg.successModal(res.message);
        this.getPlanMas()
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    })

    // this.msg.comfirm(confirm => {
    //   if (confirm) {
    //     this.loading = true;
    //     const URL = "ta/plan-mas/insert/";
    //     let data = [
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 10,
    //         facNum: this.formPlan.get("month1").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 11,
    //         facNum: this.formPlan.get("month2").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 12,
    //         facNum: this.formPlan.get("month3").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 1,
    //         facNum: this.formPlan.get("month4").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 2,
    //         facNum: this.formPlan.get("month5").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 3,
    //         facNum: this.formPlan.get("month6").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 4,
    //         facNum: this.formPlan.get("month7").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 5,
    //         facNum: this.formPlan.get("month8").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 6,
    //         facNum: this.formPlan.get("month9").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 7,
    //         facNum: this.formPlan.get("month10").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 8,
    //         facNum: this.formPlan.get("month11").value
    //       },
    //       {
    //         planMasId: null,
    //         budgetYear: this.yearPlan,
    //         month: 9,
    //         facNum: this.formPlan.get("month12").value
    //       }
    //     ]
    //     if (this.checkPlanMas) {
    //       for (let index = 0; index < this.getPlanData.length; index++) {
    //         const element = this.getPlanData[index].planMasId;
    //         data[index].planMasId = element;
    //       }
    //     }
    //     this.ajax.doPost(URL, data).subscribe((res: ResponseData<any>) => {
    //       if (MessageService.MSG.SUCCESS == res.status) {
    //         this.msg.successModal(res.message);
    //       } else {
    //         this.msg.errorModal(res.message);
    //       }
    //       this.loading = false;
    //     })
    //   }
    // }, "ยืนยันการบันทึกข้อมูล");
  }

  // ========== Call Backend ==========================================

  getPlanMas() {

    this.sumPlan = 0;
    this.sumAuditPlan = 0;
    this.sumResultPlan = 0;
    this.monthYearList = this.initailMonthYearList();
    // const URL = "ta/plan-mas/getplan/";
    const URL = "ta/plan-mas/getplanmas";
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
        // const checkNull = null;
        // let num = 0;
        // if (checkNull != res.data) {
        //   this.checkPlanMas = true;
        //   this.getPlanData = res.data;
        //   this.getPlanData.sort(function (a, b) {
        //     if (Number(a.month) < Number(b.month)) {
        //       return -1;
        //     } else if (Number(b.month) < Number(a.month)) {
        //       return 1;
        //     } else {
        //       return 0;
        //     }
        //   })
        //   let num = 3;
        //   for (let index = num; index > 0; index--) {
        //     const element = this.getPlanData[this.getPlanData.length - 1];
        //     this.getPlanData.splice(0, 0, element);
        //     this.getPlanData.pop();
        //   }
        //   for (let index = 0; index < this.getPlanData.length; index++) {
        //     const element = this.getPlanData[index];
        //     this.formPlan.get(`month${index + 1}`).patchValue(element.facNum);
        //     num = num + element.facNum;
        //   }
        //   this.formPlan.get("numTotal").patchValue(num);
        // }
      } else {
        this.msg.errorModal(res.message);
      }
      this.loading = false;
    });
  }

  previewData(resp: any) {
    resp.forEach(element => {
      let check = this.monthYearList.findIndex(x => x.month == element.month);
      console.log("check ", check);
      this.sumPlan = this.sumPlan + Number(element.facNum);
      this.sumAuditPlan = this.sumAuditPlan + Number(element.auditCount);
      this.sumResultPlan = this.sumResultPlan + Number(element.sumCount);
      if (check > -1) {
        this.monthYearList[check].audNum = element.auditCount;
        this.monthYearList[check].facNum = element.facNum;
        this.monthYearList[check].sumNum = element.sumCount

      }
    });

  }

  getBudgetYearList() {
    this.ajax.doGet('ta/tax-operator/budgetYearList').subscribe((res: ResponseData<string[]>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.budgetYearList = res.data;

        if (this.budgetYearList.length != 0) {

          this.budgetYear = this.budgetYearList[0];
          console.log("get budget year", this.budgetYear);
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

  getArea(officeCode) {
    this.ajax.doPost("preferences/department/area-list/" + officeCode, {}).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        this.areas = res.data;
      } else {
        //   this.messageBar.errorModal(res.message);
        console.log("getArea Error !!");
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

  onChangeSector(e: any) {
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value) {
      this.officeCode = e.target.value;
      if (TaUtils.isCentral(e.target.value)) {
        this.getTaxDepartment();
        this.getPlanMas();
      } else {
        this.getArea(e.target.value);
        this.getPlanMas();
      }
    }
  }
  onChangeArea(e: any) {
    if ("0" != e.target.value && "" != e.target.value) {
      this.officeCode = e.target.value;
      this.getPlanMas();
    }

  }

  clickEdit(item: any) {
    this.selectEdit = item;
    console.log("click edit ", item);
    this.formEdit.get('facNum').patchValue(item.facNum);
    $('#editModal').modal('show');
  }

  initMonthObj() {
    return {
      planMasId: '',
      budgetYear: '',
      month: 0,
      monthName: '',
      facNum: '',
      audNum: "",
      sumNum: ""
    }
  }

  gotoEditPlan(){
    let sector = this.formSearch.get("sector").value;
    let area = this.formSearch.get("area").value;
    // let budgetYear = this.budgetYear;
    if (sector && this.budgetYear ){
      this.router.navigate(['/tax-audit-new/ta02/01/01'], {
        queryParams: {
          sector: sector,
          area:area,
          budgetyear:this.budgetYear
        }
      });
    }else{
      this.messageBar.errorModal("กรุณากรอกเลือกสำนักงาน");
    }

  }

  initailMonthYearList() {
    return [
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 10,
        monthName: "ตุลาคม",
        facNum: this.formPlan.get("month1").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 11,
        monthName: "พฤศจิกายน",
        facNum: this.formPlan.get("month2").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 12,
        monthName: "ธันวาคม",
        facNum: this.formPlan.get("month3").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 1,
        monthName: "มกราคม",
        facNum: this.formPlan.get("month4").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 2,
        monthName: "กุมภาพันธ์",
        facNum: this.formPlan.get("month5").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 3,
        monthName: "มีนาคม",
        facNum: this.formPlan.get("month6").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 4,
        monthName: "เมษายน",
        facNum: this.formPlan.get("month7").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 5,
        monthName: "พฤษภาคม",
        facNum: this.formPlan.get("month8").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 6,
        monthName: "มิถุนายน",
        facNum: this.formPlan.get("month9").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 7,
        monthName: "กรกฎาคม",
        facNum: this.formPlan.get("month10").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 8,
        monthName: "สิงหาคม",
        facNum: this.formPlan.get("month11").value,
        audNum: "-",
        sumNum: "-"
      },
      {
        planMasId: null,
        budgetYear: this.yearPlan,
        month: 9,
        monthName: "กันยายน",
        facNum: this.formPlan.get("month12").value,
        audNum: "-",
        sumNum: "-"
      }
    ]
  }

  get isCentral() {
    return TaUtils.isCentral(this.auth.getUserDetails().officeCode);
  }

  get isSector() {
    return TaUtils.isSector(this.auth.getUserDetails().officeCode);
  }

  get isArea() {
    return TaUtils.isArea(this.auth.getUserDetails().officeCode);
  }
}
