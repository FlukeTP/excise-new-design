import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreadCrumb, Cart } from 'models/index';

@Component({
    selector: 'with-breadcrumb',
    templateUrl: './with-breadcrumb.html',
    styleUrls: ['./with-breadcrumb.css']
})

export class WithBreadcrumbTemplate implements OnInit {

    @Input() breadcrumb: BreadCrumb[] = [];
    @Input() lists: BreadCrumb[] = [];
    @Input() cart: Cart = {
        title: "",
        subtitle: "",
        route: ""
    };

    @Output() pageReturn: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() { }
}