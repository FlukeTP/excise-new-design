import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class SelectService {
    dataSelect06: any = null;
    dataSelect11: any = null;
    constructor() {
        
    }
    setData(page, data) {
        if ("select06" == page) {
            this.dataSelect06 = data;
        } else if ("select11" == page) {
            this.dataSelect11 = data;
        }
    }
    getData(page) {
        if ("select06" == page) {
            return this.dataSelect06;
        } else if ("select11" == page) {
            return this.dataSelect11;
        }
    }
}