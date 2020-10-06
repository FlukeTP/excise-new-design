import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { AjaxService } from 'services/index';
import { Utils } from 'helpers/index';

declare var $: any;

@Component({
  selector: 'app-tax-home-board',
  templateUrl: './tax-home-board.component.html',
  styleUrls: ['./tax-home-board.component.css']
})
export class TaxHomeBoardComponent implements OnInit {
  breadcrumb: BreadCrumb[] = [
    { label: "ตรวจสอบภาษี", route: "#" },
    { label: "การตรวจสอบภาษี", route: "#" }
  ];
  countNotificationData: any;
  dataTable: any = null;
  dataTables: any = [];

  yearSelect: string = "";

  constructor() {
    this.dataTables = [
      {
        title: "พื้นที่ สิงห์บุรี",
        data: [
          { name: "บริษัท พรีไซซ อีเลคตริค แมนูแฟคเจอริ่ง จำกัด", progress: 45 },
          { name: "บริษัท เฮดดิ้ง เทรดดิ้ง ไทย จำกัด", progress: 28 },
          { name: "ห้างหุ้นส่วนจำกัด เอส.ซี.ออยล์ กรุ๊ป แอนด์ เซอร์วิส", progress: 85 },
        ]
      },
      {
        title: "พื้นที่ อ่างทอง",
        data: [
          { name: "บริษัท ไคเนเทค เรซซิ่ง จำกัด", progress: 50 },
          { name: "บริษัท อีด้า-เซเว่น ซันส์ จำกัด", progress: 25 },
        ]
      },
      {
        title: "พื้นที่ ปทุมธานี 1",
        data: [
          { name: "บริษัท เลาทัน ลูอัส (ประเทศไทย) จำกัด", progress: 90 },
        ]
      },
      {
        title: "พื้นที่ ปทุมธานี 2",
        data: [
          { name: "บริษัท ซี.เอ.พาร์ท จำกัด", progress: 100 },
          { name: "บริษัท เกอร์ริ่ง(ไทยแลนด์) จำกัด", progress: 10 },
          { name: "บริษัท อีมาส เอ็นเนอร์ยี่ เซอร์วิสเซส (ไทยแลนด์) จำกัด", progress: 75 },
        ]
      },
    ];
  }

  ngOnInit() {
    // this.dataTabled();
  }

  ngAfterViewInit() {
    $("#selectYear").dropdown().css('width', '100%');
    $('.ui.progress').progress({ text: '' });

    setTimeout(() => {
      $("#selectYear").dropdown('set selected', '2561');
    }, 1000);
  }

  dataTabled = () => {
    if ($('#tableData').DataTable() != null) { $('#tableData').DataTable().destroy(); };

    let renderString = function (data, type, row, meta) {
      if (Utils.isNull(data)) {
        data = "-";
      }
      return data;
    };

    const URL = AjaxService.CONTEXT_PATH + 'taxHome/selectType'
    this.dataTable = $("#tableData").DataTableTh({
      processing: true,
      serverSide: false,
      paging: true,
      scrollX: true,
      lengthChange: false,
      ajax: {
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            type: 1,
            date: ""
          }));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        }, {
          data: "exciseId",
          render: renderString
        }, {
          data: "companyName",
          render: renderString
        }, {
          render: function (data, type, full, meta) {
            let _div = '';
            _div += `<div class="ui red progress">
              <div class="bar"></div> </div>`;
            return _div;
          }
        }, {
          render: function (data, type, full, meta) {
            let _btn = '';
            _btn += `<button class="circular ui basic button" type="button" 
            >More Detail</button>`;
            return _btn;
          },
          className: "center"
        },
      ],
    });

  }

  progressClass(progress: number) {
    if (progress <= 24 && progress >= 0) {
      return 'ui progress red';
    } else if (progress <= 50 && progress >= 25) {
      return 'ui active progress';
    } else if (progress <= 75 && progress >= 51) {
      return 'ui progress warning';
    } else if (progress <= 100 && progress >= 76) {
      return 'ui progress success';
    }
  }

}
