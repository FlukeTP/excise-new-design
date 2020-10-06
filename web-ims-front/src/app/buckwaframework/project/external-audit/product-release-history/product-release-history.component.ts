import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-product-release-history',
  templateUrl: './product-release-history.component.html',
  styleUrls: ['./product-release-history.component.css']
})
export class ProductReleaseHistoryComponent implements OnInit {
  table: any;
  dataTables: any = [];
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจส่งออก", route: "#" },
    { label: "ประวัติการตรวจปล่อยสินค้า", route: "#" },
  ];
  selectZone: string = "";
  selectZone2: string = "";
  area: string = "";
  constructor(private router: Router) {

    this.dataTables = [
      { num: "1", TransNumber: "001", name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "2", TransNumber: "002", name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "3", TransNumber: "003", name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", area: "สำนักงานสรรพสามิตภาคที่ 1", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "4", TransNumber: "004", name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 1", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "5", TransNumber: "005", name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "6", TransNumber: "006", name: "บริษัท เลาทัน ลูอัส (ประเทศไทย) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 2", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "7", TransNumber: "007", name: "บริษัท ซี.เอ.พาร์ท จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "8", TransNumber: "008", name: "บริษัท เกอร์ริ่ง(ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },
      { num: "9", TransNumber: "009", name: "บริษัท อีมาส เอ็นเนอร์ยี่ เซอร์วิสเซส (ไทยแลนด์) จำกัด", area: "สำนักงานสรรพสามิตภาคที่ 3", date: "12/2/2019", status: "ตรวจปล่อย( ต้นทาง )" },

    ];

  }



  ngOnInit() {

    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $('#date2').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $("#selectZone").dropdown().css('min-width', '100%');
    $("#selectZone1").dropdown().css('min-width', '100%');
    $("#selectZone2").dropdown().css('min-width', '100%');
    $("#area").dropdown().css('min-width', '100%');

  }

  ngAfterViewInit() {

    this.table = $('#dataTable').DataTable({
      data: this.dataTables,
      columns: [
        { data: 'num', class: "aligned center" },
        { data: 'TransNumber', class: "aligned center" },
        { data: 'name', class: "aligned left" },
        { data: 'area', class: "aligned center" },
        { data: 'date', class: "aligned center" },
        { data: 'status', class: "aligned center" },
        {
          class: "aligned center",
          render: function (data, type, row) {
            return "<button class='circular ui basic button dtl' type='button'>รายละเอียด</button>"
          }
        }
      ],
      rowCallback: (row, data, index) => {
        console.log("data ", data);
        console.log("row", row);
        console.log("index", index);
      }
    });

    $('.ui.progress').progress({
      label: 'percent',
      text: {
        percent: '{value} %'
      }
    });
    this.table.on('click', 'tbody tr button.dtl', (e) => {
      var closestRow = $(e.target).closest('tr');
      var data = this.table.row(closestRow).data();
      console.log(data);
      this.router.navigate(["/product-release-history/step"]);
    });
  }

}
