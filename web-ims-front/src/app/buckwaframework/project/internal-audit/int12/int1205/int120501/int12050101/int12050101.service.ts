import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AjaxService } from "services/ajax.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageBarService } from "services/message-bar.service";
import { Utils } from "helpers/utils";
import { ComboBox } from 'models/combobox.model';

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  SAVE: "ia/int0691/save",
  QEURY_SYS_BUDGET: "ia/int0691/queryBudgetList",
  QEURY_EDIT: "ia/int0691/queryByIdToEdit",
  UPDATE: "ia/int0691/update",
  COMBOBOX3: "ia/int0691/quryBudgetName",
  COMBOBOX4: "ia/int0691/getCtgBudget",
  COMBOBOX5: "ia/int0691/getListName"
};

declare var $: any;

@Injectable()
export class Int12050101Service {
  dataTable: any;
  datatable: any;
  showDatatable: any;
  budgetData: any;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    this.showDatatable = [];
  }

  dropdown = (
    type: string,
    id?: number,
    cb: Function = () => {}
  ): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      this.ajax
        .post(URL.DROPDOWN, DATA, res => {
          // const response = res.json();
          this[type] = res.json();
        })
        .then(() => {
          cb();
          obs.next(this[type]);
        });
    });
  };

  queryBudgetData = (): Observable<any> => {
    return new Observable<any>(obs => {
      this.ajax
        .post(URL.QEURY_SYS_BUDGET, {}, res => {
          this.budgetData = res.json();
        })
        .then(() => obs.next(this.budgetData));
    });
  };

  //combobox 3
  quryBudgetName = (): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      let combobox3 = null;
      this.ajax.post(URL.COMBOBOX3, {}, res => {
        combobox3 = res.json();
        resovle(combobox3);
      });
      // .then(() => obs.next(data));
    });
  };

  //combobox4
  getCtgBudget = (budgetId: number): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      let combobox4 = null;
      this.ajax.post(URL.COMBOBOX4, { budgetId: budgetId }, res => {
        console.log("combobox4: ", res.json());
        combobox4 = res.json();
        resovle(combobox4);
      });
    });
  };

  //combobox5
  getListName = (categoryId: number): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      let combobox5 = null;
      this.ajax.post(URL.COMBOBOX5, { categoryId: categoryId }, res => {
        console.log("combobox5: ", res.json());
        combobox5 = res.json();
        resovle(combobox5);
      });
    });
  };

  addData = (transferForm, flag: string, id?: number, cb?: Function) => {
    let dataFilter = this.budgetData.filter(
      obj => obj.listId == transferForm.subCtgBudget
    );

    let data = new TRANSFER();
    data.subCtgBudget = dataFilter[0].listName;
    data.ctgBudget = dataFilter[0].categoryName;
    data.budgetCode = dataFilter[0].listId;
    data.budget = dataFilter[0].budgetName;
    data.activities = transferForm.activities;
    data.amount = transferForm.amount;
    data.budgetType = transferForm.budgetType;
    data.descriptionList = transferForm.descriptionList;
    data.mofNum = transferForm.mofNum;
    data.note = transferForm.note;
    data.refDateStr = transferForm.refDate;
    data.refNum = transferForm.refNum;
    data.transferList = transferForm.transferList;

    if (flag === "SAVE") {
      this.showDatatable.push(data);
      cb(this.showDatatable);
      this.DATATABLE();
    } else {
      data.transferId = id;
      this.ajax.post(URL.UPDATE, data, res => {
        let msg = res.json();
        if (msg.messageType === "C") {
          this.msg.successModal(msg.messageTh);
          this.clearData();
        } else {
          this.msg.errorModal(msg.messageTh);
        }
      });
    }
  };

  saveDatatable = () => {
    this.ajax.post(URL.SAVE, JSON.stringify(this.showDatatable), res => {
      let msg = res.json();
      if (msg.messageType === "C") {
        this.msg.successModal(msg.messageTh);
        setTimeout(() => {
          this.router.navigate(["int06/9"], {
            queryParams: {}
          });
        }, 300);
      } else {
        this.msg.errorModal(msg.messageTh);
      }
    });
  };

  clearData() {
    this.showDatatable = [];
    this.router.navigate(["/int12/05/01"], {
      queryParams: {}
    });
  }

  queryByIdToEdit = (id: number): Promise<any> => {
    return new Promise<any>((resovle, reject) => {
      // let data = null;
      this.ajax.post(URL.QEURY_EDIT, { transferId: id }, res => {
        const data = res.json();
        resovle(data);
        //set data on edit
        // this.setDataEdit(data);
      });
    });
  };

  DATATABLE(): void {
    if (this.datatable != null || this.datatable != undefined) {
      this.datatable.destroy();
    }

    this.datatable = $("#datatable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      pageLength: 10,
      processing: true,
      serverSide: false,
      paging: true,
      data: this.showDatatable,
      columns: [
        {},
        { data: "mofNum" },
        { data: "refNum" },
        { data: "refDateStr" },
        { data: "transferList" },
        { data: "budgetType" },
        { data: "budgetCode" },
        { data: "activities" },
        { data: "budget" },
        { data: "ctgBudget" },
        { data: "subCtgBudget" },
        { data: "descriptionList" },
        {
          data: "amount",
          className: "ui right aligned",
          render: function(data) {
            return Utils.moneyFormat(data);
          }
        },
        { data: "note" }
      ],
      columnDefs: [
        {
          targets: [0],
          className: "center aligned",
          render: function(data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        }
        // { targets: [2, 3, 4, 5], className: "right aligned" },
        // { targets: [1], className: "left aligned" },
        // {
        //   targets: [2, 3, 4, 5],
        //   render: $.fn.dataTable.render.number(",", ".", 2, "")
        // }
      ]
    });
  }
}

class TRANSFER {
  transferId: number;
  mofNum: string = null;
  refNum: string = null;
  refDateStr: any = null;
  transferList: string = null;
  budgetType: string = null;
  budgetCode: string = null;
  activities: string = null;
  budget: string = null;
  ctgBudget: string = null;
  subCtgBudget: string = null;
  descriptionList: string = null;
  amount: number = 0;
  note: string = null;
}
