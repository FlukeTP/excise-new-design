import { Component, OnInit } from "@angular/core";
import { Int12050101Service } from "./int12050101.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { TextDateTH, formatter } from "helpers/datepicker";
import { ActivatedRoute } from "@angular/router";
import { Utils } from "helpers/utils";
import { BreadCrumb } from 'models/breadcrumb.model';
import { ComboBox } from 'models/combobox.model';
import { AuthService } from 'services/auth.service';

declare var $: any;
@Component({
  selector: "app-int12050101",
  templateUrl: "./int12050101.component.html",
  styleUrls: ["./int12050101.component.css"],
  providers: [Int12050101Service]
})
export class Int12050101Component implements OnInit {
  // @ViewChild("f")
  // form: NgForm; // #f
  transferForm: FormGroup;

  breadcrumb: BreadCrumb[] = [];
  comboBox1: Observable<ComboBox[]>;
  comboBox2: Observable<ComboBox[]>;
  comboBox3: Promise<any>;
  combobox4: any = [];
  combobox5: Promise<any>;
  comboBox6: Observable<ComboBox[]>;
  transferId: any = "";
  flag: any = "";
  submitted = false;
  budgetData: any = [];
  loading: boolean = true;
  checkTable: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private selfService: Int12050101Service,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: " ข้อมูล รับ - โอนเงิน", route: "#" },
      { label: "เพิ่มข้อมูล รับ - โอนเงิน", route: "#" }
    ];
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram("INT-06910");
    this.transferForm = this.formBuilder.group({
      mofNum: ["", Validators.required],
      refNum: ["", Validators.required],
      refDate: ["", Validators.required],
      transferList: ["", Validators.required],
      budgetType: ["", Validators.required],
      budget: ["", Validators.required],
      ctgBudget: ["", Validators.required],
      subCtgBudget: ["", Validators.required],
      activities: ["", Validators.required],
      descriptionList: ["", Validators.required],
      amount: ["", Validators.required],
      note: [""]
    });

    //call combobox
    this.combobox();
    //on flag 'EDIT' Int06-9
    this.transferId = this.route.snapshot.queryParams["transferId"];
    this.flag = this.route.snapshot.queryParams["flag"];

    if (this.flag !== "EDIT") {
      this.loading = false;
    }

    $(".ui.dropdown.ai")
      .dropdown()
      .css("width", "100%");
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "date",
      text: TextDateTH,
      formatter: formatter(),
      onChange: (a, b, c) => {
        this.transferForm.patchValue({ refDate: b });
      }
    });
  }

  ngAfterViewInit() {
    this.selfService.DATATABLE();
    $(".ui.dropdown.ai")
      .dropdown()
      .css("width", "100%");
    if (this.flag === "EDIT") {
      $("#tableSave").hide();
    }
  }

  onFlagEDIT() {
    this.selfService.queryByIdToEdit(this.transferId).then(data => {
      let dataEdit = data;
      this.setValueOnEdit(dataEdit);
    });
  }

  async combobox() {
    //ALL TABLE BUDGETLIST //query to compare index
    this.selfService.queryBudgetData().subscribe(data => {
      data.forEach(obj => {
        this.budgetData.push(obj);
      });
    });

    let callItemBox1 = new Promise((resolve, reject) => {
      this.comboBox1 = this.selfService.dropdown("TRANSFER", null, resolve);
    });

    let callItemBox2 = new Promise((resolve, reject) => {
      this.comboBox2 = this.selfService.dropdown("BUDGET_TYPE", null, resolve);
    });

    let callItemBox3 = new Promise((resolve, reject) => {
      this.comboBox6 = this.selfService.dropdown("ACTIVITY", null, resolve);
    });

    Promise.all([callItemBox1, callItemBox2, callItemBox3]).then(async () => {
      this.comboBox3 = await this.selfService.quryBudgetName();
      if (this.flag === "EDIT") {
        await this.onFlagEDIT();
      }
    });
  }

  get f() {
    return this.transferForm.controls;
  }

  typeNumber(e) {
    return Utils.onlyNumber(e);
  }

  addData() {
    this.submitted = true;
    if (this.flag === "SAVE") {
      // stop here if form is invalid
      if (this.transferForm.invalid) {
        return;
      } else {
        //form is valid
        this.selfService.addData(
          this.transferForm.value,
          this.flag,
          null,
          this.cbTable
        );
        // this.transferForm.reset();
        // this.transferForm.markAsPristine();
        // this.transferForm.markAsUntouched();
        // this.transferForm.updateValueAndValidity();
      }
    } else {
      if (this.transferForm.invalid) {
        return;
      }
      this.selfService.addData(
        this.transferForm.value,
        this.flag,
        this.transferId
      );
      // this.transferForm.reset();
    }
  }

  checkStatus(status: string) {
    console.log(status);
    this.flag = status;
  }

  setValueOnEdit(data) {
    console.log("data: ", data);
    let dataFilter = this.budgetData.filter(
      obj => obj.listId == data.budgetCode
    );

    //filter combobox3
    let filterIdCombo3 = dataFilter[0].budgetId;
    //filter combobox4
    let filterIdCombo4 = dataFilter[0].categoryId;
    //filter combobox5
    let filterIdCombo5 = dataFilter[0].listId;

    this.transferForm.patchValue({
      mofNum: data.mofNum,
      refNum: data.refNum,
      refDate: data.refDateStr,
      // transferList: data.transferList,
      // budgetType: data.budgetType,
      // budget: filterIdCombo3,
      // ctgBudget: filterIdCombo4,
      // subCtgBudget: filterIdCombo5,
      // activities: data.activities,
      descriptionList: data.descriptionList,
      amount: data.amount,
      note: data.note
    });

    let promise = new Promise((resolve, reject) => {
      // this.transferForm.patchValue({ budget: filterIdCombo3 });
      $("#transferList").dropdown("set selected", data.transferList);
      $("#budgetType").dropdown("set selected", data.budgetType);
      $("#activities").dropdown("set selected", data.activities);
      $("#budget").dropdown("set selected", filterIdCombo3);
      setTimeout(() => resolve(true), 500);
    });

    promise
      .then(resolve => {
        if (resolve) {
          $("#ctgBudget").dropdown("set selected", filterIdCombo4);
        }
      })
      .then(() => {
        setTimeout(() => {
          $("#subCtgBudget").dropdown("set selected", filterIdCombo5);
        }, 500);
      })
      .then(() => {
        this.loading = false;
      });
  }

  hidedata() {
    this.checkTable = [];
    this.selfService.clearData();
  }

  onSave() {
    this.selfService.saveDatatable();
  }

  async budgetChange(e) {
    await this.selfService.getCtgBudget(e.target.value).then(value => {
      value.forEach(obj => {
        this.combobox4.push(obj);
      });
    });
  }

  async ctgBudgetChange(e) {
    await this.selfService.getListName(e.target.value).then(value => {
      this.combobox5 = value;
    });
  }

  cbTable = list => {
    this.checkTable = list;
  };
}
