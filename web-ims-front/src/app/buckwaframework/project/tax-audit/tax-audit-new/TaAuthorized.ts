export class TaAuthorized {
    roleHead: string = 'ROLE_TA_HEAD';
    roleOperator: string = 'ROLE_TA_OPERATOR';
    roleSelect: string = 'ROLE_TA_SELECT';
}

export class TaUtils {

    public static isCentral(officeCode) {
        return this.isValidOfficeCode(officeCode) && ("00" === officeCode.substring(0, 2));
    }

    public static isSector(officeCode) {
        return this.isValidOfficeCode(officeCode) && ("00" !== officeCode.substring(0, 2)) && ("0000" === officeCode.substring(2, 6));
    }

    public static isArea(officeCode) {
        return this.isValidOfficeCode(officeCode) && ("00" !== officeCode.substring(0, 2)) && ("00" !== officeCode.substring(2, 4)) && ("00" === officeCode.substring(4, 6));
    }

    public static isValidOfficeCode(officeCode: string) {
        return officeCode != "" && officeCode.length == 6;
    }
}