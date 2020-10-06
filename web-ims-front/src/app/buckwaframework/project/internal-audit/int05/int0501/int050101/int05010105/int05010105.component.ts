import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { AuthService } from 'services/auth.service';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { formatter, TextDateTH } from 'helpers/datepicker';

declare var $: any;
@Component({
  selector: 'app-int05010105',
  templateUrl: './int05010105.component.html',
  styleUrls: ['./int05010105.component.css']
})
export class Int05010105Component implements OnInit {
  idProcess: any;
  breadcrumb: BreadCrumb[]
  constructor(
    private authService: AuthService,
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "ประมาณการค่าใช้จ่ายในการเดินทางไปราชการ", route: "#" },
      { label: "รายละเอียดเอกสาร", route: "#" },
      { label: "สร้างเอกสารบันทึกข้อความ", route: "#" }
    ]

  }
  calenda = function () {
    $("#date1").calendar({
      maxDate: new Date(),
      type: "month",
      text: TextDateTH,
      formatter: formatter("ด/ป")
    });
  }

  clickBack() {
    this.router.navigate(['/int09/1/1'], {
      queryParams: { idProcess: this.idProcess }
    });
  }
  save() {

    $('#modalAddHead').modal('hide');
    const URL = "ia/int09115/save";
    this.ajax.post(URL, {
      idProcess: this.idProcess
    }, res => {
      const msg = res.json();

      if (msg.messageType == "C") {
        this.msg.successModal(msg.messageTh);
        this.clickBack();
      } else {
        this.msg.errorModal(msg.messageTh);
      }
    });
  }

  ngOnInit() {
    //this.authService.reRenderVersionProgram('INT-05010105');
    this.idProcess = this.route.snapshot.queryParams["idProcess"];
    console.log("idProcess : ", this.idProcess);
    this.calenda();
  }


  ngAfterViewInit() {

  }

}
