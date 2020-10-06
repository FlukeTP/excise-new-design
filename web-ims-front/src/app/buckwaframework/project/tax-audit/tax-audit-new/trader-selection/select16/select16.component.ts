import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { BreadcrumbContant } from '../../BreadcrumbContant';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-select16',
  templateUrl: './select16.component.html',
  styleUrls: ['./select16.component.css']
})
export class Select16Component implements OnInit {

  b: BreadcrumbContant = new BreadcrumbContant();
  breadcrumb: BreadCrumb[] = [
    { label: this.b.b00.label, route: this.b.b00.route },
    { label: this.b.b05.label, route: this.b.b05.route },
  ];

  datas: any = [
    {
      data1: "ตุลาคม",
      data2: "2",
      data3: "2",
      data4: "0",
      data5: "1",
      data6: "1",
      data7: "0",
    },
    {
      data1: "พฤศจิกายน",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "ธันวาคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "มกราคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "กุมภาพันธ์",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "มีนาคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "เมษายน",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "พฤษภาคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "มิถุนายน",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "กรกฎาคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "สิงหาคม",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
    {
      data1: "กันยายน",
      data2: "-",
      data3: "-",
      data4: "-",
      data5: "-",
      data6: "-",
      data7: "-",
    },
  ]
  table: any;
  constructor(
    private route: Router
  ) { }

  ngOnInit() {
    $("#calendar").calendar({
      maxDate: new Date(),
      type: "year",
      text: TextDateTH,
      formatter: formatter('ป'),
      onChange: (date) => {
      }
    });

  }
  ngAfterViewInit(): void {
    this.tablePlan();
  }


  edit() {
    $("#edit-modal").modal('show');
  }

  tablePlan = () => {
    this.table = $("#tableDetail").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      data: this.datas,
      columns: [
        {
          data: "data1", className: "text-left"
        }, {
          data: "data2", className: "text-right"
        }, {
          data: "data3", className: "text-right"
        }, {
          data: "data4", className: "text-right"
        }, {
          data: "data5", className: "text-right"
        }, {
          data: "data6", className: "text-right"
        }, {
          data: "data7", className: "text-right"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += `<button class="ui mini yellow button edit" type="button"><i class="edit icon"></i>แก้ไข</button>
                    <button class="ui mini primary button detail" type="button"><i class="eye icon"></i>รายละเอียด</button>
                    `;
            return btn;
          }
        }
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.edit();

    });
    this.table.on("click", "td > button.detail", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.route.navigate(['/tax-audit-new/select16/se01'])
    });
  }
}
