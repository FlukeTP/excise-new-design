import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-export',
  templateUrl: './button-export.component.html',
  styleUrls: ['./button-export.component.css']
})
export class ButtonExportComponent implements OnInit {
  @Input() type: string = "button";
  @Input() disabled: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
