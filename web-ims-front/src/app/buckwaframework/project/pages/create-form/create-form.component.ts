import { Component } from "@angular/core";

// services
import { MessageBarService } from "../../../common/services/message-bar.service";

@Component({
  selector: "create-form",
  templateUrl: "create-form.component.html"
  // styleUrls : ['create-form.component.css']
})
export class CreateFormComponent {
  public listDatas: any[] = [];
  public showUploadDetail: boolean = false;

  constructor(private messageBarService: MessageBarService) {}

  ngOnInit() {
    this.listDatas = [
      [1, "C 16M DOM-1.5T CVT ZA7", 2, 2, 2, 0, 0],
      [2, "C 16M DOM-RS CVT ZB7", 104, 104, 107, 0, -3],
      [3, "C 16M DOM-1.8S CVT ZA5", 272, 272, 287, 0, -15],
      [4, "C 16M DOM-15EL  CVT ZB7", 1128, 1128, 1153, 0, -25]
    ];
  }

  ngAfterViewInit() {
    // $('.dropdown').dropdown();
  }

  onClickUpload() {
    this.showUploadDetail = true;
  }

  onclickDelete() {
    this.showUploadDetail = false;
  }
}
