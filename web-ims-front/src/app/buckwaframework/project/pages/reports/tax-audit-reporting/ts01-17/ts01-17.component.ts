import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageBarService, AjaxService } from '../../../../../common/services';
import { ActivatedRoute } from '@angular/router';
import { TextDateTH, formatter } from '../../../../../common/helper/datepicker';
import { Utils } from 'helpers/utils';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-ts01-17',
  templateUrl: './ts01-17.component.html',
  styleUrls: ['./ts01-17.component.css']
})
export class Ts0117Component implements OnInit {

  @Output() discard = new EventEmitter<any>();
  obj: Ts0117;

  constructor(
    private messageBarService: MessageBarService,
    private route: ActivatedRoute,
    private ajax: AjaxService) {
    this.obj = new Ts0117();
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

    $('#date5').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $('#date6').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $('#date7').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $('#date8').calendar({
      type: 'date',
      text: TextDateTH,
      formatter: formatter('วดป')
    });

    $('#month1').calendar({
      type: 'month',
      text: TextDateTH,
      formatter: formatter('ด')
    });

    $('#month2').calendar({
      type: 'month',
      text: TextDateTH,
      formatter: formatter('ด')
    });

    $("#time").calendar({
      type: "time",
      text: TextDateTH,
      formatter: formatter('เวลา')
    });

    this.obj.exciseTax = "0.00";
    this.obj.fine = "0.00";
    this.obj.extraMoney = "0.00";
    this.obj.sum = "0.00";
    this.obj.localTax = "0.00";
    this.obj.total = "0.00";

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


  onSubmit = e => {
    e.preventDefault();
    const url = "report/pdf/ts/mis_t_s_01_17_1";

    // Date
    let date1 = $("#date1 .ui input").val().split(" ");
    this.obj.day1 = date1[0];
    this.obj.month1 = date1[1];
    this.obj.year1 = date1[2];

    this.obj.date1 = $("#date2 .ui input").val();
    this.obj.date2 = $("#date3 .ui input").val();
    this.obj.date3 = $("#date4 .ui input").val();
    this.obj.date4 = $("#date5 .ui input").val();
    this.obj.date5 = $("#date6 .ui input").val();
    this.obj.date6 = $("#date7 .ui input").val();
    this.obj.date7 = $("#date8 .ui input").val();
    this.obj.startMonth = $("#month1 .ui input").val();
    this.obj.stopMonth = $("#month2 .ui input").val();

    // Times
    this.obj.time = $("#time .ui input").val();

    //faet
    if (!this.obj.faet) {
      this.obj.faet = "";
    }
    //laws
    if (!this.obj.laws) {
      this.obj.laws = "";
    }

    //console.log(this.obj);

    var form = document.createElement("form");
    form.method = "POST";
    form.action = AjaxService.CONTEXT_PATH + "report/pdf/ts/01/17";
    form.style.display = "none"; 
    form.target = "_blank" 

    var jsonInput = document.createElement("input");
    jsonInput.name = "json";
    jsonInput.value = JSON.stringify(this.obj);
    form.appendChild(jsonInput);

    document.body.appendChild(form);
    form.submit();
  };


  typeNumber(e, name) {
    this.obj[name] = Utils.moneyFormatDecimal(e.target.value)
    //sum
    var fine = (Utils.isNull(this.obj.fine)) ? 0 : parseFloat(this.obj.fine.replace(/,/g, ''));
    var extraMoney = (Utils.isNull(this.obj.extraMoney)) ? 0 : parseFloat(this.obj.extraMoney.replace(/,/g, ''));
    var exciseTax = (Utils.isNull(this.obj.exciseTax)) ? 0 : parseFloat(this.obj.exciseTax.replace(/,/g, ''));
    var sum = fine + exciseTax + extraMoney;
    this.obj.sum = Utils.moneyFormatDecimal(sum);
    //total
    var localTax = (Utils.isNull(this.obj.localTax)) ? 0 : parseFloat(this.obj.localTax.replace(/,/g, ''));
    var total = sum + localTax;
    this.obj.total = Utils.moneyFormatDecimal(total);
  }



}

class Ts0117 {
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
  at5: string;
  at6: string;

  date1: string;
  date2: string;
  date3: string;
  date4: string;
  date5: string;
  date6: string;
  date7: string;

  study: string;
  exciseId: string;

  homeNumber: string;
  moo: string;
  byWay: string;
  street: string;
  tambol: string;
  district: string;
  province: string;
  zipCode: string;

  officerName1: string;
  officerPosition1: string;


  startMonth: string;
  stopMonth: string;

  faet: string;
  laws: string;

  chargeName: string;
  exciseTax: string;
  fine: string;
  extraMoney: string;
  sum: string;
  localTax: string;
  total: string;

  //page2
  localName1: string
  localName2: string;
  taxNum: string;
  time: string;
  signatureName: string;
  signaturePosition: string;
  department: string;
  departName: string;
  departTel: string;
}
