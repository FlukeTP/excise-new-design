import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'models/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { Router, Data } from '@angular/router';
import { timeout } from 'q';
declare var $: any;

const URL = {
  LIST: AjaxService.CONTEXT_PATH + "ta/create-paper-service/list-quantityService",
  EXPORT:"ta/create-paper-service/exportFileQuantityServiceVo",
  UPLOAD:"ta/create-paper-service/uploedFileQuantityServiceVo"
}
@Component({
  selector: 'app-s01',
  templateUrl: './s01.component.html',
  styleUrls: ['./s01.component.css']
})
export class S01Component implements OnInit {
  breadcrumb: BreadCrumb[];
  file: File[];
  // del: any;
  // dataEdit: Data;
  //Data Upload
  dataList: Data[] = [];
  
  dataCheckList: Data[] = [];
  // dataTable
  datatable: any;
  datatableCheck: any;


  view1: any;
  view2: any;

  loading: boolean = false;
  startDate:any="";
  endDate:any="";
  startDateTM:any;
  endDateTM:any;
  int084VoList:any=[];
  idHead:any;
  hideResult: boolean = false;
  hideUpload: boolean = false;
  searchForm: FormGroup;
  showTable: boolean = false;
  table: any;
  formVo :FormVo;
  formGroup: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private ajax: AjaxService, private messageBar: MessageBarService,
     private router: Router,
     
  ) { 
    this.formVo = {
      startDate: '',
      endDate: ''
    }
  }
  search = (e) => {
    if (e.startDate || e.stopDate) {
      this.hideResult = true;
      console.log("serach : ", e)
      console.log(e.startDate)
      console.log(e.endDate)
      this.formVo = e;
      console.log("formVo : ", this.formVo);
      setTimeout(() => {
        this.dataTable();
      }, 100);
    }else{
      this.hideResult = false;
    }

  }

 

  clear = (e) => {
    console.log(e)
    this.hideResult = false;
  }
  uploadTemplate = (e) => {
    console.log(e)
    this.hideUpload = true;
  
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

  dataTable = () => {
  
    this.table = $("#dataTable").DataTableTh({
      lengthChange: true,
      searching: false,
      ordering: false,
      processing: true,
      serverSide: true,
      // pageLength: 3,
      paging: true,
      ajax: {
        type: "POST",
        url: URL.LIST,
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
          data: "goodsDesc", className: "text-center"
        
        }
        , {
          data: "serviceDocNo", className: "text-right"
        }, {
          data: "incomeDailyAccountAmt", className: "text-right"
        }, {
          data: "paymentDocNo", className: "text-right"
        }, {
          data: "auditAmt", className: "text-right"
        }, {
          data: "taxAmt", className: "text-right"
        }, {
          data: "diffAmt", className: "text-right"
        },
    
      ],
    });


  }
  
  exportFile=()=>{
    this.ajax.download(URL.EXPORT);
  }

  
  onUpload = (event: any) => {
    //this.loading = true;
    
    event.preventDefault();
   // this.dataList = [];
    console.log("อัพโหลด Excel");
    const form = $("#upload-form")[0];
    let formBody = new FormData(form);

    this.ajax.upload(
      URL.UPLOAD,formBody, res => {
      console.log(res.json());
    
      }
    )
  };

}
interface FormVo {
  startDate: string;
  endDate: string;
}
class File {
  [x: string]: any;
  name: string;
  type: string;
  value: any;
}