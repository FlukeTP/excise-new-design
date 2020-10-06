import { Injectable } from "@angular/core";
import { AjaxService, IaService } from '../../../common/services';

import { Observable } from 'rxjs';

const URL = {
    SAVE_MASTER: "ia/int02/save_qtn_master",
    DATATABLE: `${AjaxService.CONTEXT_PATH}ia/int02/qtn_master/datatable`,
    LOV_SECTOR: `combobox/controller/getDropByTypeAndParentId`
}

@Injectable()
export class Int02Service {
    int023: any;
    constructor(private ajax: AjaxService, private ia: IaService) { }
}