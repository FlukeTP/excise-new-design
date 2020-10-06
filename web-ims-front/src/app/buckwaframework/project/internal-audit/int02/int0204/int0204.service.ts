import { Injectable } from "@angular/core";

import { Observable } from 'rxjs';
import { AjaxService } from 'services/ajax.service';
import { IaService } from 'services/ia.service';

const URL = {
    SAVE_MASTER: "ia/int02/save_qtn_master",
    DATATABLE: `${AjaxService.CONTEXT_PATH}ia/int02/qtn_master/datatable`,
    LOV_SECTOR: `combobox/controller/getDropByTypeAndParentId`
}

@Injectable()
export class Int0204Service {
    int023: any;
    constructor(private ajax: AjaxService, private ia: IaService) { }
}