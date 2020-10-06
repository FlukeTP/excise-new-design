import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Observable } from 'rxjs';
import { ComboBox } from 'models/combobox.model';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Utils } from 'helpers/utils';
import { Int12030101Service } from './int12030101.service';


const URL = {
  SAVE_PcmList: "/ia/int0541/savePcmList",
  UPDATE_PcmList: "/ia/int0541/updatePcmList",
  UPLOAD_Procurement: "/ia/int0541/upload",
  UPDATE_FIND_BY_ID: "/ia/int0541/findByid"
};

declare var $: any;

@Component({
  selector: 'app-int12030101',
  templateUrl: './int12030101.component.html',
  styleUrls: ['./int12030101.component.css'],
  providers: [Int12030101Service]
})
export class Int12030101Component implements OnInit {

  breadcrumb: BreadCrumb[] = [];
  supplyChoice: string = "";
  numbers: any[] = [""];
  budgetType: string = "";
  budgetTypeList: Observable<ComboBox[]>;
  supplyChoiceList: Observable<ComboBox[]>;
  SupplyCategories: Observable<ComboBox[]>;
  budgetYear: any = null;
  projectName: string = "";
  projectCodeEgp: string = "";
  poNumber: any = null;
  tenderResults: any = 0;
  supplyType: any = null;
  procurementList: any;
  flagValidate1_: any = null;
  flagValidate2_: any = null;
  flagValidate3_: any = null;
  flagValidate4_: any = null;
  flagValidate5_: any = null;
  flagValidate6_: any = null;
  flagValidate7_: any = null;
  flag: any = "";
  head: any = "";
  dataEdit: any;
  procurementId: any = null;
  ids: number[] = [];
  operationstart: any;
  operationend: any;
  budget: any;
  installmentjob: any;
  respondepartment: any;
  loading: boolean = false;

