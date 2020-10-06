import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-select-area',
  templateUrl: './select-area.component.html',
  styleUrls: ['./select-area.component.css']
})
export class SelectAreaComponent implements OnInit {

  btnText1 : string = 'เลือก';
  btnClass1 : string = '';
  btnText2 : string = 'เลือก';
  btnClass2 : string = '';
  btnText3 : string = 'เลือก';
  btnClass3 : string = '';

  constructor() { 
    
  }

  ngOnInit() {

    // var handler = {

    //   activate: function() {
    //     $(this)
    //       .addClass('active')
    //       .siblings()
    //       .removeClass('active')
    //     ;
    //   }

    // }
    // $('.ui.buttons .button').on('click', handler.activate);
    // $('.ui.toggle.button').state({
    //   text: {
    //     inactive : 'Vote',
    //     active   : 'Voted'
    //   }
    // });
    // $('.ui.button').not('.ui.buttons .button').not('.ui.toggle.button');

  }
  ngAfterViewInit() {
    
  }

  toggleBtn1(){

    if(this.btnText1 === 'เลือก'){
      this.btnText1 = 'ยกเลิก';
      this.btnClass1 = 'active';
    }else{
      this.btnText1 = 'เลือก';
      this.btnClass1 = '';
    }
    
  }

  toggleBtn2(){

    if(this.btnText2 === 'เลือก'){
      this.btnText2 = 'ยกเลิก';
      this.btnClass2 = 'active';
    }else{
      this.btnText2 = 'เลือก';
      this.btnClass2 = '';
    }
    
  }

  toggleBtn3(){

    if(this.btnText3 === 'เลือก'){
      this.btnText3 = 'ยกเลิก';
      this.btnClass3 = 'active';
    }else{
      this.btnText3 = 'เลือก';
      this.btnClass3 = '';
    }
    
  }
}
