import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-button-search',
  templateUrl: './button-search.component.html',
  styleUrls: ['./button-search.component.css']
})
export class ButtonSearchComponent implements OnInit {
  @Input() disabled: boolean = false;
  @Input() submit: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
