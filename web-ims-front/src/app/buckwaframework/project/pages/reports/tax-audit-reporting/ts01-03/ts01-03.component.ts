import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AjaxService } from "../../../../../common/services";
import { ActivatedRoute } from "@angular/router";
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-ts01-03',
  templateUrl: './ts01-03.component.html',
  styleUrls: ['./ts01-03.component.css']
})
export class Ts0103Component implements OnInit {

  @Output() discard = new EventEmitter<any>();

  obj: Ts0103;



  constructor(
    private route: ActivatedRoute,
    private ajax: AjaxService
  ) {
    this.obj = new Ts0103();
    this.obj.exciseId = this.route.snapshot.queryParams["exciseId"];
  }

  ngOnInit() {

    $('#date1').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $('#date2').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });
    $("#time").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา')
    });
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };




  optionAddress = () => {
    const optionURL = "excise/detail/objectAddressByExciseId";
    this.ajax.post(optionURL, {
      exciseId: this.obj.exciseId
    }, res => {
      console.log(res.json());
      var dat = res.json();
      this.obj.homeNumber = dat.homeNumber;
      this.obj.byWay = dat.byWay;
      this.obj.street = dat.street;
      this.obj.tambol = dat.tambol;
      this.obj.district = dat.district;
      this.obj.province = dat.province;
      this.obj.zipCode = dat.zipCode;
    });
  };

  isAddress = () => {
    if (this.obj.addressBox !== true) {
      this.obj.homeNumber1 = this.obj.homeNumber;
      this.obj.byWay1 = this.obj.byWay;
      this.obj.street1 = this.obj.street;
      this.obj.tambol1 = this.obj.tambol;
      this.obj.district1 = this.obj.district;
      this.obj.province1 = this.obj.province;
      this.obj.zipCode1 = this.obj.zipCode;
    } else {
      this.obj.homeNumber1 = "";
      this.obj.byWay1 = "";
      this.obj.street1 = "";
      this.obj.tambol1 = "";
      this.obj.district1 = "";
      this.obj.province1 = "";
      this.obj.zipCode1 = "";
    }
  }


  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_03";

    // Date
    let date1 = $("#date1 .ui input").val().split(" ");
    this.obj.day1 = date1[0];
    this.obj.month1 = date1[1];
    this.obj.year1 = date1[2];
    let date2 = $("#date2 .ui input").val().split(" ");
    this.obj.day2 = date2[0];
    this.obj.month2 = date2[1];
    this.obj.year2 = date2[2];
    // Times
    this.obj.time = $("#time .ui input").val();


    if (this.obj.agreeBox == "factory") {
      this.obj.factory = true;
      this.obj.service = false;
      this.obj.company = false;
    } else if (this.obj.agreeBox == "service") {
      this.obj.factory = false;
      this.obj.service = true;
      this.obj.company = false;
    } else if (this.obj.agreeBox == "company") {
      this.obj.factory = false;
      this.obj.service = false;
      this.obj.company = true;
    }
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {
        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_03/file");
      }
    });
  };

}
class Ts0103 {
  logo: string = "logo1.jpg";
  [x: string]: any;
  office: string;
  day1: string;
  month1: string;
  year1: string;
  day2: string;
  
  month2: string;
  year2: string;
  time: string;
  department: string;
  agreeBox: string;
  factory: boolean;
  service: boolean;
  company: boolean;

  name: string;
  exciseId: string;

  homeNumber: string;
  byWay: string;
  street: string;
  tambol: string;
  district: string;
  province: string;
  zipCode: string;

  homeNumber1: string;
  byWay1: string;
  street1: string;
  tambol1: string;
  district1: string;
  province1: string;
  zipCode1: string;

  addressBox: boolean;

  with: string;
  article: string;
  group: string;
  location: string;
  document: string;
  signature: string;
  phoneNumber: string;
}