
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageBarService, AjaxService } from '../../../../../common/services';
import { ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { Utils } from 'helpers/utils';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-ts01-17-1',
  templateUrl: './ts01-17-1.component.html',
  styleUrls: ['./ts01-17-1.component.css']
})
export class Ts01171Component implements OnInit {

  @Output() discard = new EventEmitter<any>();
  numbers: number[];
  obj: Ts0117_1;
  add: number;

 
  constructor(
    private messageBarService: MessageBarService,
    private route: ActivatedRoute,
    private ajax: AjaxService) {
    this.add = 0;
    this.numbers = [1, 2, 3];
    this.obj = new Ts0117_1();

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

    $('#date3').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $('#date4').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $("#time").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา')
    });

    this.obj.tax="0.00";
    this.obj.fine="0.00";
    this.obj.exteamoney="0.00";
    this.obj.includes="0.00";
    this.obj.gorernment="0.00";
    this.obj.total="0.00";
  }

  onDiscard = () => {
    // on click this view hide them
    // ... Don't change or delete this
    this.discard.emit(false);
  };

  onAddField = () => {
    let num = this.numbers.length;
    if (num < 5) {
      this.numbers.push(num + 1);
    } else {
      this.messageBarService.errorModal(
        "ไม่สามารถทำรายการได้",
        "เกิดข้อผิดพลาด"
      );
    }
  };

  onDelField = index => {
    this.obj["analys" + (index + 1)] = "";
    this.numbers.splice(index, 1);
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


  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_17_1";

    // Date
    let date1 = $("#date1 .ui input").val().split(" ");
    this.obj.day1 = date1[0];
    this.obj.month1 = date1[1];
    this.obj.year1 = date1[2];

    let date2 = $("#date2 .ui input").val().split(" ");
    this.obj.day2 = date2[0];
    this.obj.month2 = date2[1];
    this.obj.year2 = date2[2];

    this.obj.dateNote = $("#date3 .ui input").val();
  
    this.obj.dateIn = $("#date4 .ui input").val();

    // Times
    this.obj.time = $("#time .ui input").val();
    
    // agreeBox
    if(this.obj.agreeBox){
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
    }else{
      this.obj.factory = false;
      this.obj.service = false;
      this.obj.company = false;
    }

    //bookBox
    if(this.obj.bookBox){
      if (this.obj.bookBox == "book1") {
        this.obj.book1 = true;
        this.obj.book2 = false;
      } else if (this.obj.bookBox == "book2") {
        this.obj.book1 = false;
        this.obj.book2 = true;
      } 
    }else{
      this.obj.book1 = false;
      this.obj.book2 = false;
    }

    //faet
    if(!this.obj.faet){
      this.obj.faet = "";
    }
    //laws
    if(!this.obj.laws){
      this.obj.laws = "";
    }
    
    this.ajax.post(url, `'${JSON.stringify(this.obj).toString()}'`, res => {
      if (res.status == 200 && res.statusText == "OK") {


        window.open("/ims-webapp/api/report/pdf/mis_t_s_01_17_1/file");
      }
    });
  };


  typeNumber(e, name) {
    this.obj[name] = Utils.moneyFormatDecimal(e.target.value)
    //sum
    var tax = (Utils.isNull(this.obj.tax)) ? 0 : parseFloat(this.obj.tax.replace(/,/g, ''));
    var fine = (Utils.isNull(this.obj.fine)) ? 0 : parseFloat(this.obj.fine.replace(/,/g, ''));
    var exteamoney = (Utils.isNull(this.obj.exteamoney)) ? 0 : parseFloat(this.obj.exteamoney.replace(/,/g, ''));
    var sum = fine + exteamoney + tax;
    this.obj.includes = Utils.moneyFormatDecimal(sum);
    //total
    var gorernment = (Utils.isNull(this.obj.gorernment)) ? 0 : parseFloat(this.obj.gorernment.replace(/,/g, ''));
    var total = sum + gorernment;
    this.obj.total = Utils.moneyFormatDecimal(total);
  }

}

class Ts0117_1 {
  logo: string = "logo1.jpg";

  day1: string;
  month1: string;
  year1: string;

  day2: string;
  month2: string;
  year2: string;

  at1: string;
	at2: string;
	at3: string;
  at4: string;
  
  study: string;
  result: string;
  exciseId: string;

  agreeBox: string;
  factory: boolean;
  service: boolean;
  company: boolean;

  homeNumber: string;
  moo: string;
  byWay: string;
  street: string;
  tambol: string;
  district: string;
  province: string;
  zipCode: string; 

  bookBox: string;
  book1: boolean;
  book2: boolean;

  timeCheck: string;
  faet: string;
  laws: string;
  
  fromtne: string;
	tax: string;
	fine: string;
  exteamoney: string;
  includes: string;
	gorernment: string;
  total: string;
  dateNote: string;
  place: string;
  dateIn: string;
  time: string;
	department: string;
	person: string;

  time1;
}
