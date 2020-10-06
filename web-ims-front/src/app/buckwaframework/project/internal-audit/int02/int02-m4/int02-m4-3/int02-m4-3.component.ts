import { Component, Output, EventEmitter, AfterViewInit } from "@angular/core";

declare var $: any;

@Component({
    selector: "app-int02-m4-3",
    templateUrl: "./int02-m4-3.component.html",
    styleUrls: ["./int02-m4-3.component.css"]
})
export class Int02M43Component implements AfterViewInit {

    @Output() cancelTo = new EventEmitter<any>();

    datatable: any;
    list: any;

    constructor() {
        this.list = [];
        for(let i=1; i<=99; i++) {
            this.list = [...this.list, ...[i]];
        }
    }

    ngAfterViewInit() {
        this.datatable = $("#datatable").DataTable({
            engthChange: false,
            searching: false,
            select: true,
            ordering: true,
            pageLength: 5,
            lengthMenu: [ 5, 10, 25, 50, 75, 100 ],
            // processing: true,
            // serverSide: true,
            paging: true,
            pagingType: "full_numbers"
        });
    }

    back() {
        this.cancelTo.emit("step1");
    }

}
