import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";

// services
import { MessageBarService } from "../../../common/services/message-bar.service";

// models
import { Message, Dropdown } from "../../../common/models";
import { AjaxService } from "../../../common/services/ajax.service";

declare var $: any;

@Component({
  selector: "page-message-detail",
  templateUrl: "message-detail.html"
})
export class MessageDetailPage implements OnInit {
  private statusPage: string;
  static ADD: string = "ADD";
  static UPDATE: string = "UPDATE";
  messageTypes: Dropdown[];
  private messageUpdate: Message;
  title: string = "";

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private messageBarService: MessageBarService,
    private ajaxService: AjaxService
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

    let id = this.route.snapshot.params["id"];
    if (id) {
      this.statusPage = MessageDetailPage.UPDATE;
      const getURL = `preferences/message/${id}`;
      this.ajaxService.get(
        getURL,
        (success: Response) => {
          let body: any = success.json();
          this.messageUpdate = body.data as Message;
          //Set Value
          $("#messageForm").form("set values", this.messageUpdate);
        },
        (err: Response) => {
          let body: any = err.json();
          this.messageBarService.error(body.error);
        }
      );
    } else {
      this.statusPage = MessageDetailPage.ADD;
    }
  }

  save() {
    let $form = $("#messageForm");
    let valid: boolean = $form.form("validate form");

    if (!valid) return false;

    //loading
    $form.addClass("loading");
    let allFields = $form.form("get values");
    const createUrl = "preferences/message";

    if (this.statusPage == MessageDetailPage.ADD) {
      this.ajaxService.post(
        createUrl,
        allFields,
        (succes: Response) => {
          let body: any = succes.json();

          this.messageBarService.success("บันทึกข้อมูลสำเร็จ.");

          $form.removeClass("loading");

          this.back();
        },
        (err: Response) => {
          let body: any = err.json();
          this.messageBarService.error(body.error);
          $form.removeClass("loading");
        }
      );
    } else {
      //merg Object
      let update = $.extend(this.messageUpdate, allFields);
      this.ajaxService.put(
        createUrl,
        update,
        (succes: Response) => {
          let body: any = succes.json();

          this.messageBarService.success("บันทึกข้อมูลสำเร็จ.");

          $form.removeClass("loading");

          this.back();
        },
        (err: Response) => {
          let body: any = err.json();
          this.messageBarService.error(body.error);
          $form.removeClass("loading");
        }
      );
    }
  }

  back(): void {
    this.router.navigate(["/message"]);
  }

  ngAfterViewInit() {
    $("#messageType").dropdown();
    this.formInit();
  }

  private formInit() {
    let EMPTY_MESSAGE = "กรุณากรอกข้อมูลในช่องว่าง.";
    $("#messageForm").form({
      on: "blur",
      inline: true,
      fields: {
        messageCode: {
          identifier: "messageCode",
          rules: [
            {
              type: "empty",
              prompt: EMPTY_MESSAGE
            }
          ]
        },
        messageType: {
          identifier: "messageType",
          rules: [
            {
              type: "empty",
              prompt: EMPTY_MESSAGE
            }
          ]
        },
        messageEn: {
          identifier: "messageEn",
          rules: [
            {
              type: "empty",
              prompt: EMPTY_MESSAGE
            }
          ]
        },
        messageTh: {
          identifier: "messageTh",
          rules: [
            {
              type: "empty",
              prompt: EMPTY_MESSAGE
            }
          ]
        }
      }
    });
  }
}
