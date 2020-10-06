import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-custom',
  templateUrl: './button-custom.component.html',
  styleUrls: ['./button-custom.component.css']
})
export class ButtonCustomComponent implements OnInit {

  @Input() text: string = "";
  @Input() btnType: string = "button";
  @Input() color: string = "primary";
  @Input() icon: string = "";
  @Input() disabled: boolean = false;
  classIcon: boolean = false;
  constructor() {


  }

  ngOnInit() {
    if (!this.text && this.icon) {
     // console.log("add icon");      
      this.classIcon = true;
      //console.log(this.classIcon)
    }
  }

}
