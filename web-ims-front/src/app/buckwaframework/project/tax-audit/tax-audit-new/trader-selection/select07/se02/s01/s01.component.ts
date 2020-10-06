import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { File } from 'models/file.model';
import { MessageService } from 'services/message.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

const URL = {
  SEARCH: AjaxService.CONTEXT_PATH + "ta/product-paper/list-product-paper-input-material",
  EXPORT:"ta/product-paper/export-product-paper-input-material",
  UPLOAD:"ta/product-paper/upload-product-paper-input-material"
}

@Component({
  selector: 'app-s01',
  templateUrl: './s01.component.html',
  styleUrls: ['./s01.component.css']
})
export class S01Component {

  hideResult: boolean = false;
  hideUpload: boolean = false;
  formGroup: FormGroup;
  table: any;
  formVo: FormVo;
  file: File[];

  dataList: Data[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.formVo = {
      startDate: '',
      endDate: ''
    }
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      exciseId: [''],
      userTaxNuber: [''],
      operator: [''],
      analysisNumber: [''],
      type: [''],
      coordinates: [''],
      startDate: [''],
      endDate: ['']
    })
  }


  search = (e) => {
    if (e.startDate || e.stopDate) {
      this.hideResult = true;
      console.log("serach : ", e)
      this.formVo = e;
      console.log("formVo : ", this.formVo);
      setTimeout(() => {
        this.dataTable();
      }, 100);
    }else{
      this.hideResult = false;
    }
  }

  uploadTemplate = (e) => {
    console.log(e)
    this.hideUpload = true;
  }
  clear = (e) => {
    console.log(e)
    this.hideResult = false;
  }

  exportFile=()=>{
    this.ajax.download(URL.EXPORT);
  }


  onUpload = (event: any) => {
    //this.loading = true;

    if ($('#file').val() == "") {
      this.messageBar.successModal("กรุณาเลือกไฟล์ที่จะอัพโหลด")
      return
    }else{
      event.preventDefault();
      this.dataList = [];
      console.log("อัพโหลด Excel");
      const form = $("#upload-form")[0];
      let formBody = new FormData(form);

      this.ajax.upload(
        URL.UPLOAD,formBody, res => {
        console.log(res.json());
  
      
          // res.json().forEach(element => {
          //    this.dataList.push(element);
          // });
  
         // this.initDatatable();
          
          // setTimeout(() => {
          //   this.loading = false;
          // }, 1000);    
        }
      )

    }
  }

  onChangeUpload = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        const f = {
          name: event.target.files[0].name,
          type: event.target.files[0].type,
          value: e.target.result
        };
        this.file = [f];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };


  

  dataTable() {

    if (this.table != null) {
      this.table.destroy();
    }
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      //pageLength: 2,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.SEARCH,
        contentType: "application/json",
        data: (d) => {
          return JSON.stringify($.extend({}, d, {
            "startDate": this.formVo.startDate,
            "endDate": this.formVo.endDate
          }));
        }
      },
      columns: [
        {
          render: function (data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          },
          className: "text-center"
        }, {
          data: "materialDesc", className: "text-left"
        }, {
          data: "inputMaterialQty", className: "text-center"
        }, {
          data: "dailyAccountQty", className: "text-center"
        }, {
          data: "monthStatementQty", className: "text-right"
        }, {
          data: "externalDataQty", className: "text-right"
        }, {
          data: "maxDiffQty", className: "text-right"
        }
      ],
    });

  }


}
interface FormVo {
  startDate: string;
  endDate: string;
}



class Data {
  list: any = '';
  invoices: any = '';
  dailyAccount: any = '';
  monthStatement: any = '';
  externalData: any = '';
  maxDiff: any = '';
}
