import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseData } from 'models/index';
import { AjaxService, MessageBarService, MessageService } from 'services/index';
import { Ope040106ButtonVo } from '../ope040106vo.model';

const URL = {
     GET_BUTTONS: "oa/04/01/06/detail",
     GET_FIND_CUSTOMER: "oa/04/01/06/customers",
     EXPORT_PDF: "oa/04/06/pdf",
     PUT_COMPLETE: "oa/04/01/06/complete/license"
}

@Component({
     selector: 'ope04010610',
     templateUrl: 'ope04010610.component.html',
     styleUrls: ['ope04010610.component.css']
})
export class Ope04010610Component {

     id: string = "";
     lubrID: string = "";
     loading: boolean = false;
     buttons: Ope040106ButtonVo = null;
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
          this.id = this.route.snapshot.queryParams["id"] || "";
          if (this.id) {
               this.getButtons();
          }
     }

     getButtons() {
          this.loading = true;
          this.ajax.doGet(`${URL.GET_BUTTONS}/${this.id}`).subscribe((response: ResponseData<Ope040106ButtonVo>) => {
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
          this.ajax.doPut(`${URL.PUT_COMPLETE}/${this.id}`, {}).subscribe((response: ResponseData<any>) => {
               if (MessageService.MSG.SUCCESS == response.status) {
                    this.msg.successModal(response.message, "สำเร็จ", event => {
                         if (event) {
                              this.router.navigate(['/ope04/06']);
                         }
                    });
               } else {
                    this.msg.errorModal(response.message);
               }
          });
     }

     get frameUrl() {
          if (this.buttons) {
               return this.sanitizer.bypassSecurityTrustResourceUrl(AjaxService.CONTEXT_PATH + URL.EXPORT_PDF + "/" + this.buttons.oaCuslicenseId + "/" + this.buttons.oaAlcoholDtlId);
          } else {
               return this.sanitizer.bypassSecurityTrustResourceUrl("");
          }
     }

}