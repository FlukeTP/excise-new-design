import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-save',
  templateUrl: './button-save.component.html',
  styleUrls: ['./button-save.component.css']
})
export class ButtonSaveComponent implements OnInit {

  @Input() disabled: boolean = false;
  @Input() submit: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
