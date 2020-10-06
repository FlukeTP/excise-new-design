import { Component, OnInit, OnDestroy } from "@angular/core";
import { AjaxService, MessageBarService } from "../../../../common/services";
import { Router } from "@angular/router";
import { BaseModel, ManageReq, BreadCrumb } from 'models/index';
var jQuery: any;
declare var $: any;

const URL = {
  DATATABLEINIT: AjaxService.CONTEXT_PATH + "ia/int02m3/showInit",
  SAVEQTN_HEADER: "/ia/int02m3/saveQtnHeader",
  UPDATEQTN_HEADER: "/ia/int02m3/updateQtnHeader",
  DELETEQTN_HEADER: "/ia/int02m3/deleteQtnHeader/"
};

@Component({
  selector: "app-int02-m3",
  templateUrl: "./int02-m3.component.html",
  styleUrls: ["./int02-m3.component.css"]
})
export class Int02M3Component implements OnInit, OnDestroy {
  manageDataExternal: any;
  sideExternal: any;
  qtnHeaderName: any;
  statusSave: String;
  idSelect: any;

// BreadCrumb
breadcrumb: BreadCrumb[];

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private messageBarService: MessageBarService
  ) {
    this.sideExternal = "";
    this.statusSave = "";
    this.idSelect = "";

    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "จัดการข้อมูลแบบสอบถามระบบการควบคุมภายใน", route: "#" },
    ];
  }

  ngOnDestroy() {
    $(".ui.modal.show").remove();
  }

  ngOnInit() {
    this.initDatatable();

    $("#closeList").click(function() {
      $(".ui.modal.show").modal("hide");
    });

    // Edit or Read detail
    $("#manageDataExternal tbody").on("click", "button", e => {
      const { id } = e.currentTarget;
      let idSplit = id.split("-");
      this.idSelect = idSplit[1];
      this.manageDataExternal.row($(e).parents("tr")).data();
      if ("edit" == id.split("-")[0]) {
        this.sideExternal = (<HTMLInputElement>(
          document.getElementById(id)
        )).value;
        this.statusSave = "update";
        $(".ui.modal.show").modal("show");
      } else {
        let sideSplit = (<HTMLInputElement>document.getElementById(id)).value;
        this.sideExternal = sideSplit.split(",");
        this.router.navigate(["/int02/m3/1"], {
          queryParams: {
            qtnHeaderCode: this.sideExternal[0],
            qtnHeaderName: this.sideExternal[1]
          }
        });
      }
    });
  }

  clickCheckAll = event => {
    if (event.target.checked) {
      var node = $("#manageDataExternal")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function(index, value) {
        $(this)
          .find("input")
          .prop("checked", true);
      });
    } else {
      var node = $("#manageDataExternal")
        .DataTable()
        .rows()
        .nodes();
      $.each(node, function(index, value) {
        $(this)
          .find("input")
          .prop("checked", false);
      });
    }
  };

  initDatatable(): void {
    this.manageDataExternal = $("#manageDataExternal").DataTable({
      serverSide: false,
      searching: false,
      ordering: false,
      processing: true,
      lengthChange: false,
      scrollX: true,
      // pageLength: 10,
      // paging: false,
      // info: false,
      // pagingType: "full_numbers",

      ajax: {
        type: "POST",
        url: URL.DATATABLEINIT
      },
      columns: [
        {
          render: function(data, type, full, meta) {
            return `<input type="checkbox" name="chk-${meta.row}" id="chk-${
              meta.row
            }" value="${$("<div/>")
              .text(full.qtnHeaderId)
              .html()}">`;
          },
          className: "ui center aligned"
        },
        {
          render: function(data, type, full, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "ui center aligned"
        },
        {
          data: "qtnHeaderName",
          className: "ui center aligned"
        },
        {
          className: "ui center aligned",
          render: function(data, type, full, meta) {
            return `<button class="ui mini  yellow button" type="button" id="edit-${
              full.qtnHeaderId
            }" value="${
              full.qtnHeaderName
            }"> <i class="edit icon"></i> แก้ไข</button>`;
          }
        },
        {
          className: "ui center aligned",
          render: function(data, type, full, meta) {
            return `<button class="ui mini blue button" type="button" id="detail-${
              full.qtnHeaderId
            }" value="${full.qtnHeaderCode +
              "," +
              full.qtnHeaderName}"> <i class="search icon"></i> รายละเอียด</button>`;
          }
        }
      ]
    });
  }

  saveSideExternal = () => {
    if (this.statusSave == "add") {
      this.ajax.post(
        URL.SAVEQTN_HEADER,
        { qtnHeaderName: this.sideExternal },
        res => {
          let data = res.json();
          this.messageBarService.successModal(data.msg.messageTh, "สำเร็จ");
          this.manageDataExternal.ajax.reload();
        },
        err => {
          this.messageBarService.errorModal(
            "ไม่สามารถบันทึกได้",
            "เกิดข้อผิดพลาด"
          );
        }
      );
    } else {
      this.ajax.post(
        `${URL.UPDATEQTN_HEADER}/${this.idSelect}`,
        { qtnHeaderName: this.sideExternal },
        res => {
          let data = res.json();
          this.messageBarService.successModal(data.msg.messageTh, "สำเร็จ");
          this.manageDataExternal.ajax.reload();
          $(".ui.modal.show").modal("hide");
        },
        err => {
          this.messageBarService.errorModal(
            "ไม่สามารถบันทึกได้",
            "เกิดข้อผิดพลาด"
          );
        }
      );
    }
  };

  addData = () => {
    this.sideExternal = "";
    this.statusSave = "add";
    $(".ui.modal.show").modal("show");
  };

  deleteData = () => {
    if (!$('input[type="checkbox"]').is(":checked")) {
      this.messageBarService.alert("กรุณาเลือกรายการ");
      return false;
    }

    this.messageBarService.comfirm(res => {
      if (res) {
        var dataCheck = this.manageDataExternal.rows().data();
        this.idSelect = [];
        for (let i = 0; i < dataCheck.length; i++) {
          if ($(`#chk-${i}`)[0].checked) {
            let id = (<HTMLInputElement>document.getElementById(`chk-${i}`))
              .value;
            this.idSelect.push(parseInt(id));
          }
        } //end for loops

        this.ajax.delete(URL.DELETEQTN_HEADER + this.idSelect.join(), res => {
          let data = res.json();
          this.messageBarService.successModal(data.messageTh, "สำเร็จ");
          $(".ui.modal.show").modal("hide");
          this.manageDataExternal.ajax.reload();
        });
      }
    }, "ลบรายการ");
  };
}
