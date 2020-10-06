import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-upload',
  templateUrl: './button-upload.component.html',
  styleUrls: ['./button-upload.component.css']
})
export class ButtonUploadComponent implements OnInit {
  @Input() btnType: string = 'button';
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
