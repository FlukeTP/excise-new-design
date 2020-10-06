import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { AjaxService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-ope0411',
  templateUrl: './ope0411.component.html',
  styleUrls: ['./ope0411.component.css']
})
export class Ope0411Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "แผนการออกตรวจควบคุมสุรากลั่นชุมชน", route: "#" },
  ];
  dataTables: any = [];
  yearSelect: string = "";
  selectZone: string = "";
  months: any[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.months = [
      {
        name: "ตุลาคม",
        year: 2561,
        plans: [
          { total: 3, status: "E" },
          { total: 2, status: "E" },
        ]
      }, {
        name: "พฤศจิกายน",
        year: 2561,
        plans: [
          { total: 3, status: "E" },
        ]
      },
      {
        name: "ธันวาคม",
        year: 2561,
        plans: [
          { total: 3, status: "E" },
        ]
      },
      {
        name: "มกราคม",
        year: 2562,
        plans: [
          { total: 3, status: "E" },
        ]
      },
      {
        name: "กุมภาพันธ์",
        year: 2562,
        plans: [
          { total: 3, status: "B" },
        ]
      },
      {
        name: "มีนาคม",
        year: 2562,
        plans: [
          { total:"-", status: "-" },
        ]
      },
      {
        name: "เมษายน",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
      {
        name: "พฤษภาคม",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
      {
        name: "มิถุนายน",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
      {
        name: "กรกฎาคม",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
      {
        name: "สิงหาคม",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
      {
        name: "กันยายน",
        year: 2562,
        plans: [
          { total: "-", status: "-" },
        ]
      },
    ];
  }

  ngOnInit() { }

  ngAfterViewInit() { }

  exportPDF = e => {
    var form = document.createElement("form");
    form.method = "POST";
    form.target = "_blank";
    form.action = AjaxService.CONTEXT_PATH + "hyddocabon/pdf/oa/hydDocabonService";

    // window.open("/hyddocabon/pdf/oa/hydDocabonService/file", "_blank");
    form.style.display = "none";
    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    form.appendChild(jsonInput);


    document.body.appendChild(form);
    form.submit();
  };

  progressClass(progress: number) {
    if (progress <= 24 && progress >= 0) {
      return 'ui active progress red';
    } else if (progress <= 50 && progress >= 25) {
      return 'ui active progress';
    } else if (progress <= 75 && progress >= 51) {
      return 'ui active progress warning';
    } else if (progress <= 100 && progress >= 76) {
      return 'ui active progress success';
    }
  }

  toSubPage(path: any) {
    this.router.navigate(['/' + path]);
  }

  search() { }

  createPlan() {
    this.router.navigate(['/ope04/11/01'], {
      queryParams: {
        to: "DETAIL"
      }
    });
  }

  managePlan(type = "DETAIL") {
    this.router.navigate(['/ope04/11/01'], {
      queryParams: {
        to: type
      }
    });
  }

}
