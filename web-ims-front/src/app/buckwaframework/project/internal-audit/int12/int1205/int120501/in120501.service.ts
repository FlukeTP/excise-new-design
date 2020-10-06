import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AjaxService } from "services/ajax.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Utils } from "helpers/utils";
import { MessageBarService } from 'services/message-bar.service';
import { ComboBox } from 'models/combobox.model';

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  FILTER: AjaxService.CONTEXT_PATH + "/ia/int069/filter",
  DELETE: "/ia/int069/delete"
};

declare var $: any;

@Injectable()
export class Int120501Service {
  dataTable: any;
  response: any;
  datatable: any;
  dataFilter: any;

  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService
  ) {
    // TODO
  }

  dropdown = (type: string, id?: number): Observable<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return new Observable<ComboBox[]>(obs => {
      this.ajax
        .post(URL.DROPDOWN, DATA, res => {
          // const response = res.json();
          this[type] = res.json();
        })
        .then(() => obs.next(this[type]));
    });
  };

  filterDropdrown(DATA) {
    this.dataFilter = DATA;
    this.DATATABLE();
  }

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
      ajax: {
        type: "POST",
        url: URL.FILTER,
        data: this.dataFilter
      },
      columns: [
        {},
        { data: "mofNum", className: "center aligned" },
        { data: "refNum" , className: "center aligned"},
        { data: "refDateStr" , className: "center aligned"},
        { data: "transferList" },
        { data: "budgetType" },
        { data: "budgetCode" , className: "center aligned"},
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
        { data: "note" },
        {
          render: function() {
            return (
              '<button type="button" class="ui mini button yellow edit"><i class="edit icon"></i>แก้ไข</button>' +
              '<button type="button" class="ui mini button red del"><i class="trash alternate icon"></i>ลบ</button>'
            );
          }
        }
      ],
      columnDefs: [
        {
          targets: [0,14],
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
      ],
      rowCallback: (row, data, index) => {
        $("td > .edit", row).bind("click", () => {
          this.router.navigate(["/int12/05/01/01"], {
            queryParams: {
              transferId: data.transferId,
              flag: "EDIT"
            }
          });
        });

        $("td > .del", row).bind("click", () => {
          this.ajax.post(URL.DELETE, { transferId: data.transferId }, res => {
            let msg = res.json();
          });

          this.DATATABLE();
        });

      }
    });
  }

  // getDataExcel
  getDataExcel(){
    let dataList = this.datatable.data();   
    let dataArray = [];
   for(let i=0;i<dataList.length;i++){
       dataArray.push(dataList[i]);
   }
   return dataArray
}


}
