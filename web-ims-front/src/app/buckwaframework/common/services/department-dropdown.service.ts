import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable()
export class DepartmentDropdownService {
    constructor(
        private ajax: AjaxService,
    ) { }

    getSector() {
        return this.ajax.doPost("preferences/department/sector-list", {});
    }

    getArea(officeCode) {
        return this.ajax.doPost("preferences/department/area-list/" + officeCode, {});
    }

    getBranch(officeCode) {
        return this.ajax.doPost("preferences/department/branch-list/" + officeCode, {});
    }
}