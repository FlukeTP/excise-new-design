import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageBarService } from 'services/message-bar.service';
import { Observable } from 'rxjs';
import { ComboBox } from 'models/combobox.model';

const URL = {
    DROPDOWN_OFFICE: "combobox/controller/getDropByTypeAndParentId"
};

@Injectable()
export class Int12030101Service {
    constructor(
        private ajax: AjaxService,
        private router: Router,
        private route: ActivatedRoute,
        private msg: MessageBarService
    ) {
        // TODO
    }

    dropdown = (type: string, combo?: string, id?: number): Observable<any> => {
        const DATA = { type: type, lovIdMaster: id || null };
        return new Observable<ComboBox[]>(obs => {
            this.ajax
                .post(URL.DROPDOWN_OFFICE, DATA, res => {
                    this[type] = res.json();
                    //   console.log("service: ", this[type]);
                })
                .then(() => obs.next(this[type]));
        });
    };
}
