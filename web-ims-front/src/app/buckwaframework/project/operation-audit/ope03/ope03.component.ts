import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { Router } from '@angular/router';
import { AjaxService } from 'services/ajax.service';

declare var $: any;

@Component({
  selector: 'app-ope03',
  templateUrl: './ope03.component.html',
  styleUrls: ['./ope03.component.css']
})
export class Ope03Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "โรงงานอุตสาหกรรม", route: "#" }
  ];
  lists: BreadCrumb[] = copHomeOils;
  dataTables: any = [];
  yearSelect: string = "";
  selectZone: string = "";
  constructor(
    private router: Router,
    private ajax: AjaxService
  ) { }

  ngOnInit() {
    $("#selectYear").dropdown('set selected', 2562).css('min-width', '100%');
    $("#selectZone").dropdown('set selected', 1).css('min-width', '100%');
    $('.dropdown').dropdown();
  }

  ngAfterViewInit() {
    $('#tableData').DataTable()
  }

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

}

export const copHomeOils: BreadCrumb[] = [
  { route: '/ope03/01', label: 'ข้อมูลผู้ประกอบการ' },
  { route: '/ope03/02', label: 'แผนประจำปี' },
  { route: '/ope03/03', label: 'ผลการคัดกรอง' },
  { route: '/ope03/05', label: 'ปฏิทิน' },
  { route: '/ope03/06', label: 'ทะเบียนคุม' },
  // { route: '/ope02/', label: 'สถานะการออกตรวจ' },
  // { route: '/ope02/', label: 'รายงานผลการออกตรวจ' },
  // { route: '/ope02/05', label: 'อนุมัติแผนการออกตรวจ' },
];
