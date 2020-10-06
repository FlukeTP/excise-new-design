import { Component, OnInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'services/auth.service';
import { Int0901011Service } from '../int090101-1.service';
import { BreadCrumb } from 'models/index';
import { Int09010102Service } from './int09010102.service';

declare var $: any;
@Component({
  selector: 'app-int09010102',
  templateUrl: './int09010102.component.html',
  styleUrls: ['./int09010102.component.css'],
  providers: [Int09010102Service]
})
export class Int09010102Component implements OnInit, AfterViewInit {

  //value init
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ตรวจสอบค่าใช้จ่าย", route: "#" },
  ];
  show: boolean = true;
  loading: boolean = false;
  tableLoading: boolean = false;
  constructor(
    private int09010102Service: Int09010102Service,
    private int0901011Service: Int0901011Service,
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-06120');

  }
  ngAfterViewInit() {
    // this.dataTable();
    this.cdRef.detectChanges();
  }

  async onChangeUpload(file: any) {
    this.loading = await true;
    await this.int09010102Service.onChangeUpload(file);
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }
  //upload
  async onSubmit(f: any) {

    this.tableLoading = await true;
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    this.int09010102Service.onSubmit(formBody, this.int0901011Service).then(() => {
      this.tableLoading = false;

      if (this.int0901011Service.getDataLedger() == 0) {
        this.show = true;
      } else {
        this.show = false;
      }

    });
  }

  // dataTable() {
  //   this.int09010102Service.dataTable();
  // }

  // claer = () => {
  //   this.show = true;
  //   this.int09010102Service.claer(this.int0901011Service);
  // }
}
