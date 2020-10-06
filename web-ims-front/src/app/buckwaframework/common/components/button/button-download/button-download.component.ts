import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-download',
  templateUrl: './button-download.component.html',
  styleUrls: ['./button-download.component.css']
})
export class ButtonDownloadComponent implements OnInit {

  @Input() type: string = "button";
  constructor() { }

  ngOnInit() {
  }

}
