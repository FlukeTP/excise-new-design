import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { formatter, TextDateTH } from 'helpers/index';
import { ExciseService } from 'services/index';
import { BreadCrumb } from 'models/index';

declare var $: any;

@Component({
  selector: 'app-ope0408',
  templateUrl: './ope0408.component.html',
  styleUrls: ['./ope0408.component.css']
})
export class Ope0408Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "การตรวจควบคุม", route: "#" },
    { label: "รอบการผลิต", route: "#" }
  ];
  dataTables: any = [];
  planForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private exciseService: ExciseService
  ) {

    this.dataTables = [
      {
        id: 1,
        companyName: 'หจก.เวียงกาหลงทอดดี้',
        details: [
          { subDtl: [{ text: "16 ตุลาคม 2561", status: 'complete' }, { text: "17 ตุลาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "5 พฤศจิกายน 2561", status: 'complete' }, { text: "7 พฤศจิกายน 2561", status: 'complete' }, { text: "8 พฤศจิกายน 2561", status: 'complete' }] },
          { subDtl: [{ text: "20 ธันวาคม 2561", status: 'complete' }, { text: "22 ธันวาคม 2561", status: 'complete' }, { text: "24 ธันวาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "5 มกราคม 2561", status: 'complete' }, { text: "7 มกราคม 2561", status: 'complete' }, { text: "8 มกราคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "1 กุมภาพันธ์ 2562", status: 'proceed' }, { text: "12 กุมภาพันธ์ 2562", status: 'proceed' }] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] }
        ]
      },
      {
        id: 2,
        companyName: 'หจก.ประเทืองบริบูรณ์สุราไทย',
        details: [
          { subDtl: [{ text: "2 ตุลาคม 2561", status: 'complete' }, { text: "4 ตุลาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "9 พฤศจิกายน 2561", status: 'complete' }, { text: "10 พฤศจิกายน 2561", status: 'complete' }, { text: "11 พฤศจิกายน 2561", status: 'complete' }] },
          { subDtl: [{ text: "6 ธันวาคม 2561", status: 'complete' }, { text: "7 ธันวาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "6 มกราคม 2562", status: 'complete' }, { text: "7 มกราคม 2562", status: 'complete' }, { text: "8 มกราคม 2562", status: 'complete' }] },
          { subDtl: [{ text: "9 กุมภาพันธ์ 2562", status: 'proceed' }] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] }
        ]
      },
      {
        id: 3,
        companyName: 'หจก.ดวงจันทร์การสุรา',
        details: [
          { subDtl: [{ text: "18 ตุลาคม 2561", status: 'complete' }, { text: "19 ตุลาคม 2561", status: 'complete' }, { text: "22 ตุลาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "5 พฤศจิกายน 2561", status: 'complete' }, { text: "10 พฤศจิกายน 2561", status: 'complete' }, { text: "12 พฤศจิกายน 2561", status: 'complete' }] },
          { subDtl: [{ text: "15 ธันวาคม 2561", status: 'complete' }, { text: "17 ธันวาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "16 มกราคม 2562", status: 'complete' }, { text: "17 มกราคม 2562", status: 'complete' }, { text: "18 มกราคม 2562", status: 'complete' }] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] }
        ]
      },
      {
        id: 4,
        companyName: 'กลุ่มองค์กรเกษตรกร',
        details: [
          { subDtl: [{ text: "10 ตุลาคม 2561", status: 'complete' }, { text: "11 ตุลาคม 2561", status: 'complete' }, { text: "12 ตุลาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "19 พฤศจิกายน 2561", status: 'complete' }, { text: "20 พฤศจิกายน 2561", status: 'complete' }, { text: "21 พฤศจิกายน 2561", status: 'complete' }] },
          { subDtl: [{ text: "15 ธันวาคม 2561", status: 'complete' }, { text: "16 ธันวาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "20 มกราคม 2562", status: 'complete' }, { text: "22 มกราคม 2562", status: 'complete' }, { text: "23 มกราคม 2562", status: 'complete' }] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] }
        ]
      },
      {
        id: 5,
        companyName: 'หจก.สาโทลำไยทอง',
        details: [
          { subDtl: [{ text: "3 ตุลาคม 2561", status: 'complete' }, { text: "5 ตุลาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "9 พฤศจิกายน 2561", status: 'complete' }, { text: "10 พฤศจิกายน 2561", status: 'complete' }] },
          { subDtl: [{ text: "5 ธันวาคม 2561", status: 'complete' }, { text: "6 ธันวาคม 2561", status: 'complete' }, { text: "8 ธันวาคม 2561", status: 'complete' }] },
          { subDtl: [{ text: "12 มกราคม 2562", status: 'complete' }, { text: "14 มกราคม 2562", status: 'complete' }] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] },
          { subDtl: [] }
        ]
      },
    ];
  }

  ngOnInit() {
    // Initial
    $('.dropdown').dropdown();
    this.initialVariable();
  }

  ngAfterViewInit(): void {
  }

  initialVariable() {
    this.planForm = this.fb.group({
      year: ["2562", Validators.required]
    })
  }

  goTo(companyName, detail) {
    let details = detail[0];
    this.router.navigate(["/ope04/07"], {
      queryParams: {
        companyName: companyName,
        detail: detail.subDtl[0].text
      }
    });
  }

  onClickMonth() {
    this.router.navigate(["/ope04/09/01"]);
  }

}