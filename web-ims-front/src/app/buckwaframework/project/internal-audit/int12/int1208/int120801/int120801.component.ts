import { Component, OnInit } from '@angular/core';
import { Int120801Service } from './int120801.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadCrumb, ResponseData } from 'models/index';
import { AuthService } from 'services/auth.service';
import { IaService } from 'services/ia.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { AjaxService } from 'services/ajax.service';
import { MessageBarService } from 'services/message-bar.service';
import { MessageService } from 'services/message.service';


declare var $: any;

const URL = {
    // export: "ia/int120101/exportFile",
    // DATATABLE: AjaxService.CONTEXT_PATH + 'ia/int120101/findAll',
    DROPDOWN_UTILITY: "ia/int120801/get-utility-type",
  }

@Component({
    selector: 'app-int120801',
    templateUrl: './int120801.component.html',
    styleUrls: ['./int120801.component.css'],
    providers: [Int120801Service]
})
export class Int120801Component implements OnInit {
    breadcrumb: BreadCrumb[] = [
        { label: "ตรวจสอบภายใน", route: "#" },
        { label: "บันทึกข้อมูล", route: "#" },
        { label: "ข้อมูลค่าสาธารณูปโภค", route: "#" },
    ];
    yearList: any;
    model: FormSearch;
    data: Data;
    utilityTypeList: any;
    formSave: FormGroup
    constructor(
        private Int120801Service: Int120801Service,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private iaService: IaService,
        private fb: FormBuilder,
        private ajax: AjaxService,
        private message: MessageBarService,
    ) {
        this.model = new FormSearch();
        this.data = new Data();
        this.formSave = this.fb.group({
            utilityType: [''],
            invoiceNum: [''],
            startDate: [],
            endDate: []
        })

    }

    ngOnInit() {
        this.authService.reRenderVersionProgram('INT-120801');
        $("#year").dropdown();
        this.iaService.setData(null);
        this.Int120801Service.setSearchFlag(this.route.snapshot.queryParams["searchFlag"] || "" || undefined);

        // this.year();
        this.getData()
        this.utilityTypeDropdown();
    }

    ngAfterViewInit(): void {
        $(".ui.dropdown.ai").dropdown().css('width', '100%');
        // this.dataTable()
        this.calendar()
    }

    calendar(){
        let dateFrom = new Date()
        let dateTo = new Date()
        $("#dateCalendarFrom").calendar({
          type: "date",
          endCalendar: $('#dateCalendarTo'),
          text: TextDateTH,
          initialDate: dateFrom,
          formatter: formatter(),
          onChange: (date, text, mode) => {
            this.formSave.get('startDate').patchValue(text);
          }
        })
    
        $("#dateCalendarTo").calendar({
          type: "date",
          startCalendar: $('#dateCalendarFrom'),
          text: TextDateTH,
          initialDate: dateTo,
          formatter: formatter(),
          onChange: (date, text, mode) => {
            this.formSave.get('endDate').patchValue(text);
          }
        })
      }

    getData(utilityType?, invoiceNum?) {
        this.Int120801Service.getData({
            utilityType: utilityType,
            invoiceNum: invoiceNum
        }).then(then => {
            console.log("then", then);
        });
    }

    utilityTypeDropdown() {
        this.ajax.doGet(`${URL.DROPDOWN_UTILITY}`).subscribe((response: ResponseData<any>) => {
          if (response.status === 'SUCCESS') {
            this.utilityTypeList = response.data;
          } else {
            this.message.errorModal(response.message);
          }
        }), error => {
          this.message.errorModal("กรุณาติดต่อผู้ดูแลระบบ");
        };
      }

    search() {
        let model = new FormSearch


        model.utilityType = this.formSave.value.utilityType
        model.invoiceNum = this.formSave.value.invoiceNum
        model.startDate = this.formSave.value.startDate
        model.endDate = this.formSave.value.endDate
        model.searchFlag = "TRUE";
        
        console.log("model : ",this.formSave);
        this.Int120801Service.search(model);
    }
    
    clear() {
        this.formSave.reset()
        $('#utilityType').dropdown('clear')
        $('#invoiceNum').dropdown('clear')
        $('#startDate').calendar('clear')
        $('#endDate').calendar('clear')
        this.search()
    }

    dataTable = () => {
        this.Int120801Service.dataTable();
    }

    // year = () => {
    //     this.Int120801Service.year(this.callBackYear);
    // }

    // callBackYear = (result) => {
    //     this.yearList = result;
    // }

}

class FormSearch {
    utilityType: string = "";
    invoiceNum: string = "";
    searchFlag: string = "";
    startDate: string = "";
    endDate: string = ""
}

class Data {
    utilityId: string = "";
    utilityType: string = "";
    invoiceNum: string = "";
    invoiceMonth: string = "";
    invoiceDate: string = "";
    requestNum: string = "";
    requestDate: string = "";
    amount: string = "";
    officeCode: string = "";
    officeDesc: string = ""
}