  constructor(
    private selfService: Int12030101Service,
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "การจัดซื้อจัดจ้าง", route: "#" },
      { label: "ข้อมูลการจัดซื้อจัดจ้าง", route: "#" },
      { label: "เพิ่มข้อมูลการจัดซื้อจัดจ้าง", route: "#" },
    ];

    //dropdown
    this.budgetTypeList = this.selfService.dropdown("TYPE_OF_EXPENSE");
    this.supplyChoiceList = this.selfService.dropdown("SUPPLY_CHOICE");
    this.SupplyCategories = this.selfService.dropdown("SUPPLY_CATEGORIES");

    //validate
    this.flagValidate1_ = [];
    this.flagValidate2_ = [];
    this.flagValidate3_ = [];
    this.flagValidate4_ = [];
    this.flagValidate5_ = [];
    this.flagValidate6_ = [];
    this.flagValidate7_ = [];
  }
  ngAfterViewInit(): void {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter("year"),
      onChange: (date, text, mode) => {
        this.budgetYear = text;
      }
    });
    $("#operationstartCal").calendar({
      minDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter("วดปเวลา"),
      onChange: (date, text, mode) => {
        this.operationstart = text;
      }
    });
    $("#operationendCal").calendar({
      // minDate: new Date(),
      startCalendar: $("#operationstartCal"),
      type: "date",
      text: TextDateTH,
      formatter: formatter("วดปเวลา"),
      onChange: (date, text, mode) => {
        this.operationend = text;
      }
    });

    //if == EDIT
    if (
      this.route.snapshot.queryParams["procurementId"] != null ||
      this.route.snapshot.queryParams["procurementId"] != undefined
    ) {
      //get params no link "/int05/4"
      this.procurementId = this.route.snapshot.queryParams["procurementId"];
      this.flag = this.route.snapshot.queryParams["status"];
      this.head = this.route.snapshot.queryParams["head"];
      this.ajax.post(
        URL.UPDATE_FIND_BY_ID,
        { procurementId: this.procurementId },
        res => {
          this.numbers = res.json().pcmList;
          const data = res.json();
          // this.onChangeChoice();
          for (let i = 0; i < this.numbers.length; i++) {
            setTimeout(() => {
              $("#procurementList" + i).val(this.numbers[i].procurementList);
              $("#amount" + i).val(this.numbers[i].amount);
              $("#unit" + i).val(this.numbers[i].unit);
              $("#presetPrice" + i).val(this.numbers[i].presetPrice);
              $("#appraisalPrice" + i).val(this.numbers[i].appraisalPrice);
              $("#unitPrice" + i).val(this.numbers[i].unitPrice);
              $("#price" + i).val(this.numbers[i].price);
            }, 50);
          }

          $("#calendar_data").val(data.budgetYear);
          $("#projectName").val(data.projectName);
          $("#projectCodeEgp").val(data.projectCodeEgp);
          $("#poNumber").val(data.poNumber);
          $("#respondepartment").val(data.respondepartment);
          $("#budget").val(data.budget);
          $("#installmentjob").val(data.installmentjob);
          $("#operationstart").val(data.operationstart);
          $("#operationend").val(data.operationend);
          setTimeout(() => {
            $("#budgetType").dropdown("set selected", data.budgetType);
            $("#supplyChoice").dropdown("set selected", data.supplyChoice);
          }, 200);
          this.tenderResults = data.tenderResults;
          this.supplyType = data.supplyType;
          setTimeout(() => {
            $(
              `input[name='jobDescription'][value='${data.jobDescription}']`
            ).prop("checked", true);
            $("#approveDatePlanData").val(data.approveDatePlan);
            $("#contractDatePlanData").val(data.contractDatePlan);
            $("#expireDatePlanData").val(data.expireDatePlan);
            $("#disbursementFinalPlanData").val(data.disbursementFinalPlan);
            $("#approveDateReportData").val(data.approveDateReport);
            $("#contractDateReportData").val(data.contractDateReport);
            $("#expireDateReportData").val(data.expireDateReport);
            $("#disbursementFinalReportData").val(data.disbursementFinalReport);
            $("#contractPartiesNum").val(data.contractPartiesNum);
            $("#contractPartiesName").val(data.contractPartiesName);
            $("#signedDatePlanData").val(data.signedDatePlan);
            $("#signedDateReportData").val(data.signedDateReport);
          }, 400);
        }
      );
    } else {
      setTimeout(() => {
        $("#supplyChoice").dropdown("set selected", "วิธีเฉพาะเจาะจง");
      }, 300);

    }
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");

  }
  ngOnInit() {
    //get params no link "/int05/4"
    this.flag = this.route.snapshot.queryParams["status"];
    this.head = this.route.snapshot.queryParams["head"];
  }

  onlyNumber(e) {
    return Utils.onlyNumber(e);
  }

  onChangeChoice = () => {
    setTimeout(() => {
      $(".ui.dropdown").dropdown();
      $(".ui.dropdown.ai").css("width", "100%");

      $("#approveDatePlan").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#contractDatePlan").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#expireDatePlan").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#disbursementFinalPlan").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#approveDateReport").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#contractDateReport").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#expireDateReport").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#disbursementFinalReport").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#signedDatePlan").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });

      $("#signedDateReport").calendar({
        maxDate: new Date(),
        type: "date",
        text: TextDateTH,
        formatter: formatter("วดปเวลา")
      });
    }, 100);
  };

  onAddField = () => {
    this.numbers.push("");
  };

  onDelField = index => {
    if (this.numbers.length < 1) {
      this.msg.errorModal("ไม่สามารถลบได้");
    } else {
      if (Utils.isNotNull(this.numbers[index].procurementListId)) {
        this.ids.push(this.numbers[index].procurementListId);
      }
      this.numbers.splice(index, 1);
    }
  };

  onSaveForm1 = e => {
    e.preventDefault();

    //send form data
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    formBody.append(
      "procurementId",
      this.procurementId == null ? "" : this.procurementId
    );
    formBody.append("budgetYear", $("#calendar_data").val());
    formBody.append("budgetType", this.budgetType);
    formBody.append("operationstart", $("#operationstart").val());
    formBody.append("operationend", $("#operationend").val());
    formBody.append("budget", $("#budget").val());
    formBody.append("installmentjob", $("#installmentjob").val());
    formBody.append("respondepartment", $("#respondepartment").val());
    formBody.append("projectName", $("#projectName").val());
    formBody.append("projectCodeEgp", $("#projectCodeEgp").val());
    formBody.append("poNumber", $("#poNumber").val());
    formBody.append("supplyChoice", $("#supplyChoice").dropdown("get text"));
    formBody.append("tenderResults", this.tenderResults);
    let jobDescription = $("input[name='jobDescription']:checked").val();
    formBody.append(
      "jobDescription",
      jobDescription == undefined ? null : jobDescription
    );
    formBody.append("supplyType", this.supplyType);
    formBody.append(
      "approveDatePlan",
      (<HTMLInputElement>document.getElementById("approveDatePlanData")).value
    );
    formBody.append(
      "contractDatePlan",
      (<HTMLInputElement>document.getElementById("contractDatePlanData")).value
    );
    formBody.append(
      "expireDatePlan",
      (<HTMLInputElement>document.getElementById("expireDatePlanData")).value
    );
    formBody.append(
      "disbursementFinalPlan",
      (<HTMLInputElement>document.getElementById("disbursementFinalPlanData"))
        .value
    );
    formBody.append(
      "approveDateReport",
      (<HTMLInputElement>document.getElementById("approveDateReportData")).value
    );
    formBody.append(
      "contractDateReport",
      (<HTMLInputElement>document.getElementById("contractDateReportData"))
        .value
    );
    formBody.append(
      "expireDateReport",
      (<HTMLInputElement>document.getElementById("expireDateReportData")).value
    );
    formBody.append(
      "disbursementFinalReport",
      (<HTMLInputElement>document.getElementById("disbursementFinalReportData"))
        .value
    );
    formBody.append(
      "contractPartiesNum",
      (<HTMLInputElement>document.getElementById("contractPartiesNum")).value
    );
    formBody.append(
      "contractPartiesName",
      (<HTMLInputElement>document.getElementById("contractPartiesName")).value
    );

    //check flag save
    let chkFlg = "";
    for (let i = 0; i < this.numbers.length; i++) {
      if (
        (<HTMLInputElement>document.getElementById("procurementList" + i))
          .value != ""
      ) {
        this.flagValidate1_[i] = true;
      } else {
        this.flagValidate1_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("amount" + i)).value != ""
      ) {
        this.flagValidate2_[i] = true;
      } else {
        this.flagValidate2_[i] = false;
      }

      if ((<HTMLInputElement>document.getElementById("unit" + i)).value != "") {
        this.flagValidate3_[i] = true;
      } else {
        this.flagValidate3_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("presetPrice" + i)).value !=
        ""
      ) {
        this.flagValidate4_[i] = true;
      } else {
        this.flagValidate4_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
          .value != ""
      ) {
        this.flagValidate5_[i] = true;
      } else {
        this.flagValidate5_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("unitPrice" + i)).value != ""
      ) {
        this.flagValidate6_[i] = true;
      } else {
        this.flagValidate6_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("price" + i)).value != ""
      ) {
        this.flagValidate7_[i] = true;
      } else {
        this.flagValidate7_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("procurementList" + i))
          .value != "" &&
        (<HTMLInputElement>document.getElementById("unit" + i)).value != "" &&
        (<HTMLInputElement>document.getElementById("amount" + i)).value != "" &&
        (<HTMLInputElement>document.getElementById("presetPrice" + i)).value !=
        "" &&
        (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
          .value != "" &&
        (<HTMLInputElement>document.getElementById("unitPrice" + i)).value !=
        "" &&
        (<HTMLInputElement>document.getElementById("price" + i)).value
      ) {
        chkFlg = "S";
      } else {
        chkFlg = "F";
      }
    }

    //check flag save
    if (chkFlg === "F") {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
    } else {
      this.ajax.upload(URL.UPLOAD_Procurement, formBody, res => {
        let data = res.json();
        let procurementId = data.data.procurementId;
        this.savePcmList(procurementId);
      });
    }
  };

  savePcmList(procurementId: number) {
    let procurementList = [];

    for (let i = 0; i < this.numbers.length; i++) {
      //update
      if (Utils.isNotNull(this.numbers[i].procurementListId)) {
        procurementList.push({
          procurementId: procurementId,
          ids: this.ids,
          procurementListId: Utils.isNotNull(this.numbers[i].procurementListId)
            ? this.numbers[i].procurementListId
            : "",
          procurementList: (<HTMLInputElement>(
            document.getElementById("procurementList" + i)
          )).value,
          amount: parseInt(
            (<HTMLInputElement>document.getElementById("amount" + i)).value
          ),
          unit: (<HTMLInputElement>document.getElementById("unit" + i)).value,
          presetPrice: parseInt(
            (<HTMLInputElement>document.getElementById("presetPrice" + i)).value
          ),
          appraisalPrice: parseInt(
            (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
              .value
          ),
          unitPrice: parseInt(
            (<HTMLInputElement>document.getElementById("unitPrice" + i)).value
          ),
          price: parseInt(
            (<HTMLInputElement>document.getElementById("price" + i)).value
          )
        });
      } else {
        //save
        procurementList.push({
          procurementId: procurementId,
          ids: this.ids,
          procurementList: (<HTMLInputElement>(
            document.getElementById("procurementList" + i)
          )).value,
          amount: parseInt(
            (<HTMLInputElement>document.getElementById("amount" + i)).value
          ),
          unit: (<HTMLInputElement>document.getElementById("unit" + i)).value,
          presetPrice: parseInt(
            (<HTMLInputElement>document.getElementById("presetPrice" + i)).value
          ),
          appraisalPrice: parseInt(
            (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
              .value
          ),
          unitPrice: parseInt(
            (<HTMLInputElement>document.getElementById("unitPrice" + i)).value
          ),
          price: parseInt(
            (<HTMLInputElement>document.getElementById("price" + i)).value
          )
        });
      }
    }
    //delete
    if (this.numbers.length == 0) {
      procurementList.push({ ids: this.ids });
    }
    this.ajax.post(URL.SAVE_PcmList, procurementList, res => {
      const msg = res.json();
      if (msg.messageType == "C") {
        this.msg.successModal(msg.messageTh);
        this.router.navigate(["/int12/03"]);
      } else {
        this.msg.errorModal(msg.messageTh);
      }
    });
  }

  onSaveForm2 = e => {
    e.preventDefault();

    //send form data
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    formBody.append(
      "procurementId",
      this.procurementId == null ? "" : this.procurementId
    );
    formBody.append("budgetYear", $("#calendar_data").val());
    formBody.append("budgetType", this.budgetType);
    formBody.append("operationstart", $("#operationstart").val());
    formBody.append("operationend", $("#operationend").val());
    formBody.append("budget", $("#budget").val());
    formBody.append("installmentjob", $("#installmentjob").val());
    formBody.append("respondepartment", $("#respondepartment").val());
    formBody.append("projectName", $("#projectName").val());
    formBody.append("projectCodeEgp", $("#projectCodeEgp").val());
    formBody.append("poNumber", $("#poNumber").val());
    formBody.append("supplyChoice", $("#supplyChoice").dropdown("get text"));
    formBody.append("tenderResults", this.tenderResults);
    let jobDescription = $("input[name='jobDescription']:checked").val();
    formBody.append(
      "jobDescription",
      jobDescription == undefined ? null : jobDescription
    );
    formBody.append("supplyType", this.supplyType);
    formBody.append(
      "approveDatePlan",
      (<HTMLInputElement>document.getElementById("approveDatePlanData")).value
    );
    formBody.append(
      "contractDatePlan",
      (<HTMLInputElement>document.getElementById("contractDatePlanData")).value
    );
    formBody.append(
      "expireDatePlan",
      (<HTMLInputElement>document.getElementById("expireDatePlanData")).value
    );
    formBody.append(
      "disbursementFinalPlan",
      (<HTMLInputElement>document.getElementById("disbursementFinalPlanData"))
        .value
    );
    formBody.append(
      "approveDateReport",
      (<HTMLInputElement>document.getElementById("approveDateReportData")).value
    );
    formBody.append(
      "contractDateReport",
      (<HTMLInputElement>document.getElementById("contractDateReportData"))
        .value
    );
    formBody.append(
      "expireDateReport",
      (<HTMLInputElement>document.getElementById("expireDateReportData")).value
    );
    formBody.append(
      "disbursementFinalReport",
      (<HTMLInputElement>document.getElementById("disbursementFinalReportData"))
        .value
    );
    formBody.append(
      "signedDatePlan",
      (<HTMLInputElement>document.getElementById("signedDatePlanData")).value
    );
    formBody.append(
      "signedDateReport",
      (<HTMLInputElement>document.getElementById("signedDateReportData")).value
    );
    formBody.append(
      "contractPartiesNum",
      (<HTMLInputElement>document.getElementById("contractPartiesNum")).value
    );
    formBody.append(
      "contractPartiesName",
      (<HTMLInputElement>document.getElementById("contractPartiesName")).value
    );

    let chkFlg = "";
    for (let i = 0; i < this.numbers.length; i++) {
      if (
        (<HTMLInputElement>document.getElementById("procurementList" + i))
          .value != ""
      ) {
        this.flagValidate1_[i] = true;
      } else {
        this.flagValidate1_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("amount" + i)).value != ""
      ) {
        this.flagValidate2_[i] = true;
      } else {
        this.flagValidate2_[i] = false;
      }

      if ((<HTMLInputElement>document.getElementById("unit" + i)).value != "") {
        this.flagValidate3_[i] = true;
      } else {
        this.flagValidate3_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("presetPrice" + i)).value !=
        ""
      ) {
        this.flagValidate4_[i] = true;
      } else {
        this.flagValidate4_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
          .value != ""
      ) {
        this.flagValidate5_[i] = true;
      } else {
        this.flagValidate5_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("unitPrice" + i)).value != ""
      ) {
        this.flagValidate6_[i] = true;
      } else {
        this.flagValidate6_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("price" + i)).value != ""
      ) {
        this.flagValidate7_[i] = true;
      } else {
        this.flagValidate7_[i] = false;
      }

      if (
        (<HTMLInputElement>document.getElementById("procurementList" + i))
          .value != "" &&
        (<HTMLInputElement>document.getElementById("unit" + i)).value != "" &&
        (<HTMLInputElement>document.getElementById("amount" + i)).value != "" &&
        (<HTMLInputElement>document.getElementById("presetPrice" + i)).value !=
        "" &&
        (<HTMLInputElement>document.getElementById("appraisalPrice" + i))
          .value != "" &&
        (<HTMLInputElement>document.getElementById("unitPrice" + i)).value !=
        "" &&
        (<HTMLInputElement>document.getElementById("price" + i)).value
      ) {
        chkFlg = "S";
      } else {
        chkFlg = "F";
      }
    }
    if (chkFlg === "F") {
      this.msg.errorModal("กรุณากรอกข้อมูลให้ครบ");
    } else {
      this.ajax.upload(URL.UPLOAD_Procurement, formBody, res => {
        let data = res.json();
        let procurementId = data.data.procurementId;
        this.savePcmList(procurementId);
      });
    }
  };
}

