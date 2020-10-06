import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/breadcrumb.model';
import { ComboBox } from 'models/combobox.model';
import { Observable } from 'rxjs';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { Int120301Service } from './int120301.service';

const URL = {
  INIT_DATATABLE: AjaxService.CONTEXT_PATH + "ia/int054/filterFindIaPcm",
  DELETE: "ia/int054/delete/"
};

declare var $: any;
@Component({
  selector: 'app-int120301',
  templateUrl: './int120301.component.html',
  styleUrls: ['./int120301.component.css'],
  providers: [Int120301Service]
})
export class Int120301Component implements OnInit {
  breadcrumb: BreadCrumb[] = [];
  budgetYear: string = "";
  budgetTypeList: Observable<ComboBox[]>;
  supplyChoiceList: Observable<ComboBox[]>;
  manageDataExternal: any;
  dataTable: any;
  idSelect: any;
  comboBox1: Observable<ComboBox[]>;
  supplyChoice: any;
  comboBox2: Observable<ComboBox[]>;
  comboBox3: Observable<ComboBox[]>;

  constructor(
    private selfService: Int120301Service,
    private ajax: AjaxService,
    private router: Router,
    private msg: MessageBarService
  ) {
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "บันทึกข้อมูล", route: "#" },
      { label: "ข้อมูลการจัดซื้อจัดจ้าง", route: "#" }
    ];
  }

  ngAfterViewInit() {
    this.DATATABLE();
    $("#budgetYear")
      .calendar({
        maxDate: new Date(),
        type: "year",
        text: TextDateTH,
        formatter: formatter("year"),
        onChange: (date, text, mode) => {
          this.budgetYear = text;
        }
      }).css("width", "100%");

    $("#export .dropdown").dropdown({
      transition: "drop"
    });

    // Edit or Read detail
    $("#dataTable tbody").on("click", "button", e => {
      const { id } = e.currentTarget;
      let idSplit = id.split("-");
      this.idSelect = idSplit[1];
      this.dataTable.row($(e).parents("tr")).data();

      if ("edit" == id.split("-")[0]) {
        this.router.navigate(["/int12/03/01"], {
          queryParams: {
            procurementId: this.idSelect,
            status: "UPDATE",
            head: "แก้ไข"
          }
        });
      }
    });
  }

  ngOnInit() {
    this.comboBox1 = this.selfService.pullComboBox("SECTOR_VALUE", "comboBox1");
    this.budgetTypeList = this.selfService.pullComboBox(
      "TYPE_OF_EXPENSE",
      "budgetType"
    );
    this.supplyChoiceList = this.selfService.pullComboBox(
      "SUPPLY_CHOICE",
      "supplyChoice"
    );
    $(".ui.checkbox").checkbox();
    $(".ui.dropdown").dropdown();
    // this.sectorL();
  }

  dropdown(e, combo: string) {
    e.preventDefault();
    this[combo] = this.selfService.pullComboBox(
      "SECTOR_VALUE",
      combo,
      e.target.value
    );
  }

  onSearch = () => {
    this.DATATABLE();
  };

  clearFile = () => {
    this.budgetYear = "";
    $("#budgetYear").calendar("refresh");
    $("#supplyChoice").dropdown("restore defaults");
    $("#budgetType").dropdown("restore defaults");
    $(".off").dropdown("restore defaults");
    if (this.dataTable != null || this.dataTable != undefined) {
      this.dataTable.clear().draw();
    }
  };

  addData = () => {
    this.router.navigate(["/int12/03/01/01"], {
      queryParams: {
        status: "SAVE",
        head: "เพิ่ม"
      }
    });
  };

  DATATABLE(): void {
    if (this.dataTable != null && this.dataTable != undefined) {
      this.dataTable.destroy();
    }

    let data = {
      exciseDepartment:
        $("#combo1").dropdown("get text") == "กรุณาเลือก"
          ? ""
          : $("#combo1").dropdown("get text"),
      exciseDistrict:
        $("#combo2").dropdown("get text") == "กรุณาเลือก"
          ? ""
          : $("#combo2").dropdown("get text"),
      exciseRegion:
        $("#combo3").dropdown("get text") == "กรุณาเลือก"
          ? ""
          : $("#combo3").dropdown("get text"),
      budgetYear: this.budgetYear,
      budgetType:
        $("#budgetType").dropdown("get text") == "กรุณาเลือก"
          ? ""
          : $("#budgetType").dropdown("get text"),
      supplyChoice:
        $("#supplyChoice").dropdown("get text") == "กรุณาเลือก"
          ? ""
          : $("#supplyChoice").dropdown("get text")
    };

    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: false,

      ajax: {
        type: "POST",
        url: URL.INIT_DATATABLE,
        data: data
      },
      columns: [
        {
          render: function (data, type, full, meta) {
            return `<input class="ui checkbox" type="checkbox" name="chk-${
              meta.row
              }" id="chk-${meta.row}">`;
          },
          className: "center"
        },
        {
          data: "budgetYear",
          className: "center"
        },
        {
          data: "poNumber",
          className: "left"
        },
        {
          data: "projectCodeEgp",
          className: "left"
        },
        {
          data: "projectName",
          className: "left"
        },
        {
          data: "price",
          render: $.fn.dataTable.render.number(",", ".", 0, ""),
          className: "right"
        },
        {
          render: function (data, type, full, meta) {
            return full.status === "N"
              ? "ยังไม่เริ่มดำเนินงาน"
              : "เสร็จสิ้นการดำเนินงาน";
          },
          className: "center"
        },
        {
          data: "updatedDate",
          className: "center"
        },
        {
          className: "center",
          render: function (data, type, full, meta) {
            return `<button class="ui mini blue button" type="button"> <i class="eye icon"></i> รายละเอียด</button>`;
          }
        },
        {
          className: "center",
          render: function (data, type, full, meta) {
            return `<button class="ui mini yellow button" type="button" id="edit-${
              full.procurementId
              }"> <i class="edit icon"></i> แก้ไข</button>`;
          }
        }
      ]
    });
  }

  onDelete = () => {
    if (
      $("#dataTable")
        .DataTable()
        .rows()
        .count() == 0
    ) {
      this.msg.alert("ไม่มีข้อมูล");
      return false;
    }

    if (!$('input[type="checkbox"]').is(":checked")) {
      this.msg.alert("กรุณาเลือกรายการ");
      return false;
    }

    let listId = [];
    let node = $("#dataTable")
      .DataTable()
      .rows()
      .nodes();
    $.each(node, function (index, value) {
      if (
        $(this)
          .find("input[type=checkbox]")
          .is(":checked")
      ) {
        let data = $("#dataTable")
          .DataTable()
          .rows()
          .data()[index];
        listId.push(parseInt(data.procurementId));
      }
    });
    this.msg.comfirm(res => {
      if (res) {
        this.ajax.delete(URL.DELETE + listId.join(), res => {
          const msg = res.json();
          if (msg.messageType == "C") {
            this.msg.successModal(msg.messageTh);
          } else {
            this.msg.errorModal(msg.messageTh);
          }
          $("#dataTable")
            .DataTable()
            .ajax.reload();
        });
      }
    }, "ลบรายการ");
  };

  clickCheckAll = event => {
    if (event.target.checked) {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", true);
      });
    } else {
      var node = $("#dataTable")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function (index, value) {
        $(this)
          .find("input")
          .prop("checked", false);
      });
    }
  };
}