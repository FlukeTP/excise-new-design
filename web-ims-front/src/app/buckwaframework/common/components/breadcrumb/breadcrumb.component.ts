import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumb, Cart } from '../../models';

declare var $: any;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [
    `
    .sixteen.wide.column.bread {
      padding-top: 14;
    }

    .shadow {
      box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2) !important;
    }
    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    `
  ]
})
export class BreadcrumbComponent {

  @Input() class: string;
  @Input() route: BreadCrumb[] = [];
  @Input() lists: BreadCrumb[] = [];
  @Input() noti: BreadCrumb[] = [];
  @Input() cart: Cart = {
    title: "",
    subtitle: "",
    route: ""
  };

  constructor(private router: Router) {
    // TODO
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('.ui.dropdown').dropdown({
        silent: true,
        direction: 'left'
      });
      $('.ui.sticky').sticky();
    }, 800);
  }

  goto(route: string) {
    this.router.navigate([route]);
  }

}
