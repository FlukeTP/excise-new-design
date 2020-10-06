import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/index';

declare var $: any;

@Component({
  selector: 'app-ope040701',
  templateUrl: './ope040701.component.html',
  styleUrls: ['./ope040701.component.css']
})
export class Ope040701Component implements OnInit {

  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "การตรวจควบคุม", route: "/ope04/07/" },
    { label: "ข้อมูลการตรวจควบคุม", route: "#" }
  ];

  companyName: any;
  detail: any;
  month: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageBar: MessageBarService
  ) { 
    if (this.route.snapshot.queryParams["companyName"]) {
      this.companyName = this.route.snapshot.queryParams["companyName"];
      this.detail = this.route.snapshot.queryParams["detail"];
      this.month = this.detail.split(" ");
    } else {
      this.router.navigate(["/ope04/07"])
    }
  }

  ngOnInit() { 
    
  }

  ngAfterViewInit() {
    $('.ui.dropdown.ai').dropdown().css('width', '100%');
  }

  saveTo() {
    this.messageBar.comfirm( event => {
      if (event) {
        this.router.navigate(['/ope04/07/']);
      }
    }, "ต้องการบันทึกข้อมูลหรือไม่ ?");
  }

  routeBack() {
    this.messageBar.comfirm( event => {
      if (event) {
        this.router.navigate(['/ope04/07/']);
      }
    }, "ต้องการออกจากหน้านี้หรือไม่ ?");
  }

}
