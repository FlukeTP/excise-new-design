import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComboBox } from 'models/index';
import { AjaxService } from 'services/ajax.service';

const URL = {
    DROPDOWN: "combobox/controller/getDropByTypeAndParentId"
};

@Injectable()
export class ConnectionProductExporterService {

    constructor(private ajax: AjaxService) { }

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
        return this.ajax.post(URL.DROPDOWN, DATA, res => {
            this[combo] = res.json();
        });
    };
}