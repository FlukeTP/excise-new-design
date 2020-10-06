import { Component, OnInit } from '@angular/core';
import { AjaxService } from 'services/ajax.service';
import { MessageService } from 'services/message.service';
import { MessageBarService } from 'services/message-bar.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-int091202',
  templateUrl: './int091202.component.html',
  styleUrls: ['./int091202.component.css']
})
export class Int091202Component implements OnInit {
  loading = true
  dayList: any[] = []
  lineData: any[] = []
  yearMonth: string
  offCode: string
  constructor(
    private ajax: AjaxService,
    private messageBar: MessageBarService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.yearMonth = this.activatedRoute.snapshot.queryParams['yearMonth'];
    this.offCode = this.activatedRoute.snapshot.queryParams['offCode'];
    // this.yearMonth = '256205'
    // this.offCode = '000001'
    this.getDataDtl()
  }

  getDataDtl() {
    // Get data detail
    this.ajax.doPost('ia/int09/12/01/view-data-detail', {
      officeCode: this.offCode,
      userLogin: '',
      yearMonth: this.yearMonth
    }).subscribe((dataRes) => {
      if (MessageService.MSG.SUCCESS === dataRes.status) {
        console.log('monthList Service => ', dataRes.data)
    // set Data
        this.dayList = dataRes.data.dayList
        this.lineData = dataRes.data.lineData
      } else {
        this.messageBar.errorModal(dataRes.message)
      }
      this.loading = false
    }, () => {
      this.loading = false
      this.messageBar.errorModal(MessageService.MSG.FAILED_CALLBACK)
    })
  }
}
