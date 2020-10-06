import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-clear',
  templateUrl: './button-clear.component.html',
  styleUrls: ['./button-clear.component.css']
})
export class ButtonClearComponent implements OnInit {
  @Input() btnType: string = "button";
  constructor() { }

  ngOnInit() {
  }

}
