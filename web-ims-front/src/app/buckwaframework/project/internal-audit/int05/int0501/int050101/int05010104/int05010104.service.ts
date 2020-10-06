import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';

const URL = {
    SAVE: "ia/int09114/save"
};

declare var $: any;
@Injectable()
export class Int05010104Service {
    constructor(
        private ajax: AjaxService,
        private msg: MessageBarService,
        private router: Router
    ) { }

    clickBack(idProcess?: number) {
        this.router.navigate(["/int09/1/1"], {
            queryParams: { idProcess: idProcess }
        });
    }

    save(FormData: Object) {
        $("#modalAddHead").modal("hide");
        this.ajax.post(URL.SAVE, FormData, res => {
            const msg = res.json();

            if (msg.messageType == "C") {
                this.msg.successModal(msg.messageTh);
                this.clickBack();
            } else {
                this.msg.errorModal(msg.messageTh);
            }
        });
    }
}