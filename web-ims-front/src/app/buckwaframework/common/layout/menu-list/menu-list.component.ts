import { Component, OnInit, Input } from '@angular/core';
import { NavItem } from './../nav-item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  @Input() items: NavItem[];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  

}
