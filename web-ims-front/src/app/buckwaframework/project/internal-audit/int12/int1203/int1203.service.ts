import { Injectable } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Observable } from 'rxjs';
import { ComboBox } from 'models/combobox.model';

const URL = {
    DROPDOWN_OFFICE: "combobox/controller/getDropByTypeAndParentId"
};

@Injectable()
export class Int1203Service {
    constructor(private ajax: AjaxService, private message: MessageBarService) {
        // TODO
    }
    pullComboBox = (
        type: string,
        combo: string,
        id?: number
    ): Observable<ComboBox[]> => {
        return new Observable<ComboBox[]>(obs => {
            this.dropdown(type, combo, id).then(() => obs.next(this[combo]));
        });
    };

    dropdown = (type: string, combo: string, id?: number): Promise<any> => {
        const DATA = { type: type, lovIdMaster: id || null };
        return this.ajax.post(URL.DROPDOWN_OFFICE, DATA, res => {
            this[combo] = res.json();
        });
    };
}
