import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AnalysisService } from "projects/pages/analysis/analysis.service";
import { BreadCrumb } from "models/index";
import { TextDateTH, formatter } from "helpers/datepicker";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AnalysisForm } from "projects/pages/analysis/analysisForm.model";
import { IaService } from "services/ia.service";

declare var $: any;
@Component({
  selector: "analysis",
  templateUrl: "analysis.component.html",
  providers: [AnalysisService]
})
export class AnalysisPage implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภาษี", route: "#" },
    { label: "การตรวจสอบภาษี", route: "#" },
    { label: "การวิเคราะห์ข้อมูลเบื้องต้น", route: "#" },
  ];
  showSelectCoordinate: boolean = false;
  coordinateList: any[];

  productList: any[];
  serviceList: any[];
  loading: boolean = true;
  submitted:boolean = false;
  //data
  exciseIdList: any;
  form: AnalysisForm = new AnalysisForm();
  formControl: FormGroup;
  coordinates: string = "";
  constructor(
    private router: Router,
    private analysisService: AnalysisService,
    private modalService: IaService,
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {

    this.formControl = this.formBuilder.group({
      exciseId: ["", Validators.required],
      userNumber: [""],
      dateFrom: ["", Validators.required],      
      dateTo: ["", Validators.required],
      type: [""],
      coordinates: [""]
    });

    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");

    this.exciseIdLists();
    this.calenda();

  }
  get f() {
    return this.formControl.controls;
  }
  goToAnalysisResult = (event: any) => {
    event.preventDefault();
    this.submitted = true;
    for(let key in this.formControl.controls) {
      console.log(key, this.formControl.get(key).valid);
    }
    // console.log(this.formControl.value);

    if (this.formControl.invalid) {
      return;
    }
    this.form.dateFrom = $("#dateFrom").val();
    this.form.dateTo = $("#dateTo").val();
    this.modalService.setData(this.formControl.value);
    this.router.navigate(["/result-analysis"]);
  }

  clear=()=>{
    this.submitted = false;
    this.analysisService.clear();
  }

  exciseIdLists = () => {
    this.analysisService.exciseIdList().then(res => {
      this.exciseIdList = res;
      this.loading = false;
    });
    console.log(this.exciseIdList);
  }

  changeExciseId = (event) => {
    this.loading = true;
    let exciseId = event.target.value;

    this.analysisService.changeExciseId(exciseId).then(res => {
      this.loading = false;
      this.formControl.get('coordinates').setValue( res.productType);
      this.form.coordinates = res.productType;

      //call function check typr
      this.formControl.get('type').setValue(this.checkType(exciseId.substring(14, 15)));
      this.form.type = this.checkType(exciseId.substring(14, 15));
      console.log(this.form);
    });
  }

  calenda = () => {
    $("#dateF").calendar({
      maxDate: new Date(),
      endCalendar: $("#dateT"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange : (date,text)=>{
        this.formControl.get('dateFrom').setValue(text);        
      }
    });
    $("#dateT").calendar({
      maxDate: new Date(),
      startCalendar: $("#dateF"),
      type: "month",
      text: TextDateTH,
      formatter: formatter('month-year'),
      onChange : (date,text)=>{
        this.formControl.get('dateTo').setValue(text);        
      }
    });
  }

  checkType(typeId) {
    switch (typeId) {
      case "1": { return "สินค้า"; }
      case "2": { return "บริการ"; }
      case "3": { return "นำเข้า"; }
      default: { return ""; }
    }
  }
}
