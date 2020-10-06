import { Component, OnInit } from '@angular/core';
import { Int09010101Service } from './int09010101.service';

import { AuthService } from 'services/auth.service';
import { BreadCrumb } from 'models/index';
import { Int0901011Service } from '../int090101-1.service';

declare var $: any;

@Component({
  selector: 'app-int09010101',
  templateUrl: './int09010101.component.html',
  styleUrls: ['./int09010101.component.css'],
  providers: [Int09010101Service]
})
export class Int09010101Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภายใน", route: "#" },
    { label: "ตรวจสอบเบิกจ่าย", route: "#" },
    { label: "ตรวจสอบค่าใช้จ่าย", route: "#" },
  ];
  loading: boolean;
  tableLoading: boolean;
  show: boolean = true;

  constructor(
    private authService: AuthService,
    private int09010101Service: Int09010101Service,
    private int0901011Service: Int0901011Service
  ) {
    this.loading = false;
    this.tableLoading = false;
    this.int0901011Service.setDataBudget(null);
  }


  ngOnInit() {
    this.authService.reRenderVersionProgram('INT-06110');
  }
  // ngAfterViewInit() {
  //   this.dataTable();
  // }

  onSubmit(f: any) {

    this.tableLoading = true;

    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    this.int09010101Service.onSubmit(formBody, this.int0901011Service).then((res) => {
      this.tableLoading = false;
      this.show = false;
      if (res == 0) {
        this.show = true;
      } else {
        if (this.int0901011Service.getDataBudget() == 0) {
          this.show = true;
        } else {
          this.show = false;
        }
      }
    }).catch(() => {
      this.show = true;
      this.tableLoading = false;
     
    });
  }

  async onChangeUpload(file: any) {
    this.loading = await true;
    await this.int09010101Service.onChangeUpload(file);
    setTimeout(() => {
      this.loading = false;
    }, 300);
  }

  // dataTable() {
  //   this.int09010101Service.dataTable();
  // }


  claer = () => {
    this.show = true;
    this.int09010101Service.claer(this.int0901011Service);
  }
}


