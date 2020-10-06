import { Injectable } from "@angular/core";
import { AlertMessage } from "./../models";

declare var $: any;

@Injectable()
export class MessageBarService {
  public static INFO_ICON: string = "info icon";
  public static SUCCESS_ICON: string = "checkmark icon";
  public static ERROR_ICON: string = "warning sign icon";
  public static CONFIRM_SAVE: string = "ยืนยันการเปลี่ยนแปลงข้อมูลหรือไม่ ?";
  public static CONFIRM_DELETE: string = "ยืนยันการลบข้อมูลหรือไม่ ?";
  public static CONFIRM_APPROVE: string = "ต้องการอนุมัติหรือไม่ ?";
  public static CONFIRM_REJECT: string = "ต้องการไม่อนุมัติหรือไม่ ?";
  public static CONFIRM_PROCESS: string = "ดำเนินการต่อหรือไม่ ?";
  public static VALIDATE_INCOMPLETE: string = "กรุณากรอกข้อมูลให้ครบ";
  public static VALIDATE_NEW_REG_ID: string = "กรุณากรอกเลขทะเบียนสรรพสามิต";
  private messageList: AlertMessage[] = [];

  constructor() { }

  info(message: string) {
    let msg: AlertMessage = new AlertMessage();
    msg.header = "Info";
    msg.message = message;
    msg.iconType = MessageBarService.INFO_ICON;
    this.messageList.push(msg);
  }

  success(message: string) {
    let msg: AlertMessage = new AlertMessage();
    msg.header = "Success";
    msg.message = message;
    msg.iconType = MessageBarService.SUCCESS_ICON;
    this.messageList.push(msg);
  }

  error(message: string) {
    let msg: AlertMessage = new AlertMessage();
    msg.header = "Error";
    msg.message = message;
    msg.iconType = MessageBarService.ERROR_ICON;
    this.messageList.push(msg);
  }

  getMessageList(): AlertMessage[] {
    return this.messageList;
  }

  clear() {
    this.messageList.length = 0;
  }

  comfirm(func: Function, message: string, title: string = "การยืนยัน") {
    $("#confirm div.header").html(title);
    $("#confirm div.content").html(message);
    $("#confirm")
      .modal({
        onApprove: function (element) {
          func(true);
        },
        onDeny: function (element) {
          func(false);
        },
        closable: false
      })
      .modal("show");
  }

  alert(message: string, title: string = "แจ้งเตือน") {
    $(".baiwa-alert div.header").html(title);
    $(".baiwa-alert div.content").html(message);
    $(".baiwa-alert div.actions").html(
      `<div class="ui mini cancel button" style="background: #e0e1e2 none; color: black; outline: none">
            <i class="remove icon"></i> ปิด
        </div>`
    );
    $(".baiwa-alert").modal("show");
  }


  errorModal = (msg: string = "ไม่สามารถทำรายการได้กรุณาลองใหม่อีกครั้ง หรือ ติดต่อผู้ดูแลระบบ", title: string = "เกิดข้อผิดพลาด", func?: Function) => {
    $("#alert-header").html(title);
    $("#alert-content").html(msg);
    $("#alert-actions").html(
      `<div class="ui mini cancel button" style="background: #e0e1e2 none; color: black; outline: none">
            <i class="remove icon"></i> ปิด
        </div>`
    );
    $(`#alert`)
      .modal({
        closable: !func,
        centered: false,
        autofocus: false,
        onApprove: (element) => {
          if (func) {
            func(true)
          }
        },
        onDeny: (element) => {
          if (func) {
            func(true)
          }
        },
      })
      .modal('show');
  };

  successModal = (msg: string, title: string = "สำเร็จ", func?: Function) => {
    $("#alert-header").html(title);
    $("#alert-content").html(msg);
    $("#alert-actions").html(
      `<div class="ui green mini cancel inverted button">
            <i class="check icon"></i> ตกลง
        </div>`
    );
    $(`#alert`)
      .modal({
        closable: !func,
        centered: false,
        autofocus: false,
        onApprove: (element) => {
          if (func) {
            func(true)
          }
        },
        onDeny: (element) => {
          if (func) {
            func(true)
          }
        },
      })
      .modal('show');
  };

  successModalReload = (msg: string, title: string = "สำเร็จ", func?: Function) => {
    $("#alert-header").html(title);
    $("#alert-content").html(msg);
    $("#alert-actions").html(
      `<div class="ui green mini cancel inverted button">
            <i class="check icon"></i> ตกลง
        </div>`
    );
    $(`#alert`)
      .modal({
        centered: false,
        autofocus: false,
        onApprove: (element) => {
          if (func) {
            func(true)
          }
        },
        onDeny: (element) => {
          if (func) {
            func(true)
          }
        },
      })
      .modal('show');
  };

}
