import { Injectable } from "@angular/core";
import { AjaxService } from "services/ajax.service";
import { MessageBarService } from "services/message-bar.service";
import { promise } from "protractor";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

const URL = {
  UPLOAD_EXCEL: "/ia/int071/upload",
  SAVE: "/ia/int071/save",
  DATATABLE: "/ia/int072/datatable"
};

declare var $: any;

@Injectable()
export class Int0801Service {
  fileExcel: File[];
  datatable: any;
  dataReadExcel: any;
  loading: boolean = false;
  loadingTable: boolean = false;
  checkSave: boolean = false;
  resData: any;
  verifyAccountHeaderId: any;
  checkLastRow: any;

  constructor(
    private ajax: AjaxService,
    private msg: MessageBarService,
    private router: Router
  ) {
    // TODO
  }

  async onInitDataTable(): Promise<any> {
    let promise = await new Promise((resolve, reject) => {
      // this.verifyAccountHeaderId = id;
      setTimeout(() => {
        resolve(this.checkLastRow);
      }, 500);
    });
    return promise;
  }

  onChangeUpload = (event: any, loadingTable: Function) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.fileExcel = [f];
        console.log(this.fileExcel);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    setTimeout(() => {
      this.loading = false;
      loadingTable(this.loading);
    }, 1000);
  };

  onUpload = (event: any, loadingTable: Function) => {
    event.preventDefault();

    console.log("UPLOAD Excel!!!!!!");
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);

    this.ajax.upload(URL.UPLOAD_EXCEL, formBody, res => {
      this.dataReadExcel = res.json().data;
      this.loadingTable = false;
      this.verifyAccountHeaderId = this.dataReadExcel[0].verifyAccountHeaderId;

      setTimeout(() => {
        loadingTable(this.loadingTable);
      }, 700);
    });
  };

  async saveData(loadingToSave: Function, statusSave: Function) {
    let DATA = [];
    await this.dataReadExcel.forEach(ex => {
      let obj = new verifyAccountDtl();
      obj.verifyAccountHeaderId = ex.verifyAccountHeaderId;
      obj.ledgerAccountNumber = ex.colum0;
      obj.ledgerAccountName = ex.colum2;
      obj.bringForward = ex.colum4;
      obj.carryForward = ex.colum9;
      obj.debit = ex.colum7;
      obj.credit = ex.colum8;

      DATA.push(obj);
    });

    await this.ajax.post(URL.SAVE, DATA, async res => {
      const msg = res.json();
      console.log("msg: ", msg);
      if (msg.messageType === "C") {
        // await this.msg.successModal(msg.messageTh);
        this.checkSave = true;
        await statusSave(this.checkSave);
        this.loadingTable = false;
        await loadingToSave(this.loadingTable);
      } else {
        // await this.msg.errorModal(msg.messageTh);
        this.loadingTable = false;
        await loadingToSave(this.loadingTable);
      }
    });
    // await this.initDatatable();
  }

  // onCheck = () => {
  //   this.router.navigate(["/int07/2"], {
  //     queryParams: {
  //       verifyAccountHeaderId: this.dataReadExcel[0].verifyAccountHeaderId
  //     }
  //   });
  // };

  initDatatable = () => {
    if (this.datatable != null || this.datatable != undefined) {
      this.datatable.destroy();
    }

    this.resData = [];
    // this.verifyAccountHeaderId
    let DATA = { verifyAccountHeaderId: this.verifyAccountHeaderId };
    this.ajax.post(URL.DATATABLE, DATA, async res => {
      const datatable = await res.json();
      this.resData = datatable.data;

      this.checkLastRow = {
        ledgerAccountNumber: "",
        ledgerAccountName: "ผลรวม",
        bringForward: 0.0,
        debit: 0,
        credit: 0,
        carryForward: 0.0,
        loadingTable: false
      };
      //count total result
      await this.resData.forEach(obj => {
        this.checkLastRow.debit += obj.debit;
        this.checkLastRow.credit += obj.credit;
      });

      this.datatable = $("#dataTableExcel").DataTableTh({
        lengthChange: false,
        searching: false,
        ordering: false,
        pageLength: 10,
        processing: true,
        serverSide: false,
        paging: false,
        data: this.resData,
        columns: [
          { data: "ledgerAccountNumber" },
          { data: "ledgerAccountName" },
          { data: "bringForward" },
          { data: "debit" },
          { data: "credit" },
          { data: "carryForward" }
        ],
        columnDefs: [
          { targets: [0], className: "center aligned" },
          { targets: [2, 3, 4, 5], className: "right aligned" },
          { targets: [1], className: "left aligned" },
          {
            targets: [2, 3, 4, 5],
            render: $.fn.dataTable.render.number(",", ".", 2, "")
          }
        ],
        rowCallback: (row, data, index) => {
          if (data.ledgerAccountName === "ผลรวม") {
            $(row).css("background-color", "#cce2ff");
          }

          //check condition
          let ledgerAccountNumber = data.ledgerAccountNumber;
          let checkId = data.ledgerAccountNumber.charAt(0);
          let debit = data.debit;
          let credit = data.credit;
          let carryForward = data.carryForward; //ยกยอดไป

          //check group 1
          //check number(+, -)
          if (checkId == 1 || checkId == 5) {
            //debit must be number +
            if (debit < 0) {
              $(row).addClass("bg-c-red");
            }
          }
          if (checkId == 2 || checkId == 3 || checkId == 4) {
            //credit must be number -
            if (credit > 0) {
              $(row).addClass("bg-c-red");
            }
          }

          //check group 2
          if (
            ledgerAccountNumber == 1101010110 ||
            ledgerAccountNumber == 1101010112 ||
            ledgerAccountNumber == 1101010113 ||
            ledgerAccountNumber == 2101020106 ||
            ledgerAccountNumber == 2102040103 ||
            ledgerAccountNumber == 2102040104 ||
            ledgerAccountNumber == 5301010101 ||
            ledgerAccountNumber == 5301010103 ||
            ledgerAccountNumber == 5210010111 ||
            ledgerAccountNumber == 5210010112 ||
            ledgerAccountNumber == 5210010114
          ) {
            //carryForward == 0 only
            if (carryForward != 0) {
              // $(row).addClass("negative");
              $(row).addClass("bg-c-red");
            }
          }

          //check group 3
          if (
            ledgerAccountNumber == 1205010103 ||
            ledgerAccountNumber == 1205020103 ||
            ledgerAccountNumber == 1205040103
          ) {
            //carryForward must be number -
            if (carryForward > 0) {
              $(row).addClass("bg-c-red");
            }
          }

          if (
            ledgerAccountNumber == 4104010101 ||
            ledgerAccountNumber == 4104010104
          ) {
            //debit must be number +
            if (debit < 0) {
              $(row).addClass("bg-c-red");
            }
          }

          if (
            ledgerAccountNumber == 3101010101 ||
            ledgerAccountNumber == 3102010101
          ) {
            //debit must be number + or -
            $(row).addClass("");
          }
        }
      });
    });
  }

  clearDataTable() {
    if (this.datatable != null || this.datatable != undefined) {
      this.datatable.clear().draw();
    }
  }
}

class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}

class verifyAccountDtl {
  [x: string]: any;
  verifyAccountHeaderId: number;
  ledgerAccountName: string;
  ledgerAccountNumber: string;
  bringForward: number;
  carryForward: number;
  credit: number;
  debit: number;
}
