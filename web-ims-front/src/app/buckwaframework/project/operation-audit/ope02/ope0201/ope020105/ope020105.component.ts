import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb } from 'models/index';
import { ExciseService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-ope020105',
  templateUrl: './ope020105.component.html',
  styleUrls: ['./ope020105.component.css']
})
export class Ope020105Component implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "น้ำมันหล่อลื่น", route: "/ope02/" },
    { label: "แผนประจำเดือน", route: "/ope02/01/" },
    { label: "รายละเอียดผู้ประกอบการ", route: "#" }
  ]
  dataTables: any = null;
  constructor(
    private _location: Location,
    private exciseService: ExciseService,
    private router: Router
  ) { }

  ngOnInit() {
    $('.dropdown').dropdown();
    $("input:text").click(function () {
      $(this).parent().find("input:file").click();
    });
    $('input:file', '.ui.action.input').on('change', function (e) {
      var name = e.target.files[0].name;
      $('input:text', $(e.target).parent()).val(name);
    });
    const data = this.exciseService.getData();
    if (data && data.dataTables) {
      this.dataTables = data.dataTables[data.index];
    }
  }

  onSubmit() {
    this.router.navigate(['/ope02/01/']);
  }

  onSave() {

  }

  onSend() {
    const oldData = Object.assign({}, this.exciseService.getData());
    this.exciseService.setData({ ...oldData, submit: true, approve: false });
    this._location.back();
  }

}
