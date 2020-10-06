import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';

declare var $: any;

@Component({
  selector: 'app-ope041101',
  templateUrl: './ope041101.component.html',
  styleUrls: ['./ope041101.component.css']
})
export class Ope041101Component implements OnInit {
  header: string="สร้างแผนการออกตรวจควบคุม"; 
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจปฏิบัติการ", route: "#" },
    { label: "สุรากลั่นชุมชน", route: "#" },
    { label: "สร้างแผนการออกตรวจควบคุม", route: "#" },
  ];
  companies: any[] = [];
  employees: any[] = [];
  constructor(
    private route: ActivatedRoute
  ) {
    this.companies = [
      "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด",
      "บริษัท ไคเนเทค เรซซิ่ง จำกัด",
      "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด"
    ];
    this.employees = [
      "ดร.ธีรวุฒิ กุลธิชัย",
      "รศ.ดร.เอกลักษณ์ อัมพุธ",
      "ว่าที่ร้อยตรี ธนพนธ์ โป่งมณี"
    ];
  }

  ngOnInit() {
    $(".ui.checkbox").checkbox();
    $(".ui.dropdown").dropdown();
  }

  ngAfterViewInit(): void {
    if(this.onApprove){
      this.breadcrumb[this.breadcrumb.length-1]={ label: "อนุมัติแผนการออกตรวจ", route: "#" };
      this.header="อนุมัติแผนการออกตรวจ";
    }

    this.calenda();
  }

  calenda = () => {
    $('#date1').calendar({
      endCalendar: $("#date2"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter(),
    });
    $('#date2').calendar({
      startCalendar: $("#date1"),
      type: 'date',
      text: TextDateTH,
      formatter: formatter()     
    });
  }

  get onInitial() {
    const initial = this.route.snapshot.queryParams['to'] || "";
    if (initial == 'DETAIL') {
      return true;
    }
    return false;
  }
  get onApprove() {
    const approve = this.route.snapshot.queryParams['to'] || "";
    if (approve == 'APPROVE') {
      return true;
    }
    return false;
  }
  get onCreate() {
    const create = this.route.snapshot.queryParams['to'] || "";
    if (create == 'CREATE') {
      return true;
    }
    return false;
  }

  
}
