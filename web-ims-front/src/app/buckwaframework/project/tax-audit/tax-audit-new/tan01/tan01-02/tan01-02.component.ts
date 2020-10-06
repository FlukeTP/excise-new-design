import { Component, OnInit, OnDestroy } from "@angular/core";
import { BreadCrumb } from "models/index";
import { MessageBarService } from "services/message-bar.service";
import { AjaxService } from "services/ajax.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "services/auth.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "app-tan01-02",
  templateUrl: "./tan01-02.component.html",
  styleUrls: ["./tan01-02.component.css"]
})

export class Tan0102Component implements OnInit, OnDestroy {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "แผนการตรวจปฏิบัติการประจำปี", route: "#" },
    { label: "รายละเอียดแผนปฏิบัติการ", route: "#" }
  ];

  submitted: boolean = false;
  dtlForm: FormGroup;
  loading: boolean = false;

  constructor(
    private message: MessageBarService,
    private ajax: AjaxService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.initialVariable();
  }


  ngOnInit() {
    //this.authService.reRenderVersionProgram('TAN-0102');
    
    console.log("startDate : ",this.route.snapshot.queryParams["startDate"]);
    
    this.setVariable(); 
  }

  ngOnDestroy() {
    // $('#').remove();
  }

  initialVariable() {
    this.dtlForm = this.fb.group({
      // Self
      startDate: [{ value: "", disabled: false }, Validators.required],
      endDate: [{ value: "", disabled: false }, Validators.required],
      checkSystem: [{ value: "", disabled: false }, Validators.required],
      exciseNo: [{ value: "", disabled: false }, Validators.required],
      companyName: [{ value: "", disabled: false }, Validators.required],
      addressCompany: [{ value: "", disabled: false }, Validators.required],
      department: [{ value: "", disabled: false }, Validators.required],
      area: [{ value: "", disabled: false }, Validators.required],
      product: [{ value: "", disabled: false }, Validators.required],
      risk: [{ value: "", disabled: false }, Validators.required],
    });
  }

  setVariable() {
    
    this.dtlForm.get('startDate').setValue(this.route.snapshot.queryParams["startDate"]);
    this.dtlForm.get('endDate').setValue(this.route.snapshot.queryParams["endDate"]);
    this.dtlForm.get('checkSystem').setValue(this.route.snapshot.queryParams["checkSystem"]);
    this.dtlForm.get('exciseNo').setValue(this.route.snapshot.queryParams["exciseNo"]);
    this.dtlForm.get('companyName').setValue(this.route.snapshot.queryParams["companyName"]);
    this.dtlForm.get('addressCompany').setValue(this.route.snapshot.queryParams["addressCompany"]);
    this.dtlForm.get('department').setValue(this.route.snapshot.queryParams["department"]);
    this.dtlForm.get('area').setValue(this.route.snapshot.queryParams["area"]);
    this.dtlForm.get('product').setValue(this.route.snapshot.queryParams["product"]);
    this.dtlForm.get('risk').setValue(this.route.snapshot.queryParams["risk"]);
  }

  error(control) {
    return this.dtlForm.get(control).invalid && this.dtlForm;
  }

  onClick(path:any, param:any) {
    
    this.router.navigate(["/"+path], {
      queryParams: {
        topics: param.topics,
        typeDocs: param.typeDocs
      }
    });
  }

}