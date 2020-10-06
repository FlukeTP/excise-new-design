import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AjaxService, MessageBarService, AuthService, MessageService } from 'services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { ResponseData, BreadCrumb } from 'models/index';
import { DecimalFormatPipe } from 'app/buckwaframework/common/pipes/decimal-format.pipe';
import { TaUtils } from 'projects/tax-audit/tax-audit-new/TaAuthorized';
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
declare var $: any;
@Component({
  selector: 'app-ta011101',
  templateUrl: './ta011101.component.html',
  styleUrls: ['./ta011101.component.css']
})
export class Ta011101Component implements OnInit {
  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b01.label, route: this.b.b01.route },
    { label: this.b.b01.label, route: this.b.b01.route },
  ];
  formReplace: FormGroup;
  formSearchModal: FormGroup;
  sectors: any[] = [];
  areas: any[] = [];
  table: any;
  outplanTable: any;
  selectOutPlan: any;
  changeOutPlan: any;
  outplanOffcode: string;
  planType: string;
  sectorRoute: string;
  areaRoute: string;
  budgetYearRoute: string;
  analysisNumber: string;
  planNumber: string;
  officeCode:string;
  searchRegId:string;
  constructor(private ajax: AjaxService,
    private messageBar: MessageBarService,
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.formReplace = this.formBuilder.group({
      sector: [''],
      area: [''],
      planType: ['', Validators.required],
      regid_select: ['', Validators.required],
      facfullName_select: [''],
      cusfullName_select: [''],
      duty_select: [''],
      regid_change: ['', Validators.required],
      facfullName_change: [''],
      cusfullName_change: [''],
      duty_change: [''],
      replaceReason: ['', Validators.required]
    });
    this.formSearchModal = this.formBuilder.group({
      newRegId: [''],
      analysisNumber: [''],
      facType: [''],
      dutyCode: [''],
      sector: [''],
      area: ['']

    });

    this.sectorRoute = this.route.snapshot.queryParams['sector'] || "";
    this.areaRoute = this.route.snapshot.queryParams['area'] || "";
    this.budgetYearRoute = this.route.snapshot.queryParams['budgetyear'] || "";

    this.selectOutPlan = this.initOutPlan();
    this.getSector();
  }

  ngAfterViewInit(): void {
    // this.tablePlan();
    this.formReplace.get("sector").patchValue(this.sectorRoute);
    if (TaUtils.isCentral(this.sectorRoute)) {
      this.getTaxDepartment();
    } else {
      this.getArea(this.sectorRoute);
    }
    this.formReplace.get("area").patchValue(this.areaRoute);

    $("#sector").dropdown('set selected', 0).css('min-width', '3em');
    $("#area").dropdown('set selected', 0).css('min-width', '3em');


    this.findPlanNumberbyBudgetyear();

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

  onSaveOutPlan() {
    let sector = this.formReplace.get("sector").value;
    let area = this.formReplace.get("area").value;
    if (area != "" && area != "0") {
      this.officeCode = area;
    } else if (sector != "" && sector != "0") {
      this.officeCode = sector;
    }

    let planType = this.formReplace.get('planType').value;
    if (planType == 'E') {
      this.formReplace.get('regid_change').clearValidators();
      this.formReplace.get('regid_change').updateValueAndValidity();
    } else {
      this.formReplace.get('regid_change').setValidators([Validators.required]);
      this.formReplace.get('regid_change').updateValueAndValidity();
    }

    if (this.formReplace.valid) {
      // this.changeOutPlan.planReplaceId = this.cusReplace.planWorksheetDtlId
      this.selectOutPlan.replaceReason = this.formReplace.get("replaceReason").value;
      this.selectOutPlan.replaceRegId = this.formReplace.get("regid_select").value;
      this.selectOutPlan.budgetYear = this.budgetYearRoute;
      this.selectOutPlan.planNumber = this.planNumber;
      this.selectOutPlan.analysisNumber = this.analysisNumber;
      this.selectOutPlan.planType = this.planType;
      this.selectOutPlan.officeCode = this.officeCode;
      console.log("save assign ", this.selectOutPlan);
      this.ajax.doPost("ta/tax-operator/update-plan-worksheetdtl-outplan",  this.selectOutPlan).subscribe((res: ResponseData<any>) => {
        if (MessageService.MSG.SUCCESS == res.status) {
          // this.auditType = res.data;
          this.messageBar.successModal(res.message);
          this.router.navigate(['/tax-audit-new/ta01/11']);
          // this.searchPlan();
        }
      });
    } else {
      this.messageBar.errorModal("กรุณากรอกข้อมูลให้ครบ");
    }

  }

  onClear() {
    this.formReplace.reset({
      planType: '',
      regid_select: '',
      facfullName_select: '',
      cusfullName_select: '',
      duty_select: '',
      regid_change: '',
      facfullName_change: '',
      cusfullName_change: '',
      duty_change: '',
      replaceReason: ''
    });
  }

  onChangeSector(e: any) {
    this.areas = [];
    if ("0" != e.target.value && "" != e.target.value) {
      this.outplanOffcode = e.target.value;
      this.getArea(e.target.value);
    }
    this.outplanTable.ajax.reload()

  }

  onChangeArea(e: any) {
    if ("0" != e.target.value && "" != e.target.value) {
      if (TaUtils.isCentral(e.target.value)) {
        this.getTaxDepartment();
      } else {
        this.outplanOffcode = e.target.value;
        this.getArea(e.target.value);
      }
    }
    this.outplanTable.ajax.reload()
  }

  onChangePlanType() {
    this.planType = this.formReplace.get('planType').value;
    // console.log("change plantype", this.formReplace.get('planType').value);
    if(this.planType == 'E'){
      this.formReplace.get("regid_change").patchValue('');
      this.formReplace.get("facfullName_change").patchValue('');
      this.formReplace.get("cusfullName_change").patchValue('');
      this.formReplace.get("duty_change").patchValue('');
    }
  }
  onChangeNewRegId(e: any){
    // console.log("search by reg id ",e.target.value);
    if ("0" != e.target.value && "" != e.target.value) {
      this.searchRegId = e.target.value;
      this.outplanTable.ajax.reload()
    }

  }

  searchCusModal() {
    this.tablePlan();
    $('#searchCusModal').modal('show');
  }

  searchOutPlanModal() {
    this.formSearchModal.get("newRegId").patchValue('');
    this.formSearchModal.get("area").patchValue('')
    this.formSearchModal.get("sector").patchValue('')
    $('#sector_search').dropdown('clear');
    $('#area_search').dropdown('clear');
    this.outplanOffcode = null;
    setTimeout(() => {
      $("#sector_search").dropdown('set selected', 0).css('min-width', '3em');
      $("#area_search").dropdown('set selected', 0).css('min-width', '3em');
    }, 200);

    this.tableOutPlan();
    $('#searchOutPlanModal').modal('show');
  }

  findPlanNumberbyBudgetyear() {
    this.ajax.doPost("ta/tax-operator/find-one-budget-plan-header", { "budgetYear": this.budgetYearRoute }).subscribe((res: ResponseData<any>) => {
      if (MessageService.MSG.SUCCESS == res.status) {
        if (res.data == null) {
          this.analysisNumber = '';
          this.planNumber = '';
        } else {
          this.analysisNumber = res.data.analysisNumber;
          this.planNumber = res.data.planNumber;
        }
      } else {
        // this.messageBar.errorModal("function checkShowButton error!");
      }

    });
  }

  tablePlan = () => {

    if (this.table != null) {
      this.table.destroy();
    }
    // const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-dtl-outplan";
    this.table = $("#tablePlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      pageLength:10,
      lengthChange: false,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            sendAllFlag: "Y",
            planType: this.formReplace.get('planType').value
          }));
        }
      },
      columns: [
        {
          className: "ui center aligned",
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }, {
          data: "auditStatusDesc", className: "text-left"
        }, {
          data: "newRegId", className: "text-left"
        },
        {
          data: "facFullname", className: "text-left"
        },
        {
          data: "cusFullname", className: "text-left"
        }, {
          className: "text-left",
          render: function (data, type, row, meta) {
            return (row.secDesc + "/" + row.areaDesc);
          }
        }, {
          className: "text-right",
          render: function (data, type, row, meta) {
            return new DecimalFormatPipe().transform(row.regCapital, "###,###.00");
          }
        }, {
          data: "dutyDesc", className: "text-left"
        }

      ]
    });

    $.fn.DataTable.ext.pager.numbers_length = 5;

    this.table.on("dblclick", "tr", (event) => {
      let data = this.table.row($(event.currentTarget).closest("tr")).data();
      this.selectOutPlan = data;
      this.formReplace.get('regid_change').patchValue(data.newRegId);
      this.formReplace.get('facfullName_change').patchValue(data.facFullname);
      this.formReplace.get('cusfullName_change').patchValue(data.cusFullname);
      this.formReplace.get('duty_change').patchValue(data.dutyDesc);
      // console.log("outplan ", data);

      $('#searchCusModal').modal('hide');
    });

    this.table.on('draw.dt', function() {
      $('.paginate_button').not('.previous, .next').each(function(i, a) {
         var val = $(a).text();
         val =  val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
         $(a).text(val);
      })
    });  

  }


  tableOutPlan = () => {

    if (this.outplanTable != null) {
      this.outplanTable.destroy();
    }
    // const URL = AjaxService.CONTEXT_PATH + "ta/tax-operator/plan-selected-dtl";
    const URL = AjaxService.CONTEXT_PATH + "ta/tax-audit/outside-plan";
    this.outplanTable = $("#tableOutPlan").DataTableTh({
      processing: true,
      serverSide: true,
      paging: true,
      scrollX: true,
      pageLength: 10,
      lengthChange: false,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            officeCode: this.outplanOffcode,
            planType:"E",
            planNumber :this.planNumber,
            newRegId:this.searchRegId
          }));
        }
      },
      columns: [
        {
          render: (data, type, row, meta) => {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "newRegId",
          className: "text-left"
        }, {
          data: "cusFullname",
          className: "text-left"
        }, {
          data: "facFullname",
          className: "text-left"
        }, {
          className: "text-left",
          render: function (data, type, row, meta) {
            return (row.secDesc + "/" + row.areaDesc);
          }
        }, {
          data: "dutyDesc",
          className: "text-left"
        }

      ]
    });

    $.fn.DataTable.ext.pager.numbers_length = 5;

    this.outplanTable.on("dblclick", "tr", (event) => {
      let data = this.outplanTable.row($(event.currentTarget).closest("tr")).data();
      this.changeOutPlan = data;
      this.formReplace.get('regid_select').patchValue(data.newRegId);
      this.formReplace.get('facfullName_select').patchValue(data.facFullname);
      this.formReplace.get('cusfullName_select').patchValue(data.cusFullname);
      this.formReplace.get('duty_select').patchValue(data.dutyDesc);
      $('#searchOutPlanModal').modal('hide');
    });

    this.outplanTable.on('draw.dt', function() {
      $('.paginate_button').not('.previous, .next').each(function(i, a) {
         var val = $(a).text();
         val =  val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
         $(a).text(val);
      })
    });  

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

  initOutPlan() {
    return {
      analysisNumber: "",
      budgetYear: null,
      newRegId: "",
      officeCode: "",
      planNumber: "",
      planReplaceId: null,
      planType: "",
      planWorksheetDtlId: null,
      replaceReason: null,
      replaceRegId: null
    }
  }

}
