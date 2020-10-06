import { Component, OnInit } from "@angular/core";
// services
import { MessageBarService } from "../../../common/services/message-bar.service";
// models
import { AlertMessage } from "../../models";

declare var $: any;

@Component({
  selector: "message-bar",
  template: `
        <div class="ui icon message" [ngClass]="msg.messageType" *ngFor="let msg of messageList" >
            <i  [ngClass]="msg.iconType"></i>
            <i class="close icon" (click)="demiss($event,msg)" ></i>
            <div class="content">
            <div class="header">
                {{msg.header}}
            </div>
            <p>{{msg.message}}</p>
            </div>
        </div>
    `
  // styles: ['.ui.message { margin-bottom: 14px; }']
})
export class MessageBarComponent implements OnInit {
  messageList: AlertMessage[] = [];

  constructor(private messageBarService: MessageBarService) { }

  ngOnInit(): void {
    this.messageList = this.messageBarService.getMessageList();
  }

  demiss(event: Event, item: AlertMessage) {
    // $(event.target).closest('.message').transition('fade');
    let index = this.messageList.indexOf(item);
    this.messageList.splice(index, 1);
  }
}
