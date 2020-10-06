import { Injectable } from '@angular/core';
import { Utils } from 'helpers/utils';
import { Router } from '@angular/router';
import { PathTs } from './path.model';

@Injectable()
export class Ta0301Service {

    constructor(private router: Router) { }
    checkPathFormTs(pathPage: string, pathMoel: string): void {
        if (Utils.isNull(pathPage)) { this.router.navigate([`/tax-audit-new/ta03/01`]) }
        else {
            if (pathPage != pathMoel) {
                this.router.navigate([`/tax-audit-new/ta03/01`])
            }
        }
    }

    getPathTs(code: string): string {
        let path = '';
        if ("FORM_TS01_01" == code) {
            path = "ta-form-ts0101";
        } else if ("FORM_TS01_02" == code) {
            path = "ta-form-ts0102";
        } else if ("FORM_TS01_03" == code) {
            path = "ta-form-ts0103";
        } else if ("FORM_TS01_04" == code) {
            path = "ta-form-ts0104";
        } else if ("FORM_TS01_05" == code) {
            path = "ta-form-ts0105";
        } else if ("FORM_TS01_06" == code) {
            path = "ta-form-ts0106";
        } else if ("FORM_TS01_07" == code) {
            path = "ta-form-ts0107";
        } else if ("FORM_TS01_08" == code) {
            path = "ta-form-ts0108";
        } else if ("FORM_TS01_09" == code) {
            path = "ta-form-ts0109";
        } else if ("FORM_TS01_10" == code) {
            path = "ta-form-ts0110";
        } else if ("FORM_TS01_10_1" == code) {
            path = "ta-form-ts01101";
        } else if ("FORM_TS01_11" == code) {
            path = "ta-form-ts0111";
        } else if ("FORM_TS01_12" == code) {
            path = "ta-form-ts0112";
        } else if ("FORM_TS01_13" == code) {
            path = "ta-form-ts0113";
        } else if ("FORM_TS01_14" == code) {
            path = "ta-form-ts0114";
        } else if ("FORM_TS01_14_1" == code) {
            path = "ta-form-ts0114/1";
        } else if ("FORM_TS01_14_2" == code) {
            path = "ta-form-ts0114/2";  
        } else if ("FORM_TS01_15" == code) {
            path = "ta-form-ts0115";
        } else if ("FORM_TS01_16" == code) {
            path = "ta-form-ts0116";
        } else if ("FORM_TS01_17" == code) {
            path = "ta-form-ts0117";
        } else if ("FORM_TS01_17_1" == code) {
            path = "ta-form-ts01171";
        } else if ("FORM_TS01_18" == code) {
            path = "ta-form-ts0118";
        } else if ("FORM_TS01_19" == code) {
            path = "ta-form-ts0119";
        } else if ("FORM_TS01_20" == code) {
            path = "ta-form-ts0120";
        } else if ("FORM_TS01_21" == code) {
            path = "ta-form-ts0121";
        } else if ("FORM_TS03_02" == code) {
            path = "ta-form-ts0302";
        } else if ("FORM_TS03_03" == code) {
            path = "ta-form-ts0303";
        }else if ("FORM_TS04_23" == code) {
            path = "ta-form-ts0423";
        } else if ("FORM_TS04_24" == code) {
            path = "ta-form-ts0424";
        }
        return path;
    }
}