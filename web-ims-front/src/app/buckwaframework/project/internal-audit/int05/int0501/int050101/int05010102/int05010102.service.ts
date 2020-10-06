import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router } from '@angular/router';
const URL = {
    SAVE: "ia/int09112/save"
};

declare var $: any;
@Injectable()
export class Int05010102Service {
    constructor(
        private ajax: AjaxService,
        private msg: MessageBarService,
        private router: Router
    ) { }

    save(DATA: any) {
        $("#modalAddHead").modal("hide");
        this.ajax.post(URL.SAVE, DATA, res => {
            const msg = res.json();
            if (msg.messageType == "C") {
                this.msg.successModal(msg.messageTh);
                this.clickBack();
            } else {
                this.msg.errorModal(msg.messageTh);
            }
        });
    }

    clickBack(idProcess?: number) {
        this.router.navigate(["/int09/1/1"], {
            queryParams: { idProcess: idProcess }
        });
    }
}