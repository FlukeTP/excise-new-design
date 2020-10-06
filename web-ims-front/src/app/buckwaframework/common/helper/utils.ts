import { DecimalFormat } from "helpers/decimalformat";

export class Utils {
  public static isNull(obj) {
    return obj === null || obj === undefined || obj === "";
  }

  public static isNotNull(obj) {
    return obj !== null && obj !== undefined && obj !== "";
  }

  public static moneyFormat(money) {
    // console.log(money);
    money == null || money == "" || money == "null" ? 0 : money;
    var op = "";
    var moneyP = parseFloat(money);
    if (moneyP < 0) {
      // money = money.substring(1);
      money *= -1;
      op = "-";
    }

    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
      // the default value for minimumFractionDigits depends on the currency
      // and is usually already 2
    });
    var result = formatter.format(money).substring(1);
    return op == "-" ? op + result : result;
  }
  public static moneyFormatDecimal(money) {
    if (money == null || money == "") money = 0;
    var df = new DecimalFormat("###,###.00");
    return df.format(money);
  }

  public static moneyFormatInt(money) {
    if (money == null || money == "") money = 0;
    var df = new DecimalFormat("###,###");
    return df.format(money);
  }

  //type number (1, 2, 3, 4, 5, 6, 7, 8, 9, 0, - , . )
  // ** must use (keypress) on html **
  public static onlyNumber(e) {
    return (
      e.charCode == 45 ||
      e.charCode == 46 ||
      (e.charCode >= 48 && e.charCode <= 57)
    );
  }

  //number to thai text
  public static thaiBaht(money) {
    const ThaiBaht = require("thai-baht-text"); // for ES5
    return ThaiBaht(money);
  }
}
