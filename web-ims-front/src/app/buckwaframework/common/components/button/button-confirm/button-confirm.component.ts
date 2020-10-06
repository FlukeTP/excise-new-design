import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-confirm',
  templateUrl: './button-confirm.component.html',
  styleUrls: ['./button-confirm.component.css']
})
export class ButtonConfirmComponent implements OnInit {
  @Input() type: string = "button";

  constructor() { }

  ngOnInit() {
  }

}
