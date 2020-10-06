import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// services
import { AjaxService } from "../../../common/services/ajax.service";
import { MessageBarService } from "../../../common/services/message-bar.service";

// models
import { Dropdown } from "../../../common/models";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "page-message",
  templateUrl: "message.html"
})
export class MessagePage implements OnInit {
  messageTypes: Dropdown[];
  messageDt: any;
  editMessageMd: any;
  checkboxes;
  Array;

  constructor(
    private router: Router,
    private ajaxService: AjaxService,
    private messageBarService: MessageBarService
  ) {}

  ngOnInit(): void {
    this.messageTypes = new Array();

    let dd = new Dropdown();
    dd.value = "I";
    dd.text = "Info";
    this.messageTypes.push(dd);

    dd = new Dropdown();
    dd.value = "E";
    dd.text = "Error";
    this.messageTypes.push(dd);

    dd = new Dropdown();
    dd.value = "W";
    dd.text = "Waring";
    this.messageTypes.push(dd);

    dd = new Dropdown();
    dd.value = "C";
    dd.text = "Confirm";
    this.messageTypes.push(dd);
  }

  ngAfterViewInit() {
    this.initDatatable();
    $("#messageTypeSelect").dropdown();
  }

  delete(): void {
    let deletes = [];
    this.checkboxes = document.getElementsByName("checkMessageID");
    for (var i = 0, n = this.checkboxes.length; i < n; i++) {
      if (this.checkboxes[i].checked) {
        deletes.push(this.checkboxes[i].defaultValue);
      }
    }
    if (deletes.length == 0) return;

    this.messageBarService.comfirm(res => {
      if (!res) return false;

      const deleteURL = `preferences/message/${deletes.join(",")}`;
      this.ajaxService.delete(
        deleteURL,
        (ok: Response) => {
          let body: any = ok.json();
          this.messageBarService.success("ลบข้อมูลสำเร็จ.");
          this.search();
        },
        (error: Response) => {
          let body: any = error.json();
          this.messageBarService.error(body.error);
        }
      );
    }, "ยืนยันการลบ.");
  }

  initDatatable(): void {
    const URL = AjaxService.CONTEXT_PATH + "preferences/message/search";
    this.messageDt = $("#messageDt").DataTable({
      lengthChange: false,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: true,
      paging: true,
      pagingType: "full_numbers",
      ajax: {
        type: "GET",
        url: URL,
        data: function(params) {
          params["messageCode"] = $("#messageCode").val();
          params["messageEn"] = $("#messageEn").val();
          params["messageTh"] = $("#messageTh").val();
          params["messageType"] = $("#messageTypeSelect").dropdown("get value");
          return params;
        }
      },
      columns: [
        {
          data: "messageId",
          render: function(data, type, full, meta) {
            return (
              '<div class="ui checkbox"><input name="checkMessageID" value="' +
              data +
              '" type="checkbox"><label></label></div>'
            );
          }
        },
        { data: "messageCode" },
        { data: "messageEn" },
        { data: "messageTh" },
        { data: "messageType" },
        {
          data: "messageId",
          render: function() {
            return '<button type="button" class="ui mini button edit"><i class="pencil icon"></i> Edit</button>';
          }
        }
      ],
      columnDefs: [{ targets: [0, 5], className: "center aligned" }],
      rowCallback: (row, data, index) => {
        $("td > .edit", row).bind("click", () => {
          this.router.navigate(["/edit-message", data.messageId]);
        });
      }
    });
  }

  resetSearch() {
    $("input[type='text']").val("");
    $("#messageTypeSelect").dropdown("restore defaults");
    this.search();
  }

  search() {
    this.messageDt.ajax.reload();
  }
}
