import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

declare var $: any;

@Component({
    selector: "app-int02-m5-2-1",
    templateUrl: "./int02-m5-2-1.component.html",
    styleUrls: ["./int02-m5-2-1.component.css"]
})
export class Int02M521Component implements OnInit {

    datatable: any;

    constructor(private router: Router) { }

    ngOnInit() { }

    export() {
        alert("ส่งออกละ เอาไงต่อ");
    }

    back() {
        this.router.navigate(['int02/m5/2']);
    }

}