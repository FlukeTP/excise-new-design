import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.css']
})
export class ButtonAddComponent implements OnInit {
  @Input() type: string = "button";
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
