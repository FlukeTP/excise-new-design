import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';

@Component({
  selector: 'app-page-component',
  templateUrl: './page-component.component.html',
  styleUrls: ['./page-component.component.css']
})
export class PageComponentComponent implements OnInit {

  constructor() { }

  copied: boolean = false;
  breadcrumb: BreadCrumb[] = [
    { label: 'components', route: '#' }
  ];

  btn = `
  Ts : import ButtonModule

  Html :
  <app-button-back></app-button-back>
  <app-button-add></app-button-add>
  <app-button-cancel></app-button-cancel>
  <app-button-check></app-button-check>
  <app-button-clear></app-button-clear>
  <app-button-confirm></app-button-confirm>
  <app-button-delete></app-button-delete>
  <app-button-detail></app-button-detail>
  <app-button-edit></app-button-edit>
  <app-button-export></app-button-export>
  <app-button-home></app-button-home>
  <app-button-save></app-button-save>
  <app-button-search></app-button-search>
  <app-button-upload></app-button-upload>
  <app-button-download></app-button-download>


  Button custom :
  <app-button-custom color="primary" icon="check icon" text="Button Custom !!"></app-button-custom>
  `

  loading: boolean = true;
  sagment = `
    Ts : import SegmentModule

    Html : 
    <segment header="Header Sagment" [loading]="true || false">
       content here
    </segment>
  `

  dataTableTxt = `
  tablePlan = () => {
    this.table = $("#tableDetail").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      data: this.datas,
      columns: [
        {
          data: "data1", className: "text-left"
        }, {
          data: "data2", className: "text-right"
        }, {
          data: "data3", className: "text-right"
        }, {
          data: "data4", className: "text-right"
        }, {
          data: "data5", className: "text-right"
        }, {
          data: "data6", className: "text-right"
        }, {
          data: "data7", className: "text-right"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += \`<button class="ui mini yellow button edit" type="button">
                      <i class="edit icon"></i>
                      แก้ไข
                    </button>
                    <button class="ui mini primary button detail" type="button">
                      <i class="eye icon"></i>
                      รายละเอียด
                    </button>
                    \`;
            return btn;
          }
        }
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.edit();

    });
    this.table.on("click", "td > button.detail", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.route.navigate(['/tax-audit-new/select16/se01'])
    });
  }
  `;
  dataTableTxtAjax = `
  tablePlan = () => {
    this.table = $("#tableDetail").DataTableTh({
      processing: true,
      serverSide: false,
      paging: false,
      scrollX: true,
      ajax: {
        type: "POST",
        url: ====>URL,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "exciseId": this.exciseId,
            "exciseName": this.exciseName,
            "searchFlag": this.searchFlag
          }));
        }
      },
      columns: [
        {
          data: "data1", className: "text-left"
        }, {
          data: "data2", className: "text-right"
        }, {
          data: "data3", className: "text-right"
        }, {
          data: "data4", className: "text-right"
        }, {
          data: "data5", className: "text-right"
        }, {
          data: "data6", className: "text-right"
        }, {
          data: "data7", className: "text-right"
        }, {
          render: function (data, type, full, meta) {
            let btn = '';
            btn += \`<button class="ui mini yellow button edit" type="button">
                      <i class="edit icon"></i>
                      แก้ไข
                    </button>
                    <button class="ui mini primary button detail" type="button">
                      <i class="eye icon"></i>
                      รายละเอียด
                    </button>
                    \`;
            return btn;
          }
        }
      ],
    });

    this.table.on("click", "td > button.edit", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.edit();

    });
    this.table.on("click", "td > button.detail", (event) => {
      var data = this.table.row($(event.currentTarget).closest("tr")).data();
      console.log(data);
      this.route.navigate(['/tax-audit-new/select16/se01'])
    });
  }
  `;
  ngOnInit() { }

  copyToClipboard = type => {
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
    const el = document.createElement('textarea');
    el.value = this.switchItem(type);
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  switchItem(type: string) {
    switch (type) {
      case 'btn-back':
        return `<app-button-back></app-button-back>`;
      case 'btn-add':
        return `<app-button-add></app-button-add>`;
      case 'btn-cancel':
        return `<app-button-cancel></app-button-cancel>`;
      case 'btn-check':
        return `<app-button-check></app-button-check>`;
      case 'btn-clear':
        return `<app-button-clear></app-button-clear>`;
      case 'btn-confirm':
        return `<app-button-confirm></app-button-confirm>`;
      case 'btn-delete':
        return `<app-button-delete></app-button-delete>`;
      case 'btn-detail':
        return `<app-button-detail></app-button-detail>`;
      case 'btn-edit':
        return `<app-button-edit></app-button-edit>`;
      case 'btn-export':
        return `<app-button-export></app-button-export>`;
      case 'btn-home':
        return `<app-button-home></app-button-home>`;
      case 'btn-save':
        return `<app-button-save></app-button-save>`;
      case 'btn-search':
        return `<app-button-search></app-button-search>`;
      case 'btn-upload':
        return `<app-button-upload></app-button-upload>`;
      case 'btn-custom':
        return `<app-button-custom color="primary" icon="check icon" text="Button Custom !!"></app-button-custom>`;
      case 'segment':
        return `
          <segment header="Header Sagment" [loading]="false">
            content here
          </segment>
        `;
      case 'form':
        return this.form;
      default:
        return ``;
    }
  }

  form: string = `
    <div form>
      <div inline>
        <div field [col]="6">
          <div class="ui input custom-readonly">
            <input type="text" readonly value="Username">
          </div>
        </div>
        <div field [col]="10">
          <div class="ui input">
            <input type="text">
          </div>
        </div>
      </div>
      <div inline>
        <div field [col]="6">
          <div class="ui input custom-readonly">
            <input type="text" readonly value="Password">
          </div>
        </div>
        <div field [col]="10">
          <div class="ui input">
            <input type="password">
          </div>
        </div>
      </div>
      <div inline [center]="true">
        <app-button-custom text="Login"></app-button-custom>
        <app-button-custom text="Register"></app-button-custom>
      </div>
    </div>
  `;

  column: string[] = [
    `<div [column]="0"></div>`,
    `<div [column]="1"></div>`,
    `<div [column]="2"></div>`,
    `<div [column]="3"></div>`,
    `<div [column]="4"></div>`,
    `<div [column]="5"></div>`,
    `<div [column]="6"></div>`,
    `<div [column]="7"></div>`,
    `<div [column]="8"></div>`,
    `<div [column]="9"></div>`,
    `<div [column]="10"></div>`,
    `<div [column]="11"></div>`,
    `<div [column]="12"></div>`,
    `<div [column]="13"></div>`,
    `<div [column]="14"></div>`,
    `<div [column]="15"></div>`,
    `<div [column]="16"></div>`,
  ];

}
