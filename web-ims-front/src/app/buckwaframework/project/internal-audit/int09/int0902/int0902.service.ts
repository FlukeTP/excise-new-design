import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DecimalFormat } from "helpers/decimalformat";
import { ComboBox } from 'models/combobox.model';
import { Observable } from "rxjs";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  UPLOAD_EXCEL: "ia/int062/uploadExcel"
};

declare var $: any;

@Injectable()
export class Int0902Service {
  fileExcel: File[];
  loading: boolean;
  fileExcel2: File[];
  dataExcel1: any = null;
  TypeSort: string;

  constructor(
    private router: Router,
    private ajax: AjaxService,
    private msg: MessageBarService
  ) { }

  dropdown = (type: string, id?: number): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      obs.next(this[type]);
    });
  };

  onUpload = (comboBoxID: number): Promise<any> => {
    /* SORT_BC = 1322 <--> SORT_DATE = 1323 */
    comboBoxID == 1322
      ? (this.TypeSort = "SORT_BC")
      : (this.TypeSort = "SORT_DATE");

    const form = $("#upload-form")[0];
    let formBody = new FormData(form);
    //Destroy tr
    document.getElementById("tdDataUpload").innerHTML = "<tr>" + "" + "</tr>";
    return new Promise<any>((resovle, reject) => {
      this.ajax.upload(
        URL.UPLOAD_EXCEL,
        formBody,
        res => {
          this.dataExcel1 = res.json();
          //call table
          this.showUploadTable(res.json());
          resovle("Upload Success!!");
        },
        error => {
          reject(error);
        }
      );
    });
  };

  compareTR(comboBoxId: number) {
    let idExcel1 = this.dataExcel1[0].cwpScwdDtl.cwpScwdHdrId;
    let idExcel2 = this.dataExcel1[0].cwpScwdDtl.idExcel2;
    let fileUploadID = this.dataExcel1[0].fileUploadID;
    this.router.navigate(["/int09/02/01"], {
      queryParams: {
        idExcel1: idExcel1,
        idExcel2: idExcel2,
        comboBoxId: comboBoxId,
        fileUploadID: fileUploadID
      }
    });
  }

  showUploadTable(data) {
    $("#showTable").show();
    /*--- initial variable ---*/
    let trData = "";
    let count = 0;
    let budgetCodeBefore = "";
    let totalWithdrawAmount = 0;
    let totalWithholdingTax = 0;
    let totalFines = 0;
    let totalFee = 0;
    let totalNetAmount = 0;
    let totalWithdrawalAmount = 0;
    let totalDiffWithdraw = 0;
    let totalReceivedAmount = 0;
    let totalDiffReceived = 0;
    /*--------------------------------------- */

    data.forEach(arr1 => {
      /*---- Choose Sort by Budget Code ----*/
      if (this.TypeSort == "SORT_BC") {
        //check to set value initial
        if (count == 0) {
          budgetCodeBefore = arr1.cwpScwdDtlList[0].budgetCode;
        }
        //check budgetCodeBefore
        if (count > 0) {
          if (budgetCodeBefore != arr1.cwpScwdDtlList[0].budgetCode) {
            trData +=
              "<tr class='bg-row-purple-highlight' style ='text-align: right'>" +
              "<td colspan='8'>" +
              "รวมทั้งรหัสงบประมาณ" +
              "</td>" +
              "<td>" +
              this.DF(totalWithdrawAmount) +
              "</td>" +
              "<td>" +
              this.DF(totalWithholdingTax) +
              "</td>" +
              "<td>" +
              this.DF(totalFines) +
              "</td>" +
              "<td>" +
              this.DF(totalFee) +
              "</td>" +
              "<td>" +
              this.DF(totalNetAmount) +
              "</td> " +
              "</tr>";

            //change budgetCode
            budgetCodeBefore = arr1.cwpScwdDtlList[0].budgetCode;
            //reset total
            totalWithdrawAmount = 0;
            totalWithholdingTax = 0;
            totalFines = 0;
            totalFee = 0;
            totalNetAmount = 0;
          }
        }
        //loop for cal table
        for (let i = 0; i < arr1.cwpScwdDtlList.length; i++) {
          //find total month
          totalWithdrawAmount += arr1.cwpScwdDtlList[i].withdrawAmount;
          totalWithholdingTax += arr1.cwpScwdDtlList[i].withholdingTax;
          totalFines += arr1.cwpScwdDtlList[i].fines;
          totalFee += arr1.cwpScwdDtlList[i].fee;
          totalNetAmount += arr1.cwpScwdDtlList[i].netAmount;

          //set value in tr
          trData +=
            "<tr>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].recordDateStr +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].postDateStr +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].typeCode +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].ducumentNumber +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].seller +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].bankAccount +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].referenceNo +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].budgetCode +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].withdrawAmount) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].withholdingTax) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].fines) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].fee) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].netAmount) +
            "</td> " +
            "</tr>";
        }
        //set value in tr total month
        trData +=
          "<tr class='bg-row-blue-highlight' style ='text-align: right'>" +
          "<td colspan='8'>" +
          "รวมเดือน" +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.withdrawAmount) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.withholdingTax) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.fines) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.fee) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.netAmount) +
          "</td> " +
          "</tr>";

        //last row * this.TypeSort == "SORT_BC" *
        if (count == data.length - 1) {
          trData +=
            "<tr class='bg-row-purple-highlight' style ='text-align: right'>" +
            "<td colspan='8'>" +
            "รวมทั้งรหัสงบประมาณ" +
            "</td>" +
            "<td>" +
            this.DF(totalWithdrawAmount) +
            "</td>" +
            "<td>" +
            this.DF(totalWithholdingTax) +
            "</td>" +
            "<td>" +
            this.DF(totalFines) +
            "</td>" +
            "<td>" +
            this.DF(totalFee) +
            "</td>" +
            "<td>" +
            this.DF(totalNetAmount) +
            "</td> " +
            "</tr>";
        }
      }

      /*---- Choose Sort by date ----*/
      if (this.TypeSort == "SORT_DATE") {
        //loop for cal table
        for (let i = 0; i < arr1.cwpScwdDtlList.length; i++) {
          //find total month
          totalWithdrawAmount += arr1.cwpScwdDtlList[i].withdrawAmount;
          totalWithholdingTax += arr1.cwpScwdDtlList[i].withholdingTax;
          totalFines += arr1.cwpScwdDtlList[i].fines;
          totalFee += arr1.cwpScwdDtlList[i].fee;
          totalNetAmount += arr1.cwpScwdDtlList[i].netAmount;
          totalWithdrawalAmount += arr1.cwpScwdDtlList[i].withdrawalAmount;
          totalDiffWithdraw += arr1.cwpScwdDtlList[i].diffWithdraw;
          totalReceivedAmount += arr1.cwpScwdDtlList[i].receivedAmount;
          totalDiffReceived += arr1.cwpScwdDtlList[i].diffReceived;

          //set value in tr
          trData +=
            "<tr>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].recordDateStr +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].postDateStr +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].typeCode +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].ducumentNumber +
            "</td>" +
            "<td style ='text-align: center'>" +
            (arr1.cwpScwdDtlList[i].refNum == null
              ? "-"
              : arr1.cwpScwdDtlList[i].refNum) +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].seller +
            "</td>" +
            "<td style ='text-align: center'>" +
            (arr1.cwpScwdDtlList[i].listName == null
              ? "-"
              : arr1.cwpScwdDtlList[i].listName) +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].bankAccount +
            "</td>" +
            "<td style ='text-align: center'>" +
            arr1.cwpScwdDtlList[i].referenceNo +
            "</td>" +
            "<td style ='text-align: right'>" +
            arr1.cwpScwdDtlList[i].budgetCode +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].withdrawAmount) +
            "</td>" +
            "<td style ='text-align: right'>" +
            (arr1.cwpScwdDtlList[i].withdrawalAmount == null
              ? "-"
              : this.DF(arr1.cwpScwdDtlList[i].withdrawalAmount)) +
            "</td>" +
            "<td style ='text-align: right'>" +
            (arr1.cwpScwdDtlList[i].diffWithdraw == null
              ? "-"
              : this.DF(arr1.cwpScwdDtlList[i].diffWithdraw)) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].withholdingTax) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].fines) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].fee) +
            "</td>" +
            "<td style ='text-align: right'>" +
            this.DF(arr1.cwpScwdDtlList[i].netAmount) +
            "</td> " +
            "<td style ='text-align: right'>" +
            (arr1.cwpScwdDtlList[i].receivedAmount == null
              ? "-"
              : this.DF(arr1.cwpScwdDtlList[i].receivedAmount)) +
            "</td>" +
            "<td style ='text-align: right'>" +
            (arr1.cwpScwdDtlList[i].diffReceived == null
              ? "-"
              : this.DF(arr1.cwpScwdDtlList[i].diffReceived)) +
            "</td>";
          //Info Payment
          if (arr1.cwpScwdDtlList[i].paymentInfoVoList == null) {
            trData += "<td style ='text-align: center'>";
            trData += "-";
            trData += "</td>";
          } else {
            trData += "<td style ='text-align: left'>";
            for (
              let j = 0;
              j < arr1.cwpScwdDtlList[i].paymentInfoVoList.length;
              j++
            ) {
              trData +=
                j +
                1 +
                ". " +
                arr1.cwpScwdDtlList[i].paymentInfoVoList[j].payee +
                " | ";
              trData +=
                arr1.cwpScwdDtlList[i].paymentInfoVoList[j].paymentMethod +
                " | ";
              trData +=
                arr1.cwpScwdDtlList[i].paymentInfoVoList[j].refPayment + " | ";
              trData +=
                this.DF(arr1.cwpScwdDtlList[i].paymentInfoVoList[j].amount) +
                "</br>";
            }
            trData += "</td>";
          }
          trData += "</tr>";
        }
        //set value in tr total month
        trData +=
          "<tr class='bg-row-blue-highlight' style ='text-align: right'>" +
          "<td colspan='10'>" +
          "รวมเดือน" +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.withdrawAmount) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.withdrawalAmount) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.totalDiffWithdraw) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.withholdingTax) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.fines) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.fee) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.netAmount) +
          "</td> " +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.receivedAmount) +
          "</td>" +
          "<td>" +
          this.DF(arr1.cwpScwdDtl.totalDiffReceived) +
          "</td>" +
          "<td colspan='2'>" +
          "</td>" +
          "</tr>";

        //result total month * this.TypeSort == "SORT_DATE" *
        if (count == data.length - 1) {
          trData +=
            "<tr class='bg-row-purple-highlight' style ='text-align: right'>" +
            "<td colspan='10'>" +
            "รวมทั้งหมด" +
            "</td>" +
            "<td>" +
            this.DF(totalWithdrawAmount) +
            "</td>" +
            "<td>" +
            this.DF(totalWithdrawalAmount) +
            "</td>" +
            "<td>" +
            this.DF(totalDiffWithdraw) +
            "</td>" +
            "<td>" +
            this.DF(totalWithholdingTax) +
            "</td>" +
            "<td>" +
            this.DF(totalFines) +
            "</td>" +
            "<td>" +
            this.DF(totalFee) +
            "</td>" +
            "<td>" +
            this.DF(totalNetAmount) +
            "</td> " +
            "<td>" +
            this.DF(totalReceivedAmount) +
            "</td>" +
            "<td>" +
            this.DF(totalDiffReceived) +
            "</td>" +
            "<td colspan='2'>" +
            "</td>" +
            "</tr>";
        }
      }
      count++;
    });
    //show data in table
    document.getElementById("tdDataUpload").innerHTML =
      "<tr>" + trData + "</tr>";
  }

  DF(what) {
    const df = new DecimalFormat("###,###.00");
    return df.format(what);
  }
}

class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}
