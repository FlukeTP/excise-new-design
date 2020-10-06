import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { Observable } from "rxjs";
import { DecimalFormat } from "helpers/decimalformat";

const URL = {
  QUERY_BUDGET_CODE: "ia/int0621/budgetCodeList",
  DROPDOWN: "ia/int0621/dropdownT",
  COMPARE_EXCEL: "ia/int0621/compareExcel"
};

declare var $: any;
@Injectable()
export class Int090201Service {
  budgetCodeList: any;

  constructor(private ajax: AjaxService, private msg: MessageBarService) {}

  getBudgetCode = (id: number): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      this.ajax.post(
        URL.QUERY_BUDGET_CODE,
        { cwpScwdHdrId: id },
        res => {
          this.budgetCodeList = res.json();
          resovle(res.json());
        },
        error => {
          reject(error);
        }
      );
    });
  };

  getDropdownT = (id: number): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      this.ajax.post(
        URL.DROPDOWN,
        { cwpTblHdrId: id },
        res => {
          resovle(res.json());
        },
        error => {
          reject(error);
        }
      );
    });
  };

  compareDataExcel = (e: any): Promise<any> => {
    e.preventDefault();
    let DATA = [];
    for (let i = 0; i < this.budgetCodeList.length; i++) {
      DATA.push({
        cwpScwdHdrId: this.budgetCodeList[i].cwpScwdHdrId,
        budgetCode: e.target["budgetCode" + i].value,
        cwpTblDtlId: $("#TR" + i).dropdown("get value")
      });
    }

    return new Promise<any>((resovle, reject) => {
      this.ajax.post(
        URL.COMPARE_EXCEL,
        DATA,
        res => {
          let dataCompare = res.json();
          $("#Int0621").show();
          let trData = "";

          for (let i = 0; i < dataCompare.length; i++) {
            for (let j = 0; j < dataCompare[i].cwpTblDtlList.length; j++) {
              //set value in tr
              trData += "<tr>";
              trData += "<td style ='text-align: right'>";
              trData += j == 0 ? dataCompare[i].budgetCode : "";
              trData += "</td>";
              trData += "<td style ='text-align: left'>";
              trData += j == 0 ? dataCompare[i].budgetName : "";
              trData += "</td>";
              trData += "<td style ='text-align: right'>";
              trData += j == 0 ? this.DF(dataCompare[i].netAmount) : "";
              trData += "</td>";
              trData +=
                "<td style ='text-align: left'>" +
                dataCompare[i].cwpTblDtlList[j].ledgerAccountName +
                "</td>" +
                "<td style ='text-align: right'>" +
                this.DF(dataCompare[i].cwpTblDtlList[j].carryForward) +
                "</td>" +
                "<td style ='text-align: right'>";
              trData +=
                dataCompare[i].cwpTblDtlList[j].diff == null
                  ? "-"
                  : this.DF(dataCompare[i].cwpTblDtlList[j].diff);
              trData += "</td>";
              trData += "</tr>";
            }
          }
          //show data in table
          document.getElementById("tdDataCompare").innerHTML =
            "<tr>" + trData + "</tr>";

          resovle(res.json());
        },
        error => {
          reject(error);
        }
      );
    });
  };

  DF(what) {
    const df = new DecimalFormat("###,###.00");
    return df.format(what);
  }
}
