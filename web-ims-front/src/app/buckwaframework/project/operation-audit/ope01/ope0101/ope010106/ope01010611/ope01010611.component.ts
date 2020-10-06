import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope010106ButtonVo } from '../ope010106vo.model';

const URL = {
     GET_DETAILS: "oa/01/01/06/09/detail",
     PUT_UPDATE: "oa/01/01/06/09/save",
     GET_BUTTONS: "oa/01/01/06/detail",
     GET_FIND_CUSTOMER: "oa/01/01/06/customers",
     EXPORT_PDF: "oa/01/06/pdf",
     PUT_COMPLETE: "oa/01/01/06/complete/license"
}

@Component({
     selector: 'ope01010611',
     templateUrl: 'ope01010611.component.html',
     styleUrls: ['ope01010611.component.css']
})
export class Ope01010611Component {

     id: string = "";
     lubrID: string = "";
     loading: boolean = false;
     buttons: Ope010106ButtonVo = null;
     constructor(
          private ajax: AjaxService,
          private fb: FormBuilder,
          private route: ActivatedRoute,
          private router: Router,
          private msg: MessageBarService,
          private sanitizer: DomSanitizer
     ) {
          // TODO
     }

     ngOnInit() {
          // TODO
          this.id = this.route.snapshot.queryParams["oaHydrocarbDtlId"] || "";
          this.lubrID = this.route.snapshot.queryParams["id"] || "";
          if (this.lubrID) {
               this.getButtons();
          }
     }

     getButtons() {
          this.loading = true;
          this.ajax.doGet(`${URL.GET_BUTTONS}/${this.lubrID}`).subscribe((response: ResponseData<Ope010106ButtonVo>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.buttons = response.data;
                    this.loading = false;
               } else {
                    this.msg.errorModal(response.message);
               }
          })
     }

     onComplete() {
          // On Complete
          this.msg.comfirm((event: boolean) => {
               if (event) {
                    // After Confirm
                    this.saveTo();
               }
          }, MessageBarService.CONFIRM_PROCESS);
     }

     saveTo() {
          this.ajax.doPut(`${URL.PUT_COMPLETE}/${this.lubrID}`, {}).subscribe((response: ResponseData<any>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.msg.successModal(response.message, "สำเร็จ", event => {
                         if (event) {
                              this.router.navigate(['/ope01/06']);
                         }
                    });
               } else {
                    this.msg.errorModal(response.message);
               }
          });
     }

     frameUrl() {
          if (this.buttons) {
               return this.sanitizer.bypassSecurityTrustResourceUrl(AjaxService.CONTEXT_PATH + URL.EXPORT_PDF + "/" + this.buttons.oaCuslicenseId + "/" + this.buttons.oaHydrocarbDtlId);
          } else {
               return this.sanitizer.bypassSecurityTrustResourceUrl("");
          }
     }

}