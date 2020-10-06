
export class ObjMonth {
  monthTotal: number = 0;
  monthStart: number = 0;
  yearMonthStart: string = '';
  yearMonthEnd: string = '';
  yearMonthStartCompare: string = '';
  yearMonthEndCompare: string = '';
  condNumber: string = '';
  condSubCapitalFlag: string = '';
  condSubRiskFlag: string = '';
  condSubNoAuditFlag: string = '';
  worksheetStatus: string = '';
  yearCondSubNoAudit: string = '';
  countGroup: number = 1;
  showCondFlag: string = 'Y';
  showDetail: boolean = false;
  isDisabled: boolean = true;
}
export interface RequestStartLength {
  start: number;
  length: number;
}

export interface checkboxList {
  typeCheckedAll: boolean;
  ids: any[];
}

export class TableShowDetail {
  color: string = 'gray';
  show: boolean = false;

}






