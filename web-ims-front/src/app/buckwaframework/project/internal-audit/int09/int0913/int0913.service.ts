import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AjaxService } from "services/ajax.service";
import { ComboBox } from "./../../../../common/models/combobox.model";

const URL = {
  DROPDOWN: "combobox/controller/getDropByTypeAndParentId",
  FILTER: AjaxService.CONTEXT_PATH + "/ia/int067/filter"
};

declare var $: any;

@Injectable()
export class Int0913Service {
  combobox1: ComboBox[] = [];
  combobox2: ComboBox[] = [];
  combobox3: ComboBox[] = [];
  dataTable: any;
  dataFilter: {
    exciseDepartment: string;
    exciseRegion: string;
    exciseDistrict: string;
    budgetYear: string;
  };

  constructor(private ajax: AjaxService) {
    // TODO
  }

  dropdown = (type: string, combo: string, id?: number): Promise<any> => {
    const DATA = { type: type, lovIdMaster: id || null };
    return this.ajax.post(URL.DROPDOWN, DATA, res => {
      this[combo] = res.json();
    });
  };

  findByFilter = (
    combo1: string,
    combo2: string,
    combo3: string,
    year: string
  ) => {
    //set data
    this.dataFilter = {
      exciseDepartment: combo1,
      exciseRegion: combo2,
      exciseDistrict: combo3,
      budgetYear: year
    };
    this.DATATABLE();
  };

  // findById = (id: number, combo: string) => {
  //   return this[combo].find(obj => obj.lovId == id);
  // };

  pullComboBox = (
    type: string,
    combo: string,
    id?: number
  ): Observable<ComboBox[]> => {
    return new Observable<ComboBox[]>(obs => {
      this.dropdown(type, combo, id).then(() => obs.next(this[combo]));
    });
  };

  DATATABLE(): void {
    if (this.dataTable != null && this.dataTable != undefined) {
      this.dataTable.destroy();
    }

    this.dataTable = $("#dataTable").DataTableTh({
      lengthChange: false,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: false,
      paging: true,
      pageLength: 10,
      ajax: {
        type: "POST",
        url: URL.FILTER,
        data: this.dataFilter
      },

      columns: [
        {
          render: function(data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "center"
        },
        {
          data: "publicUtilityType",
          className: "left"
        },
        {
          data: "monthInvoice",
          className: "center"
        },
        {
          data: "invoiceNumber",
          className: "right"
        },
        {
          data: "invoiceDate",
          className: "center"
        },
        {
          data: "withdrawalNumber",
          className: "right"
        },
        {
          data: "withdrawalDate",
          className: "center"
        },
        {
          data: "amount",
          render: $.fn.dataTable.render.number(",", ".", 2, ""),
          className: "right"
        }
      ]
    });
  }
}
