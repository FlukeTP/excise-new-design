import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-int010201',
  templateUrl: './int010201.component.html',
  styleUrls: ['./int010201.component.css']
})
export class Int010201Component implements OnInit {
  show: boolean = true
  constructor() { }

  ngOnInit() {
  }
  checkShow(show: boolean) {
    this.show = show
  }
}
