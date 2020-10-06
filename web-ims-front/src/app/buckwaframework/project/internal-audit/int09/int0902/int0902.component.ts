import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BreadCrumb } from 'models/breadcrumb.model';
import { Observable } from 'rxjs/internal/Observable';
import { ComboBox } from 'models/combobox.model';
import { AuthService } from 'services/auth.service';
import { MessageBarService } from 'services/message-bar.service';
import { Int0902Service } from './int0902.service';
declare var $: any;
@Component({
  selector: 'app-int0902',
  templateUrl: './int0902.component.html',
  styleUrls: ['./int0902.component.css'],
  providers: [Int0902Service]
})
export class Int0902Component implements OnInit {

  checkListOfwithdraw: FormGroup;
  breadcrumb: BreadCrumb[] = [];
  loading: boolean = false;
  submitted: boolean = false;
  comboBox: Observable<ComboBox[]>;
  comboBoxId: number = null;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private selfService: Int0902Service,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ตรวจสอบเบิกจ่าย", route: "#" },
      { label: "ตรวจสอบการเบิกและจ่ายเงิน", route: "#" }
    ];

    this.comboBox = this.selfService.dropdown("SORT_SYSTEM", null);
  }

  ngAfterViewInit() {
    $("#export .dropdown").dropdown({
      transition: "drop"
    });
    $("#showTable").hide();
  }

  ngOnInit() {
    this.authService.reRenderVersionProgram("INT-06200");
    //set formbuilder
    this.checkListOfwithdraw = this.formBuilder.group({
      fileExcel1: ["", Validators.required],
      fileExcel2: ["", Validators.required],
      sortSystem: ["", Validators.required]
    });

    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.ai").css("width", "100%");
  }

  popupEditData() {
    $("#modalInt062").modal("show");
  }

  closePopupEdit() {
    $("#modalInt062").modal("hide");
  }

  uploadData(e: any) {
    e.preventDefault();
    this.submitted = true;
    // stop here if form is invalid
    if (this.checkListOfwithdraw.invalid) {
      return;
    }
    this.comboBoxId = e.target["sortSystem"].value;
    this.loading = true;
    this.selfService
      .onUpload(this.comboBoxId)
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.msg.errorModal(err.statusText);
        this.loading = false;
      });
  }

  clearData() {
    $("#showTable").hide();
    $("#sortSystem").dropdown("restore defaults");
  }

  get f() {
    return this.checkListOfwithdraw.controls;
  }

  onChangeUpload(e: any) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  onChangeUpload2(e: any) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  // changeSortSystem(e) {
  //   this.comboBoxId = e.target.value;
  // }

  compareTR() {
    this.selfService.compareTR(this.comboBoxId);
  }

  getLoading = args => {
    this.loading = args;
  };
}
