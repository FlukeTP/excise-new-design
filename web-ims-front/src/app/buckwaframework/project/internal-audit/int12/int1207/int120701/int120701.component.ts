import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm, FormBuilder } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Int120701Service, Lov } from './int120701.service';
import { BreadCrumb } from 'models/index';
import { TextDateTH, formatter } from 'helpers/datepicker';
import { UserModel } from 'models/user.model';
import { AjaxService } from 'services/ajax.service';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';

declare var $: any;

const URLS = {
  GET_TYPE_6006: 'ia/int12/07/01/01/filterByDate',
  GET_TYPE_7131: 'ia/int12/07/01/01/filterByDate7131',
};
@Component({
  selector: 'app-int120701',
  templateUrl: './int120701.component.html',
  styleUrls: ['./int120701.component.css'],
  providers: [Int120701Service]
})
export class Int120701Component implements OnInit, AfterViewInit {
  userProfile: UserModel;
  breadcrumb: BreadCrumb[];
  formSearch: FormGroup = new FormGroup({});
  bills: any;
  tab = 1;
  dataType6006: any;
  dataType7131: any;

  dataTable6006: any;
  dataTable7131: any;
  constructor(
    private router: Router,
    private selfService: Int120701Service,
    private authService: AuthService,
    private fb: FormBuilder,
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private route: ActivatedRoute,
  ) {
    this.userProfile = this.authService.getUserDetails();
    this.breadcrumb = [
      { label: 'ตรวจสอบภายใน', route: '#' },
      { label: 'ตรวจสอบเบิกจ่าย', route: '#' },
      { label: 'บันทึกคำขอเบิก', route: '#' }
    ];
    this.formSearch = this.fb.group({
      startDate: [],
      endDate: [],
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    $(`.ui.fluid.dropdown`)
      .dropdown({
        clearable: true
      })
      .css('width', '100%');
    $('.dropdown').dropdown('set selected', '1');
    this.calender();
    this.initTable6006();
    this.initTable7131();
    const page = this.route.snapshot.queryParams['page'];
    if (page) {
      this.tab = Number(page);
    }
  }

  calender() {
    $('#calendar1').calendar({
      endCalendar: $('#calendar2'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter('date'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({ startDate: text });
      }
    });
    $('#calendar2').calendar({
      startCalendar: $('#calendar1'),
      type: 'date',
      text: TextDateTH,
      formatter: formatter('date'),
      onChange: (date, text, mode) => {
        this.formSearch.patchValue({ endDate: text });
      }
    });
  }

  createbill() {
    this.router.navigate([`/int12/07/01/0${this.tab}`]);
  }

  changeTab(tab: number) {
    if (tab === this.tab) {
      return;
    }
    this.tab = tab;
  }

  searchFilter() {
    if (this.tab === 1) {
      this.searchType1();
    } else if (this.tab === 2) {
      this.searchType2();
    } else if (this.tab === 3) {
      this.searchType3();
    }
  }


  searchType1() {
    this.ajax.doPost(URLS.GET_TYPE_6006, this.formSearch.value).subscribe(
      (res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.dataType6006 = res.data;
          this.dataTable6006.clear().draw();
          this.dataTable6006.rows.add(res.data).draw();
          this.dataTable6006.columns.adjust().draw();
        } else {
          this.messageBar.errorModal(res.message);
        }
      },
      (err) => {
        this.messageBar.errorModal(err);
      });
  }

  searchType2() {
    this.ajax.doPost(URLS.GET_TYPE_7131, this.formSearch.value).subscribe(
      (res) => {
        if (MessageService.MSG.SUCCESS === res.status) {
          this.dataType7131 = res.data;
          this.dataTable7131.clear().draw();
          this.dataTable7131.rows.add(res.data).draw();
          this.dataTable7131.columns.adjust().draw();
        } else {
          this.messageBar.errorModal(res.message);
        }
      },
      (err) => {
        this.messageBar.errorModal(err);
      });
  }

  searchType3() {

  }

  initTable6006() {
    this.dataTable6006 = this.selfService.dataTable6006Service();
    $('.ui.grid .row').css('padding-top', '0');
    this.dataTable6006.on('click', 'tbody tr', (e) => {
      const closestRow = $(e.target).closest('tr');
      const dataRow = this.dataTable6006.row(closestRow).data();
      if (!dataRow) {
        return;
      }
      this.router.navigate(['int12/07/01/01'], {
        queryParams: {
          id: dataRow.id
        }
      });
    });
  }

  initTable7131() {
    this.dataTable7131 = this.selfService.dataTable7131ervice();
    $('.ui.grid .row').css('padding-top', '0');
    this.dataTable7131.on('click', 'tbody tr', (e) => {
      const closestRow = $(e.target).closest('tr');
      const dataRow = this.dataTable7131.row(closestRow).data();
      if (!dataRow) {
        return;
      }
      this.router.navigate(['int12/07/01/02'], {
        queryParams: {
          id: dataRow.id
        }
      });
    });
  }
}

