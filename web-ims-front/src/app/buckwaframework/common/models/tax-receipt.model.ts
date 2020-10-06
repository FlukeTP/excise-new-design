export class TaxReceipt {
    [x: string]: any;
    // String
    count: number = 0;
    taxPrintNo: string = "-";
    taxReceiptId: string = "-";
    receiptDate: string = "-";
    depositDate: string = "-";
    sendDate: string = "-";
    incomeName: string = "-";
    receiptNo: string = "-";
    // Number
    checkedAmount: number = 0.0;
    netTaxAmount: number = 0.0;
    netLocAmount: number = 0.0;
    locOthAmount: number = 0.0;
    locExpAmount: number = 0.0;
    olderFundAmount: number = 0.0;
    tpbsFundAmount: number = 0.0;
    sendAmount: number = 0.0;
    stampAmount: number = 0.0;
    customAmount: number = 0.0;
    sum: number = 0.0;
    portal: string = "";
}